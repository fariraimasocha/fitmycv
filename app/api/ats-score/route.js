import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseAtsResponse } from "@/utils/ats-parser";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an ATS (Applicant Tracking System) expert. Analyze how well a CV matches a job description.
Score each dimension 0-100. Extract keywords from job requirements/responsibilities/qualifications.
Check which keywords appear in the CV (case-insensitive). Return ONLY valid JSON, no markdown.

Return this exact JSON structure:
{
  "score": 78,
  "breakdown": { "keywords": 85, "skills": 90, "experience": 75, "sectionCompleteness": 80 },
  "keywordsMatched": ["React", "TypeScript", "Node.js"],
  "keywordsMissing": ["AWS", "Docker", "CI/CD"],
  "formattingNotes": ["Avoid tables", "Keep to one page"],
  "recommendations": ["Add 'AWS' to skills — mentioned 4x in job", "Expand DevOps bullet to mention containerization"]
}`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { tailoredCV, jobData } = await request.json();

    if (!tailoredCV || !jobData) {
      return Response.json(
        { error: "Tailored CV and job data are required" },
        { status: 400 }
      );
    }

    const userMessage = `## Tailored CV
${JSON.stringify(tailoredCV, null, 2)}

## Job Description
Title: ${jobData.title || "Not specified"}
Company: ${jobData.company || "Not specified"}

Requirements:
${(jobData.requirements || []).map((r) => `- ${r}`).join("\n")}

Responsibilities:
${(jobData.responsibilities || []).map((r) => `- ${r}`).join("\n")}

Qualifications:
${(jobData.qualifications || []).map((q) => `- ${q}`).join("\n")}

Analyze how well this tailored CV matches the job description and return the ATS score JSON.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 2048,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json(
        { error: "Failed to generate ATS score" },
        { status: 500 }
      );
    }

    const atsResult = parseAtsResponse(responseText);

    return Response.json({ data: atsResult });
  } catch (error) {
    console.error("ATS score error:", error);
    return Response.json(
      { error: "Failed to analyze ATS score" },
      { status: 500 }
    );
  }
}
