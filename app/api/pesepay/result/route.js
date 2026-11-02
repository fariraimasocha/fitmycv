import { connectDB } from "@/utils/connect";
import EcocashPayment from "@/models/EcocashPayment";
import { decrypt } from "@/lib/pesepay";
import { settleEcocashPayment } from "@/lib/ecocash";

// Pesepay calls this when a payment finishes. The body is only used to find
// the payment: settle asks Pesepay for the real status, so a forged call
// can't grant anything. Always 200 so Pesepay doesn't retry forever.
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    let referenceNumber = body?.referenceNumber || new URL(request.url).searchParams.get("referenceNumber");
    if (!referenceNumber && body?.payload) {
      referenceNumber = decrypt(body.payload)?.referenceNumber;
    }

    if (referenceNumber) {
      await connectDB();
      const payment = await EcocashPayment.findOne({ referenceNumber: String(referenceNumber), status: "pending" }).lean();
      if (payment) await settleEcocashPayment(payment);
    }
  } catch (error) {
    console.error("Pesepay result hook failed:", error);
  }
  return Response.json({ received: true });
}
