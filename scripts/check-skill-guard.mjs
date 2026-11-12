// Self check for lib/skill-guard.js. Run: npm run check:skill-guard
import assert from "node:assert/strict";
import { keepClaimedSkills } from "../lib/skill-guard.js";

const reference = {
  basics: { label: "Account Manager", summary: "Excellent communicator who managed key stakeholders across EMEA." },
  work: [
    {
      position: "Account Manager",
      company: "Acme",
      description: "Built monthly reports in Excel.\nRan quarterly business reviews with 30 clients using Salesforce.",
    },
  ],
  skills: [{ category: "Tools", skills: ["Salesforce", "Microsoft Excel"] }],
};

const { skills, dropped } = keepClaimedSkills(
  [
    { category: "Tools", skills: ["Salesforce", "Excel", "HubSpot", "TypeScript"] },
    { category: "Practice", skills: ["Stakeholder management", "Quarterly business reviews", "Machine learning"] },
    { category: "Invented only", skills: ["Kubernetes"] },
  ],
  reference
);

const kept = skills.flatMap((g) => g.skills);
// In the CV, word for word or as the same known skill.
assert.ok(kept.includes("Salesforce"));
assert.ok(kept.includes("Excel"), "Excel is in the CV");
assert.ok(kept.includes("Quarterly business reviews"), "phrase is in the CV");
// Reworded from "managed key stakeholders".
assert.ok(kept.includes("Stakeholder management"), "honest rewording");
// Never claimed.
for (const s of ["HubSpot", "TypeScript", "Machine learning", "Kubernetes"]) {
  assert.ok(dropped.includes(s), `${s} should be dropped`);
}
// A group left empty disappears.
assert.ok(!skills.some((g) => g.category === "Invented only"));

// "Excel" must not pass on "excellent" alone.
const noExcel = keepClaimedSkills([{ category: "T", skills: ["Excel"] }], {
  basics: { summary: "Excellent communicator." },
});
assert.deepEqual(noExcel.dropped, ["Excel"]);

console.log("skill-guard: ok");

// Soft skills are labels, not tools: they pass even when the CV never says the word.
const soft = keepClaimedSkills([{ category: "S", skills: ["Communication", "Attention to Detail", "Power BI"] }], {
  basics: { summary: "Sales lead." },
});
assert.deepEqual(soft.dropped, ["Power BI"]);
console.log("skill-guard soft skills: ok");
