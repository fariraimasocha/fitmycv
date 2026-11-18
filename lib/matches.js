import Job from "@/models/Job";
import User from "@/models/User";
import ReferenceCV from "@/models/ReferenceCV";
import TailoredCV from "@/models/TailoredCV";
import Application from "@/models/Application";
import { buildQueries, scoreJob } from "@/lib/jsearch";
import { publicJob } from "@/lib/job-crawler";
import { escapeRegex, startOfWeek, titleTerms } from "@/lib/match-terms";

// ponytail: regex over recent titles, then scoreJob in memory over at most 400
// rows. Fine for the current pool; swap for a text index or embeddings if the
// pool or the user count outgrows it.
export async function getTopMatches({ userId, isPremium, n = 3, exclude = [], since = null }) {
  const [cv, user, tailored] = await Promise.all([
    ReferenceCV.findOne({ userId }).lean(),
    User.findById(userId).select("jobPreferences").lean(),
    TailoredCV.find({ userId }).select("jobUrl").lean(),
  ]);
  if (!cv) return [];

  const terms = titleTerms(buildQueries(cv, user?.jobPreferences));
  if (terms.length === 0) return [];

  const skip = new Set([...exclude, ...tailored.map((t) => t.jobUrl)].filter(Boolean));
  const docs = await Job.find({
    title: { $regex: terms.map(escapeRegex).join("|"), $options: "i" },
    crawledAt: { $gte: new Date(Date.now() - 14 * 864e5) },
  })
    .sort({ crawledAt: -1 })
    .limit(400)
    .lean();

  return docs
    .filter((doc) => !skip.has(doc.url))
    .map((doc) => ({ doc, fit: scoreJob(cv, { title: doc.title, highlights: { s: [doc.snippet ?? ""] } }) }))
    .filter(({ fit }) => fit > 0)
    .sort((a, b) => b.fit - a.fit || b.doc.crawledAt - a.doc.crawledAt)
    .slice(0, n)
    .map(({ doc, fit }) => ({
      ...publicJob(doc, isPremium),
      fit,
      isNew: Boolean(since && doc.crawledAt > since),
    }));
}

export async function getWeeklyProgress(userId) {
  const [user, applied] = await Promise.all([
    User.findById(userId).select("weeklyGoal").lean(),
    Application.countDocuments({ userId, appliedAt: { $gte: startOfWeek() } }),
  ]);
  return { goal: user?.weeklyGoal ?? 5, applied };
}

// Called by the dashboard home. Returns the visit before this one, which is
// what "New since your last visit" compares against.
export async function touchLastActive(userId) {
  const user = await User.findById(userId).select("lastActiveAt previousActiveAt").lean();
  const last = user?.lastActiveAt ?? null;
  if (!last || Date.now() - new Date(last) > 12 * 3600e3) {
    await User.updateOne({ _id: userId }, { lastActiveAt: new Date(), previousActiveAt: last });
    return last;
  }
  return user?.previousActiveAt ?? null;
}
