// Run: node utils/resume-parser.test.js
import assert from "node:assert/strict";

import { parseResumeFromResponse } from "./resume-parser.js";

// A URL in a profile used to be destroyed by a // comment stripper, which left
// an unterminated string and a "bad control character" parse failure.
const withUrls = `{
  "basics": {
    "name": "Jane Doe",
    "profiles": [
      { "network": "LinkedIn", "url": "https://linkedin.com/in/janedoe" }
    ]
  },
  "work": [{ "company": "Acme", "highlights": ["Shipped a thing"] }],
  "education": [],
  "skills": [{ "name": "Languages", "keywords": ["JavaScript"] }]
}`;

const parsedUrls = parseResumeFromResponse(withUrls);
assert.equal(parsedUrls.basics.profiles[0].url, "https://linkedin.com/in/janedoe");
assert.equal(parsedUrls.work[0].company, "Acme");
assert.equal(parsedUrls.skills[0].category, "Languages");

// A raw newline inside a string value must be escaped, not rejected.
const withRawNewline = `{
  "basics": { "name": "Jane Doe", "summary": "Line one
Line two" },
  "work": [],
  "education": [],
  "skills": []
}`;

const parsedNewline = parseResumeFromResponse(withRawNewline);
assert.equal(parsedNewline.basics.summary, "Line one\nLine two");

// Fenced output with a trailing comma still parses.
const fenced = '```json\n{ "basics": { "name": "Jane", "email": "j@x.com", }, "work": [] }\n```';
assert.equal(parseResumeFromResponse(fenced).basics.email, "j@x.com");

console.log("resume-parser: all checks passed");
