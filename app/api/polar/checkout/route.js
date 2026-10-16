import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createPolarClient } from "@/lib/polar";
import { connectDB } from "@/utils/connect";
import mongoose from "mongoose";
import User from "@/models/User";
import TailoredCV from "@/models/TailoredCV";
import { appUrl } from "@/lib/site";
import { CHECKOUT_PLANS, getPolarProductId } from "@/lib/pricing";
import {
  getPricingTier,
  resolveCountryFromHeaders,
  resolveCustomerIp,
} from "@/lib/pricing-region";

const polar = createPolarClient();

function localAppUrl(path, request) {
  return process.env.NODE_ENV === "production"
    ? appUrl(path)
    : new URL(path, request.url);
}

async function resolveCheckoutTier() {
  const headerStore = await headers();
  const country = resolveCountryFromHeaders(headerStore);
  return getPricingTier(country);
}

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.redirect(localAppUrl("/auth", request));
    }

    if (session.user.isPremium) {
      return NextResponse.redirect(localAppUrl("/api/polar/portal", request));
    }

    await connectDB();
    const dbUser = await User.findOne({ _id: session.user.id }).select("isPremium");
    if (dbUser?.isPremium) {
      return NextResponse.redirect(localAppUrl("/api/polar/portal", request));
    }

    const { searchParams } = new URL(request.url);
    const planParam = searchParams.get("plan");
    const plan = CHECKOUT_PLANS.includes(planParam) ? planParam : "lifetime";

    // A single purchase is tied to one CV the buyer owns and has not unlocked.
    let tailoredCvId = null;
    if (plan === "single") {
      const cvId = searchParams.get("cv");
      const cv = mongoose.isValidObjectId(cvId)
        ? await TailoredCV.findOne({ _id: cvId, userId: session.user.id })
            .select("unlockedAt")
            .lean()
        : null;
      if (!cv) {
        return NextResponse.redirect(localAppUrl("/dashboard/tailored", request));
      }
      if (cv.unlockedAt) {
        return NextResponse.redirect(localAppUrl(`/dashboard/tailored/${cvId}`, request));
      }
      tailoredCvId = String(cv._id);
    }

    const tier = await resolveCheckoutTier();
    const productId = getPolarProductId(tier, plan);

    if (!productId) {
      throw new Error(`Missing Polar product ID for tier=${tier}, plan=${plan}`);
    }

    const headerStore = await headers();
    const customerIp = resolveCustomerIp(headerStore);
    const cookieStore = await cookies();
    const datafastVisitorId = cookieStore.get("datafast_visitor_id")?.value;
    const datafastSessionId = cookieStore.get("datafast_session_id")?.value;

    // A single purchase goes back to its CV, which waits for the webhook and
    // then opens. Plans go through /payment/success, which waits for Pro.
    const cvPath = tailoredCvId ? `/dashboard/tailored/${tailoredCvId}` : null;
    const successUrl = cvPath
      ? localAppUrl(`${cvPath}?unlock=pending`, request).toString()
      : process.env.NODE_ENV === "production"
        ? appUrl(`/payment/success?plan=${plan}`).toString()
        : process.env.POLAR_SUCCESS_URL ||
          localAppUrl(`/payment/success?plan=${plan}`, request).toString();

    await User.updateOne(
      { _id: session.user.id },
      {
        $set: { checkoutStartedAt: new Date(), checkoutPlan: plan, checkoutCvId: tailoredCvId },
        $unset: { checkoutReminderSentAt: 1 },
      },
    );

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl,
      returnUrl: localAppUrl(cvPath ?? "/dashboard/upgrade", request).toString(),
      externalCustomerId: String(session.user.id),
      customerName: session.user.name || undefined,
      customerEmail: session.user.email,
      ...(customerIp ? { customerIpAddress: customerIp } : {}),
      metadata: {
        userId: String(session.user.id),
        pricingTier: tier,
        plan,
        ...(tailoredCvId ? { tailoredCvId } : {}),
        ...(datafastVisitorId
          ? { datafast_visitor_id: datafastVisitorId }
          : {}),
        ...(datafastSessionId
          ? { datafast_session_id: datafastSessionId }
          : {}),
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (error) {
    console.error("Polar checkout error:", error);
    return NextResponse.redirect(
      localAppUrl("/dashboard/upgrade?error=checkout_failed", request),
    );
  }
}
