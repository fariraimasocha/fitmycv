// Self check for the agent's CV patching in lib/cv-patch.js.
//
// Run: npm run check:cv-patch

import assert from "node:assert/strict";
import { applyCvPatch, getAtPath, normalizeCv } from "../lib/cv-patch.js";

// Shaped like a lean Mongo document: _ids, a null, a missing section.
const lean = {
  _id: "cv1",
  basics: {
    name: "Ada Lovelace",
    email: null,
    profiles: [{ _id: "p1", network: "GitHub", url: "https://github.com/ada" }],
  },
  work: [{ _id: "w1", company: "Acme", position: "Engineer", description: "Built billing" }],
  skills: [{ category: "Languages", skills: ["Go"] }],
};

const base = normalizeCv(lean);
assert.equal(base.basics.email, "");
assert.equal(base.basics.summary, "");
assert.ok(!("_id" in base.work[0]), "Mongo ids are dropped");
assert.deepEqual(base.education, []);

const next = applyCvPatch(lean, [
  { op: "replace", path: "/basics/summary", value: "Backend engineer." },
  { op: "add", path: "/work/-", value: { company: "Beta", position: "Developer" } },
  { op: "add", path: "/skills/0/skills/-", value: "Rust" },
  { op: "remove", path: "/basics/profiles/0" },
]);
assert.equal(next.basics.summary, "Backend engineer.");
assert.equal(next.work[1].startDate, "", "added items get blank fields");
assert.deepEqual(next.skills[0].skills, ["Go", "Rust"]);
assert.deepEqual(next.basics.profiles, []);
assert.equal(lean.basics.profiles.length, 1, "the input is not mutated");

const rejects = (operations, pattern) => assert.throws(() => applyCvPatch(lean, operations), pattern);
rejects([], /at least one/);
rejects([{ op: "move", path: "/work/0", from: "/work/1" }], /Unsupported/);
rejects([{ op: "replace", path: "basics/summary", value: "x" }], /JSON Pointer/);
rejects([{ op: "replace", path: "/name", value: "x" }], /outside the CV/);
rejects([{ op: "add", path: "/basics/__proto__", value: { polluted: true } }], /not allowed/);
rejects([{ op: "add", path: "/work/0/highlights", value: [] }], /not a CV field/);
rejects([{ op: "replace", path: "/work/5/company", value: "x" }], /past the end/);
rejects([{ op: "replace", path: "/basics/summary", value: 5 }], /invalid value/);
rejects([{ op: "replace", path: "/basics/summary" }], /needs a value/);
rejects([{ op: "remove", path: "/work" }], /whole section/);
assert.equal({}.polluted, undefined);

assert.equal(getAtPath(lean, "/work/0/company"), "Acme");
assert.equal(getAtPath(lean, "/work/9/company"), undefined);
assert.equal(getAtPath(lean, "/nope"), undefined);

console.log("cv patch self-check OK");
