// npm run check:jobs
import { CATEGORIES, EMPLOYMENT_TYPES, boardUrl, categorise, dedupeAcrossSources, domainLabel, logoFromImage, logoFromImages, logoFromResult, normaliseEmploymentType, parseAtsResult, parseAtsUrl, parseCompanyUrl, parseEnrichResponse, publicJob, stripCompanyFromTitle } from "../lib/job-crawler.js";

const assert = (c, m) => {
  if (!c) {
    console.error("FAIL:", m);
    process.exit(1);
  }
};

// --- URL parsing, one case per ATS ---
const gh = parseAtsUrl("https://boards.greenhouse.io/acme-corp/jobs/4512?gh_src=abc");
assert(gh?.company === "Acme Corp", `greenhouse company, got ${gh?.company}`);
assert(gh?.source === "greenhouse", "greenhouse source");
assert(gh?.url === "https://boards.greenhouse.io/acme-corp/jobs/4512", "tracking params dropped");

assert(parseAtsUrl("https://job-boards.greenhouse.io/acme/jobs/9")?.company === "Acme", "greenhouse job-boards host");
assert(parseAtsUrl("https://jobs.lever.co/ramp/1a2b-3c")?.source === "lever", "lever source");
assert(parseAtsUrl("https://jobs.ashbyhq.com/linear/abc-def")?.company === "Linear", "ashby company");
assert(parseAtsUrl("https://apply.workable.com/tally/j/ABC123")?.company === "Tally", "workable company");
assert(parseAtsUrl("https://jobs.smartrecruiters.com/PostHog/7431")?.company === "PostHog", "existing casing preserved");
// careers.smartrecruiters.com 302s to jobs.*, so it never carries a posting.
assert(
  parseAtsUrl("https://careers.smartrecruiters.com/PostHog/7431") === null,
  "the redirecting smartrecruiters host is not a posting host"
);

// Workday reads the employer off the subdomain, not the path.
const wd = parseAtsUrl("https://acme.wd1.myworkdayjobs.com/en-US/careers/job/Remote/Engineer_R-1");
assert(wd?.company === "Acme", `workday company, got ${wd?.company}`);
assert(wd?.source === "workday", "workday source");
assert(
  parseAtsUrl("https://acme.wd1.myworkdayjobs.com/en-US/careers") === null,
  "workday search page is not a posting"
);

// --- non-jobs are skipped, never guessed at ---
assert(parseAtsUrl("https://www.linkedin.com/jobs/view/123") === null, "aggregator rejected");
assert(parseAtsUrl("https://boards.greenhouse.io/acme") === null, "board index is not a posting");
assert(parseAtsUrl("not a url") === null, "garbage rejected");

// --- company career domains ---
assert(domainLabel("careers.cohere.com") === "cohere", "subdomain stripped");
assert(domainLabel("www.cohere.com") === "cohere", "www stripped");
assert(domainLabel("jobs.acme.co.uk") === "acme", "two-part TLD handled");
assert(domainLabel("localhost") === "", "single label rejected");
assert(domainLabel("www.capitalonecareers.com") === "capitalone", "glued-on 'careers' trimmed");
assert(domainLabel("careers.unitedhealthgroup.com") === "unitedhealthgroup", "subdomain 'careers' is not the label");
assert(domainLabel("jobs.io") === "jobs", "a label that IS the word survives");

const co = parseCompanyUrl("https://cohere.com/careers/senior-engineer");
assert(co?.company === "Cohere", `company from domain, got ${co?.company}`);
assert(co?.source === "company", "company source");
assert(co?.companySlug === "cohere", "slug is the domain label");
assert(
  parseCompanyUrl("https://careers.acme.io/jobs/staff-designer?utm_source=x")?.url ===
    "https://careers.acme.io/jobs/staff-designer",
  "tracking params dropped on company URLs too"
);
assert(parseCompanyUrl("https://acme.com/careers") === null, "careers index is not a posting");
assert(parseCompanyUrl("https://acme.com/careers/apply") === null, "generic segment rejected");
assert(
  parseCompanyUrl("https://point.com/careers/job/software-engineer-8448882002")?.company === "Point",
  "an intermediate path segment does not hide the posting slug"
);
assert(parseCompanyUrl("https://acme.com/careers/") === null, "trailing slash is still the index");
assert(parseCompanyUrl("https://acme.com/company/careers/all-jobs") === null, "listing page rejected");
assert(parseCompanyUrl("https://acme.com/careers/eng") === null, "too-short segment rejected");
assert(parseCompanyUrl("https://acme.com/blog/we-are-hiring") === null, "announcement rejected");
assert(parseCompanyUrl("https://www.linkedin.com/jobs/view/123") === null, "aggregator rejected");
assert(
  parseCompanyUrl("https://weworkremotely.com/remote-jobs/acme-engineer") === null,
  "job board is not an employer"
);
assert(
  parseCompanyUrl("https://jobs.ashbyhq.com/cohere/abc-def") === null,
  "ATS hosts belong to the ATS pass, not the company pass"
);
assert(parseCompanyUrl("http://acme.com/careers/engineer-iii") === null, "non https rejected");
assert(parseCompanyUrl("not a url") === null, "garbage rejected");
assert(
  parseAtsResult({ url: "https://cohere.com/careers/staff-engineer", title: "Staff Engineer" })?.source ===
    "company",
  "parseAtsResult falls through to the company parser"
);

// --- the same job on two hosts collapses to one row, ATS wins ---
const dupes = dedupeAcrossSources([
  { url: "https://cohere.com/careers/staff-engineer", title: "Staff Engineer", company: "Cohere", companySlug: "cohere", source: "company" },
  { url: "https://jobs.ashbyhq.com/cohere/abc", title: "Staff Engineer at Cohere", company: "Cohere", companySlug: "cohere", source: "ashby" },
]);
assert(dupes.length === 1, `cross-source duplicate collapsed, got ${dupes.length}`);
assert(dupes[0].source === "ashby", "the ATS row is the one kept");
assert(
  dedupeAcrossSources([
    { url: "a", title: "Staff Engineer", company: "Cohere", companySlug: "cohere", source: "ashby" },
    { url: "b", title: "Staff Designer", company: "Cohere", companySlug: "cohere", source: "ashby" },
  ]).length === 2,
  "different roles at one company are not merged"
);

// --- title stripping (the paywall's teeth) ---
assert(stripCompanyFromTitle("Senior Engineer - Acme", "Acme", "acme") === "Senior Engineer", "trailing dash form");
assert(stripCompanyFromTitle("Acme: Senior Engineer", "Acme", "acme") === "Senior Engineer", "leading colon form");
assert(stripCompanyFromTitle("Senior Engineer at Acme Corp", "Acme Corp", "acme-corp") === "Senior Engineer", "'at' form");
assert(
  stripCompanyFromTitle("Job Application for Data Engineer at Acme Corp", "Acme Corp", "acme-corp") === "Data Engineer",
  "greenhouse 'Job Application for' form"
);
assert(stripCompanyFromTitle("Backend Engineer", "Acme", "acme") === "Backend Engineer", "clean title untouched");
// slug spelling differs from the rendered company name
assert(stripCompanyFromTitle("AcmeCorp - Designer", "Acme Corp", "acme-corp") === "Designer", "slug variant matched");

// --- junk titles are dropped, not stored ---
const mk = (title) => ({ url: "https://jobs.lever.co/acme/1", title });
assert(parseAtsResult(mk("page_title")) === null, "placeholder title rejected");
assert(parseAtsResult(mk("Careers")) === null, "nav title rejected");
assert(parseAtsResult(mk("Careers at BoxCast")) === null, "title that strips down to junk rejected");
assert(parseAtsResult(mk("Product Designer @ Railway"))?.title === "Product Designer @ Railway", "real title kept raw for premium");
assert(parseAtsResult(mk("  ")) === null, "blank title rejected");
assert(parseAtsResult(mk("---")) === null, "letterless title rejected");
assert(parseAtsResult(mk("Staff Engineer"))?.title === "Staff Engineer", "real title kept");
assert(parseAtsResult(mk("Staff Engineer"))?.category === "Engineering", "category set at parse time");
assert(parseAtsResult(mk("Staff Engineer")).postedAt === null, "absent publishedDate stays null");

// --- stale postings are dropped, unknown dates pass ---
const dated = (daysAgo) => ({
  url: "https://jobs.lever.co/acme/1",
  title: "Staff Engineer",
  publishedDate: new Date(Date.now() - daysAgo * 864e5).toISOString(),
});
assert(parseAtsResult(dated(5)) !== null, "recent posting kept");
assert(parseAtsResult(dated(429)) === null, "429-day-old posting dropped");
assert(parseAtsResult(dated(61)) === null, "just past the cutoff is dropped");
assert(parseAtsResult({ ...dated(5), publishedDate: "garbage" })?.postedAt === null, "unparseable date treated as unknown");

// --- logo allowlist ---
assert(
  logoFromImage("https://lever-client-logos.s3.us-west-2.amazonaws.com/abc.png") !== null,
  "lever client logo accepted"
);
assert(
  logoFromImage("https://s3-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/1/x.png") !== null,
  "greenhouse logo accepted"
);
assert(
  logoFromImage("https://app.ashbyhq.com/api/images/org-theme-logo/a/b/c.png") !== null,
  "ashby org-theme-logo accepted"
);
assert(
  logoFromImage("https://app.ashbyhq.com/api/images/org-theme-social/a/b/c.png") === null,
  "ashby social banner rejected"
);
assert(
  logoFromImage("https://app.ashbyhq.com/api/images/org-theme-wordmark/a/b/c.png") === null,
  "ashby wordmark rejected as illegible at tile size"
);
assert(
  logoFromImage("https://jobs.lever.co/img/lever-logo-refresh.svg") === null,
  "the ATS's own logo must never brand an employer's job"
);
assert(
  logoFromImage("https://s4-recruiting.cdn.greenhouse.io/job_board_renderer/job_board_configurations/x.png") === null,
  "greenhouse board config graphic rejected"
);
assert(logoFromImage("http://lever-client-logos.s3.amazonaws.com/a.png") === null, "non https rejected");
assert(logoFromImage("evil") === null, "garbage rejected");
assert(logoFromImage(null) === null, "null rejected");
assert(
  publicJob({ _id: "x", title: "Engineer", company: "Acme", companySlug: "acme", url: "u", logo: "https://x/y.png" }, false).logo === null,
  "free tier gets no logo"
);
assert(
  logoFromResult({
    image: "https://app.ashbyhq.com/api/images/org-theme-social/a/b/c.png",
    extras: { imageLinks: ["https://app.ashbyhq.com/api/images/org-theme-logo/a/b/c.png"] },
  }) === "https://app.ashbyhq.com/api/images/org-theme-logo/a/b/c.png",
  "imageLinks recover the square mark when og:image is a banner"
);
assert(
  logoFromImages([
    "https://jobs.lever.co/img/lever-logo-refresh.svg",
    "https://lever-client-logos.s3.us-west-2.amazonaws.com/abc.png",
  ]) === "https://lever-client-logos.s3.us-west-2.amazonaws.com/abc.png",
  "first allowlisted URL wins"
);
assert(boardUrl("ashby", "railway") === "https://jobs.ashbyhq.com/railway", "ashby board URL");
assert(boardUrl("greenhouse", "grafanalabs") === "https://job-boards.greenhouse.io/grafanalabs", "greenhouse board URL");
assert(boardUrl("smartrecruiters", "PostHog") === "https://jobs.smartrecruiters.com/PostHog", "smartrecruiters board URL");
assert(boardUrl("workday", "acme") === null, "no derivable workday board index");
assert(boardUrl("company", "cohere") === null, "a company posting is already the company's page");

// --- category derivation ---
assert(categorise("Senior Backend Engineer") === "Engineering", "engineer -> Engineering");
assert(categorise("Product Designer") === "Design", "Product Designer is Design, not Product");
assert(categorise("Data Engineer") === "Data & AI", "Data Engineer is Data, not Engineering");
assert(categorise("Machine Learning Engineer") === "Data & AI", "ML Engineer is Data");
assert(categorise("Senior Product Manager") === "Product", "PM -> Product");
assert(categorise("Staff UX Researcher") === "Design", "UX -> Design");
assert(categorise("Functional Registered Dietitian") === "Other", "unmatched -> Other");
// Roles that merely mention AI or data are engineering, not Data & AI.
assert(
  categorise("Senior Frontend Engineer (Next.js & React, AI-Native)") === "Engineering",
  "AI-Native frontend role is Engineering"
);
assert(
  categorise("Staff Software Engineer, AI & Platform") === "Engineering",
  "AI & Platform is Engineering"
);
assert(
  categorise("Senior Backend Engineer - Databases") === "Engineering",
  '"Databases" must not match the data rule'
);
assert(categorise("Data Scientist") === "Data & AI", "Data Scientist is Data & AI");
assert(categorise("Analytics Engineer") === "Data & AI", "Analytics Engineer is Data & AI");
assert(categorise("Tier 2 Product Owner") === "Product", "Product Owner is Product");
assert(CATEGORIES.includes(categorise("anything")), "always returns a known category");

// --- employment type normalisation (the model will not stick to the enum) ---
for (const v of ["Full time", "Full Time", "Full-time", "FullTime", "full time", "Full-Time (Remote)"]) {
  assert(normaliseEmploymentType(v) === "Full time", `"${v}" should normalise to Full time`);
}
assert(normaliseEmploymentType("part-time") === "Part time", "part-time normalised");
assert(normaliseEmploymentType("Freelance") === "Contract", "freelance is Contract");
assert(normaliseEmploymentType("Internship") === "Internship", "internship kept");
assert(normaliseEmploymentType(null) === null, "null stays null");
assert(normaliseEmploymentType("Permanent Staff") === null, "unrecognised value is dropped, not guessed");
assert(
  EMPLOYMENT_TYPES.includes(normaliseEmploymentType("Full Time")),
  "output is always one of the known types"
);

// --- enrichment response parsing (a bad batch must cost nothing) ---
assert(parseEnrichResponse("not json").size === 0, "garbage reply yields no fields");
assert(parseEnrichResponse('{"jobs":null}').size === 0, "missing array yields no fields");
const pe = parseEnrichResponse(JSON.stringify({
  jobs: [
    { i: 0, location: "Remote - US", salary: "$190,000-$220,000 per year", employmentType: "Full time", postedAt: "2026-08-17" },
    { i: 1, location: "null", salary: "  ", employmentType: null, postedAt: "not-a-date" },
    { i: 2, location: "London, UK", postedAt: "2099-01-01" },
  ],
}));
assert(pe.get(0).location === "Remote - US", "location parsed");
assert(pe.get(0).salary === "$190,000-$220,000 per year", "salary parsed");
assert(pe.get(0).postedAt instanceof Date, "valid date parsed");
assert(pe.get(1).location === null, 'the string "null" is treated as absent');
assert(pe.get(1).salary === null, "whitespace-only is treated as absent");
assert(pe.get(1).postedAt === null, "unparseable date rejected");
assert(pe.get(2).postedAt === null, "future date rejected as a hallucination");

// --- backstop: title spells the company differently than the slug ---
const freeTitle = (title, company, slug) =>
  publicJob({ _id: "x", title, company, companySlug: slug, url: "u" }, false).title;
assert(
  freeTitle("Graphic Designer (Remote) at Intelligent Technical Solutions", "Its", "its") ===
    "Graphic Designer (Remote)",
  "abbreviated slug: full name still removed"
);
assert(
  freeTitle("Instructional Designer at Fresh Prints", "Freshprints", "freshprints") ===
    "Instructional Designer",
  "concatenated slug vs spaced title"
);
assert(
  freeTitle("Product Designer @ Sunrise Robotics Corporation", "Sunrise", "sunrise") ===
    "Product Designer",
  "slug is only the first word of the company"
);
assert(
  freeTitle("Senior Engineer - Backend", "Acme", "acme") === "Senior Engineer - Backend",
  "a dash separating a role qualifier is NOT treated as a company marker"
);
// The company pass derives slugs from domains, which are concatenated.
assert(
  freeTitle("Staff Software Engineer - Capital One", "Capitalone", "capitalone") ===
    "Staff Software Engineer",
  "concatenated domain slug matches the spaced company in the title"
);
assert(
  freeTitle("Lead Software Engineer (Remote) | UnitedHealth Group", "Unitedhealthgroup", "unitedhealthgroup") ===
    "Lead Software Engineer (Remote)",
  "long concatenated slug matches a spaced title"
);
assert(
  freeTitle("Senior Engineer", "Acme", "acme") === "Senior Engineer",
  "a short slug is left to exact matching, no letter-by-letter fishing"
);

// --- the gate: nothing paid may survive into a free response ---
const job = {
  _id: "abc123",
  url: "https://boards.greenhouse.io/acme-corp/jobs/4512",
  title: "Senior Engineer at Acme Corp",
  company: "Acme Corp",
  companySlug: "acme-corp",
  // names the company on purpose. the fixture has to exercise the leak path
  snippet: "Acme Corp is hiring engineers. Email careers@acme-corp.com",
  remote: true,
  postedAt: new Date(),
};

const free = publicJob(job, false);
assert(free.company === null, "free: company withheld");
assert(free.applyUrl === null, "free: apply URL withheld");
assert(free.locked === true, "free: locked flag set");
assert(!("url" in free), "free: raw url never serialized");
assert(free.snippet === null, "free: snippet withheld (it names the employer)");
assert(
  !JSON.stringify(free).toLowerCase().includes("acme"),
  `free: company leaked somewhere in the payload. ${JSON.stringify(free)}`
);

const pro = publicJob(job, true);
assert(pro.company === "Acme Corp", "pro: company present");
assert(pro.applyUrl === job.url, "pro: apply URL present");
assert(pro.locked === false, "pro: unlocked");
assert(pro.snippet === job.snippet, "pro: snippet present");

// trailing punctuation on a legal name must not survive the strip
assert(
  stripCompanyFromTitle("Glass Health Inc. - Founding Engineer", "Glass Health Inc", "glass-health-inc") ===
    "Founding Engineer",
  "legal-suffix period handled"
);

// a null session must fall through to the locked branch, not the paid one
assert(publicJob(job, undefined).locked === true, "undefined isPremium defaults to locked");

console.log("job-crawler self-check OK");
