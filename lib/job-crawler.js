// Crawls remote jobs off company ATS pages via Exa and shapes them for the
// shared Job pool. Also owns the read-time paywall (`publicJob`)  parsing and
// gating live together because the gate has to undo what the parse found.
//
// No LLM anywhere: ATS URLs encode the company as a path slug, so extracting it
// is a regex, not an inference. Cost per crawl is ~12 Exa searches, 0 tokens.

import OpenAI from "openai";

const EXA_SEARCH_URL = "https://api.exa.ai/search";

// Company career pages only. Aggregators (LinkedIn/Indeed/Glassdoor) are
// excluded on purpose. they're the noise this page exists to avoid.
export const ATS_HOSTS = [
  "boards.greenhouse.io",
  "job-boards.greenhouse.io",
  "jobs.lever.co",
  "jobs.ashbyhq.com",
  "apply.workable.com",
  "careers.smartrecruiters.com",
];

export const ROLES = [
  "software engineer",
  "senior software engineer",
  "frontend engineer",
  "backend engineer",
  "full stack engineer",
  "data engineer",
  "data scientist",
  "machine learning engineer",
  "devops engineer",
  "mobile engineer",
  "product manager",
  "product designer",
];

const RESULTS_PER_ROLE = 50;
// Exa surfaces postings over a year old. When it gives us a date we can act
// on it; past this the listing is almost certainly filled or pulled.
const MAX_AGE_DAYS = 60;
const SNIPPET_CHARS = 300;
const TEXT_CHARS = 2000;
// 15 jobs per request keeps each prompt small enough that the model stays
// accurate; 6 in flight keeps a ~450 job crawl inside maxDuration.
const ENRICH_BATCH = 15;
const ENRICH_CONCURRENCY = 6;

// host → [regex over the pathname, source label]. The capture group is the
// company slug. Anything that doesn't match is skipped rather than guessed at.
const URL_PATTERNS = [
  [/^boards\.greenhouse\.io$/, /^\/([^/]+)\/jobs\/[^/]+/, "greenhouse"],
  [/^job-boards\.greenhouse\.io$/, /^\/([^/]+)\/jobs\/[^/]+/, "greenhouse"],
  [/^jobs\.lever\.co$/, /^\/([^/]+)\/[^/]+/, "lever"],
  [/^jobs\.ashbyhq\.com$/, /^\/([^/]+)\/[^/]+/, "ashby"],
  [/^apply\.workable\.com$/, /^\/([^/]+)\/j\/[^/]+/, "workable"],
  [/^careers\.smartrecruiters\.com$/, /^\/([^/]+)\/[^/]+/, "smartrecruiters"],
];

// Exa returns the page's og:image. On ATS pages that is sometimes the real
// company logo and sometimes a wide social banner, the ATS's own branding, or a
// board config graphic. Only these three shapes are square company logos.
// Rejected on purpose: ashby org-theme-social (wide banner), org-theme-wordmark
// (illegible at 40px), greenhouse job_board_configurations, and
// jobs.lever.co/img/* which is Lever's logo, not the employer's.
export function logoFromImage(image) {
  let u;
  try {
    u = new URL(String(image ?? ""));
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  if (/(^|\.)lever-client-logos\.s3[.-]/.test(u.hostname)) return u.href;
  if (/recruiting\.cdn\.greenhouse\.io$/.test(u.hostname) && u.pathname.includes("/logos/")) return u.href;
  if (u.hostname === "app.ashbyhq.com" && u.pathname.includes("/org-theme-logo/")) return u.href;
  return null;
}

export const CATEGORIES = ["Engineering", "Data & AI", "Design", "Product", "Other"];

// Order matters: "Product Designer" is Design, not Product, and "Data Engineer"
// is Data, not Engineering. First match wins, so the specific buckets come
// before the broad ones.
const CATEGORY_RULES = [
  ["Design", /\b(designer|design systems?|ux|ui|user experience|user interface|graphic|illustrat\w*)\b/i],
  // Must name an actual data or ML role. A bare "AI" or "data" matches far too
  // much: "Frontend Engineer (AI-Native)" and "Backend Engineer, Databases" are
  // engineering roles that merely mention the words.
  [
    "Data & AI",
    /\b(data (?:engineer|scientist|analyst|architect|platform)|data science|machine learning|ml (?:engineer|scientist|ops)|ai (?:engineer|researcher|scientist)|research scientist|analytics engineer|nlp|computer vision|deep learning)\b/i,
  ],
  ["Product", /\b(product manager|product owner|product lead|product marketing|program manager|\btpm\b|\bpm\b)\b/i],
  [
    "Engineering",
    /\b(engineer|developer|programmer|\bsre\b|devops|architect|backend|frontend|full.?stack|mobile|ios|android|platform|infrastructure|security|\bqa\b)\b/i,
  ],
];

export const EMPLOYMENT_TYPES = ["Full time", "Part time", "Contract", "Internship"];

// The model drifts off the enum it is given: one crawl produced "Full time",
// "Full Time", "Full-time", "Full-Time", "FullTime", "full time" and
// "Full-Time (Remote)" for the same thing. Normalise here so the value is
// filterable instead of trusting the prompt.
export function normaliseEmploymentType(value) {
  const v = String(value ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (!v) return null;
  if (v.startsWith("fulltime")) return "Full time";
  if (v.startsWith("parttime")) return "Part time";
  if (v.startsWith("contract") || v.startsWith("freelance") || v.startsWith("temporary")) return "Contract";
  if (v.startsWith("intern")) return "Internship";
  return null;
}

export function categorise(title) {
  const t = String(title ?? "");
  for (const [name, re] of CATEGORY_RULES) if (re.test(t)) return name;
  return "Other";
}

function escapeRegex(str) {
  return String(str ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// "acme-corp" → "Acme Corp". Slugs that already carry casing ("PostHog") are
// left alone. re-casing them reads worse than the original.
export function companyFromSlug(slug) {
  const s = String(slug ?? "").trim();
  if (!s) return "";
  if (/[A-Z]/.test(s)) return s.replace(/[-_]+/g, " ").trim();
  return s
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// Splits a URL into the pieces the pool needs, or null if it isn't a job page
// on an ATS we understand.
export function parseAtsUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");
  for (const [hostRe, pathRe, source] of URL_PATTERNS) {
    if (!hostRe.test(host)) continue;
    const m = parsed.pathname.match(pathRe);
    if (!m) return null;
    const companySlug = decodeURIComponent(m[1]);
    // Greenhouse's embed/board index pages aren't postings.
    if (["embed", "jobs", "j"].includes(companySlug.toLowerCase())) return null;
    const company = companyFromSlug(companySlug);
    if (!company) return null;
    // Drop tracking params so the same posting dedupes to one row.
    return {
      url: `${parsed.origin}${parsed.pathname}`.replace(/\/$/, ""),
      companySlug,
      company,
      source,
    };
  }
  return null;
}

// Matches the company however it's written in a title: "Acme Corp", "acme-corp",
// "acme_corp", "AcmeCorp".
function companyPattern(company, companySlug) {
  const words = String(companySlug || company)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(escapeRegex);
  if (words.length === 0) return null;
  return words.join("[-_\\s]*");
}

// Removes the company from a job title. This is a paywall concern, not a
// cosmetic one: ATS titles routinely read "Senior Engineer - Acme", so leaving
// the title untouched would hand a locked company name straight to a free user.
export function stripCompanyFromTitle(title, company, companySlug) {
  let t = String(title ?? "").trim();
  // Greenhouse renders "Job Application for {Title} at {Company}".
  t = t.replace(/^job application for\s+/i, "");
  const pat = companyPattern(company, companySlug);
  if (!pat) return t.trim();
  // "Title at Acme" / "Title - Acme" / "Title | Acme" / "Title @ Acme"
  t = t.replace(new RegExp(`\\s*(?:[-|@:]|\\bat\\b)\\s*${pat}[.,]?\\s*$`, "i"), "");
  // "Acme - Title" / "Acme, Inc.: Title"
  t = t.replace(new RegExp(`^\\s*${pat}[.,]?\\s*[-|:@]\\s*`, "i"), "");
  // ponytail: nuke any leftover mention. Over-eager when the company name is a
  // common word ("Ramp"), but erring toward a clipped title beats leaking a
  // paid field. Narrow it if titles start coming out mangled.
  t = t.replace(new RegExp(pat, "gi"), " ");
  return tidy(t);
}

// Backstop for the case the slug can't cover: the title spells the company
// differently than its URL slug does. "its" vs "Intelligent Technical
// Solutions", "freshprints" vs "Fresh Prints", or a slug holding only the first
// word ("sunrise" of "Sunrise Robotics Corporation"). In an ATS title, "at" and
// "@" mark the employer, so everything after the first one goes regardless of
// spelling. "-" is deliberately excluded: it separates role qualifiers at least
// as often as it precedes a company ("Engineer - Backend").
function dropEmployerSuffix(title) {
  return tidy(String(title ?? "").replace(/\s+(?:@|\bat\b)\s+.+$/i, ""));
}

function tidy(t) {
  return t
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s\-|:@,.]+|[\s\-|:@,.]+$/g, "")
    .trim();
}

// The single choke point between a Job document and the wire.
//
// A CSS blur is not a paywall. anything in the DOM is readable in devtools, so
// the three paid fields have to be absent from the response, not hidden in it:
// the company, the apply URL (its href is boards.greenhouse.io/acme/..., which
// leaks the company on its own), and the company inside the title.
export function publicJob(job, isPremium) {
  const shared = {
    id: String(job._id ?? job.id ?? ""),
    remote: job.remote ?? true,
    // postedAt is the real publication date or null; listedAt is when we first
    // saw it. The card shows the former when known and falls back to the latter.
    postedAt: job.postedAt ?? null,
    listedAt: job.crawledAt ?? null,
    source: job.source ?? null,
    category: job.category ?? "Other",
    // Location, salary and contract type describe the role, not the employer,
    // so they stay visible on the free tier. Only the company and the apply
    // link are held back.
    location: job.location ?? null,
    salary: job.salary ?? null,
    employmentType: job.employmentType ?? null,
  };
  if (isPremium) {
    return {
      ...shared,
      title: job.title,
      company: job.company,
      applyUrl: job.url,
      snippet: job.snippet ?? "",
      // A logo identifies the employer just as plainly as the name, so it sits
      // behind the paywall with the rest.
      logo: job.logo ?? null,
      locked: false,
    };
  }
  // The snippet is scraped page prose and names the employer all over the place
  // ("we at Acme", careers@acme.com, the page header). Stripping it is
  // whack-a-mole, so free viewers don't get it at all. the title is the value.
  return {
    ...shared,
    title: dropEmployerSuffix(stripCompanyFromTitle(job.title, job.company, job.companySlug)),
    company: null,
    applyUrl: null,
    snippet: null,
    logo: null,
    locked: true,
  };
}

// Exa hands back scraper placeholders on pages it couldn't read properly.
const JUNK_TITLES = /^(page_?title|untitled|job|jobs|careers|home|null|undefined)$/i;

export function parseAtsResult(result) {
  const parsed = parseAtsUrl(result?.url);
  if (!parsed) return null;
  const rawTitle = String(result?.title ?? "").trim();
  if (!rawTitle) return null;
  const text = String(result?.text ?? "");
  // Keep the company in the stored title. publicJob strips it per viewer.
  const title = rawTitle.replace(/^job application for\s+/i, "").trim();
  // Check the junk guard against what a locked viewer would actually see:
  // "Careers at BoxCast" reads fine raw but strips down to a useless "Careers".
  const visible = dropEmployerSuffix(title);
  if (
    title.length < 3 ||
    visible.length < 3 ||
    JUNK_TITLES.test(title) ||
    JUNK_TITLES.test(visible) ||
    !/[a-z]/i.test(visible)
  ) {
    return null;
  }
  let published = result?.publishedDate ? new Date(result.publishedDate) : null;
  if (published && Number.isNaN(published.getTime())) published = null;
  // Drop postings we KNOW are stale. An unknown date can't be judged, so it
  // passes. the 30-day TTL on Job sweeps those up instead.
  if (published && Date.now() - published.getTime() > MAX_AGE_DAYS * 864e5) return null;
  return {
    ...parsed,
    title,
    category: categorise(title),
    logo: logoFromImage(result?.image),
    remote: /\bremote\b/i.test(`${rawTitle} ${text}`),
    snippet: text.replace(/\s+/g, " ").trim().slice(0, SNIPPET_CHARS),
    // Not persisted: handed to the enrichment pass, then dropped.
    _text: text.replace(/\s+/g, " ").trim().slice(0, 1200),
    // Null when Exa gives us nothing. only ~35% of ATS pages carry a real
    // date, and inventing one would put a false "Today" on a month-old post.
    // crawledAt is the sort key instead; it's always populated.
    postedAt: published,
  };
}

async function searchRole(role) {
  const res = await fetch(EXA_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`,
    },
    body: JSON.stringify({
      query: `remote ${role} job opening`,
      type: "auto",
      numResults: RESULTS_PER_ROLE,
      includeDomains: ATS_HOSTS,
      contents: { text: { maxCharacters: TEXT_CHARS, includeHtmlTags: false } },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Exa ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  return json?.results ?? [];
}

const ENRICH_PROMPT = `You extract facts from job posting pages. For each numbered posting you get the page title and the first part of its text.

Return JSON: {"jobs":[{"i":<number>,"location":<string|null>,"salary":<string|null>,"employmentType":<string|null>,"postedAt":<"YYYY-MM-DD"|null>}]}

Rules:
- Only report what the text states. Never infer, never guess, never use outside knowledge. If a field is not stated, return null.
- location: as written, e.g. "Remote - US or Canada", "London, UK", "Remote (EMEA)". Null if absent.
- salary: the range as written with its currency and period, e.g. "$190,000-$220,000 per year", "£70k-£90k". Null if absent. Never convert currencies.
- employmentType: one of "Full time", "Part time", "Contract", "Internship". Null if absent.
- postedAt: the publication date if the page states one. Null otherwise.
- Return exactly one entry per numbered posting, same numbers.`;

// Parses the model's reply into a map of index -> fields. Tolerates a missing
// or malformed response by returning an empty map: enrichment is a bonus, and
// a bad batch must never cost us the jobs themselves.
export function parseEnrichResponse(content) {
  const out = new Map();
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return out;
  }
  const clean = (v) => {
    const t = typeof v === "string" ? v.trim() : "";
    return t && t.toLowerCase() !== "null" && t.toLowerCase() !== "n/a" ? t : null;
  };
  for (const row of Array.isArray(parsed?.jobs) ? parsed.jobs : []) {
    const i = Number(row?.i);
    if (!Number.isInteger(i)) continue;
    let postedAt = null;
    if (typeof row?.postedAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(row.postedAt.trim())) {
      const d = new Date(`${row.postedAt.trim()}T00:00:00Z`);
      // A future date means the model hallucinated or misread the page.
      if (!Number.isNaN(d.getTime()) && d.getTime() <= Date.now() + 864e5) postedAt = d;
    }
    out.set(i, {
      location: clean(row?.location),
      salary: clean(row?.salary),
      employmentType: clean(row?.employmentType),
      postedAt,
    });
  }
  return out;
}

async function enrichBatch(openai, batch) {
  const listing = batch
    .map((j, n) => `${n}. TITLE: ${j.title}\nTEXT: ${j._text ?? ""}`)
    .join("\n\n");
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ENRICH_PROMPT },
      { role: "user", content: listing },
    ],
  });
  const fields = parseEnrichResponse(res.choices?.[0]?.message?.content ?? "");
  batch.forEach((job, n) => {
    const f = fields.get(n);
    if (!f) return;
    job.location = f.location;
    job.salary = f.salary;
    job.employmentType = normaliseEmploymentType(f.employmentType);
    // Only upgrade the date; never overwrite a real one Exa already gave us.
    if (!job.postedAt && f.postedAt) job.postedAt = f.postedAt;
  });
}

// Location and salary sit in prose on Greenhouse and Lever and in key-value
// blocks on Ashby, with no shared shape to regex against. One cheap model pass
// handles every layout, including ATSs we haven't seen yet.
export async function enrichJobs(jobs) {
  if (!process.env.OPENAI_API_KEY || jobs.length === 0) return [];
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const batches = [];
  for (let i = 0; i < jobs.length; i += ENRICH_BATCH) {
    batches.push(jobs.slice(i, i + ENRICH_BATCH));
  }

  const errors = [];
  for (let i = 0; i < batches.length; i += ENRICH_CONCURRENCY) {
    const wave = batches.slice(i, i + ENRICH_CONCURRENCY);
    const settled = await Promise.allSettled(wave.map((b) => enrichBatch(openai, b)));
    settled.forEach((r, n) => {
      if (r.status === "rejected") {
        errors.push(`enrich batch ${i + n}: ${r.reason?.message ?? r.reason}`);
      }
    });
  }
  return errors;
}

// ponytail: no startPublishedDate filter. Exa leaves publishedDate empty on a
// lot of ATS pages, and filtering on it drops them entirely. The unique `url`
// index dedupes repeats and the 30-day TTL on Job handles staleness instead.
export async function crawlJobs() {
  if (!process.env.EXA_API_KEY) {
    throw new Error("EXA_API_KEY env var is not set");
  }

  const errors = [];
  const byUrl = new Map();
  let seen = 0;

  // ponytail: sequential, not Promise.all. firing all 12 roles at once trips
  // Exa's 10 req/sec limit and silently drops a role's jobs every crawl. This
  // is a cron; nothing is waiting on it. Batch it only if ROLES grows enough
  // that the run approaches maxDuration.
  for (const role of ROLES) {
    try {
      for (const result of await searchRole(role)) {
        seen++;
        const row = parseAtsResult(result);
        if (row) byUrl.set(row.url, row);
      }
    } catch (error) {
      errors.push(`${role}: ${error?.message ?? error}`);
    }
  }

  let jobs = [...byUrl.values()];

  errors.push(...(await enrichJobs(jobs)));

  // Enrichment can surface a publication date Exa didn't give us, so re-apply
  // the staleness cut now that more rows have a real date to judge.
  const before = jobs.length;
  jobs = jobs.filter(
    (j) => !j.postedAt || Date.now() - j.postedAt.getTime() <= MAX_AGE_DAYS * 864e5
  );
  const staleAfterEnrich = before - jobs.length;

  for (const j of jobs) delete j._text;

  return { jobs, seen, skipped: seen - jobs.length, staleAfterEnrich, errors };
}

// Self-check: `npm run check:jobs` (copies this file to .mjs so node can run it).
if (process.argv[1] && process.argv[1].endsWith("job-crawler.mjs")) {
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
  assert(parseAtsUrl("https://careers.smartrecruiters.com/PostHog/7431")?.company === "PostHog", "existing casing preserved");

  // --- non-jobs are skipped, never guessed at ---
  assert(parseAtsUrl("https://www.linkedin.com/jobs/view/123") === null, "aggregator rejected");
  assert(parseAtsUrl("https://boards.greenhouse.io/acme") === null, "board index is not a posting");
  assert(parseAtsUrl("not a url") === null, "garbage rejected");

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
}
