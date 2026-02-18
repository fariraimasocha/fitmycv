import { extractText } from "unpdf";

/**
 * Extract and sanitize text from a PDF ArrayBuffer.
 */
export async function extractPdfText(arrayBuffer) {
  const { text } = await extractText(new Uint8Array(arrayBuffer));

  return sanitizeText(text);
}

function sanitizeText(text) {
  return (
    text
      // Smart quotes → straight quotes
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // Em/en dashes → hyphen
      .replace(/[\u2013\u2014]/g, "-")
      // Bullet characters → dash
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
      // Non-breaking spaces → regular spaces
      .replace(/\u00A0/g, " ")
      // Control characters (except newline, tab)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Collapse multiple blank lines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
