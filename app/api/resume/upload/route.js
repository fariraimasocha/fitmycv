import { auth } from "@/lib/auth";
import { sanitizeExtractedText } from "@/utils/pdf-parser";
import { parseResumeFromResponse } from "@/utils/resume-parser";
import { chat, MODEL_FAST } from "@/lib/groq";

const MIN_TEXT_LENGTH = 100;
const MAX_TEXT_LENGTH = 50_000;

const SYSTEM_PROMPT = `You are a resume parser. Given the raw text of a resume, parse it into a structured JSON Resume format. Return ONLY valid JSON with no additional text.

Use this exact schema:
{
  "basics": {
    "name": "",
    "label": "",
    "email": "",
    "phone": "",
    "summary": "",
    "location": "",
    "profiles": [{ "network": "", "url": "" }]
  },
  "work": [{
    "company": "",
    "position": "",
    "location": "",
    "startDate": "",
    "endDate": "",
    "highlights": []
  }],
  "education": [{
    "institution": "",
    "studyType": "",
    "area": "",
    "startDate": "",
    "endDate": ""
  }],
  "skills": [{
    "name": "",
    "keywords": []
  }]
}

Rules:
- Extract ALL information from the resume text
- For dates, use "YYYY-MM" format when possible, or keep the original format
- "label" is the person's job title or professional headline
- "highlights" should be an array of bullet points / achievements for each role
- Group skills by category (e.g. "Programming Languages", "Frameworks", "Tools")
- If a field is not found, use an empty string
- Return ONLY the JSON object, no markdown, no explanation`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // The browser reads the PDF (utils/upload-resume.js), so only text arrives.
    const body = await request.json().catch(() => null);
    if (typeof body?.text !== "string") {
      return Response.json({ error: "Choose a PDF or paste your CV text." }, { status: 400 });
    }

    const rawText = sanitizeExtractedText(body.text);

    if (rawText.length < MIN_TEXT_LENGTH) {
      return Response.json(
        { error: "Couldn't read enough text from your CV. It may be a scan. Paste your CV text instead." },
        { status: 422 }
      );
    }

    if (rawText.length > MAX_TEXT_LENGTH) {
      return Response.json(
        { error: "Your CV text is too long. Keep it under 50,000 characters." },
        { status: 400 }
      );
    }

    const completion = await chat({
      model: MODEL_FAST,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: rawText },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json({ error: "Couldn't read your CV. Try again, or upload a different PDF." }, { status: 500 });
    }

    const parsed = parseResumeFromResponse(responseText);

    return Response.json({ data: parsed, rawText });
  } catch (error) {
    console.error("Resume upload error:", error);
    return Response.json(
      { error: "Couldn't read your CV. Try again, or upload a different PDF." },
      { status: 500 }
    );
  }
}
