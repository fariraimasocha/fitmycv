import { headers } from "next/headers";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import TailoredCV from "@/models/TailoredCV";
import EcocashPayment from "@/models/EcocashPayment";
import { FAILED_STATUSES, makeEcocashPayment, normalizeEcocashPhone } from "@/lib/pesepay";
import { getPricingForTier } from "@/lib/pricing";
import { PRICING_TIERS, resolveCountryFromHeaders } from "@/lib/pricing-region";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";
import { appUrl } from "@/lib/site";

const fail = (error, status) => Response.json({ error }, { status });

// Starts an EcoCash payment. Pesepay sends a PIN prompt to the phone, and
// the client polls /api/pesepay/ecocash/[id] until it is paid or fails.
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) return fail("Sign in to pay.", 401);

  // EcoCash is for Zimbabwe only. ponytail: country comes from the request's
  // geo header, so a VPN changes it. The price is the same Africa tier either way.
  if (resolveCountryFromHeaders(await headers()) !== "zw") {
    return fail("EcoCash is only available in Zimbabwe.", 403);
  }

  // ponytail: reuses the job-save limiter (5 a minute) with its own key.
  if (await isRateLimited("JOB_SAVE_LIMITER", `ecocash:${session.user.id}`)) {
    return tooManyRequests();
  }

  const body = await request.json().catch(() => ({}));
  const plan = body.plan === "single" ? "single" : body.plan === "lifetime" ? "lifetime" : null;
  if (!plan) return fail("Choose what you want to buy.", 400);
  const phone = normalizeEcocashPhone(body.phone);
  if (!phone) return fail("Enter an EcoCash number that starts with 077 or 078.", 400);

  await connectDB();
  const user = await User.findById(session.user.id).select("isPremium email name");
  if (!user) return fail("Sign in to pay.", 401);
  if (user.isPremium) return fail("You already have Pro.", 409);

  let tailoredCvId = null;
  if (plan === "single") {
    const cv = mongoose.isValidObjectId(body.cvId)
      ? await TailoredCV.findOne({ _id: body.cvId, userId: user._id }).select("unlockedAt").lean()
      : null;
    if (!cv) return fail("We couldn't find that CV.", 404);
    if (cv.unlockedAt) return fail("This CV is already unlocked.", 409);
    tailoredCvId = cv._id;
  }

  // A second tap within 2 minutes reuses the prompt already on the phone.
  const recent = await EcocashPayment.findOne({
    userId: user._id,
    plan,
    tailoredCvId,
    phone,
    status: "pending",
    createdAt: { $gt: new Date(Date.now() - 2 * 60 * 1000) },
  }).lean();
  if (recent) return Response.json({ data: { paymentId: String(recent._id) } });

  const amount = Number(getPricingForTier(PRICING_TIERS.africa)[plan].price);
  const reference = new mongoose.Types.ObjectId();

  let tx;
  try {
    tx = await makeEcocashPayment({
      amount,
      phone,
      reference: String(reference),
      reason: plan === "single" ? "FitMyCV: one tailored CV" : "FitMyCV Pro lifetime",
      resultUrl: appUrl("/api/pesepay/result").toString(),
      customer: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("EcoCash initiate failed:", error);
    return fail("EcoCash didn't respond. Nothing was charged. Try again.", 502);
  }

  if (!tx?.referenceNumber || FAILED_STATUSES.has(tx.transactionStatus)) {
    console.error("EcoCash initiate rejected:", tx?.transactionStatus, tx?.transactionStatusDescription);
    return fail("EcoCash couldn't start the payment. Check the number and try again.", 502);
  }

  await EcocashPayment.create({
    _id: reference,
    userId: user._id,
    plan,
    tailoredCvId,
    amount,
    phone,
    referenceNumber: tx.referenceNumber,
    providerStatus: tx.transactionStatus,
  });

  return Response.json({ data: { paymentId: String(reference) } }, { status: 201 });
}
