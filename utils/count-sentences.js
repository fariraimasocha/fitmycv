/**
 * Count complete sentences in a block of prose, so the "Why this role" answer
 * can be checked against the 3-5 sentences an application form asks for.
 * Text with no terminator at all counts as one sentence.
 */
export function countSentences(text) {
  const trimmed = String(text || "").trim();
  const matches = trimmed.match(/[^.!?]+[.!?]+/g);
  if (matches) return matches.length;
  return trimmed ? 1 : 0;
}
