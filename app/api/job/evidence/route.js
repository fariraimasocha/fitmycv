import { auth } from "@/lib/auth";
import { chat, MODEL_FAST } from "@/lib/groq";
import { cvToText } from "@/lib/ats/rules";
import { groqRateLimited, tooManyRequests } from "@/lib/rate-limit";

// For each requirement in a posting, the line of the user's own CV that shows
// it. Free for everyone: it is the proof that we read their CV.
const SYSTEM_PROMPT = `You compare a candidate's CV with a job's requirements.

For every numbered requirement, decide:
- "met": the CV clearly shows it.
- "partial": the CV shows something close (a related skill, fewer years, a similar tool).
- "missing": nothing in the CV shows it.

For "met" and "partial", copy the single most convincing line from the CV word for word into "quote". Copy, never paraphrase or combine lines. Keep it under 140 characters by cutting the end. For "missing", quote is "".

Return ONLY JSON: {"requirements":[{"i":0,"status":"met","quote":"..."}],"qualifications":[...]}
Include every index, in order.`;

const MAX_ITEMS = 15;
const STATUSES = new Set(["met", "partial", "missing"]);

const normalize = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

// A quote only counts if it is really in the CV. Anything the model made up
// becomes "missing", so a tick on screen always has the user's own words under it.
function verify(list, items, cvNorm) {
  return items.map((_, i) => {
    const row = Array.isArray(list) ? list.find((r) => Number(r?.i) === i) : null;
    const status = STATUSES.has(row?.status) ? row.status : "missing";
    const quote = String(row?.quote ?? "")
      .replace(/^[\s•·▪*\-–—]+/, "")
      .trim()
      .slice(0, 160);
    const found = quote.length >= 8 && cvNorm.includes(normalize(quote));
    if (status === "missing" || !found) return { status: "missing", quote: "" };
    return { status, quote };
  });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (await groqRateLimited(session.user.id)) return tooManyRequests();

  try {
    const { referenceCV, jobData } = await request.json();
    const requirements = (jobData?.requirements || []).slice(0, MAX_ITEMS).map(String);
    const qualifications = (jobData?.qualifications || []).slice(0, MAX_ITEMS).map(String);
    if (!referenceCV || (!requirements.length && !qualifications.length)) {
      return Response.json({ data: { requirements: [], qualifications: [] } });
    }

    const cvText = cvToText(referenceCV);
    const numbered = (items) => items.map((r, i) => `${i}. ${r}`).join("\n") || "(none)";
    const completion = await chat({
      model: MODEL_FAST,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `## CV\n${cvText}\n\n## Requirements\n${numbered(requirements)}\n\n## Qualifications\n${numbered(qualifications)}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: 2048,
    });

    const raw = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const cvNorm = normalize(cvText);
    return Response.json({
      data: {
        requirements: verify(raw.requirements, requirements, cvNorm),
        qualifications: verify(raw.qualifications, qualifications, cvNorm),
      },
    });
  } catch (error) {
    console.error("Job evidence error:", error);
    return Response.json({ error: "Couldn't check your CV against this job. Try again." }, { status: 500 });
  }
}
