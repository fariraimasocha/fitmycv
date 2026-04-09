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

function extractJsonString(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return cleanJsonString(codeBlockMatch[1]);
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return cleanJsonString(jsonMatch[0]);
  }

  throw new Error("No JSON found in job score response");
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
