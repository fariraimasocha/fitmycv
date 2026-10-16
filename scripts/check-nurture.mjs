// npm run check:nurture
// Asserts the send timing, then writes all six emails to tmp for a visual check.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DONE, OFFSETS, buildNurtureEmail, checkoutReminderEmail, dueStep, shouldSkip } from "../lib/nurture-email.js";

const assert = (c, m) => {
  if (!c) {
    console.error("FAIL:", m);
    process.exit(1);
  }
};

const now = Date.parse("2026-10-05T12:00:00Z");
const at = (ms) => new Date(now - ms);
const H = 36e5;

assert(dueStep({ nurtureStep: 0, createdAt: at(0) }, now) === 0, "welcome is due right away");
assert(dueStep({ nurtureStep: 1, createdAt: at(H - 1) }, now) === null, "step 1 waits an hour");
assert(dueStep({ nurtureStep: 1, createdAt: at(H) }, now) === 1, "step 1 due after an hour");
assert(dueStep({ nurtureStep: 5, createdAt: at(4.9 * 24 * H) }, now) === null, "offer waits five days");
assert(dueStep({ nurtureStep: 5, createdAt: at(5 * 24 * H) }, now) === 5, "offer due on day five");
assert(dueStep({ nurtureStep: DONE, createdAt: at(99 * 24 * H) }, now) === null, "done means done");
assert(dueStep({ createdAt: at(99 * 24 * H) }, now) === null, "legacy users never enter");
assert(shouldSkip({ isPremium: true }, 5) && !shouldSkip({ isPremium: false }, 5), "premium skips the offer");
assert(!shouldSkip({ isPremium: true }, 2), "premium still gets the rest");

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fitmycv-nurture-"));
for (let step = 0; step < OFFSETS.length; step++) {
  const { subject, html, text } = buildNurtureEmail(step, {
    userName: "ARNOLD CHITSA",
    unsubscribeUrl: "https://www.fitmycv.link/api/unsubscribe?u=0&s=0",
  });
  assert(!/[–—]| -- /.test(text), `step ${step} copy has a dash`);
  assert(text.startsWith("Hi Arnold,"), `step ${step} greeting`);
  fs.writeFileSync(path.join(dir, `${step}.html`), `<!-- ${subject} -->\n${html}`);
}
// The abandoned checkout reminder goes back to the plan or CV they started on.
const opts = { userName: "ARNOLD CHITSA", unsubscribeUrl: "https://www.fitmycv.link/api/unsubscribe?u=0&s=0" };
const month = checkoutReminderEmail({ checkoutPlan: "month" });
assert(month.cta[1] === "/api/polar/checkout?plan=month", "month reminder links to month checkout");
const single = checkoutReminderEmail({ checkoutPlan: "single", checkoutCvId: "abc123" });
assert(single.cta[1] === "/dashboard/tailored/abc123", "single reminder links to its CV");
assert(checkoutReminderEmail({}).cta[1] === "/api/polar/checkout?plan=month", "no plan falls back to month");
for (const [name, email] of [["month", month], ["single", single]]) {
  const { subject, html, text } = buildNurtureEmail(email, opts);
  assert(subject && html.includes(email.cta[1]), `${name} reminder renders its link`);
  assert(text.startsWith("Hi Arnold,"), `${name} reminder greeting`);
  assert(!/[–—]| -- /.test(text), `${name} reminder copy has a dash`);
  fs.writeFileSync(path.join(dir, `reminder-${name}.html`), `<!-- ${subject} -->\n${html}`);
}

console.log(`ok. previews: open ${dir}/*.html`);
