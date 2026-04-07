import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseJobScoreResponse } from "@/utils/job-score-parser";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a career matching expert. Given a candidate's reference CV and a job description, assess the match quality BEFORE the CV is tailored. This helps the candidate decide if the job is worth pursuing.

Score across 4 dimensions with letter grades (A+, A, B+, B, C+, C, D, F). Return ONLY valid JSON:

{
  "globalScore": 3.8,
  "globalGrade": "B+",
  "recommendation": "Strong match — your backend and API experience align well. Worth tailoring.",
  "dimensions": {
    "cvMatch": {
      "grade": "B+",
      "reasoning": "You have 7/10 required skills. Missing: Kubernetes, Terraform. Your Node.js and Python experience directly maps to their stack."
    },
    "compensation": {
      "grade": "A",
      "reasoning": "Listed range $130K-160K aligns well with your experience level and market rates for this role."
    },
    "cultureSignals": {
      "grade": "B",
      "reasoning": "Remote-friendly, fast-paced startup. Engineering blog shows strong technical culture. No red flags."
    },
    "redFlags": {
      "grade": "A",
      "reasoning": "No concerning patterns. Clear job description, reasonable requirements, fair compensation range."
    }
  }
}

Scoring guide:
- globalScore: 1-5 scale (5 = perfect match)
- cvMatch: How well does the candidate's existing experience match the requirements? Count matched vs missing skills.
- compensation: If salary is listed, how does it compare to market? If not listed, grade based on company stage/industry norms.
- cultureSignals: What can be inferred about culture from the JD language, benefits, and company description?
- redFlags: Look for unrealistic requirements, too many hats, vague responsibilities, concerning language. A = no red flags, F = major concerns.

Rules:
- Be honest and specific in reasoning — cite actual skills/requirements
- If salary is not listed, say so in compensation reasoning and give a B grade
- Recommendation should be actionable: "worth tailoring", "consider skipping", "strong match", etc.
- Keep reasoning to 1-2 sentences per dimension
- Return ONLY the JSON object`;

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

    const userMessage = `## Candidate's Current CV
${JSON.stringify(referenceCV, null, 2)}

## Job Posting
Title: ${jobData.title || "Not specified"}
Company: ${jobData.company || "Not specified"}
Location: ${jobData.location || "Not specified"}
Type: ${jobData.type || "Not specified"}
Salary: ${jobData.salary || "Not listed"}

Requirements:
${(jobData.requirements || []).map((r) => `- ${r}`).join("\n")}

Responsibilities:
${(jobData.responsibilities || []).map((r) => `- ${r}`).join("\n")}

Qualifications:
${(jobData.qualifications || []).map((q) => `- ${q}`).join("\n")}

Assess how well this candidate matches this job BEFORE any tailoring.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json(
        { error: "Failed to score job match" },
        { status: 500 }
      );
    }

    const scoreResult = parseJobScoreResponse(responseText);

    return Response.json({ data: scoreResult });
  } catch (error) {
    console.error("Job score error:", error);
    return Response.json(
      { error: "Failed to score job match" },
      { status: 500 }
    );
  }
}
