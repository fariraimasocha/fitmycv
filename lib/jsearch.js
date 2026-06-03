const JSEARCH_BASE = "https://api.openwebninja.com/jsearch/search";

export async function searchJobs(query, { num_pages = 1, date_posted = "week", remote_jobs_only = false } = {}) {
  if (!process.env.JSEARCHAPI) {
    throw new Error("JSEARCHAPI env var is not set");
  }

  const params = new URLSearchParams({
    query,
    page: "1",
    num_pages: String(num_pages),
    date_posted,
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
