/**
 * Parse the Groq LLM response into a structured company research brief.
 * Follows the same pattern as ats-parser.js and job-parser.js.
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
          url: item.url || "",
          publishedAt: item.publishedAt || "",
          snippet: item.snippet || "",
        }))
      : [],
  };
}

function extractJsonString(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return cleanJsonString(codeBlockMatch[1]);
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return cleanJsonString(jsonMatch[0]);
  }

  throw new Error("No JSON found in company research LLM response");
}

function cleanJsonString(str) {
  let cleaned = str
    .trim()
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/\/\/.*$/gm, "");

  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
    return match
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
  });

  return cleaned;
}
