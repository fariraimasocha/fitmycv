// Self check for the rule-based ATS engine in lib/ats/rules.js.
//
// Run: npm run check:ats-rules

import assert from "node:assert/strict";
import { checkCv, parseCvDate } from "../lib/ats/rules.js";
import { scoreResumeJobMatch } from "../lib/resume-job-match.js";

const NOW = Date.UTC(2026, 8, 14);

const clean = () => ({
  basics: {
    name: "Ada Lovelace",
    label: "Engineer",
    email: "ada@example.com",
    phone: "+44 20 7946 0000",
    location: "London, UK",
    summary: "Backend engineer who ships data tooling.",
    profiles: [{ network: "GitHub", url: "https://github.com/ada" }],
  },
  work: [
    {
      company: "Acme",
      position: "Senior Engineer",
      startDate: "2022-01",
      endDate: "Present",
      description: "Built billing for 40 teams\nCut build time by 30%\nLed a move to Postgres in 6 weeks",
    },
    {
      company: "Beta",
      position: "Engineer",
      startDate: "2019-06",
      endDate: "2021-12",
      description: "Wrote 12 services\nReduced cloud cost 20%",
    },
  ],
  education: [{ institution: "UCL", degree: "BSc", fieldOfStudy: "Maths", startDate: "2015", endDate: "2019" }],
  skills: [{ category: "Languages", skills: ["Python", "Go"] }],
});

const codes = (report) => report.findings.map((f) => f.code);
const at = (report, code) => report.findings.find((f) => f.code === code)?.path;

// Dates
assert.equal(parseCvDate("Mar 2022").lo, 2022 * 12 + 2);
assert.equal(parseCvDate("03/2022").lo, 2022 * 12 + 2);
assert.equal(parseCvDate("2020").hi, 2020 * 12 + 11, "a bare year covers the whole year");
assert.equal(parseCvDate("Summer 2020"), null);
assert.equal(parseCvDate("present").present, true);

// A clean CV passes everything
const good = checkCv(clean(), NOW);
assert.deepEqual(codes(good), [], `clean CV raised ${codes(good)}`);
assert.equal(good.score, 100);
assert.equal(good.passedChecks, good.totalChecks);

// Blockers cap the total
const noEmail = clean();
noEmail.basics.email = "";
const noEmailReport = checkCv(noEmail, NOW);
assert.deepEqual(noEmailReport.cappedBy, ["MISSING_EMAIL"]);
assert.ok(noEmailReport.score <= 60, `blocker cap ignored: ${noEmailReport.score}`);

// Paths point at the field
const broken = clean();
broken.basics.profiles[0].url = "linkedin.com/in/ada";
broken.work[1].endDate = "2018-01";
broken.work[0].startDate = "Spring 2022";
const brokenReport = checkCv(broken, NOW);
assert.equal(at(brokenReport, "MALFORMED_URL"), "basics.profiles.0.url");
assert.equal(at(brokenReport, "REVERSED_PERIOD"), "work.1.endDate");
assert.equal(at(brokenReport, "UNPARSEABLE_DATE"), "work.0.startDate");

// A warning is charged once, however often it fires
const oneEmpty = clean();
oneEmpty.work[0].description = "";
const twoEmpty = clean();
twoEmpty.work[0].description = "";
twoEmpty.work[1].description = "";
assert.equal(codes(checkCv(twoEmpty, NOW)).filter((c) => c === "MISSING_DESCRIPTION").length, 2);
assert.equal(checkCv(oneEmpty, NOW).score, checkCv(twoEmpty, NOW).score);

// Future dates on jobs are flagged, future graduation is not
const future = clean();
future.work[0].startDate = "2027-02";
future.education[0].endDate = "2027";
const futureReport = checkCv(future, NOW);
assert.equal(at(futureReport, "FUTURE_DATE"), "work.0.startDate");
assert.equal(codes(futureReport).filter((c) => c === "FUTURE_DATE").length, 1);

// Tips never move the score
const vague = clean();
vague.work[0].description = "Responsible for billing\nHelped the platform team\nWorked on builds";
vague.work[1].description = "Worked on services\nResponsible for cloud spend";
const vagueReport = checkCv(vague, NOW);
assert.ok(codes(vagueReport).includes("NO_QUANTIFIED_IMPACT"));
assert.ok(codes(vagueReport).includes("WEAK_OPENERS"));
assert.equal(vagueReport.score, 100);

// Gaps over six months, pointing at the position that follows the gap
const gap = clean();
gap.work[1].endDate = "2020-01";
assert.equal(at(checkCv(gap, NOW), "EMPLOYMENT_GAP"), "work.0.startDate");

// A freshly added blank position is not a finding
const blankRow = clean();
blankRow.work.push({ company: "", position: "", startDate: "", endDate: "", description: "" });
assert.deepEqual(codes(checkCv(blankRow, NOW)), []);

// Keyword coverage: the same count ranks higher under a requirements heading
const ranked = scoreResumeJobMatch("Our product\nPayments payments.\nRequirements\nLedger ledger.", "").keywords.terms.map(
  (t) => t.term,
);
assert.ok(ranked.indexOf("ledger") < ranked.indexOf("payments"), `requirements boost missing: ${ranked}`);

// A known skill outranks a generic word with the same count
const skillFirst = scoreResumeJobMatch("Requirements\nledger terraform", "").keywords.terms.map((t) => t.term);
assert.ok(skillFirst.indexOf("terraform") < skillFirst.indexOf("ledger"), `skill boost missing: ${skillFirst}`);

// Stuffing needs heavy repetition, not honest use
const job = "Requirements\nPython services";
assert.deepEqual(scoreResumeJobMatch(job, "python ".repeat(10)).keywords.stuffed, ["python"]);
assert.deepEqual(scoreResumeJobMatch(job, "Built Python services. Python tooling. Python tests.").keywords.stuffed, []);

console.log("ats rules self-check OK");
