import { checkCv, cvToText, jobToText } from "@/lib/ats/rules";
import { scoreResumeJobMatch } from "@/lib/resume-job-match";

// Rule-based, no model call. The score comes from lib/ats/rules.js, the same
// rules the CV editor runs live, and keyword coverage is reported beside it,
// never inside it. The AI opinion on the writing lives in /api/ats-review.
export function atsReport(cv, jobData) {
  const report = checkCv(cv, Date.now());
  const match = jobData ? scoreResumeJobMatch(jobToText(jobData), cvToText(cv)) : null;
  return {
    ...report,
    coverage: match && {
      matchedCount: match.keywords.present.length,
      total: match.keywords.terms.length,
      matched: match.keywords.present.map((t) => t.term),
      missing: match.keywords.missing.map((t) => t.term),
      stuffed: match.keywords.stuffed,
      skillsMatched: match.skills.strong,
      skillsMissing: match.skills.missing,
    },
    recommendations: match?.improvements ?? [],
  };
}
