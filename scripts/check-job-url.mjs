// npm run check:job-url
// The LinkedIn URL shapes people paste. Each must reach the guest API, which
// is the only LinkedIn path that works (lib/job-extract.js).
import assert from "node:assert/strict";
import { linkedinJobId, normalizeJobUrl } from "../lib/job-extract.js";

const id = (url) => linkedinJobId(normalizeJobUrl(url));

assert.equal(id("https://www.linkedin.com/jobs/view/4012345678/"), "4012345678");
assert.equal(id("https://www.linkedin.com/jobs/view/4012345678?trk=public_jobs"), "4012345678");
assert.equal(id("https://www.linkedin.com/jobs/view/senior-dev-at-acme-4012345678/"), "4012345678");
assert.equal(id("https://za.linkedin.com/jobs/view/hr-officer-at-sasol-4012345678?position=1"), "4012345678");
assert.equal(id("https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4012345678"), "4012345678");
assert.equal(id("https://www.linkedin.com/in/someone/"), null);
assert.equal(id("https://boards.greenhouse.io/acme/jobs/4512"), null);

console.log("All job URL checks passed.");
