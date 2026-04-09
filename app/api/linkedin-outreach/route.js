import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a LinkedIn outreach specialist. Given a candidate's CV and a job they're interested in, generate a compelling LinkedIn connection request message.

The message MUST be under 300 characters (LinkedIn connection request limit).

Structure: Hook (company challenge or initiative) + Proof (candidate's relevant achievement) + Proposal (brief conversation).

Return ONLY valid JSON:
{
  "message": "The 300-char connection message",
  "characterCount": 287,
  "targetRoles": ["Hiring Manager", "Engineering Lead"],
  "alternateMessages": [
    "A different version of the message with a different angle"
  ]
}

Rules:
- Message MUST be under 300 characters — count carefully
- Open with something specific about the company (not generic)
- Include one concrete metric or achievement from the candidate
- End with a soft ask ("would love to chat" or "happy to share insights")
- Tone: confident, specific, direct — not salesy
- Generate 2 alternate versions with different hooks
- targetRoles: suggest 2-3 roles at the company worth reaching out to
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
      ? `\nCompany Info: ${companyBrief.summary || ""}\nChallenges: ${(companyBrief.challenges || []).join(", ")}\nRecent News: ${(companyBrief.recentNews || []).map((n) => n.title).join(", ")}`
      : "";

    const userMessage = `## Candidate Summary
Name: ${tailoredCV.basics?.name || ""}
Title: ${tailoredCV.basics?.label || ""}
Summary: ${tailoredCV.basics?.summary || ""}
Key skills: ${(tailoredCV.skills || []).map((s) => (s.skills || s.keywords || []).join(", ")).join(", ")}

## Target Job
Title: ${jobData.title || ""}
Company: ${jobData.company || ""}
${companyContext}

Generate a LinkedIn connection request message for reaching out about this role.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json(
        { error: "Failed to generate outreach message" },
        { status: 500 }
      );
    }

    // Parse JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Failed to parse response" }, { status: 500 });
    }

    const raw = JSON.parse(jsonMatch[0]);

    return Response.json({
      data: {
        message: raw.message || "",
        characterCount: (raw.message || "").length,
        targetRoles: Array.isArray(raw.targetRoles) ? raw.targetRoles : [],
        alternateMessages: Array.isArray(raw.alternateMessages) ? raw.alternateMessages : [],
      },
    });
  } catch (error) {
    console.error("LinkedIn outreach error:", error);
    return Response.json(
      { error: "Failed to generate outreach message" },
      { status: 500 }
    );
  }
}
