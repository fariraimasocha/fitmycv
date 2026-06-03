import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import ReferenceCV from "@/models/ReferenceCV";
import { searchJobs, buildQueriesFromCV } from "@/lib/jsearch";

export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const manualQuery = searchParams.get("query");

  try {
    await connectDB();

    let queries = [];

    if (manualQuery) {
      queries = [manualQuery];
    } else {
      const cv = await ReferenceCV.findOne({ userId: session.user.id }).lean();
      queries = buildQueriesFromCV(cv);
      if (queries.length === 0) {
        return Response.json(
          { error: "No CV found. Upload your CV or pass ?query= to search manually." },
          { status: 422 }
        );
      }
    }

    const results = await Promise.all(
      queries.map((q) => searchJobs(q, { date_posted: "week", remote_jobs_only: true }))
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

    return Response.json({ queries, jobs, count: jobs.length });
  } catch (error) {
    console.error("Jobs API error:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
