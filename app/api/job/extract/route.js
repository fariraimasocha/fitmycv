import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseJobFromResponse } from "@/utils/job-parser";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  "salary": "Salary range if listed, or empty string"
}

Rules:
- Extract ALL relevant information from the job posting
- "requirements" should list key technical and soft skills required
- "responsibilities" should list main duties and tasks
- "qualifications" should list education, certifications, years of experience
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

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    let { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "A valid URL is required" }, { status: 400 });
    }

    // Transform any LinkedIn URL with currentJobId to a direct public job view URL
    if (url.includes("linkedin.com") && url.includes("currentJobId=")) {
      const match = url.match(/currentJobId=(\d+)/);
      if (match) {
        url = `https://www.linkedin.com/jobs/view/${match[1]}/`;
        console.log("[job-extract] Transformed LinkedIn search URL to:", url);
      }
    }

    // Step 1: Scrape page content via Exa.ai
    const exaRes = await fetch("https://api.exa.ai/contents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXA_API_KEY}`,
      },
      body: JSON.stringify({
        urls: [url],
        text: {
          maxCharacters: 15000,
          includeHtmlTags: false,
        },
        livecrawl: "always",
        livecrawlTimeout: 15000,
      }),
    });

    if (!exaRes.ok) {
      const exaError = await exaRes.text();
      console.error("Exa.ai error:", exaError);
      return Response.json(
        { error: "Failed to scrape job page. Please check the URL and try again." },
        { status: 422 }
      );
    }

    const exaData = await exaRes.json();
    const pageText = exaData.results?.[0]?.text;

    console.log(
      `[job-extract] Scraped ${pageText?.length ?? 0} chars from ${url}`,
      pageText ? `| Preview: ${pageText.substring(0, 500)}` : "| No text"
    );

    // Detect LinkedIn login wall — short content with sign-in text but no job keywords
    const isLoginWall = pageText &&
      pageText.length < 2000 &&
      /sign\s*in|log\s*in/i.test(pageText) &&
      !/requirements|responsibilities|qualifications|experience/i.test(pageText);

    if (isLoginWall) {
      return Response.json(
        { error: "This page requires authentication. Try pasting the direct job URL (linkedin.com/jobs/view/...)." },
        { status: 422 }
      );
    }

    if (!pageText || pageText.length < 50) {
      return Response.json(
        { error: "Could not extract enough content from the page." },
        { status: 422 }
      );
    }

    // Step 2: Parse with Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: pageText },
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
