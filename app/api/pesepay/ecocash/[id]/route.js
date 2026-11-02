import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import EcocashPayment from "@/models/EcocashPayment";
import { settleEcocashPayment } from "@/lib/ecocash";

// Polled by the checkout while the buyer approves the prompt on their phone.
export async function GET(_request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Sign in to continue." }, { status: 401 });

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Payment not found." }, { status: 404 });

  await connectDB();
  const payment = await EcocashPayment.findOne({ _id: id, userId: session.user.id }).lean();
  if (!payment) return Response.json({ error: "Payment not found." }, { status: 404 });

  let status = payment.status;
  try {
    status = await settleEcocashPayment(payment);
  } catch (error) {
    // Pesepay down for a moment: report pending and let the next poll retry.
    console.error(`EcoCash status check failed for ${payment.referenceNumber}:`, error);
  }

  return Response.json({
    data: { status, plan: payment.plan, cvId: payment.tailoredCvId ? String(payment.tailoredCvId) : null },
  });
}
