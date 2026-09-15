import { auth } from "@/lib/auth";
import { parseJobFromResponse } from "@/utils/job-parser";
import { chat, MODEL_FAST } from "@/lib/groq";
import { JobPageError, scrapeJobPage } from "@/lib/job-extract";

// This route calls a model. Without this the platform default (10-15s) kills
// the function mid-response and the browser sees a dropped socket, which the
// client can only report as a network error.
export const maxDuration = 60;

// Same cap as the scraper, so a pasted posting and a crawled one cost the same.
const MIN_PASTED_CHARS = 150;
const MAX_PASTED_CHARS = 15000;

const SYSTEM_PROMPT = `You are an expert job listing parser. Given the raw text content scraped from a job posting page, extract the structured job information. Return ONLY valid JSON with no additional text.

Use this exact schema:
{
  "title": "Job title",
  "company": "Company name",
  "location": "Job location (city, state, remote, etc.)",
  "type": "Full-time, Part-time, Contract, etc.",
  "requirements": ["Required skill 1", "Required skill 2"],
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "qualifications": ["Qualification 1", "Qualification 2"],
  "salary": "Salary range if listed, or empty string",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- Extract ALL relevant information from the job posting
- "requirements" should list key technical and soft skills required
- "responsibilities" should list main duties and tasks
- "qualifications" should list education, certifications, years of experience
- "keywords" should list 15-20 key technical skills, tools, frameworks, and domain terms that the job emphasizes most. Extract specific technologies (e.g. "React", "AWS", "Python") and domain concepts (e.g. "CI/CD", "microservices", "agile"). These are the terms an ATS would scan for.
- If a field is not found, use an empty string or empty array
- Return ONLY the JSON object, no markdown, no explanation

IMPORTANT — Extraction Strategy:
- The page text may be noisy, partial, or mixed with unrelated content (navigation, ads, sidebar text). Focus on the job description body.
- LinkedIn and similar sites often embed requirements inside prose paragraphs rather than clean bullet lists. Read the ENTIRE text carefully and infer requirements, responsibilities, and qualifications even when they are not explicitly labeled.
- If the description says things like "you will...", "you should have...", "we're looking for someone who...", "experience with...", these are requirements or qualifications — extract them.
- Always return at least 3-5 items per array field if the job posting contains a meaningful description. Try hard to populate every field.
- Do NOT return empty arrays if there is any text describing the role — infer from context.`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, text } = await request.json();
    const pasted = typeof text === "string" ? text.trim() : "";

    if (!pasted && (!url || typeof url !== "string")) {
      return Response.json({ error: "Add a job link or paste the job description." }, { status: 400 });
    }

    // Step 1: Use the pasted description, or scrape the page (URL
    // normalizing, Exa crawl, search fallback).
    let finalText;
    if (pasted) {
      if (pasted.length < MIN_PASTED_CHARS) {
        return Response.json(
          { error: "Paste the full job description, not just a few lines." },
          { status: 400 }
        );
      }
      finalText = pasted.slice(0, MAX_PASTED_CHARS);
    } else {
      try {
        ({ text: finalText } = await scrapeJobPage(url));
      } catch (error) {
        if (error instanceof JobPageError) {
          return Response.json({ error: error.message }, { status: 422 });
        }
        throw error;
      }
    }

    // Step 2: Parse with Groq
    const completion = await chat({
      model: MODEL_FAST,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: finalText },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json({ error: "Failed to parse job listing" }, { status: 500 });
    }

    // Step 3: Parse structured data
    const parsed = parseJobFromResponse(responseText);

    return Response.json({ data: parsed });
  } catch (error) {
    console.error("Job extraction error:", error);
    return Response.json(
      { error: "Failed to extract job requirements" },
      { status: 500 }
    );
  }
}
