import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import ReferenceCV from "@/models/ReferenceCV";
import User from "@/models/User";
import { searchJobs, buildQueries } from "@/lib/jsearch";
import { COUNTRY_CODES } from "@/lib/countries";

export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const manualQuery = searchParams.get("query");
  const countryParam = searchParams.get("country")?.toLowerCase();

  try {
    await connectDB();

    // Same market and remote setting as the email digest. Without a country
    // JSearch defaults to the US, so everyone saw US listings.
    const user = await User.findById(session.user.id).select("jobPreferences").lean();
    const prefs = user?.jobPreferences ?? {};
    const country = COUNTRY_CODES.has(countryParam) ? countryParam : prefs.country || "us";

    let queries = [];

    if (manualQuery) {
      queries = [manualQuery];
    } else {
      const cv = await ReferenceCV.findOne({ userId: session.user.id }).lean();
      queries = buildQueries(cv, prefs);
      if (queries.length === 0) {
        return Response.json(
          { error: "Upload your CV to see matching jobs, or search by job title." },
          { status: 422 }
        );
      }
    }

    const results = await Promise.all(
      queries.map((q) =>
        searchJobs(q, { date_posted: "week", remote_jobs_only: prefs.remoteOnly !== false, country })
      )
    );

    const seen = new Set();
    const jobs = results
      .flat()
      .filter((j) => {
        if (seen.has(j.id)) return false;
        seen.add(j.id);
        return true;
      })
      .slice(0, 10);

    return Response.json({ queries, country, jobs, count: jobs.length });
  } catch (error) {
    console.error("Jobs API error:", error);
    return Response.json({ error: "Couldn't load jobs. Refresh the page." }, { status: 500 });
  }
}
