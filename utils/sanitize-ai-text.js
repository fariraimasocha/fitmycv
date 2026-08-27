/**
 * Strip invisible Unicode marks and "AI tell" typography from LLM-generated
 * text, so downloaded CVs and cover letters parse cleanly in ATS systems.
 */

// Invisible characters: zero-width chars, soft hyphen, bidi controls,
// variation selectors, and Unicode tag characters.
const INVISIBLE_CHARS =
  /[\u200B-\u200F\u2060\uFEFF\u00AD\u202A-\u202E\u2066-\u2069\uFE00-\uFE0F\u{E0000}-\u{E007F}]/gu;

// Exotic spaces that should render as a plain space.
const EXOTIC_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;

export function sanitizeAIText(str) {
  return str
    .replace(INVISIBLE_CHARS, "")
    .replace(EXOTIC_SPACES, " ")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u2026/g, "...");
}

export function sanitizeAIObject(value) {
  if (typeof value === "string") {
    return sanitizeAIText(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeAIObject);
  }
  if (value !== null && typeof value === "object") {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = sanitizeAIObject(val);
    }
    return result;
  }
  return value;
}
