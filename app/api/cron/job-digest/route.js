import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import ReferenceCV from "@/models/ReferenceCV";
import JobDigestItem from "@/models/JobDigestItem";
import { searchJobs, buildQueries, scoreJob } from "@/lib/jsearch";
import { buildJobDigestEmail } from "@/lib/job-digest-email";
import { Resend } from "resend";

export const maxDuration = 300;

const DEDUP_WINDOW_DAYS = 14;

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Skip anyone who turned the digest off. $ne:false keeps users who never set prefs.
  const users = await User.find({
    isPremium: true,
    "jobPreferences.emailDigest": { $ne: false },
  })
    .select("email name jobPreferences")
    .lean();

  const resend = new Resend(process.env.RESEND_API_KEY);
  let processed = 0;
  let skipped = 0;
  const errors = [];

  const since = new Date(Date.now() - DEDUP_WINDOW_DAYS * 864e5);

  for (const user of users) {
    try {
      const cv = await ReferenceCV.findOne({ userId: user._id }).lean();
      const prefs = user.jobPreferences ?? {};
      const queries = buildQueries(cv, prefs);

      if (queries.length === 0) {
        skipped++;
        continue;
      }

      const results = await Promise.all(
        queries.map((q) =>
          searchJobs(q, {
            date_posted: "week",
            remote_jobs_only: prefs.remoteOnly !== false,
            country: prefs.country || "us",
          })
        )
      );

      // jobIds already emailed to this user inside the dedup window.
      const sent = await JobDigestItem.find({ userId: user._id, sentAt: { $gte: since } })
        .select("jobId")
        .lean();
      const sentIds = new Set(sent.map((d) => d.jobId));

      // Dedup within batch + against recently-sent, then rank by CV match.
      const seen = new Set();
      const jobs = results
        .flat()
        .filter((j) => {
          if (seen.has(j.id) || sentIds.has(j.id)) return false;
          seen.add(j.id);
          return true;
        })
        .sort((a, b) => scoreJob(cv, b) - scoreJob(cv, a))
        .slice(0, 10);

      if (jobs.length === 0) {
        skipped++;
        continue;
      }

      await resend.emails.send({
        from: "FitMyCV <onboarding@resend.dev>",
        to: user.email,
        subject: `Your daily job matches — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        html: buildJobDigestEmail({
          userId: String(user._id),
          userName: user.name,
          jobs,
          queries,
        }),
      });

      // Record what we sent — powers dedup and the email "Save" link.
      await JobDigestItem.insertMany(
        jobs.map((job) => ({ userId: user._id, jobId: job.id, job })),
        { ordered: false }
      ).catch(() => {}); // ignore duplicate-key races

      processed++;
    } catch (err) {
      console.error(`Job digest error for ${user.email}:`, err);
      errors.push({ email: user.email, error: err.message });
    }
  }

  return Response.json({ processed, skipped, errors, total: users.length });
}
