import mongoose from "mongoose";
import User from "@/models/User";
import { connectDB } from "@/utils/connect";
import { verify } from "@/lib/sign";
import { SITE_URL } from "@/lib/site";

// One-click unsubscribe from product announcements. No session: the link is
// HMAC-signed, same pattern as app/api/saved-jobs/save/route.js.
//
// GET is the link in the email body. POST is what Gmail and Yahoo call when the
// reader taps their built-in unsubscribe button (RFC 8058 one-click), driven by
// the List-Unsubscribe-Post header we send.

async function optOut(request) {
  const { searchParams } = new URL(request.url);
  const u = searchParams.get("u");
  const s = searchParams.get("s");

  // A bad signature returns the same page as a good one. Otherwise the endpoint
  // tells an attacker which user ids are real.
  if (!u || !mongoose.isValidObjectId(u) || !verify(u, s)) return false;

  await connectDB();
  await User.updateOne({ _id: u }, { $set: { marketingEmails: false } });
  return true;
}

export async function GET(request) {
  try {
    await optOut(request);
  } catch (error) {
    console.error("Unsubscribe error:", error);
  }
  return new Response(page(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Gmail and Yahoo expect 200 and no body here.
export async function POST(request) {
  try {
    await optOut(request);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 200 });
}

function page() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribed | FitMyCV</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f7f4ef;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <main style="max-width:420px;padding:40px 24px;text-align:center;">
    <div style="width:36px;height:36px;margin:0 auto 24px;border-radius:10px;background:#1a1a1a;color:#f7f4ef;font-weight:700;font-size:16px;line-height:36px;">F</div>
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;letter-spacing:-0.4px;">You are unsubscribed</h1>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#5c5c5c;">We will not send you any more product announcements. Your account and your saved CVs are untouched.</p>
    <a href="${SITE_URL}" style="display:inline-block;background:#1a1a1a;color:#f7f4ef;font-size:14px;font-weight:600;padding:12px 22px;border-radius:10px;text-decoration:none;">Go to FitMyCV</a>
  </main>
</body>
</html>`;
}
