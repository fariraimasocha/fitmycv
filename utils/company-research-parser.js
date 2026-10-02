import { extractJsonString } from "./llm-json.js";
import { httpUrl } from "@/lib/tailored-preview";
/**
 * Parse the Groq LLM response into a structured company research brief.
 * Follows the same pattern as job-parser.js and tailor-parser.js.
 */
export function parseCompanyResearchResponse(responseText) {
  const jsonStr = extractJsonString(responseText);
  const raw = JSON.parse(jsonStr);

  return {
    mission: typeof raw.mission === "string" ? raw.mission.trim() : "",
    summary: typeof raw.summary === "string" ? raw.summary.trim() : "",
    teamSize: typeof raw.teamSize === "string" ? raw.teamSize.trim() : "",
    fundingStage: typeof raw.fundingStage === "string" ? raw.fundingStage.trim() : "",
    cultureSignals: Array.isArray(raw.cultureSignals)
      ? raw.cultureSignals.filter(Boolean)
      : [],
    recentNews: Array.isArray(raw.recentNews)
      ? raw.recentNews.map((item) => ({
          title: item.title || "",
          url: httpUrl(item.url),
          publishedAt: item.publishedAt || "",
          snippet: item.snippet || "",
        }))
      : [],
    techStrategy: typeof raw.techStrategy === "string" ? raw.techStrategy.trim() : "",
    challenges: Array.isArray(raw.challenges) ? raw.challenges.filter(Boolean) : [],
    competitors: Array.isArray(raw.competitors)
      ? raw.competitors.map((c) => ({
          name: c.name || "",
          differentiation: c.differentiation || "",
        }))
      : [],
    positioningTips: Array.isArray(raw.positioningTips) ? raw.positioningTips.filter(Boolean) : [],
  };
}
