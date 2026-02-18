import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { extractPdfText } from "@/utils/pdf-parser";
import { parseResumeFromResponse } from "@/utils/resume-parser";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const MIN_TEXT_LENGTH = 100;

const SYSTEM_PROMPT = `You are a resume parser. Given raw text extracted from a PDF resume, parse it into a structured JSON Resume format. Return ONLY valid JSON with no additional text.

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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return Response.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "File must be less than 8MB" }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const rawText = await extractPdfText(arrayBuffer);

    if (rawText.length < MIN_TEXT_LENGTH) {
      return Response.json(
        { error: "Could not extract enough text from PDF. The file may be scanned or image-based." },
        { status: 422 }
      );
    }

    // Parse with Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: rawText },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json({ error: "Failed to parse resume" }, { status: 500 });
    }

    const parsed = parseResumeFromResponse(responseText);

    return Response.json({ data: parsed, rawText });
  } catch (error) {
    console.error("Resume upload error:", error);
    return Response.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
