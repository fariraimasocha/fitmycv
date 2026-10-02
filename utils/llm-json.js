/**
 * Pull the JSON object out of a model reply: a ```json block or the first
 * {...} span, with trailing commas dropped and raw control characters inside
 * strings escaped. Models sometimes put a raw newline in a summary or
 * highlight, which JSON.parse rejects as a bad control character.
 */
export function extractJsonString(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  const raw = codeBlockMatch?.[1] ?? text.match(/\{[\s\S]*\}/)?.[0];
  if (raw === undefined) throw new Error("No JSON found in LLM response");

  return raw
    .trim()
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/"(?:[^"\\]|\\.)*"/g, (match) =>
      match
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ""),
    );
}
