import { connectDB } from "@/utils/connect";
import Job from "@/models/Job";
import { crawlJobs } from "@/lib/job-crawler";

export const maxDuration = 300;

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const { jobs, seen, skipped, staleAfterEnrich, errors } = await crawlJobs();

    if (jobs.length === 0) {
      return Response.json({ seen, upserted: 0, skipped, staleAfterEnrich, errors });
    }

    // Upsert on url: a posting we've already got keeps its original crawledAt
    // (so the TTL still measures from first sighting) but refreshes its title.
    const result = await Job.bulkWrite(
      jobs.map((job) => {
        // Fields we derive ourselves are always safe to rewrite.
        const set = {
          title: job.title,
          company: job.company,
          companySlug: job.companySlug,
          source: job.source,
          remote: job.remote,
          snippet: job.snippet,
          category: job.category,
        };
        // Enrichment fields are only written when we actually got a value.
        // Writing null unconditionally would erase every location and salary in
        // the pool the first time OpenAI is down, rate limited, or out of
        // credit, and the next crawl is 12 hours away.
        if (job.location) set.location = job.location;
        if (job.salary) set.salary = job.salary;
        if (job.employmentType) set.employmentType = job.employmentType;
        if (job.postedAt) set.postedAt = job.postedAt;

        return {
          updateOne: {
            filter: { url: job.url },
            update: {
              $set: set,
              $setOnInsert: {
                url: job.url,
                crawledAt: new Date(),
                ...(job.postedAt ? {} : { postedAt: null }),
              },
            },
            upsert: true,
          },
        };
      }),
      { ordered: false }
    );

    return Response.json({
      seen,
      parsed: jobs.length,
      upserted: result.upsertedCount ?? 0,
      matched: result.matchedCount ?? 0,
      skipped,
      staleAfterEnrich,
      withLocation: jobs.filter((j) => j.location).length,
      withSalary: jobs.filter((j) => j.salary).length,
      errors,
    });
  } catch (error) {
    console.error("Jobs crawl cron error:", error);
    return Response.json({ error: "Crawl failed" }, { status: 500 });
  }
}
