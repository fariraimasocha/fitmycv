import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import { parseCompanyResearchResponse } from "@/utils/company-research-parser";
import CompanyResearch from "@/models/CompanyResearch";
import { connectDB } from "@/utils/connect";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a company research analyst. Given web content about a company, extract and synthesize a structured research brief for a job seeker preparing for an interview. Return ONLY valid JSON with no additional text.

Use this exact schema:
{
  "mission": "The company's mission or purpose in 1-2 sentences",
  "summary": "A concise 1-paragraph executive summary (3-5 sentences) covering what they do, who they serve, their market position, and culture — written from a job seeker's perspective",
  "teamSize": "Approximate team/employee count as a string, e.g. '~250 employees' or '1,001–5,000 (LinkedIn estimate)' or 'Unknown'",
  "fundingStage": "e.g. 'Series B ($40M raised)', 'Public (NYSE: XYZ)', 'Bootstrapped', or 'Unknown'",
  "cultureSignals": ["signal1", "signal2", "signal3"],
  "recentNews": [
    {
      "title": "Article headline",
      "url": "https://...",
      "publishedAt": "2026-01-15",
      "snippet": "One or two sentence summary of what this article covers"
    }
  ]
}

Rules:
- "mission" should come from the company's own website copy if available
- "cultureSignals" should be 3-6 short phrases inferred from the content, e.g. "remote-first", "fast-paced startup", "strong engineering culture", "equity compensation", "unlimited PTO"
- "recentNews" should only include genuinely recent items; use an empty array if none are found in the provided content
- "teamSize" and "fundingStage" should say "Unknown" if not determinable from the content
- Return ONLY the JSON object, no markdown, no explanation`;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    await connectDB();
    const briefs = await CompanyResearch.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("companyName jobTitle jobUrl createdAt summary fundingStage teamSize")
      .lean();

    return Response.json({ data: briefs });
  } catch (error) {
    console.error("Company research GET error:", error);
    return Response.json({ error: "Failed to fetch company research" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { companyName, jobTitle, jobUrl } = await request.json();

    if (!companyName || companyName.trim().length < 2) {
      return Response.json({ error: "companyName is required" }, { status: 400 });
    }

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    // Dual Exa.ai calls in parallel
    const [newsRes, aboutRes] = await Promise.all([
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXA_API_KEY}`,
        },
        body: JSON.stringify({
          query: `${companyName} company news funding product launch`,
          numResults: 5,
          startPublishedDate: ninetyDaysAgo,
          livecrawl: "always",
          contents: {
            text: { maxCharacters: 3000, includeHtmlTags: false },
          },
        }),
      }),
      fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXA_API_KEY}`,
        },
        body: JSON.stringify({
          query: `${companyName} company mission culture values team size employees`,
          numResults: 3,
          livecrawl: "always",
          contents: {
            text: { maxCharacters: 5000, includeHtmlTags: false },
          },
        }),
      }),
    ]);

    const [newsData, aboutData] = await Promise.all([
      newsRes.json(),
      aboutRes.json(),
    ]);

    const newsBlock = (newsData.results || [])
      .map(
        (r, i) =>
          `[News ${i + 1}]\nTitle: ${r.title || ""}\nURL: ${r.url || ""}\nPublished: ${r.publishedDate || "unknown"}\n${r.text || ""}`
      )
      .join("\n\n---\n\n");

    const aboutBlock = (aboutData.results || [])
      .map((r, i) => `[About ${i + 1}]\nSource: ${r.url || ""}\n${r.text || ""}`)
      .join("\n\n---\n\n");

    const combinedContext = `COMPANY: ${companyName}\n\n== RECENT NEWS ==\n${newsBlock || "No recent news found."}\n\n== ABOUT / CULTURE / TEAM ==\n${aboutBlock || "No about information found."}`;

    console.log(`[company-research] Context length: ${combinedContext.length} chars`);

    // Groq synthesis
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: combinedContext },
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json({ error: "Failed to generate company research" }, { status: 500 });
    }

    const parsed = parseCompanyResearchResponse(responseText);

    await connectDB();

    let brief;
    if (jobUrl && jobUrl.trim()) {
      // Upsert: refresh if same user+jobUrl exists
      brief = await CompanyResearch.findOneAndUpdate(
        { userId: session.user.id, jobUrl: jobUrl.trim() },
        {
          $set: {
            companyName: companyName.trim(),
            jobTitle: jobTitle || "",
            jobUrl: jobUrl.trim(),
            ...parsed,
          },
        },
        { new: true, upsert: true, runValidators: true }
      ).lean();
    } else {
      // No jobUrl: always create new
      brief = await CompanyResearch.create({
        userId: session.user.id,
        companyName: companyName.trim(),
        jobTitle: jobTitle || "",
        jobUrl: "",
        ...parsed,
      });
      brief = brief.toObject();
    }

    return Response.json({ data: brief }, { status: 201 });
  } catch (error) {
    console.error("Company research POST error:", error);
    return Response.json({ error: "Failed to generate company research" }, { status: 500 });
  }
}
