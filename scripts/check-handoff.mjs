// npm run check:handoff
// The hero hands over a job link, the free tools hand over job text. Both
// must reach the tailor page. The link one was being dropped.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const { saveAtsHandoff, takeAtsHandoff, saveCvHandoff, takeCvHandoff } = await import("../lib/ats-handoff.js");

saveAtsHandoff({ jobUrl: "https://boards.greenhouse.io/acme/jobs/1", source: "hero" });
assert.equal(takeAtsHandoff()?.jobUrl, "https://boards.greenhouse.io/acme/jobs/1");
assert.equal(takeAtsHandoff(), null, "read once, then cleared");

saveAtsHandoff({ jobText: "Senior designer, Figma, design systems", source: "match" });
assert.equal(takeAtsHandoff()?.jobText, "Senior designer, Figma, design systems");

saveAtsHandoff({ jobText: "   ", source: "match" });
assert.equal(takeAtsHandoff(), null, "blank text is not a handoff");

// A magic link opens a new tab, so the handoff lives in localStorage with an hour cap.
saveCvHandoff("Jane Doe, product designer", "ats_checker");
assert.equal(takeCvHandoff()?.cvText, "Jane Doe, product designer");
assert.equal(takeCvHandoff(), null, "CV read once, then cleared");

const realNow = Date.now;
saveAtsHandoff({ jobText: "Old posting", source: "match" });
saveCvHandoff("Old CV", "ats_checker");
Date.now = () => realNow() + 61 * 60 * 1000;
assert.equal(takeAtsHandoff(), null, "job handoff expires after an hour");
assert.equal(takeCvHandoff(), null, "CV handoff expires after an hour");
Date.now = realNow;

console.log("All handoff checks passed.");
