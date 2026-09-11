// Crawls remote jobs off company ATS pages via Exa and shapes them for the
// shared Job pool. Also owns the read-time paywall (`publicJob`)  parsing and
// gating live together because the gate has to undo what the parse found.
//
// No LLM for sourcing: ATS URLs encode the company as a path slug and a company
// career page encodes it in the domain, so extracting it is a regex either way.
// Cost per crawl is ~84 Exa searches (one per role per ATS host).

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
  // careers.smartrecruiters.com 302s here, so the old entry matched nothing.
  "jobs.smartrecruiters.com",
  // Every employer gets its own subdomain; Exa matches those under this host.
  "myworkdayjobs.com",
];

// Hosts that are not an employer's own site. Exa's excludeDomains gets this
// list for the company-site pass, and parseCompanyUrl re-checks it, because an
// allowlist is what keeps the ATS pass honest and the company pass has none.
export const NON_EMPLOYER_HOSTS = [
  "linkedin.com",
  "indeed.com",
  "glassdoor.com",
  "glassdoor.co.uk",
  "ziprecruiter.com",
  "monster.com",
  "dice.com",
  "simplyhired.com",
  "weworkremotely.com",
  "remoteok.com",
  "remoteok.io",
  "remotive.com",
  "wellfound.com",
  "angel.co",
  "builtin.com",
  "otta.com",
  "himalayas.app",
  "workingnomads.com",
  "talent.com",
  "jooble.org",
  "adzuna.com",
  "careerbuilder.com",
  "lensa.com",
  "joblist.com",
  "snagajob.com",
  "upwork.com",
  "freelancer.com",
  "jobright.ai",
  "kitjob.com",
  "startuphub.ai",
  "jobs-in.us",
  "jobgether.com",
  "jobicy.com",
  "arc.dev",
  "turing.com",
  "toptal.com",
  "crossover.com",
  // Other ATSs. Not aggregators, but not an employer's own domain either, and
  // we have no URL_PATTERNS entry to read a company off them.
  "applytojob.com",
  "jobs.workable.com",
  "bamboohr.com",
  "jobvite.com",
  "recruitee.com",
  "teamtailor.com",
  "breezy.hr",
  "medium.com",
  "substack.com",
  "reddit.com",
  "github.com",
  "ycombinator.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "google.com",
  "youtube.com",
  "wikipedia.org",
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

// Per (role, source) bucket, not per role. 12 roles x 8 buckets x 15 lands in
// the same ballpark as the old 12 x 50, but spread across boards instead of
// stacked on whichever one Exa ranks best.
const RESULTS_PER_BUCKET = 15;
// Exa surfaces postings over a year old. When it gives us a date we can act
// on it; past this the listing is almost certainly filled or pulled.
const MAX_AGE_DAYS = 60;
const SNIPPET_CHARS = 300;
const TEXT_CHARS = 2000;
// 15 jobs per request keeps each prompt small enough that the model stays
// accurate; 6 in flight keeps a ~450 job crawl inside maxDuration.
const ENRICH_BATCH = 15;
const ENRICH_CONCURRENCY = 6;

// [host regex, pathname regex, source label, where the company slug comes from].
// The capture group is the company slug, taken from the pathname unless the
// entry says "host". Anything that doesn't match is skipped, never guessed at.
const URL_PATTERNS = [
  [/^boards\.greenhouse\.io$/, /^\/([^/]+)\/jobs\/[^/]+/, "greenhouse"],
  [/^job-boards\.greenhouse\.io$/, /^\/([^/]+)\/jobs\/[^/]+/, "greenhouse"],
  [/^jobs\.lever\.co$/, /^\/([^/]+)\/[^/]+/, "lever"],
  [/^jobs\.ashbyhq\.com$/, /^\/([^/]+)\/[^/]+/, "ashby"],
  [/^apply\.workable\.com$/, /^\/([^/]+)\/j\/[^/]+/, "workable"],
  [/^jobs\.smartrecruiters\.com$/, /^\/([^/]+)\/[^/]+/, "smartrecruiters"],
  // Workday puts the employer in the subdomain. The path match only proves the
  // page is a posting rather than a board index or a search result.
  [/^([^.]+)\.wd\d+\.myworkdayjobs\.com$/, /\/job\/[^/]+/, "workday", "host"],
];

// Exa returns the page's og:image as `image`. On ATS pages that is often a
// wide social banner or the ATS's own branding, not the employer's mark.
// `extras.imageLinks` is the rest of the page, which is where Ashby puts
// org-theme-logo and Greenhouse puts /logos/. Only those three shapes are
// company logos. Rejected on purpose: ashby org-theme-social (wide banner),
// org-theme-wordmark (illegible at 40px), greenhouse job_board_configurations,
// and jobs.lever.co/img/* which is Lever's logo, not the employer's.
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

export function logoFromImages(urls) {
  for (const url of urls ?? []) {
    const href = typeof url === "string" ? url : url?.url;
    const logo = logoFromImage(href);
    if (logo) return logo;
  }
  return null;
}

// First allowlisted URL wins. og:image is checked first so a real logo there
// is kept, then the in-page links that Exa only returns when asked.
export function logoFromResult(result) {
  const extras = result?.extras?.imageLinks ?? [];
  return logoFromImages([result?.image, ...extras]);
}

function httpsUrlsFromHtml(html) {
  const normalized = String(html ?? "").replace(/\\\//g, "/");
  const found = normalized.match(/https:\/\/[^\s"'<>\\]+/g) ?? [];
  return [...new Set(found.map((u) => u.replace(/[),.;]+$/, "")))];
}

export function boardUrl(source, companySlug) {
  const slug = encodeURI(String(companySlug ?? "").trim());
  if (!slug) return null;
  if (source === "greenhouse") return `https://job-boards.greenhouse.io/${slug}`;
  if (source === "lever") return `https://jobs.lever.co/${slug}`;
  if (source === "ashby") return `https://jobs.ashbyhq.com/${slug}`;
  if (source === "workable") return `https://apply.workable.com/${slug}`;
  if (source === "smartrecruiters") return `https://jobs.smartrecruiters.com/${slug}`;
  // Workday board indexes are behind a tenant-specific path we can't derive,
  // and a company-site posting is already the company's own page. In both cases
  // logoForCompany falls back to the posting URL.
  return null;
}

const LOGO_FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; FitMyCV/1.0; +https://www.fitmycv.com)",
  Accept: "text/html",
};

export async function logoFromPage(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      headers: LOGO_FETCH_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return logoFromImages(httpsUrlsFromHtml(await res.text()));
  } catch {
    return null;
  }
}

// One company, a few URLs. The posting page first (Exa already proved it
// exists), then the board index, because some Greenhouse job pages are a
// client render with the logo only on the board.
export async function logoForCompany(job) {
  const urls = [job?.url, boardUrl(job?.source, job?.companySlug)];
  if (job?.source === "greenhouse" && job?.companySlug) {
    urls.push(`https://boards.greenhouse.io/${encodeURI(job.companySlug)}`);
  }
  const seen = new Set();
  for (const url of urls) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const logo = await logoFromPage(url);
    if (logo) return logo;
  }
  return null;
}

async function mapPool(items, n, fn) {
  const ret = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      ret[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) || 0 }, worker));
  return ret;
}

// Exa's og:image is a banner often enough that parseAtsResult leaves logo
// empty. One HTML fetch per company recovers the mark for every posting
// at that employer.
export async function fillMissingLogos(jobs) {
  const byCompany = new Map();
  for (const job of jobs ?? []) {
    if (job.logo || !job.companySlug) continue;
    const key = `${job.source}:${job.companySlug}`;
    if (!byCompany.has(key)) byCompany.set(key, job);
  }
  const logos = new Map();
  await mapPool([...byCompany.entries()], 6, async ([key, job]) => {
    const logo = await logoForCompany(job);
    if (logo) logos.set(key, logo);
  });
  let filled = 0;
  for (const job of jobs ?? []) {
    if (job.logo) continue;
    const logo = logos.get(`${job.source}:${job.companySlug}`);
    if (!logo) continue;
    job.logo = logo;
    filled++;
  }
  return { companies: byCompany.size, filled };
}

// Existing rows were crawled before we stored logos. Same fetch as the live
// crawl, keyed by employer so 12 Railway postings cost one request.
export async function backfillStoredLogos(Job, { limit = 200 } = {}) {
  const missing = await Job.find({ $or: [{ logo: null }, { logo: { $exists: false } }] })
    .select("url companySlug source")
    .lean();
  const byCompany = new Map();
  for (const job of missing) {
    if (!job.companySlug) continue;
    const key = `${job.source}:${job.companySlug}`;
    if (!byCompany.has(key)) byCompany.set(key, job);
  }
  const companies = [...byCompany.entries()].slice(0, limit);
  let updated = 0;
  await mapPool(companies, 6, async ([, job]) => {
    const logo = await logoForCompany(job);
    if (!logo) return;
    const result = await Job.updateMany(
      { source: job.source, companySlug: job.companySlug, $or: [{ logo: null }, { logo: { $exists: false } }] },
      { $set: { logo } }
    );
    updated += result.modifiedCount ?? 0;
  });
  return { missing: missing.length, companies: companies.length, updated };
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
  for (const [hostRe, pathRe, source, slugFrom] of URL_PATTERNS) {
    const hostMatch = hostRe.exec(host);
    if (!hostMatch) continue;
    const m = parsed.pathname.match(pathRe);
    if (!m) return null;
    const companySlug = decodeURIComponent(slugFrom === "host" ? hostMatch[1] : m[1]);
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

// Suffixes where the registrable name is the third label from the end, not the
// second. Not a full public suffix list, just the ones an employer plausibly
// sits on. A miss costs a slightly wrong company name, not a crash.
const MULTI_PART_TLDS = new Set([
  "co.uk",
  "org.uk",
  "ac.uk",
  "co.nz",
  "co.za",
  "com.au",
  "com.br",
  "co.jp",
  "co.in",
  "co.il",
  "com.mx",
  "co.kr",
]);

// "careers.cohere.com" → "cohere". The company-site equivalent of the ATS path
// slug: still a regex, still no inference.
export function domainLabel(hostname) {
  const parts = String(hostname ?? "")
    .toLowerCase()
    .replace(/^www\./, "")
    .split(".")
    .filter(Boolean);
  if (parts.length < 2) return "";
  const idx = MULTI_PART_TLDS.has(parts.slice(-2).join(".")) ? parts.length - 3 : parts.length - 2;
  const label = idx >= 0 ? parts[idx] : "";
  // A dedicated careers domain glues the word on: "capitalonecareers.com".
  // Leaving it in puts "Capitalonecareers" on the card.
  const trimmed = label.replace(/(?:careers?|jobs|hiring|talent)$/, "");
  return trimmed.length >= 3 ? trimmed : label;
}

// A posting lives under a careers/jobs path with something after it. A bare
// "/careers" is the index and "/blog/we-are-hiring" is an announcement. The
// tail can hold more than one segment ("/careers/job/software-engineer-844"),
// so capture all of it and judge the last one.
const POSTING_PATH = /\/(?:careers?|jobs?|openings?|positions?|opportunities|join-us|work-with-us)\/(.+)$/i;

// Segments that are still navigation, not a posting.
const GENERIC_SEGMENTS = new Set([
  "apply",
  "search",
  "all",
  "all-jobs",
  "list",
  "listings",
  "browse",
  "index",
  "remote",
  "remote-jobs",
  "openings",
  "open-positions",
  "job-openings",
  "current-openings",
  "vacancies",
  "positions",
  "jobs",
  "join",
  "teams",
  "departments",
  "locations",
  "life",
  "culture",
  "benefits",
  "students",
  "interns",
  "faq",
  "about",
  "overview",
  "engineering",
  "design",
  "product",
  "sales",
  "marketing",
]);

function hostMatchesAny(host, domains) {
  return domains.some((d) => host === d || host.endsWith(`.${d}`));
}

// Same contract as parseAtsUrl: the pieces the pool needs, or null. Used for
// postings on an employer's own domain, where there is no ATS slug to read.
//
// ponytail: a denylist, so a job board we have never seen reads as an employer
// until someone adds it. The ATS pass is an allowlist and has no such hole;
// this pass trades that for reach. Watch the pool for company names that are
// really aggregators and add them above. If it turns into weekly whack-a-mole,
// the upgrade is to verify the host actually looks like a company site
// (og:site_name, a homepage that isn't a job list) before trusting it.
export function parseCompanyUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  // ATS pages are pass 1's job; aggregators are the noise this page avoids.
  if (hostMatchesAny(host, ATS_HOSTS)) return null;
  if (hostMatchesAny(host, NON_EMPLOYER_HOSTS)) return null;
  const m = parsed.pathname.match(POSTING_PATH);
  if (!m) return null;
  const segments = m[1].split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const last = decodeURIComponent(segments[segments.length - 1]).toLowerCase();
  if (last.length < 4 || GENERIC_SEGMENTS.has(last)) return null;
  const companySlug = domainLabel(host);
  if (companySlug.length < 2) return null;
  const company = companyFromSlug(companySlug);
  if (!company) return null;
  return {
    url: `${parsed.origin}${parsed.pathname}`.replace(/\/$/, ""),
    companySlug,
    company,
    source: "company",
  };
}

// Matches the company however it's written in a title: "Acme Corp", "acme-corp",
// "acme_corp", "AcmeCorp".
function companyPattern(company, companySlug) {
  const words = String(companySlug || company)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(escapeRegex);
  if (words.length === 0) return null;
  // A single concatenated token ("capitalone", "unitedhealthgroup") still has to
  // match the spaced form a title uses ("Capital One"), or a free viewer reads
  // the employer we charge for. Domain-derived slugs are concatenated far more
  // often than ATS ones, so this is load-bearing for source "company".
  // Letters joined by optional separators, and only for tokens long enough that
  // the match can't be a coincidence.
  if (words.length === 1 && words[0].length >= 6) return words[0].split("").join("[-_\\s]*");
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
  // ATS first: a slug-derived company beats a domain-derived one, and every
  // ATS host is excluded from parseCompanyUrl anyway.
  const parsed = parseAtsUrl(result?.url) ?? parseCompanyUrl(result?.url);
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
    logo: logoFromResult(result),
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

async function exaSearch(body) {
  const res = await fetch(EXA_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`,
    },
    body: JSON.stringify({
      type: "auto",
      numResults: RESULTS_PER_BUCKET,
      contents: {
        text: { maxCharacters: TEXT_CHARS, includeHtmlTags: false },
        extras: { imageLinks: 8 },
      },
      ...body,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Exa ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  return json?.results ?? [];
}

// One host at a time. Pooling every host into a single query hands the mix to
// Exa's ranking, which is how the pool ended up leaning on one board.
function searchRoleOnHost(role, host) {
  return exaSearch({
    query: `remote ${role} job opening`,
    includeDomains: [host],
  });
}

// OFF. The pass works, but measured over 3 roles x 20 results it parsed 23
// distinct hosts and only ~9 were real employers. The rest were aggregators
// (remoterocketship, snaprecruit, jobera, wantremote, inclusivelyremote) and
// white-label boards on shared hosting (flexgen.zya.me, hirefromhome.yzz.me),
// which yield company names like "Zya" and "Yzz".
//
// Aggregators are the one thing /jobs promises not to have, so shipping this on
// would make the page's own copy false. The denylist cannot close it: every
// crawl surfaces new ones.
//
// Flip to true once a host is verified rather than assumed. The cheapest
// verification that would actually hold: one fetch per host per crawl (the
// shape fillMissingLogos already uses), rejecting any homepage that lists jobs
// from more than one employer.
const CRAWL_COMPANY_SITES = false;

// The employer's own careers page. No allowlist to search against, so the
// denylist does the filtering here and parseCompanyUrl checks the rest.
function searchRoleOnCompanySites(role) {
  return exaSearch({
    query: `remote ${role} job opening company careers page`,
    excludeDomains: [...ATS_HOSTS, ...NON_EMPLOYER_HOSTS],
  });
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

// A job posted on the employer's own site and mirrored on its ATS is one job
// with two URLs, and the unique index on `url` cannot see that. Key on company
// plus the company-stripped title instead, so "Senior Engineer at Cohere" and
// "Senior Engineer" collapse. The ATS row wins: its company comes from a URL
// slug and its logo from a known CDN, both firmer than a domain guess.
export function dedupeAcrossSources(jobs) {
  const byKey = new Map();
  for (const job of jobs ?? []) {
    const stripped = dropEmployerSuffix(
      stripCompanyFromTitle(job.title, job.company, job.companySlug)
    );
    const key = `${String(job.company).toLowerCase()}|${(stripped || job.title).toLowerCase()}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, job);
      continue;
    }
    if (existing.source === "company" && job.source !== "company") byKey.set(key, job);
  }
  return [...byKey.values()];
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

  // One search per (role, source bucket): every ATS host on its own, plus one
  // pass over employers' own career domains.
  const tasks = [];
  for (const role of ROLES) {
    for (const host of ATS_HOSTS) {
      tasks.push([`${role} @ ${host}`, () => searchRoleOnHost(role, host)]);
    }
    if (CRAWL_COMPANY_SITES) {
      tasks.push([`${role} @ company sites`, () => searchRoleOnCompanySites(role)]);
    }
  }

  // ponytail: concurrency 5, not Promise.all. Exa caps at 10 req/sec and firing
  // ~96 searches at once silently drops a bucket's jobs every crawl. Drop it if
  // Exa starts returning 429s.
  await mapPool(tasks, 5, async ([label, run]) => {
    try {
      for (const result of await run()) {
        seen++;
        const row = parseAtsResult(result);
        if (row) byUrl.set(row.url, row);
      }
    } catch (error) {
      errors.push(`${label}: ${error?.message ?? error}`);
    }
  });

  let jobs = dedupeAcrossSources([...byUrl.values()]);
  const crossSourceDupes = byUrl.size - jobs.length;

  errors.push(...(await enrichJobs(jobs)));

  // Enrichment can surface a publication date Exa didn't give us, so re-apply
  // the staleness cut now that more rows have a real date to judge.
  const before = jobs.length;
  jobs = jobs.filter(
    (j) => !j.postedAt || Date.now() - j.postedAt.getTime() <= MAX_AGE_DAYS * 864e5
  );
  const staleAfterEnrich = before - jobs.length;

  const logos = await fillMissingLogos(jobs);

  for (const j of jobs) delete j._text;

  return {
    jobs,
    seen,
    skipped: seen - jobs.length,
    crossSourceDupes,
    staleAfterEnrich,
    logos,
    errors,
  };
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
}
