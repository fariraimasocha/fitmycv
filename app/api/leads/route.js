import { cookies, headers } from "next/headers";
import { connectDB } from "@/utils/connect";
import Lead from "@/models/Lead";
import { sendLeadNurtureEmail } from "@/lib/lead-nurture-email";
import { resolveCountryFromHeaders } from "@/lib/pricing-region";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// The only form that posts here. Taking source from the body let one address
// be mailed again under every new source string.
const SOURCE = "ats_checker";
// ponytail: per-isolate map, so it only slows a burst. Add a Cloudflare rate
// limiting rule on /api/leads if abuse shows up.
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
    // Set by Cloudflare and not spoofable, unlike the first x-forwarded-for entry.
    const ip = headerStore.get("cf-connecting-ip") || "unknown";

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

    // One nurture email per address, ever.
    const existing = await Lead.findOne({ email });
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
      source: SOURCE,
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
    return Response.json({ error: "Couldn't save your email. Try again." }, { status: 500 });
  }
}
