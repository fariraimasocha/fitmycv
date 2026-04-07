/**
 * Parse the Groq LLM response into structured job data.
 * Handles markdown code blocks, JSON quirks, and missing fields.
 */
export function parseJobFromResponse(responseText) {
  const jsonStr = extractJsonString(responseText);
  const raw = JSON.parse(jsonStr);

  return {
    title: raw.title || "",
    company: raw.company || "",
    location: raw.location || "",
    type: raw.type || "",
    requirements: ensureArray(raw.requirements),
    responsibilities: ensureArray(raw.responsibilities),
    qualifications: ensureArray(raw.qualifications),
    salary: raw.salary || "",
    keywords: ensureArray(raw.keywords),
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

  throw new Error("No JSON found in LLM response");
}

function cleanJsonString(str) {
  let cleaned = str
    .trim()
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/\/\/.*$/gm, "");

  // Escape literal control characters inside JSON string values
  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
    return match
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
  });

  return cleaned;
}

function ensureArray(val) {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string" && val) return [val];
  return [];
}
