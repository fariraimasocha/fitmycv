// node scripts/check-tailored-preview.mjs
import assert from "node:assert/strict";
import { httpUrl, tailoredForViewer } from "../lib/tailored-preview.js";

const doc = {
  basics: { name: "A", summary: "S" },
  work: [{ company: "X", description: "\nFirst win\nSecond win\nThird" }],
  coverLetter: "Dear team,\n\nBody paragraph.\n\nSign off",
};
const free = tailoredForViewer({ user: { isPremium: false } }, doc);
assert.equal(free.work[0].description, "First win");
assert.equal(free.coverLetter, "Dear team,");
assert.equal(free.locked, true);
assert.equal(free.basics.summary, "S");
assert.equal(tailoredForViewer({ user: { isPremium: true } }, doc), doc);
assert.equal(httpUrl("javascript:alert(1)"), "");
assert.equal(httpUrl(" https://x.com/job "), "https://x.com/job");
console.log("tailored-preview ok");
