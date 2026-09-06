import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import Job from "@/models/Job";
import { publicJob, CATEGORIES, EMPLOYMENT_TYPES } from "@/lib/job-crawler";

const PAGE_SIZE = 20;
const PERIOD_DAYS = { "24h": 1, week: 7, month: 30 };

function escapeRegex(str) {
  return String(str ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Public on purpose. this page is an acquisition surface. auth() is read only
// to decide how much of each row the viewer earns; no session means not
// premium, which is the correct default.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const category = (searchParams.get("category") ?? "").trim();
  const period = (searchParams.get("posted") ?? "").trim();
  const jobType = (searchParams.get("type") ?? "").trim();
  const remoteOnly = searchParams.get("remote") === "1";
  const paidOnly = searchParams.get("salary") === "1";

  try {
    const session = await auth();
    const isPremium = !!session?.user?.isPremium;

    await connectDB();

    // ponytail: regex scan over titles. fine to ~50k docs. Swap for a text
    // index if the pool ever outgrows that.
    const filter = {};
    if (q) filter.title = { $regex: escapeRegex(q), $options: "i" };
    if (CATEGORIES.includes(category)) filter.category = category;
    // Dates come off crawledAt because it is always populated, unlike postedAt.
    if (PERIOD_DAYS[period]) {
      filter.crawledAt = { $gte: new Date(Date.now() - PERIOD_DAYS[period] * 864e5) };
    }
    if (EMPLOYMENT_TYPES.includes(jobType)) filter.employmentType = jobType;
    if (remoteOnly) filter.remote = true;
    if (paidOnly) filter.salary = { $ne: null };

    const [docs, total] = await Promise.all([
      Job.find(filter)
        // crawledAt, not postedAt: only ~35% of ATS pages expose a real
        // publication date, so sorting on it would tie most of the pool. _id
        // breaks remaining ties so paging can't repeat or skip a row.
        .sort({ crawledAt: -1, _id: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Job.countDocuments(filter),
    ]);

    return Response.json({
      data: docs.map((doc) => publicJob(doc, isPremium)),
      total,
      page,
      hasMore: page * PAGE_SIZE < total,
      isPremium,
      categories: CATEGORIES,
      employmentTypes: EMPLOYMENT_TYPES,
    });
  } catch (error) {
    console.error("Jobs feed GET error:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
