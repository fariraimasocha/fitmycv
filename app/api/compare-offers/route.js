import { auth } from "@/lib/auth";
import { requirePremium } from "@/lib/paywall";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a career decision advisor. Given multiple job offers/applications, compare them across key dimensions and provide a recommendation.

Return ONLY valid JSON:
{
  "comparisons": [
    {
      "id": "offer_id",
      "jobTitle": "...",
      "company": "...",
      "scores": {
        "roleFit": { "score": 8, "note": "Strong alignment with your skills" },
        "compensation": { "score": 7, "note": "Competitive but not top" },
        "growth": { "score": 9, "note": "Clear path to senior role" },
        "culture": { "score": 7, "note": "Remote-friendly, fast-paced" },
        "techStack": { "score": 8, "note": "Modern stack you enjoy" },
        "workLifeBalance": { "score": 6, "note": "Startup pace expected" },
        "companyStage": { "score": 7, "note": "Series B, stable" },
        "brand": { "score": 8, "note": "Well-known in the industry" }
      },
      "totalScore": 7.5
    }
  ],
  "recommendation": "Based on your profile, Offer A (Company X) is the strongest choice because...",
  "tradeoffs": ["Offer A has better growth but lower comp than Offer B", "Offer B is more stable but less technically exciting"]
}

Rules:
- Score each dimension 1-10
- Total score is the weighted average (roleFit: 25%, compensation: 15%, growth: 15%, culture: 10%, techStack: 10%, workLifeBalance: 10%, companyStage: 10%, brand: 5%)
- Be specific in notes — reference actual details from the offers
- Recommendation should be decisive with clear reasoning
- List 2-4 key tradeoffs between the offers
- Return ONLY the JSON object`;

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paywallResponse = requirePremium(session);
  if (paywallResponse) return paywallResponse;

  try {
    const { offers, candidateProfile } = await request.json();

    if (!offers || offers.length < 2) {
      return Response.json(
        { error: "At least 2 offers are required for comparison" },
        { status: 400 }
      );
    }

    const offersText = offers
      .map(
        (o, i) =>
          `## Offer ${i + 1}: ${o.jobTitle} at ${o.company}
Status: ${o.status || "Unknown"}
Match Score: ${o.matchScore || "N/A"} (${o.matchGrade || "N/A"})
Notes: ${o.notes || "None"}
URL: ${o.jobUrl || "N/A"}`
      )
      .join("\n\n");

    const userMessage = `## Candidate Profile
${candidateProfile || "Not provided — use offer details to infer preferences"}

## Offers to Compare
${offersText}

Compare these offers and provide a recommendation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 3072,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return Response.json(
        { error: "Failed to generate comparison" },
        { status: 500 }
      );
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Failed to parse response" }, { status: 500 });
    }

    const raw = JSON.parse(jsonMatch[0]);

    return Response.json({
      data: {
        comparisons: Array.isArray(raw.comparisons) ? raw.comparisons : [],
        recommendation: raw.recommendation || "",
        tradeoffs: Array.isArray(raw.tradeoffs) ? raw.tradeoffs : [],
      },
    });
  } catch (error) {
    console.error("Compare offers error:", error);
    return Response.json(
      { error: "Failed to compare offers" },
      { status: 500 }
    );
  }
}
