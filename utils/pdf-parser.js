import { extractText } from "unpdf";

// pdf.js calls Math.sumPrecise while substituting embedded subset fonts. Node
// does not ship it yet, so every upload logs a TypeError and the substitution
// is skipped. ponytail: plain reduce, the inputs are small integer glyph sizes
// so exact summation buys nothing. Drop this once Node ships Math.sumPrecise.
Math.sumPrecise ??= (values) => {
  let total = 0;
  for (const value of values) total += value;
  return total;
};

/**
 * Extract and sanitize text from a PDF ArrayBuffer.
 */
export async function extractPdfText(arrayBuffer) {
  const { text } = await extractText(new Uint8Array(arrayBuffer));

  const rawText = Array.isArray(text) ? text.join("\n") : (text || "");
  return sanitizeExtractedText(rawText);
}

export function sanitizeExtractedText(text) {
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
