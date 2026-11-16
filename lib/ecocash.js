import EcocashPayment from "@/models/EcocashPayment";
import User from "@/models/User";
import { checkPayment, FAILED_STATUSES } from "@/lib/pesepay";
import { grantPurchase } from "@/lib/grant-purchase";
import { captureServerEvent } from "@/lib/posthog-server";
import { sendEmail } from "@/lib/email";

const OWNER_EMAIL = "fariraimasocha@gmail.com";

// Buyer name comes from Google, so escape it before it goes into HTML.
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Ansa SMS (sms.ansa.co.zw/docs). The idempotency key stops a retry texting twice.
async function sendOwnerSms(text, referenceNumber) {
  if (!process.env.ANSA || !process.env.OWNER_PHONE) return console.warn("Owner SMS skipped: set ANSA and OWNER_PHONE");
  const res = await fetch("https://api.sms.ansa.co.zw/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ANSA}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `pesepay:${referenceNumber}`,
    },
    body: JSON.stringify({ to: process.env.OWNER_PHONE, text }),
  });
  if (!res.ok) throw new Error(`Ansa ${res.status}: ${await res.text()}`);
}

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
    // Ping the owner. A failed email must never undo a paid order.
    const buyer = user.name || user.email;
    const what = `$${payment.amount} ${payment.plan === "single" ? "single CV" : "lifetime"}`;
    const line = `${buyer} (${user.email}) just paid ${what} on fitmycv with EcoCash.`;
    const ref = `Reference ${payment.referenceNumber}, phone ${payment.phone}`;
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `You have a new EcoCash payment on fitmycv (${what})!`,
      text: `Congratulations!\n\n${line}\n\n${ref}`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
<h2>Congratulations!</h2>
<p><b>${escapeHtml(buyer)}</b> (<a href="mailto:${escapeHtml(user.email)}">${escapeHtml(user.email)}</a>) just paid <b>${what}</b> on <b>fitmycv</b> with EcoCash.</p>
<hr><p style="color:#666;font-size:13px">${escapeHtml(ref)}</p></div>`,
    }).catch((error) => console.error(`EcoCash owner email failed for ${payment.referenceNumber}:`, error));
    await sendOwnerSms(`New EcoCash payment on fitmycv: ${what} from ${user.email}`, payment.referenceNumber).catch(
      (error) => console.error(`EcoCash owner SMS failed for ${payment.referenceNumber}:`, error),
    );
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
