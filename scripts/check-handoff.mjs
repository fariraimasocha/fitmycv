// npm run check:handoff
// The hero hands over a job link, the free tools hand over job text. Both
// must reach the tailor page. The link one was being dropped.
import assert from "node:assert/strict";

const store = new Map();
globalThis.sessionStorage = {
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const { saveAtsHandoff, takeAtsHandoff } = await import("../lib/ats-handoff.js");

saveAtsHandoff({ jobUrl: "https://boards.greenhouse.io/acme/jobs/1", source: "hero" });
assert.equal(takeAtsHandoff()?.jobUrl, "https://boards.greenhouse.io/acme/jobs/1");
assert.equal(takeAtsHandoff(), null, "read once, then cleared");

saveAtsHandoff({ jobText: "Senior designer, Figma, design systems", source: "match" });
assert.equal(takeAtsHandoff()?.jobText, "Senior designer, Figma, design systems");

saveAtsHandoff({ jobText: "   ", source: "match" });
assert.equal(takeAtsHandoff(), null, "blank text is not a handoff");

console.log("All handoff checks passed.");
