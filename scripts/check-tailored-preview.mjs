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
assert.deepEqual(tailoredForViewer({ user: { isPremium: true } }, doc), doc);

// A free user who bought this one CV gets all of it, and never the order id.
const bought = { ...doc, unlockedAt: new Date(), unlockOrderId: "order_1" };
const single = tailoredForViewer({ user: { isPremium: false } }, bought);
assert.equal(single.locked, undefined);
assert.equal(single.work[0].description, doc.work[0].description);
assert.equal(single.coverLetter, doc.coverLetter);
assert.equal(single.unlockOrderId, undefined);
assert.equal(tailoredForViewer({ user: { isPremium: true } }, bought).unlockOrderId, undefined);
assert.equal(httpUrl("javascript:alert(1)"), "");
assert.equal(httpUrl(" https://x.com/job "), "https://x.com/job");
console.log("tailored-preview ok");
