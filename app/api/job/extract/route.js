import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseJobFromResponse } from "@/utils/job-parser";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    // Normalize any Indeed URL to canonical viewjob?jk=VALUE form
    if (url.includes("indeed.com")) {
      // jk= appears in viewjob URLs; vjk= appears in search result URLs — both are the same job key
      const jkMatch = url.match(/[?&]jk=([a-zA-Z0-9]+)/) || url.match(/[?&]vjk=([a-zA-Z0-9]+)/);
      if (jkMatch) {
        url = `https://www.indeed.com/viewjob?jk=${jkMatch[1]}`;
        console.log("[job-extract] Normalized Indeed URL to:", url);
      }
    }

    // Glassdoor: keep only the jl= (job listing ID) param, strip all tracking noise
    if (url.includes("glassdoor.com")) {
      try {
        const urlObj = new URL(url);
        const jl = urlObj.searchParams.get("jl");
        urlObj.search = jl ? `?jl=${jl}` : "";
        url = urlObj.toString();
        console.log("[job-extract] Normalized Glassdoor URL to:", url);
      } catch {}
    }

    // Lever: strip /apply suffix and lever-* tracking params
    if (url.includes("jobs.lever.co")) {
      url = url.replace(/\/apply(\?.*)?$/, "");
      try {
        const urlObj = new URL(url);
        for (const key of [...urlObj.searchParams.keys()]) {
          if (key.startsWith("lever-")) urlObj.searchParams.delete(key);
        }
        url = urlObj.toString().replace(/\?$/, "");
        console.log("[job-extract] Normalized Lever URL to:", url);
      } catch {}
    }

    // Greenhouse: job-boards.greenhouse.io → boards.greenhouse.io (canonical domain)
    if (url.includes("greenhouse.io")) {
      url = url.replace("job-boards.greenhouse.io", "boards.greenhouse.io");
      console.log("[job-extract] Normalized Greenhouse URL to:", url);
    }

    // Workday: strip source= tracking param
    if (url.includes("myworkdayjobs.com")) {
      try {
        const urlObj = new URL(url);
        urlObj.searchParams.delete("source");
        url = urlObj.toString().replace(/\?$/, "");
        console.log("[job-extract] Normalized Workday URL to:", url);
      } catch {}
    }

    // AngelList → Wellfound (rebranded domain)
    if (url.includes("angel.co/")) {
      url = url.replace("angel.co/", "wellfound.com/");
      console.log("[job-extract] Normalized AngelList URL to Wellfound:", url);
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

    let finalText = pageText;

    // Fallback: try Exa.ai neural search if direct crawl was blocked or empty
    if (isLoginWall || !pageText || pageText.length < 50) {
      console.log("[job-extract] Direct crawl failed, trying Exa.ai search fallback...");
      try {
        const searchRes = await fetch("https://api.exa.ai/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXA_API_KEY}`,
          },
          body: JSON.stringify({
            query: url,
            numResults: 1,
            contents: {
              text: { maxCharacters: 15000, includeHtmlTags: false },
            },
          }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const searchText = searchData.results?.[0]?.text;
          if (searchText && searchText.length >= 50) {
            console.log(`[job-extract] Search fallback returned ${searchText.length} chars`);
            finalText = searchText;
          }
        }
      } catch (err) {
        console.error("[job-extract] Search fallback error:", err);
      }
    }

    // If still no usable content, return actionable 422
    if (!finalText || finalText.length < 50) {
      let errorMsg = "Could not extract enough content from the page. Try a direct job listing URL.";
      if (url.includes("linkedin.com")) {
        errorMsg = "LinkedIn blocks job page access. Try the company's own careers page URL instead.";
      } else if (url.includes("indeed.com")) {
        errorMsg = "Could not extract the Indeed job listing. Try opening the job directly and copying its URL from the address bar.";
      } else if (url.includes("glassdoor.com")) {
        errorMsg = "Glassdoor blocks direct access. Try the company's own careers page URL instead.";
      } else if (url.includes("myworkdayjobs.com")) {
        errorMsg = "Workday job pages are JavaScript-rendered and difficult to scrape. Try the company's direct careers page URL instead.";
      } else if (url.includes("wellfound.com") || url.includes("angel.co")) {
        errorMsg = "Wellfound job pages require a login to view. Try the company's own careers page URL instead.";
      }
      return Response.json({ error: errorMsg }, { status: 422 });
    }

    // Step 2: Parse with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
