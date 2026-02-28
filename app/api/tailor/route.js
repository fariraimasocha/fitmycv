import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseTailorResponse } from "@/utils/tailor-parser";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert CV tailoring assistant. Given a reference CV (JSON) and job requirements, you will:

1. Rewrite the CV to be optimized for the specific role
2. Generate a matching cover letter

Return ONLY valid JSON with this exact structure:
{
  "cv": {
    "basics": {
      "name": "...",
      "label": "Job-relevant title",
      "email": "...",
      "phone": "...",
      "summary": "Rewritten 2-3 sentence summary targeting this role",
      "location": "...",
      "profiles": [{ "network": "...", "url": "..." }]
    },
    "work": [
      {
        "company": "...",
        "position": "...",
        "location": "...",
        "startDate": "...",
        "endDate": "...",
        "highlights": ["Achievement rewritten to emphasize relevance to target role"]
      }
    ],
    "education": [
      {
        "institution": "...",
        "studyType": "...",
        "area": "...",
        "startDate": "...",
        "endDate": "..."
      }
    ],
    "skills": [
      { "name": "Category", "keywords": ["skill1", "skill2"] }
    ]
  },
  "coverLetter": "Full cover letter text with paragraphs separated by newlines..."
}

CV Tailoring Rules:
- Rewrite the professional summary to directly address the target role
- Adjust work experience descriptions to highlight relevant achievements and skills
- Reorder skills to prioritize those matching the job requirements
- Use keywords from the job listing naturally throughout
- NEVER fabricate experience, companies, roles, or skills that aren't in the original CV
- NEVER change dates, company names, or educational institutions
- Keep the same structure but optimize the language and emphasis

Cover Letter Rules:
- Address the specific company and role by name
- Highlight 2-3 of the strongest matching qualifications
- Write 3-4 paragraphs: intro, relevant experience, why this company, closing
- Professional but personable tone
- Do NOT repeat the CV verbatim — complement it with narrative`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { referenceCV, jobData } = await request.json();

    if (!referenceCV || !jobData) {
      return Response.json(
        { error: "Reference CV and job data are required" },
        { status: 400 }
      );
    }

    const userMessage = `## Reference CV
${JSON.stringify(referenceCV, null, 2)}

## Target Job
Title: ${jobData.title}
Company: ${jobData.company}
Location: ${jobData.location || "Not specified"}
Type: ${jobData.type || "Not specified"}

Requirements:
${(jobData.requirements || []).map((r) => `- ${r}`).join("\n")}

Responsibilities:
${(jobData.responsibilities || []).map((r) => `- ${r}`).join("\n")}

Qualifications:
${(jobData.qualifications || []).map((q) => `- ${q}`).join("\n")}

Please tailor the CV for this specific role and generate a cover letter.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 8192,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json(
        { error: "Failed to generate tailored CV" },
        { status: 500 }
      );
    }

    const { tailoredCV, coverLetter } = parseTailorResponse(responseText);

    return Response.json({ data: { tailoredCV, coverLetter } });
  } catch (error) {
    console.error("Tailor error:", error);
    return Response.json(
      { error: "Failed to tailor CV" },
      { status: 500 }
    );
  }
}
