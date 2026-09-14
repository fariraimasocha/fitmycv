import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { checkCv, cvToText, jobToText } from "@/lib/ats/rules";
import { scoreResumeJobMatch } from "@/lib/resume-job-match";

// Rule-based, no model call. The score comes from lib/ats/rules.js, the same
// rules the CV editor runs live, and keyword coverage is reported beside it,
// never inside it. The AI opinion on the writing lives in /api/ats-review.
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { tailoredCV, jobData } = await request.json();

    if (!tailoredCV || typeof tailoredCV !== "object") {
      return Response.json({ error: "A CV is required" }, { status: 400 });
    }

    const report = checkCv(tailoredCV, Date.now());
    const match = jobData ? scoreResumeJobMatch(jobToText(jobData), cvToText(tailoredCV)) : null;

    return Response.json({
      data: {
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
      },
    });
  } catch (error) {
    console.error("ATS score error:", error);
    return Response.json({ error: "Failed to check the CV" }, { status: 500 });
  }
}
