// Aggregate study of tailored CVs: how much tailoring moves the job match score,
// and which skills postings ask for that uploaded CVs most often miss.
// Read-only on MongoDB. Prints JSON; save it with
//   node --env-file=.env scripts/tailoring-study.mjs > data/tailoring-study.json
//
// Privacy (see the privacy policy): counts and medians only, never a single CV,
// name or company. Any group under MIN_GROUP CVs is dropped from the output.
//
// Pairing: a tailored CV is compared with its owner's reference CV only when
// that reference was last updated before the tailoring, so "before" really is
// the CV the user started from.
import { createRequire } from "node:module";
import { scoreResumeJobMatch } from "../lib/resume-job-match.js";
import { cvToText, jobToText } from "../lib/ats/rules.js";
import { keepClaimedSkills } from "../lib/skill-guard.js";

const mongoose = createRequire(import.meta.url)("mongoose");
const MIN_GROUP = 20;

// ponytail: title keywords, first match wins. Good enough to group; add a family
// when "Other" grows past a third of the sample.
const FAMILIES = [
  ["Software and IT", /engineer|developer|devops|software|frontend|backend|full.?stack|sre|it support|technical/i],
  ["Data and analytics", /data|analyst|analytics|scientist|bi\b/i],
  ["Sales and accounts", /sales|account (executive|manager)|business development|bdr|sdr/i],
  ["Marketing and content", /marketing|content|seo|social media|brand|communications/i],
  ["Product and design", /product|design|ux|ui\b/i],
  ["Operations and projects", /operations|project|program|logistics|supply chain/i],
  ["Finance and accounting", /financ|account(ant|ing)|audit|tax|bookkeep/i],
  ["Customer support", /customer|support|service|success/i],
  ["HR and recruiting", /\bhr\b|human resources|recruit|talent|people/i],
  ["Admin and office", /admin|assistant|office|receptionist|secretary/i],
  ["Healthcare", /nurse|clinical|health|medical|pharm|care/i],
  ["Education", /teacher|lecturer|tutor|education|teaching/i],
];
const familyOf = (title = "") => FAMILIES.find(([, re]) => re.test(title))?.[0] ?? "Other";

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const refs = new Map(
  (await db.collection("referencecvs").find({}, { projection: { userId: 1, basics: 1, work: 1, education: 1, skills: 1, updatedAt: 1 } }).toArray())
    .map((r) => [String(r.userId), r])
);
const tailored = await db
  .collection("tailoredcvs")
  .find({ jobData: { $exists: true, $ne: null } }, { projection: { userId: 1, basics: 1, work: 1, education: 1, skills: 1, jobData: 1, createdAt: 1 } })
  .toArray();

const pairs = [];
let skippedNoRef = 0;
let skippedReupload = 0;
for (const t of tailored) {
  const ref = refs.get(String(t.userId));
  if (!ref) { skippedNoRef++; continue; }
  if (ref.updatedAt && t.createdAt && ref.updatedAt > t.createdAt) { skippedReupload++; continue; }
  const job = jobToText(t.jobData);
  if (job.length < 200) continue; // too little posting text to score
  const before = scoreResumeJobMatch(job, cvToText(ref));
  // Score the CV as the tailor now saves it: skills the original never
  // claimed are dropped by lib/skill-guard.js, so they cannot inflate "after".
  const after = scoreResumeJobMatch(job, cvToText({ ...t, skills: keepClaimedSkills(t.skills, ref).skills }));
  pairs.push({
    family: familyOf(t.jobData.title),
    before: before.overall,
    after: after.overall,
    keywordsBefore: before.keywords.score,
    keywordsAfter: after.keywords.score,
    asked: [...new Set([...before.skills.strong, ...before.skills.missing])],
    missingBefore: before.skills.missing,
  });
}
await mongoose.disconnect();

function summarise(rows) {
  const askCount = {};
  const missCount = {};
  for (const r of rows) {
    for (const s of r.asked) askCount[s] = (askCount[s] ?? 0) + 1;
    for (const s of r.missingBefore) missCount[s] = (missCount[s] ?? 0) + 1;
  }
  // A skill needs 5+ postings asking for it before its miss rate means anything.
  const missedSkills = Object.entries(askCount)
    .filter(([, asked]) => asked >= 5)
    .map(([skill, asked]) => ({ skill, asked, missedShare: Math.round(((missCount[skill] ?? 0) / asked) * 100) }))
    .sort((a, b) => b.missedShare * b.asked - a.missedShare * a.asked)
    .slice(0, 10);
  return {
    cvs: rows.length,
    medianScoreBefore: median(rows.map((r) => r.before)),
    medianScoreAfter: median(rows.map((r) => r.after)),
    medianKeywordsBefore: median(rows.map((r) => r.keywordsBefore)),
    medianKeywordsAfter: median(rows.map((r) => r.keywordsAfter)),
    shareImproved: Math.round((rows.filter((r) => r.after > r.before).length / rows.length) * 100),
    mostMissedSkills: missedSkills,
  };
}

const byFamily = Object.groupBy(pairs, (p) => p.family);
console.log(
  JSON.stringify(
    {
      generatedOn: new Date().toISOString().slice(0, 10),
      method: {
        scorer: "lib/resume-job-match.js (the free job match checker)",
        afterScoredWith: "lib/skill-guard.js applied, so unclaimed skills do not count",
        tailoredWithPosting: tailored.length,
        skippedNoReferenceCv: skippedNoRef,
        skippedReferenceUpdatedAfter: skippedReupload,
        minGroup: MIN_GROUP,
      },
      overall: pairs.length >= MIN_GROUP ? summarise(pairs) : null,
      byFamily: Object.fromEntries(
        Object.entries(byFamily)
          .filter(([, rows]) => rows.length >= MIN_GROUP)
          .map(([family, rows]) => [family, summarise(rows)])
      ),
    },
    null,
    1
  )
);
