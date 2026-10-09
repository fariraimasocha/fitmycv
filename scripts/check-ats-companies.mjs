// Self check for lib/ats-detect.js and the claims in content/ats-companies.js.
// Run: npm run check:ats-companies

import assert from "node:assert/strict";
import { detectAts, getAtsVendor } from "../lib/ats-detect.js";
import { ATS_COMPANIES } from "../content/ats-companies.js";

const id = (url) => detectAts(url)?.id ?? null;

// Every company page claims a vendor; its evidence link has to show it.
const slugs = new Set();
for (const c of ATS_COMPANIES) {
  assert.equal(id(c.evidenceUrl), c.ats, `${c.slug}: ${c.evidenceUrl}`);
  assert.ok(getAtsVendor(c.ats), `${c.slug}: unknown vendor ${c.ats}`);
  assert.ok(!slugs.has(c.slug), `duplicate slug ${c.slug}`);
  slugs.add(c.slug);
}

assert.equal(id("boards.greenhouse.io/stripe/jobs/123"), "greenhouse");
assert.equal(id("https://jobs.lever.co/palantir/abc/apply"), "lever");
assert.equal(id("https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/x"), "workday");
assert.equal(id("https://career5.successfactors.eu/careers?company=acme"), "successfactors");
assert.equal(id("https://acme.taleo.net/careersection/2/jobdetail.ftl"), "taleo");
assert.equal(id("https://acme.fa.em2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX/job/1"), "oracle");
assert.equal(id("HTTPS://ACME.BAMBOOHR.COM/careers/12"), "bamboohr");

// Not a vendor host, or only looks like one.
assert.equal(id("https://stripe.com/jobs"), null);
assert.equal(id("https://greenhouse.io.evil.com/x"), null);
assert.equal(id("https://notgreenhouse.io/x"), null);
assert.equal(id("https://acme.oraclecloud.com/something-else"), null);
assert.equal(id("javascript:alert(1)"), null);
assert.equal(id(""), null);
assert.equal(id("not a link"), null);

console.log(`ats-companies: ok (${ATS_COMPANIES.length} companies)`);
