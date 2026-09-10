import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { sanitizeAIText } from "@/utils/sanitize-ai-text";
import OpenAI from "openai";

// This route calls a model. Without this the platform default (10-15s) kills
// the function mid-response and the browser sees a dropped socket, which the
// client can only report as a network error.
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DEFAULT_QUESTION =
  "In 3-5 sentences, tell us why you are interested in this role.";

const SYSTEM_PROMPT = `You answer application form questions on behalf of a candidate, in their voice, using only what their CV and the job posting support.

Return ONLY valid JSON:
{ "answer": "The answer text, plain prose, no headings or bullets." }

Rules:
- Write in first person as the candidate.
- 3 to 5 sentences unless the question asks for a different length. Never exceed the length the question asks for.
- One paragraph, no line breaks, no bullet points, no salutation, no sign-off.
- Name the exact role and company at least once.
- Tie the answer to two or three concrete things: a specific requirement from the posting, and real experience or a real metric from the CV.
- Use only facts present in the CV or the posting. Never invent employers, projects, numbers, or skills.
- Grammar and spelling must be flawless. Use complete sentences and standard British or American spelling consistently.
- Never use em dashes, en dashes, or double hyphens. Use a full stop, a comma, or a colon instead.
- No clichés such as "passionate about", "team player", "fast-paced environment", "I would be a great fit".
- Plain, direct, professional. No marketing language.`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { tailoredCV, jobData, companyBrief, question } = await request.json();

    if (!tailoredCV || !jobData) {
      return Response.json(
        { error: "Tailored CV and job data are required" },
        { status: 400 },
      );
    }

    const prompt = String(question || "").trim() || DEFAULT_QUESTION;

    const companyContext = companyBrief
      ? `\nCompany: ${companyBrief.summary || ""}\nWhat they are working on: ${(companyBrief.challenges || []).join("; ")}`
      : "";

    const userMessage = `## Candidate CV
Name: ${tailoredCV.basics?.name || ""}
Title: ${tailoredCV.basics?.label || ""}
Summary: ${tailoredCV.basics?.summary || ""}

Experience:
${(tailoredCV.work || [])
  .map(
    (w) =>
      `- ${w.position || ""} at ${w.company || ""} (${w.startDate || ""} to ${w.endDate || "present"})\n${w.description || ""}`,
  )
  .join("\n")}

Skills: ${(tailoredCV.skills || [])
      .map((s) => (s.skills || s.keywords || []).join(", "))
      .join("; ")}

## Target Job
Title: ${jobData.title || ""}
Company: ${jobData.company || ""}

Requirements:
${(jobData.requirements || []).map((r) => `- ${r}`).join("\n")}

Responsibilities:
${(jobData.responsibilities || []).map((r) => `- ${r}`).join("\n")}
${companyContext}

## Question to answer
${prompt}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json(
        { error: "Failed to write an answer" },
        { status: 500 },
      );
    }

    const raw = JSON.parse(responseText);
    const answer = sanitizeAIText(String(raw.answer || "").trim());

    if (!answer) {
      return Response.json(
        { error: "Failed to write an answer" },
        { status: 500 },
      );
    }

    return Response.json({ data: { answer, question: prompt } });
  } catch (error) {
    console.error("Why this role error:", error);
    return Response.json(
      { error: "Failed to write an answer" },
      { status: 500 },
    );
  }
}
