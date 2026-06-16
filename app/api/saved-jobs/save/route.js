import { NextResponse } from "next/server";
import JobDigestItem from "@/models/JobDigestItem";
import { connectDB } from "@/utils/connect";
import { verify } from "@/lib/sign";
import { SITE_URL } from "@/lib/site";

// One-click save from the digest email. No session required — the link is
// HMAC-signed, so we trust (u, j) only when the signature matches.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const u = searchParams.get("u");
  const j = searchParams.get("j");
  const s = searchParams.get("s");

  const redirect = (ok) =>
    NextResponse.redirect(`${SITE_URL}/dashboard/saved?saved=${ok ? 1 : 0}`);

  if (!u || !j || !verify(`${u}:${j}`, s)) {
    return redirect(false);
  }

  try {
    await connectDB();
    // Only flips a row the cron already wrote, so a forged (u,j) can't inject
    // arbitrary jobs — matchedCount is 0 if it was never sent to this user.
    const res = await JobDigestItem.updateOne(
      { userId: u, jobId: j },
      { $set: { saved: true, savedAt: new Date() } }
    );
    return redirect(res.matchedCount > 0);
  } catch (error) {
    console.error("Save job error:", error);
    return redirect(false);
  }
}
