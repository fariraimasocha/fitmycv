import crypto from "node:crypto";

// Pesepay seamless EcoCash. Same wire format as the pesepay-js SDK used in
// tumai, without axios and crypto-js: every body is AES-256-CBC with the
// encryption key, IV = its first 16 characters, base64, sent as { payload }.
const API = process.env.PESEPAY_API_URL || "https://api.pesepay.com/api/payments-engine/";
const ECOCASH = "PZW211";

export const FAILED_STATUSES = new Set([
  "FAILED", "CANCELLED", "DECLINED", "ERROR", "AUTHORIZATION_FAILED",
  "INSUFFICIENT_FUNDS", "REVERSED", "TERMINATED", "CLOSED", "CLOSED_PERIOD_ELAPSED",
]);

function keys() {
  const integrationKey = process.env.PESEPAY_INTEGRATION_KEY;
  const encryptionKey = process.env.PESEPAY_ENCRYPTION_KEY;
  if (!integrationKey || !encryptionKey) throw new Error("Pesepay keys are not set");
  return { integrationKey, encryptionKey };
}

const cipherArgs = (key) => ["aes-256-cbc", Buffer.from(key, "utf8"), Buffer.from(key.slice(0, 16), "utf8")];

export function encrypt(data, key = keys().encryptionKey) {
  const cipher = crypto.createCipheriv(...cipherArgs(key));
  return Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]).toString("base64");
}

export function decrypt(payload, key = keys().encryptionKey) {
  const decipher = crypto.createDecipheriv(...cipherArgs(key));
  return JSON.parse(Buffer.concat([decipher.update(payload, "base64"), decipher.final()]).toString("utf8"));
}

async function call(path, body) {
  const res = await fetch(new URL(path, API), {
    method: body ? "POST" : "GET",
    headers: { authorization: keys().integrationKey, "content-type": "application/json" },
    ...(body ? { body: JSON.stringify({ payload: encrypt(body) }) } : {}),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.payload) {
    throw new Error(`Pesepay ${path} failed: ${res.status} ${json?.message ?? ""}`.trim());
  }
  return decrypt(json.payload);
}

// EcoCash numbers: 077 or 078, written as 07..., 2637... or +2637...
export function normalizeEcocashPhone(input) {
  const digits = String(input ?? "").replace(/\D/g, "");
  const local = digits.startsWith("263") ? `0${digits.slice(3)}` : digits;
  return /^07[78]\d{7}$/.test(local) ? local : null;
}

export function makeEcocashPayment({ amount, phone, reference, reason, resultUrl, customer }) {
  return call("v2/payments/make-payment", {
    amountDetails: { amount, currencyCode: "USD" },
    merchantReference: reference,
    reasonForPayment: reason,
    resultUrl,
    paymentMethodCode: ECOCASH,
    customer: { phoneNumber: phone, email: customer?.email ?? "", name: customer?.name || "FitMyCV customer" },
    paymentMethodRequiredFields: { customerPhoneNumber: phone },
  });
}

export function checkPayment(referenceNumber) {
  return call(`v1/payments/check-payment?referenceNumber=${encodeURIComponent(referenceNumber)}`);
}
