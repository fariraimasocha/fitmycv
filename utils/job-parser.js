import { extractJsonString } from "./llm-json.js";
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

function ensureArray(val) {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string" && val) return [val];
  return [];
}
