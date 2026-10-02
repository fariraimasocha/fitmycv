import crypto from "node:crypto";

// HMAC-sign action links that get clicked from an email (no session available).
// Uses CRON_SECRET so it shares the digest's existing secret, no new env var.
// ponytail: HMAC over a token store; no DB rows, no JWT lib.

function secret() {
  if (!process.env.CRON_SECRET) throw new Error("CRON_SECRET env var is not set");
  return process.env.CRON_SECRET;
}

export function sign(value) {
  return crypto
    .createHmac("sha256", secret())
    .update(String(value))
    .digest("hex")
    .slice(0, 32);
}

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function verify(value, sig) {
  if (!sig) return false;
  return safeEqual(sign(value), sig);
}

// Fails closed: with CRON_SECRET unset, "Bearer undefined" used to pass.
export function isCronRequest(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return safeEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`);
}
