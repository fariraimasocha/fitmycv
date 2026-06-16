import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import User from "@/models/User";
import { connectDB } from "@/utils/connect";
import { COUNTRY_CODES } from "@/lib/countries";

const DEFAULTS = { titles: [], country: "us", remoteOnly: true, emailDigest: true };

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywall = requirePremium(session);
  if (paywall) return paywall;

  try {
    await connectDB();
    const user = await User.findById(session.user.id).select("jobPreferences").lean();
    return Response.json({ data: { ...DEFAULTS, ...(user?.jobPreferences ?? {}) } });
  } catch (error) {
    console.error("Preferences GET error:", error);
    return Response.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywall = requirePremium(session);
  if (paywall) return paywall;

  try {
    await connectDB();
    const body = await request.json();

    const titles = Array.isArray(body.titles)
      ? body.titles.map((t) => String(t).trim()).filter(Boolean).slice(0, 10)
      : [];

    const c = String(body.country || "us").toLowerCase();
    const country = COUNTRY_CODES.has(c) ? c : "us";

    const jobPreferences = {
      titles,
      country,
      remoteOnly: body.remoteOnly !== false,
      emailDigest: body.emailDigest !== false,
    };

    await User.findByIdAndUpdate(session.user.id, { $set: { jobPreferences } });
    return Response.json({ data: jobPreferences });
  } catch (error) {
    console.error("Preferences PUT error:", error);
    return Response.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
