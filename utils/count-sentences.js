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

// Self-check: `npm run check:sentences`
if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("count-sentences.mjs")) {
  const eq = (got, want, label) => {
    if (got !== want) throw new Error(`${label}: got ${got}, want ${want}`);
  };
  eq(countSentences(""), 0, "empty");
  eq(countSentences("   "), 0, "whitespace");
  eq(countSentences("No terminator yet"), 1, "no terminator");
  eq(countSentences("One. Two! Three?"), 3, "three sentences");
  eq(countSentences("Done. Trailing fragment"), 1, "trailing fragment uncounted");
  eq(countSentences("Wait... really?"), 2, "ellipsis");
  console.log("countSentences OK");
}
