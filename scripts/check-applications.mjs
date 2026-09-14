// Self check for the pipeline numbers and input cleaning in lib/applications.js.
//
// Run: npm run check:applications

import assert from "node:assert/strict";
import { computeInsights, computeTimeline, pickApplicationFields } from "../lib/applications.js";

const history = (...stages) => stages.map((status) => ({ status }));

const apps = [
  { status: "evaluated", statusHistory: history("evaluated") },
  { status: "applied", statusHistory: history("evaluated", "applied") },
  { status: "interviewing", statusHistory: history("evaluated", "applied", "interviewing") },
  // Rejected after screening still counts as having reached screening
  { status: "rejected", statusHistory: history("evaluated", "applied", "screening", "rejected") },
  { status: "offer", statusHistory: history("evaluated", "applied", "screening", "interviewing", "offer") },
  // Notes sit in the same timeline and must not move the funnel
  { status: "applied", statusHistory: [...history("evaluated", "applied"), { kind: "note", status: "offer", note: "Called" }] },
];

const insights = computeInsights(apps);
assert.deepEqual(
  insights.funnel.map((f) => f.reached),
  [6, 5, 3, 2, 1],
);
assert.equal(insights.applied, 5);
assert.equal(insights.responseRate, 60);
assert.equal(insights.interviews, 2);
assert.equal(insights.offers, 1);
assert.equal(insights.rejected, 1);
assert.equal(insights.funnel[1].conversion, 83);
assert.equal(insights.funnel[0].conversion, null);

const empty = computeInsights([]);
assert.equal(empty.responseRate, 0);
assert.ok(empty.funnel.every((f) => f.reached === 0 && f.share === 0));

// Wednesday 16 Sep 2026, noon local time
const now = new Date(2026, 8, 16, 12).getTime();
const timeline = computeTimeline(
  [
    new Date(2026, 8, 14), // this week
    new Date(2026, 8, 16, 9), // this week
    new Date(2026, 7, 26), // three weeks back
    new Date(2026, 3, 1), // outside the window
    "not a date",
  ],
  now,
);
assert.equal(timeline.length, 8);
assert.equal(timeline[7].count, 2);
assert.equal(timeline[4].count, 1);
assert.equal(timeline.reduce((sum, b) => sum + b.count, 0), 3);

// Input cleaning at the API boundary
const picked = pickApplicationFields({
  jobTitle: "  Engineer  ",
  jobUrl: "javascript:alert(1)",
  tags: ["remote", " remote ", "", "fintech"],
  contacts: [{ name: "" }, { name: "Sam", email: "sam@example.com", extra: true }],
  userId: "someone-else",
  archived: "yes",
});
assert.equal(picked.jobTitle, "Engineer");
assert.equal(picked.jobUrl, "", "non http links are refused");
assert.deepEqual(picked.tags, ["remote", "fintech"]);
assert.deepEqual(picked.contacts, [{ name: "Sam", role: "", kind: "", email: "sam@example.com", phone: "" }]);
assert.ok(!("userId" in picked), "unknown keys are dropped");
assert.ok(!("archived" in picked), "archived must be a real boolean");
assert.equal(pickApplicationFields({ jobUrl: "https://jobs.example.com/1" }).jobUrl, "https://jobs.example.com/1");

console.log("applications self-check OK");
