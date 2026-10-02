import { extractJsonString } from "./llm-json.js";
/**
 * Parse the OpenAI response into a structured job match score result.
 */
export function parseJobScoreResponse(responseText) {
  const jsonStr = extractJsonString(responseText);
  const raw = JSON.parse(jsonStr);

  return {
    globalScore: typeof raw.globalScore === "number" ? Math.min(5, Math.max(0, raw.globalScore)) : 0,
    globalGrade: raw.globalGrade || "N/A",
    recommendation: raw.recommendation || "",
    dimensions: {
      cvMatch: parseDimension(raw.dimensions?.cvMatch),
      compensation: parseDimension(raw.dimensions?.compensation),
      cultureSignals: parseDimension(raw.dimensions?.cultureSignals),
      redFlags: parseDimension(raw.dimensions?.redFlags),
    },
  };
}

function parseDimension(dim) {
  if (!dim) return { grade: "N/A", reasoning: "" };
  return {
    grade: dim.grade || "N/A",
    reasoning: dim.reasoning || "",
  };
}
