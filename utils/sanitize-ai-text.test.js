// Run: node utils/sanitize-ai-text.test.js
import assert from "node:assert/strict";

import { sanitizeAIText } from "./sanitize-ai-text.js";

// Dashes used to become a bare hyphen, which glued words together in cover
// letters: "code—a core" came out as "code-a core".
const cases = [
  ["functional code—a core responsibility", "functional code, a core responsibility"],
  ["multiple teams — at CLARITY SMART TECH", "multiple teams, at CLARITY SMART TECH"],
  ["code – a core", "code, a core"],
  ["2020–2022", "2020-2022"],
  ["Jan 2020 – Mar 2022", "Jan 2020 - Mar 2022"],
  ["2024 – Present", "2024 - Present"],
  ["— Led the team", "- Led the team"],
  ["and shipped it —.", "and shipped it."],
  ["full‐stack", "full-stack"],
];

for (const [input, expected] of cases) {
  assert.equal(sanitizeAIText(input), expected, JSON.stringify(input));
}

console.log("sanitize-ai-text: ok");
