// Guards the ATS fixes in components/ResumePreview.jsx. Every template's chrome
// is rendered verbatim into the PDF text layer, and parsers drop or garble text
// around en/em dashes, middle dots, bullets, box-drawing and dingbat glyphs.
// Model output is already sanitized (utils/sanitize-ai-text.js); this catches
// the case where a template re-introduces one at render time.
//
// Template chrome must be ASCII. Accented characters in a real CV come from the
// user's data, never from these files. Comments are exempt: they never render.
//
// Run: npm run check:ats
import { readFileSync } from "node:fs";

const FILE = "components/ResumePreview.jsx";

const isComment = (line) => /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line);

function offences(line) {
  const found = [];
  // Literal non-ASCII.
  if (/[^\x00-\x7F]/.test(line)) found.push("literal");
  // ...and the escaped form, which is ASCII in source but not once rendered.
  for (const [, hex] of line.matchAll(/\\u\{?([0-9a-fA-F]{4,6})\}?/g)) {
    if (parseInt(hex, 16) > 0x7f) found.push(`\\u${hex}`);
  }
  return found;
}

const bad = readFileSync(FILE, "utf8")
  .split("\n")
  .map((line, i) => ({ n: i + 1, line }))
  .filter(({ line }) => !isComment(line))
  .map(({ n, line }) => ({ n, line, hits: offences(line) }))
  .filter(({ hits }) => hits.length > 0);

if (bad.length) {
  console.error(`${FILE}: ATS-unsafe characters in rendered output`);
  for (const { n, line, hits } of bad) {
    console.error(`  ${n} (${hits.join(", ")}): ${line.trim()}`);
  }
  process.exit(1);
}
console.log(`${FILE}: no ATS-unsafe characters in rendered output`);
