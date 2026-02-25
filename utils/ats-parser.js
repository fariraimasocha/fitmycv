/**
 * Parse the Groq LLM response into a structured ATS score result.
 * Follows the same pattern as tailor-parser.js and job-parser.js.
 */
export function parseAtsResponse(responseText) {
  const jsonStr = extractJsonString(responseText);
  const raw = JSON.parse(jsonStr);

  return {
    score: typeof raw.score === "number" ? Math.min(100, Math.max(0, raw.score)) : 0,
    breakdown: {
      keywords: raw.breakdown?.keywords ?? 0,
      skills: raw.breakdown?.skills ?? 0,
      experience: raw.breakdown?.experience ?? 0,
      sectionCompleteness: raw.breakdown?.sectionCompleteness ?? 0,
    },
    keywordsMatched: Array.isArray(raw.keywordsMatched) ? raw.keywordsMatched : [],
    keywordsMissing: Array.isArray(raw.keywordsMissing) ? raw.keywordsMissing : [],
    formattingNotes: Array.isArray(raw.formattingNotes) ? raw.formattingNotes : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
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

  throw new Error("No JSON found in ATS LLM response");
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
