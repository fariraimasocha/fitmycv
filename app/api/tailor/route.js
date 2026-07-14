import { auth } from "@/lib/auth";
import { parseTailorResponse } from "@/utils/tailor-parser";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert CV tailoring assistant and career coach. Given a reference CV (JSON) and job requirements, you will:

1. Rewrite the CV to be optimized for the specific role and to pass Applicant Tracking Systems (ATS)
2. Generate a matching cover letter

Return ONLY valid JSON with this exact structure:
{
  "cv": {
    "basics": {
      "name": "...",
      "label": "Job-relevant title",
      "email": "...",
      "phone": "...",
      "summary": "Rewritten 3-4 sentence summary targeting this role",
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
          "Achievement rewritten for the target role",
          "Another achievement rewritten for the target role"
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

Keyword strategy (do this first, internally):
- Extract 15-20 key terms from the job description. Separate HARD skills (technologies, tools, methods, certifications, domain nouns) from SOFT skills (communication, leadership, collaboration).
- ATS weight hard skills far more heavily than soft skills — prioritize hard-skill terms, and only inject terms the candidate can genuinely support from their real experience.
- Mirror the job's EXACT terminology and spelling. If the posting says "CI/CD", use "CI/CD" (not "continuous integration"); if it says "Node.js", don't write "NodeJS".

CV Tailoring Rules:
- Rewrite the professional summary as 3-4 sentences: lead with the target job title and years of experience, then weave in the top 3-5 hard keywords naturally. Do NOT dump a comma-separated keyword list.
- Rewrite work highlights as achievement statements, not duty lists. Use the pattern: strong action verb → what you did → quantified result/impact. Start each with a distinct, strong action verb (Led, Built, Reduced, Shipped, Automated…) — never reuse the same opener twice in one role.
- QUANTIFY wherever the source CV supports it (%, $, time saved, scale, counts). PRESERVE every real number from the reference CV. NEVER invent, inflate, or guess metrics that aren't in the original — if there's no number, write a strong qualitative achievement instead.
- Highlights per role are FLEXIBLE and recency-weighted: 4-5 highlights for the most recent / most job-relevant roles, 2-3 for older or less relevant roles. Aim for the strongest, non-redundant points — do not pad to a fixed count.
- Each highlight is a single sentence, plain text, no leading bullets or dashes.
- Draw ONLY from the reference CV's existing experience — expand and rephrase, but NEVER invent new experience, employers, projects, or outcomes.
- Weave job keywords naturally across highlights, not just the first one. No keyword stuffing — every keyword must read naturally in context.
- Include ALL work entries from the reference CV — do not drop roles.
- Skills section: reorder so job-matching skills come first. Aim for roughly 70% hard skills / 30% soft skills. Only list a skill if it appears in the reference CV or is a genuine, obvious synonym of one — do NOT add skills the candidate never claimed.
- NEVER change dates, company names, job titles' factual truth, or educational institutions.
- Track every job keyword you injected in "keywordsInjected" with the keyword and where it was placed.

Cover Letter Rules:
- Write the cover letter specifically for the exact job title and company provided — it must be obvious which role the candidate is applying for
- Open with the role title and company name in the first sentence (e.g. "I am writing to apply for the [Job Title] position at [Company]")
- Reference 3-4 specific requirements or responsibilities from the job posting and explain how the candidate's experience maps to each
- Use the job's own terminology (skills, tools, domain language) — mirror phrasing from the requirements and responsibilities sections
- Highlight 2-3 of the strongest matching qualifications with concrete examples from the CV (company names, outcomes, metrics where available)
- Write 3-4 paragraphs: role-specific intro, relevant experience mapped to job duties, why this company/role, closing with call to action
- Professional but personable tone
- Do NOT write a generic cover letter that could apply to any job — every paragraph must tie back to this specific role
- Do NOT repeat the CV verbatim — complement it with narrative that shows fit for this role
- Quantify impact where the CV supports it, and never invent numbers or experience the candidate doesn't have
- Avoid empty clichés ("hard worker", "team player", "passionate about") unless backed by a concrete example; keep it to ~250-350 words`;

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

    const generate = () =>
      openai.chat.completions.create({
        // ponytail: gpt-4o for the quality-critical tailoring path; drop back to gpt-4o-mini if cost matters more than output quality
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 8192,
      });

    // Retry once: the model occasionally returns truncated/malformed JSON.
    let parsed;
    for (let attempt = 0; attempt < 2; attempt++) {
      const completion = await generate();
      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) continue;
      try {
        parsed = parseTailorResponse(responseText);
        break;
      } catch (err) {
        console.warn(`Tailor parse failed (attempt ${attempt + 1}):`, err.message);
      }
    }

    if (!parsed) {
      return Response.json(
        { error: "Failed to generate a valid tailored CV. Please try again." },
        { status: 502 }
      );
    }

    const { tailoredCV, coverLetter, keywordsInjected } = parsed;

    // Guard against the model silently dropping work roles.
    const expectedRoles = (referenceCV.work || []).length;
    if (expectedRoles > 0 && tailoredCV.work.length < expectedRoles) {
      console.warn(
        `Tailor dropped work roles: got ${tailoredCV.work.length} of ${expectedRoles}`,
      );
    }

    return Response.json({ data: { tailoredCV, coverLetter, keywordsInjected } });
  } catch (error) {
    console.error("Tailor error:", error);
    return Response.json(
      { error: "Failed to tailor CV" },
      { status: 500 }
    );
  }
}
