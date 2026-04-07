import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseInterviewPrepResponse } from "@/utils/interview-prep-parser";
import InterviewPrep from "@/models/InterviewPrep";
import { connectDB } from "@/utils/connect";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert interview coach. Given a candidate's tailored CV and the job they're applying for, generate structured interview preparation materials. Return ONLY valid JSON.

{
  "stories": [
    {
      "requirement": "The specific JD requirement this story addresses",
      "situation": "Context and background (1-2 sentences)",
      "task": "What was your specific responsibility (1 sentence)",
      "action": "Concrete steps you took (2-3 sentences, specific and technical)",
      "result": "Measurable outcome with metrics (1-2 sentences)",
      "reflection": "What you learned or would do differently (1 sentence)"
    }
  ],
  "redFlagQA": [
    {
      "question": "A tricky question the interviewer might ask based on CV gaps or career transitions",
      "suggestedAnswer": "A confident, honest answer that reframes the concern positively (2-3 sentences)"
    }
  ],
  "talkingPoints": [
    "Key point to mention during the interview, specific to this company/role"
  ]
}

Rules:
- Generate 4-6 STAR stories, each mapped to a specific JD requirement
- Stories MUST use real experience from the CV — never fabricate achievements or metrics
- Each story should demonstrate a different skill or competency
- Generate 2-4 red flag Q&A items addressing gaps, career changes, or potential concerns
- Generate 3-5 talking points that reference specific company/role details
- Talking points should be actionable: "Mention your X experience when discussing Y"
- Use confident, specific language — no generic advice
- Return ONLY the JSON object`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { tailoredCV, jobData, companyBrief } = await request.json();

    if (!tailoredCV || !jobData) {
      return Response.json(
        { error: "Tailored CV and job data are required" },
        { status: 400 }
      );
    }

    const companyContext = companyBrief
      ? `\n\nCompany Context:\n- Mission: ${companyBrief.mission || "Unknown"}\n- Culture: ${(companyBrief.cultureSignals || []).join(", ")}\n- Challenges: ${(companyBrief.challenges || []).join(", ")}\n- Positioning Tips: ${(companyBrief.positioningTips || []).join("; ")}`
      : "";

    const userMessage = `## Candidate's Tailored CV
${JSON.stringify(tailoredCV, null, 2)}

## Target Job
Title: ${jobData.title || "Not specified"}
Company: ${jobData.company || "Not specified"}

Requirements:
${(jobData.requirements || []).map((r) => `- ${r}`).join("\n")}

Responsibilities:
${(jobData.responsibilities || []).map((r) => `- ${r}`).join("\n")}

Qualifications:
${(jobData.qualifications || []).map((q) => `- ${q}`).join("\n")}${companyContext}

Generate interview preparation materials for this candidate and role.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json(
        { error: "Failed to generate interview prep" },
        { status: 500 }
      );
    }

    const prepData = parseInterviewPrepResponse(responseText);

    // Save to DB
    await connectDB();
    const prep = await InterviewPrep.create({
      userId: session.user.id,
      tailoredCVId: tailoredCV._id || undefined,
      jobTitle: jobData.title || "",
      jobCompany: jobData.company || "",
      ...prepData,
    });

    return Response.json({ data: prepData }, { status: 201 });
  } catch (error) {
    console.error("Interview prep error:", error);
    return Response.json(
      { error: "Failed to generate interview prep" },
      { status: 500 }
    );
  }
}
