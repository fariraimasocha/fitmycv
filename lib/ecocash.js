import EcocashPayment from "@/models/EcocashPayment";
import User from "@/models/User";
import { checkPayment, FAILED_STATUSES } from "@/lib/pesepay";
import { grantPurchase } from "@/lib/grant-purchase";
import { captureServerEvent } from "@/lib/posthog-server";

// Asks Pesepay for the status and never trusts what the caller sent. The
// poll and the result hook can both get here at once: the conditional
// update means only one of them marks it paid and grants access.
export async function settleEcocashPayment(payment) {
  if (payment.status !== "pending") return payment.status;

  const tx = await checkPayment(payment.referenceNumber);
  const providerStatus = tx?.transactionStatus || "UNKNOWN";

  if (providerStatus === "SUCCESS") {
    const paidAmount = Number(tx.amountDetails?.amount);
    const currency = tx.amountDetails?.currencyCode;
    if (paidAmount + 0.001 < payment.amount || (currency && currency !== "USD")) {
      console.error(`EcoCash ${payment.referenceNumber}: paid ${paidAmount} ${currency}, expected ${payment.amount} USD`);
      await EcocashPayment.updateOne({ _id: payment._id, status: "pending" }, { status: "failed", providerStatus });
      return "failed";
    }

    const won = await EcocashPayment.findOneAndUpdate(
      { _id: payment._id, status: "pending" },
      { status: "paid", providerStatus, paidAt: new Date() },
      { new: true },
    );
    if (!won) return "paid";

    const user = await User.findById(payment.userId);
    if (!user) {
      console.error(`EcoCash ${payment.referenceNumber}: user ${payment.userId} not found`);
      return "paid";
    }
    await grantPurchase(user, {
      plan: payment.plan,
      tailoredCvId: payment.tailoredCvId,
      orderId: `pesepay:${payment.referenceNumber}`,
    });
    await captureServerEvent(user._id, "purchase_complete", {
      plan: payment.plan,
      order_id: payment.referenceNumber,
      tier: "africa",
      provider: "pesepay",
      revenue: payment.amount,
      currency: "USD",
      $insert_id: `pesepay:${payment.referenceNumber}`,
    });
    return "paid";
  }

  if (FAILED_STATUSES.has(providerStatus)) {
    await EcocashPayment.updateOne({ _id: payment._id, status: "pending" }, { status: "failed", providerStatus });
    return "failed";
  }

  if (providerStatus !== payment.providerStatus) {
    await EcocashPayment.updateOne({ _id: payment._id }, { providerStatus });
  }
  return "pending";
}
