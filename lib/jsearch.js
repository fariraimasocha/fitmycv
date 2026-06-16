const JSEARCH_BASE = "https://api.openwebninja.com/jsearch/search";

export async function searchJobs(query, { num_pages = 1, date_posted = "week", remote_jobs_only = false, country = "us" } = {}) {
  if (!process.env.JSEARCHAPI) {
    throw new Error("JSEARCHAPI env var is not set");
  }

  const params = new URLSearchParams({
    query,
    page: "1",
    num_pages: String(num_pages),
    date_posted,
    country, // JSearch defaults to "us" — without this every result is US-based
  });

  if (remote_jobs_only) params.set("remote_jobs_only", "true");

  const res = await fetch(`${JSEARCH_BASE}?${params}`, {
    headers: { "x-api-key": process.env.JSEARCHAPI },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`JSearch API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  if (json.status !== "OK") {
    throw new Error(`JSearch returned status: ${json.status}`);
  }

  return (json.data ?? []).map((j) => ({
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    logo: j.employer_logo ?? null,
    applyLink: j.job_apply_link,
    city: j.job_city ?? null,
    state: j.job_state ?? null,
    country: j.job_country ?? "US",
    isRemote: j.job_is_remote ?? false,
    employmentType: j.job_employment_type ?? null,
    postedAt: j.job_posted_at_datetime_utc ?? null,
    salary: j.job_salary_string ?? null,
    highlights: j.job_highlights ?? {},
  }));
}

export function buildQueriesFromCV(cv) {
  if (cv?.work?.length > 0) {
    const seen = new Set();
    const positions = [];
    for (const w of cv.work.slice(0, 2)) {
      if (!w.position) continue;
      const key = w.position.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      positions.push(w.position.trim());
    }
    if (positions.length > 0) return positions;
  }

  if (cv?.skills?.length > 0) {
    const topSkill = cv.skills[0]?.skills?.[0];
    if (topSkill) return [`${topSkill} developer`];
  }

  return [];
}

// Prefer the user's explicit target titles; fall back to CV-derived queries.
export function buildQueries(cv, prefs) {
  const titles = (prefs?.titles ?? []).map((t) => t.trim()).filter(Boolean);
  if (titles.length > 0) return titles;
  return buildQueriesFromCV(cv);
}

const STOP = new Set([
  "and", "the", "for", "with", "you", "your", "our", "job", "role", "work",
  "team", "etc", "will", "are", "have", "this", "that", "from", "who",
]);

function tokens(str) {
  return String(str ?? "")
    .toLowerCase()
    .split(/[^a-z0-9+#]+/) // keep + and # for c++/c#; everything else splits
    .filter((t) => t.length >= 2 && !STOP.has(t));
}

function cvKeywords(cv) {
  const words = [];
  for (const cat of cv?.skills ?? []) {
    for (const s of cat?.skills ?? []) words.push(...tokens(s));
  }
  for (const w of cv?.work ?? []) {
    if (w?.position) words.push(...tokens(w.position));
  }
  return new Set(words);
}

// ponytail: heuristic rank — counts CV skill/title tokens that appear in the
// job's title + highlights. Cheap enough to run over every premium user's jobs.
// Swap for embeddings/LLM if match quality ever complains.
export function scoreJob(cv, job) {
  const keywords = cvKeywords(cv);
  if (keywords.size === 0) return 0;
  const hay = new Set([
    ...tokens(job?.title),
    ...Object.values(job?.highlights ?? {})
      .flat()
      .flatMap(tokens),
  ]);
  let score = 0;
  for (const k of keywords) if (hay.has(k)) score++;
  return score;
}

// Self-check: run a `.mjs` copy of this file directly (see plan verification).
if (process.argv[1] && process.argv[1].endsWith("jsearch.mjs")) {
  const assert = (c, m) => {
    if (!c) {
      console.error("FAIL:", m);
      process.exit(1);
    }
  };
  const cv = {
    skills: [{ skills: ["React", "Node.js"] }],
    work: [{ position: "Software Engineer" }],
  };
  const good = {
    title: "React Node Engineer",
    highlights: { Qualifications: ["Strong React and Node experience"] },
  };
  const bad = {
    title: "Senior Accountant",
    highlights: { Qualifications: ["Manage ledgers and audits"] },
  };
  assert(scoreJob(cv, good) > scoreJob(cv, bad), "matched job should outrank unrelated job");
  assert(scoreJob(cv, good) >= 2, "expected react+node+engineer overlap");
  assert(scoreJob({}, good) === 0, "empty CV scores zero");
  assert(buildQueries(cv, { titles: ["Backend Engineer"] })[0] === "Backend Engineer", "prefs titles win");
  assert(buildQueries(cv, {})[0] === "Software Engineer", "falls back to CV query");
  console.log("jsearch self-check OK");
}
