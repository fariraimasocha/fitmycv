import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseTailorResponse } from "@/utils/tailor-parser";
import OpenAI from "openai";

// This route calls a model. Without this the platform default (10-15s) kills
// the function mid-response and the browser sees a dropped socket, which the
// client can only report as a network error.
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You edit an already tailored CV to apply ONE specific ATS recommendation. You are not rewriting the CV from scratch.

Return ONLY valid JSON with this exact structure:
{
  "cv": {
    "basics": { "name": "...", "label": "...", "email": "...", "phone": "...", "summary": "...", "location": "...", "profiles": [{ "network": "...", "url": "..." }] },
    "work": [{ "company": "...", "position": "...", "location": "...", "startDate": "...", "endDate": "...", "highlights": ["..."] }],
    "education": [{ "institution": "...", "studyType": "...", "area": "...", "startDate": "...", "endDate": "..." }],
    "skills": [{ "name": "Category", "keywords": ["skill1"] }]
  },
  "changes": ["Plain sentence naming what you changed and where"]
}

Rules:
- Return the COMPLETE CV, including every section, every work entry, and every highlight you did not touch, byte-identical where untouched.
- Change only what the recommendation asks for. Touch as few fields as possible.
- Never invent employers, projects, dates, numbers, skills, or experience the candidate does not already have. If the recommendation asks for experience that is not in the CV, reframe the closest genuine experience in the job's vocabulary instead, and say so in "changes".
- Never change names, dates, employers, job titles, or institutions.
- Preserve every real number already in the CV.
- Highlights stay single plain sentences with no leading bullets or dashes.
- If the recommendation is about page count or length, cut the weakest, least job-relevant highlights rather than shortening every line.
- If the recommendation cannot be applied honestly, return the CV unchanged and explain why in "changes".
- List every edit in "changes", one short sentence each.`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { tailoredCV, jobData, recommendation } = await request.json();

    if (!tailoredCV || !jobData || !recommendation) {
      return Response.json(
        { error: "Tailored CV, job data, and a recommendation are required" },
        { status: 400 },
      );
    }

    const userMessage = `## Current tailored CV
${JSON.stringify(tailoredCV, null, 2)}

## Target Job
Title: ${jobData.title || ""}
Company: ${jobData.company || ""}

Requirements:
${(jobData.requirements || []).map((r) => `- ${r}`).join("\n")}

Responsibilities:
${(jobData.responsibilities || []).map((r) => `- ${r}`).join("\n")}

## Recommendation to apply
${recommendation}

Apply this one recommendation and return the complete CV.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 8192,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json({ error: "Failed to apply the fix" }, { status: 500 });
    }

    const parsed = parseTailorResponse(responseText);
    const updatedCV = parsed.tailoredCV;

    // The model occasionally returns a truncated CV. Dropping roles the user
    // already had is worse than not applying the fix, so refuse instead.
    const expectedRoles = (tailoredCV.work || []).length;
    if (expectedRoles > 0 && (updatedCV.work || []).length < expectedRoles) {
      return Response.json(
        { error: "The fix came back incomplete. Try again." },
        { status: 502 },
      );
    }

    let changes = [];
    try {
      const raw = JSON.parse(responseText);
      changes = Array.isArray(raw.changes) ? raw.changes.map(String) : [];
    } catch {
      changes = [];
    }

    return Response.json({ data: { tailoredCV: updatedCV, changes } });
  } catch (error) {
    console.error("ATS apply error:", error);
    return Response.json({ error: "Failed to apply the fix" }, { status: 500 });
  }
}
