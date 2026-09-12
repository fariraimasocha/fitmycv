import { cookies, headers } from "next/headers";
import { connectDB } from "@/utils/connect";
import Lead from "@/models/Lead";
import { sendLeadNurtureEmail } from "@/lib/lead-nurture-email";
import { resolveCountryFromHeaders } from "@/lib/pricing-region";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function pruneExpiredRateLimits(now = Date.now()) {
  for (const [key, entry] of rateLimit) {
    if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
      rateLimit.delete(key);
    }
  }
}

function isRateLimited(key) {
  const now = Date.now();
  pruneExpiredRateLimits(now);

  const entry = rateLimit.get(key);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(key, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

async function deliverLeadNurtureEmail(lead) {
  await sendLeadNurtureEmail({
    email: lead.email,
    score: lead.score,
    missingKeywordCount: lead.missingKeywordCount,
    country: lead.country,
  });
  lead.emailedAt = new Date();
  await lead.save();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const source = String(body.source ?? "ats_checker").trim();
    const score =
      typeof body.score === "number" ? Math.round(body.score) : null;
    const missingKeywordCount =
      typeof body.missingKeywordCount === "number"
        ? Math.max(0, Math.round(body.missingKeywordCount))
        : null;

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerStore.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 },
      );
    }

    const cookieStore = await cookies();
    const countryFromHeader = resolveCountryFromHeaders(headerStore);
    const countryFromCookie = cookieStore.get("visitor_country")?.value?.toLowerCase();
    const country = countryFromHeader ?? countryFromCookie ?? null;

    await connectDB();

    const existing = await Lead.findOne({ email, source });
    if (existing) {
      if (!existing.emailedAt) {
        try {
          await deliverLeadNurtureEmail(existing);
        } catch (emailError) {
          console.error("Lead nurture email retry failed:", emailError);
        }
      }
      return Response.json({ ok: true, duplicate: true });
    }

    const lead = await Lead.create({
      email,
      source,
      country,
      score,
      missingKeywordCount,
    });

    try {
      await deliverLeadNurtureEmail(lead);
    } catch (emailError) {
      console.error("Lead nurture email failed:", emailError);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return Response.json({ error: "Could not save your email." }, { status: 500 });
  }
}
