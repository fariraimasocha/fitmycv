import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import ReferenceCV from "@/models/ReferenceCV";
import { searchJobs, buildQueriesFromCV } from "@/lib/jsearch";
import { buildJobDigestEmail } from "@/lib/job-digest-email";
import { Resend } from "resend";

export const maxDuration = 300;

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const users = await User.find({ isPremium: true }).select("email name").lean();

  const resend = new Resend(process.env.RESEND_API_KEY);
  let processed = 0;
  let skipped = 0;
  const errors = [];

  for (const user of users) {
    try {
      const cv = await ReferenceCV.findOne({ userId: user._id }).lean();
      const queries = buildQueriesFromCV(cv);

      if (queries.length === 0) {
        skipped++;
        continue;
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

      if (jobs.length === 0) {
        skipped++;
        continue;
      }

      await resend.emails.send({
        from: "FitMyCV <onboarding@resend.dev>",
        to: user.email,
        subject: `Your daily job matches — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        html: buildJobDigestEmail({ userName: user.name, jobs }),
      });

      processed++;
    } catch (err) {
      console.error(`Job digest error for ${user.email}:`, err);
      errors.push({ email: user.email, error: err.message });
    }
  }

  return Response.json({ processed, skipped, errors, total: users.length });
}
