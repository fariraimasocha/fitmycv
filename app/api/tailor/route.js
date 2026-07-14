import { auth } from "@/lib/auth";
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
        "highlights": [
          "First achievement rewritten for the target role",
          "Second achievement rewritten for the target role",
          "Third achievement rewritten for the target role",
          "Fourth achievement rewritten for the target role"
        ]
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
  "coverLetter": "Full cover letter text with paragraphs separated by newlines...",
  "keywordsInjected": [
    { "keyword": "React", "location": "Summary" },
    { "keyword": "CI/CD", "location": "Work entry 1, highlight 2" }
  ]
}

CV Tailoring Rules:
- First, extract 15-20 key terms from the job description (technologies, skills, domain concepts)
- Rewrite the professional summary to directly address the target role, embedding top 5 keywords naturally
- For EVERY work entry, the "highlights" array MUST contain exactly 4 items
- Each highlight is a single achievement or responsibility sentence (plain text, no leading bullets or dashes)
- Draw from the reference CV's existing bullets/description — expand and rephrase into 4 distinct, non-redundant highlights; NEVER invent new experience
- Weave job keywords naturally across all 4 highlights per role, not just the first two
- Include ALL work entries from the reference CV — do not drop roles
- Reorder skills to prioritize those matching the job requirements
- NEVER fabricate experience, companies, roles, or skills that aren't in the original CV
- NEVER change dates, company names, or educational institutions
- Keep the same structure but optimize the language and emphasis
- Track every keyword you injected in the "keywordsInjected" array with the keyword and where it was placed

Cover Letter Rules:
- Write the cover letter specifically for the exact job title and company provided — it must be obvious which role the candidate is applying for
- Open with the role title and company name in the first sentence (e.g. "I am writing to apply for the [Job Title] position at [Company]")
- Reference 3-4 specific requirements or responsibilities from the job posting and explain how the candidate's experience maps to each
- Use the job's own terminology (skills, tools, domain language) — mirror phrasing from the requirements and responsibilities sections
- Highlight 2-3 of the strongest matching qualifications with concrete examples from the CV (company names, outcomes, metrics where available)
- Write 3-4 paragraphs: role-specific intro, relevant experience mapped to job duties, why this company/role, closing with call to action
- Professional but personable tone
- Do NOT write a generic cover letter that could apply to any job — every paragraph must tie back to this specific role
- Do NOT repeat the CV verbatim — complement it with narrative that shows fit for this role`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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

Please tailor the CV for this specific role and generate a cover letter that clearly addresses the ${jobData.title} position at ${jobData.company}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
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

    const { tailoredCV, coverLetter, keywordsInjected } = parseTailorResponse(responseText);

    return Response.json({ data: { tailoredCV, coverLetter, keywordsInjected } });
  } catch (error) {
    console.error("Tailor error:", error);
    return Response.json(
      { error: "Failed to tailor CV" },
      { status: 500 }
    );
  }
}
