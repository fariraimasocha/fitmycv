// Rule-based CV checks, ported from Reactive Resume's ATS engine
// (packages/resume/src/ats and ats-pdf/score.ts). Pure functions over our CV
// JSON, so the editor runs them live and the API runs the same code.
//
// There is no model in here. Every finding has a code, and the score is
// arithmetic a person can redo by hand. The AI review in /api/ats-review
// comments on the writing and never produces a number.
//
// Paths are react-hook-form paths ("work.2.startDate") so the editor can focus
// the field a finding points at.

export const CATEGORIES = {
  contact: { label: "Contact details", weight: 30, description: "Whether a recruiter can reach you." },
  sections: {
    label: "Sections",
    weight: 35,
    description: "Whether your CV has the sections software expects to find.",
  },
  dates: { label: "Dates", weight: 35, description: "Whether your timeline can be reconstructed." },
  // Tips live here. They are shown beside the score and never counted in it.
  content: {
    label: "Writing",
    weight: 0,
    description: "Advice for the person reading it. None of this affects the score.",
  },
};

/** What a blocker costs its own category, on top of the ceiling it puts on the total. */
const BLOCKER_PENALTY = 60;

export const CATALOG = {
  MISSING_NAME: {
    category: "contact",
    severity: "blocker",
    cap: 40,
    title: "Your CV has no name.",
    action: "Add your full name under Personal Information.",
  },
  MISSING_EMAIL: {
    category: "contact",
    severity: "blocker",
    cap: 60,
    title: "Your CV has no email address.",
    action: "Add an email address so recruiters can reach you.",
  },
  MALFORMED_EMAIL: {
    category: "contact",
    severity: "warning",
    deduction: 40,
    title: "This email address is not in a standard form.",
    action: "Use a plain address such as name@example.com, with no extra text.",
  },
  MISSING_PHONE: {
    category: "contact",
    severity: "warning",
    deduction: 20,
    title: "Your CV has no phone number.",
    action: "Add one with its country code. Some application forms ask for it.",
  },
  MISSING_LOCATION: {
    category: "contact",
    severity: "warning",
    deduction: 10,
    title: "Your CV has no location.",
    action: "Add at least a city and country.",
  },
  MALFORMED_URL: {
    category: "contact",
    severity: "warning",
    deduction: 15,
    title: "This link is missing https://.",
    action: "Write the full address, including https://.",
  },

  NO_EXPERIENCE: {
    category: "sections",
    severity: "blocker",
    cap: 50,
    title: "Your CV shows no work experience.",
    action: "Add a position, or use projects and volunteer work to show similar history.",
  },
  MISSING_DESCRIPTION: {
    category: "sections",
    severity: "warning",
    deduction: 25,
    title: "This position has no description.",
    action: "Describe what you did. An empty role adds no keywords for matching.",
  },
  NO_SKILLS: {
    category: "sections",
    severity: "warning",
    deduction: 25,
    title: "Your CV lists no skills.",
    action: "Add the tools and methods you use.",
  },
  NO_EDUCATION: {
    category: "sections",
    severity: "warning",
    deduction: 15,
    title: "Your CV has no education.",
    action: "Add where you studied, or a relevant course or certificate.",
  },
  NO_SUMMARY: {
    category: "sections",
    severity: "warning",
    deduction: 10,
    title: "Your CV has no summary.",
    action: "Add two or three lines at the top describing what you do.",
  },

  MISSING_DATES: {
    category: "dates",
    severity: "warning",
    deduction: 25,
    title: "This entry has no start date.",
    action: "Add a date such as Mar 2022 so it lands on your timeline.",
  },
  MISSING_END_DATE: {
    category: "dates",
    severity: "warning",
    deduction: 15,
    title: "This position has no end date.",
    action: "Write Present if you still work here, or add the month you left.",
  },
  UNPARSEABLE_DATE: {
    category: "dates",
    severity: "warning",
    deduction: 25,
    title: "This date is written in a form software may not read.",
    action: "Use a form such as Mar 2022, 2022-03 or 2022.",
  },
  REVERSED_PERIOD: {
    category: "dates",
    severity: "warning",
    deduction: 30,
    title: "This entry ends before it starts.",
    action: "Swap the start and end dates.",
  },
  FUTURE_DATE: {
    category: "dates",
    severity: "warning",
    deduction: 20,
    title: "This date is in the future.",
    action: "Correct the year, or write Present for ongoing work.",
  },
  MIXED_DATE_FORMATS: {
    category: "dates",
    severity: "warning",
    deduction: 10,
    title: "Your work dates are written in different ways.",
    action: "Pick one format and use it for every position.",
  },

  NO_QUANTIFIED_IMPACT: {
    category: "content",
    severity: "tip",
    title: "Few of your bullets include a number.",
    action: "Add figures where you have them: volumes, percentages, time frames, team sizes.",
  },
  WEAK_OPENERS: {
    category: "content",
    severity: "tip",
    title: "Many bullets open with filler such as \"Responsible for\".",
    action: "Start each one with what you did: built, led, reduced, migrated.",
  },
  FIRST_PERSON_PRONOUNS: {
    category: "content",
    severity: "tip",
    title: "Your CV uses \"I\" and \"my\".",
    action: "Drop the pronouns and start from the verb.",
  },
  LONG_BULLETS: {
    category: "content",
    severity: "tip",
    title: "Some bullets run long.",
    action: "Keep each one to about two lines.",
  },
  EMPLOYMENT_GAP: {
    category: "content",
    severity: "tip",
    title: "There is a gap of more than six months between two positions.",
    action: "A gap is fine. Add a short line about it only if you want to.",
  },
};

const SCORED_CODES = Object.keys(CATALOG).filter((code) => CATALOG[code].severity !== "tip");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FILLER_OPENER = /^(responsible|worked|helped|assisted|involved|participated|tasked|duties|in charge|various)\b/i;
const PRONOUNS = /\b(I|[Mm]y|[Mm]e|[Mm]yself)\b/g;
const PRESENT = /^(present|current|now|ongoing|today)$/i;
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const MIN_BULLETS_FOR_ADVICE = 4;
const QUANTIFIED_SHARE = 0.2;
const FILLER_SHARE = 0.25;
const LONG_BULLET_CHARS = 220;
const MAX_PRONOUNS = 2;
const GAP_MONTHS = 6;

const text = (value) => (typeof value === "string" ? value.trim() : "");

export function bulletsOf(description) {
  return text(description)
    .split(/\n+/)
    .map((line) => line.replace(/^[\s•·▪*\-–—]+/, "").trim())
    .filter(Boolean);
}

function isWebUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function monthRange(year, month, shape) {
  if (month < 1 || month > 12 || year < 1950 || year > 2100) return null;
  const at = year * 12 + month - 1;
  return { shape, lo: at, hi: at };
}

/**
 * Reads a CV date as a range of month indexes (year * 12 + month), so "2020"
 * covers Jan to Dec 2020. Returns { present: true } for "Present", null when
 * the value is not a form we recognise.
 */
export function parseCvDate(raw) {
  const value = text(raw).toLowerCase();
  if (PRESENT.test(value)) return { shape: "present", present: true };

  let m;
  if ((m = value.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/))) return monthRange(+m[1], +m[2], "numeric");
  if ((m = value.match(/^(\d{1,2})[/.](\d{4})$/))) return monthRange(+m[2], +m[1], "slash");
  if ((m = value.match(/^([a-z]{3,9})\.?,?\s+(\d{4})$/))) {
    const index = MONTHS.indexOf(m[1].slice(0, 3));
    return index === -1 ? null : monthRange(+m[2], index + 1, "name");
  }
  if ((m = value.match(/^(\d{4})$/))) {
    const range = monthRange(+m[1], 1, "year");
    return range && { ...range, hi: range.lo + 11 };
  }
  return null;
}

const isBlankWork = (w) => !text(w?.company) && !text(w?.position) && !text(w?.description);
const isBlankEducation = (e) => !text(e?.institution) && !text(e?.degree) && !text(e?.fieldOfStudy);

function contactRules(cv, out) {
  const b = cv.basics || {};
  if (!text(b.name)) out.push({ code: "MISSING_NAME", path: "basics.name" });

  const email = text(b.email);
  if (!email) out.push({ code: "MISSING_EMAIL", path: "basics.email" });
  else if (!EMAIL.test(email)) out.push({ code: "MALFORMED_EMAIL", path: "basics.email", value: email });

  if (!text(b.phone)) out.push({ code: "MISSING_PHONE", path: "basics.phone" });
  if (!text(b.location)) out.push({ code: "MISSING_LOCATION", path: "basics.location" });

  (b.profiles || []).forEach((profile, i) => {
    const url = text(profile?.url);
    if (url && !isWebUrl(url)) out.push({ code: "MALFORMED_URL", path: `basics.profiles.${i}.url`, value: url });
  });
}

function sectionRules(cv, out) {
  const work = cv.work || [];
  if (work.every(isBlankWork)) out.push({ code: "NO_EXPERIENCE", path: "work" });

  work.forEach((w, i) => {
    if (!isBlankWork(w) && bulletsOf(w.description).length === 0) {
      out.push({ code: "MISSING_DESCRIPTION", path: `work.${i}.description` });
    }
  });

  const skillCount = (cv.skills || []).reduce(
    (n, group) => n + (group?.skills || group?.keywords || []).filter((s) => text(s)).length,
    0,
  );
  if (skillCount === 0) out.push({ code: "NO_SKILLS", path: "skills" });
  if ((cv.education || []).every(isBlankEducation)) out.push({ code: "NO_EDUCATION", path: "education" });
  if (!text(cv.basics?.summary)) out.push({ code: "NO_SUMMARY", path: "basics.summary" });
}

/** Checks one entry's dates and returns its period for the gap check, or null. */
function entryDates(entry, base, kind, nowIndex, out) {
  const start = text(entry.startDate);
  const end = text(entry.endDate);
  const s = start ? parseCvDate(start) : null;
  const e = end ? parseCvDate(end) : null;

  // Education often carries only a graduation year, so it needs one date, not two.
  if (!start && (kind === "work" || !end)) out.push({ code: "MISSING_DATES", path: `${base}.startDate` });
  if (start && (!s || s.present)) out.push({ code: "UNPARSEABLE_DATE", path: `${base}.startDate`, value: start });
  if (end && !e) out.push({ code: "UNPARSEABLE_DATE", path: `${base}.endDate`, value: end });
  if (kind === "work" && !end) out.push({ code: "MISSING_END_DATE", path: `${base}.endDate` });

  const startOk = s && !s.present;
  const endOk = e && !e.present;
  if (startOk && endOk && e.hi < s.lo) out.push({ code: "REVERSED_PERIOD", path: `${base}.endDate` });
  if (startOk && s.lo > nowIndex) out.push({ code: "FUTURE_DATE", path: `${base}.startDate`, value: start });
  // A future graduation date is normal; a future end to a job is not.
  if (kind === "work" && endOk && e.lo > nowIndex) out.push({ code: "FUTURE_DATE", path: `${base}.endDate`, value: end });

  if (!startOk || (!e?.present && !endOk)) return null;
  return { lo: s.lo, hi: e.present ? nowIndex : e.hi };
}

function dateRules(cv, nowIndex, out) {
  const periods = [];
  const shapes = new Map();

  (cv.work || []).forEach((w, i) => {
    if (isBlankWork(w)) return;
    periods.push(entryDates(w, `work.${i}`, "work", nowIndex, out));
    for (const raw of [w.startDate, w.endDate]) {
      const shape = parseCvDate(raw)?.shape;
      if (shape && shape !== "present") shapes.set(shape, (shapes.get(shape) || 0) + 1);
    }
  });

  (cv.education || []).forEach((e, i) => {
    if (!isBlankEducation(e)) entryDates(e, `education.${i}`, "education", nowIndex, out);
  });

  // ponytail: work dates only. Year-only education beside YYYY-MM work dates is normal.
  if ([...shapes.values()].filter((count) => count >= 2).length >= 2) {
    out.push({ code: "MIXED_DATE_FORMATS", path: "work" });
  }

  return periods;
}

function contentRules(cv, periods, out) {
  const work = cv.work || [];
  const bullets = work.flatMap((w) => bulletsOf(w?.description));

  if (bullets.length >= MIN_BULLETS_FOR_ADVICE) {
    const share = (test) => bullets.filter(test).length / bullets.length;
    if (share((b) => /\d/.test(b)) < QUANTIFIED_SHARE) out.push({ code: "NO_QUANTIFIED_IMPACT", path: "work" });
    if (share((b) => FILLER_OPENER.test(b)) >= FILLER_SHARE) out.push({ code: "WEAK_OPENERS", path: "work" });
  }

  const longAt = work.findIndex((w) => bulletsOf(w?.description).some((b) => b.length > LONG_BULLET_CHARS));
  if (longAt !== -1) out.push({ code: "LONG_BULLETS", path: `work.${longAt}.description` });

  const prose = [cv.basics?.summary, ...work.map((w) => w?.description)].map(text).join("\n");
  if ((prose.match(PRONOUNS) || []).length > MAX_PRONOUNS) {
    out.push({ code: "FIRST_PERSON_PRONOUNS", path: "basics.summary" });
  }

  // Only when every position has a readable period: a guessed gap is worse than none.
  if (periods.length >= 2 && periods.every(Boolean)) {
    const order = periods.map((p, i) => ({ ...p, i })).sort((a, b) => a.lo - b.lo);
    let coveredUntil = order[0].hi;
    for (const period of order.slice(1)) {
      if (period.lo - coveredUntil > GAP_MONTHS) {
        const workIndex = work.findIndex((w, j) => !isBlankWork(w) && work.slice(0, j + 1).filter((x) => !isBlankWork(x)).length - 1 === period.i);
        out.push({ code: "EMPLOYMENT_GAP", path: `work.${workIndex}.startDate` });
        break;
      }
      coveredUntil = Math.max(coveredUntil, period.hi);
    }
  }
}

/** Every finding for a CV, in field order. `now` is a timestamp, passed in so render stays pure. */
export function runRules(cv, now) {
  const date = new Date(now);
  const nowIndex = date.getFullYear() * 12 + date.getMonth();
  const out = [];
  contactRules(cv || {}, out);
  sectionRules(cv || {}, out);
  const periods = dateRules(cv || {}, nowIndex, out);
  contentRules(cv || {}, periods, out);
  return out.map((finding) => ({ ...CATALOG[finding.code], ...finding }));
}

/**
 * Turns findings into a score. Ported from ats-pdf/score.ts: a warning is
 * charged once per code however often it fires, a blocker takes a large bite
 * out of its category and caps the total, and tips count nowhere.
 */
export function scoreCv(findings) {
  const scored = findings.filter((f) => CATALOG[f.code].severity !== "tip");
  const failedCodes = [...new Set(scored.map((f) => f.code))];

  const categories = Object.entries(CATEGORIES)
    .filter(([, c]) => c.weight > 0)
    .map(([key, { label, weight }]) => {
      const codes = failedCodes.filter((code) => CATALOG[code].category === key);
      const penalty = codes.reduce(
        (sum, code) => sum + (CATALOG[code].severity === "blocker" ? BLOCKER_PENALTY : CATALOG[code].deduction),
        0,
      );
      const checks = SCORED_CODES.filter((code) => CATALOG[code].category === key).length;
      return {
        key,
        label,
        weight,
        score: Math.max(0, 100 - penalty),
        failed: codes.length,
        totalChecks: checks,
        passedChecks: checks - codes.length,
      };
    });

  const weighted = Math.round(categories.reduce((sum, c) => sum + c.score * c.weight, 0) / 100);
  const cappedBy = failedCodes.filter((code) => CATALOG[code].severity === "blocker");
  const ceiling = Math.min(100, ...cappedBy.map((code) => CATALOG[code].cap));

  return {
    score: Math.min(weighted, ceiling),
    categories,
    cappedBy,
    totalChecks: SCORED_CODES.length,
    passedChecks: SCORED_CODES.length - failedCodes.length,
  };
}

export function checkCv(cv, now) {
  const findings = runRules(cv, now);
  return { findings, ...scoreCv(findings) };
}

/** The CV as plain text, for keyword matching and the AI review. */
export function cvToText(cv = {}) {
  const b = cv.basics || {};
  const lines = [b.name, b.label, [b.email, b.phone, b.location].filter(Boolean).join(" | "), "", "Summary", b.summary, "", "Experience"];
  for (const w of cv.work || []) {
    lines.push(`${w.position || ""} at ${w.company || ""} (${w.startDate || ""} to ${w.endDate || ""})`);
    lines.push(...bulletsOf(w.description).map((bullet) => `- ${bullet}`));
  }
  lines.push("", "Education");
  for (const e of cv.education || []) {
    lines.push(`${[e.degree, e.fieldOfStudy].filter(Boolean).join(", ")}, ${e.institution || ""} (${e.startDate || ""} to ${e.endDate || ""})`);
  }
  lines.push("", "Skills");
  for (const s of cv.skills || []) lines.push(`${s.category || s.name || ""}: ${(s.skills || s.keywords || []).join(", ")}`);
  return lines.filter((line) => typeof line === "string").join("\n");
}

/** A scraped posting as text, with requirement headings the keyword matcher weighs up. */
export function jobToText(job = {}) {
  const list = (heading, items) => (items?.length ? `${heading}\n${items.map((item) => `- ${item}`).join("\n")}` : "");
  return [
    [job.title, job.company].filter(Boolean).join(" at "),
    list("Responsibilities", job.responsibilities),
    list("Requirements", job.requirements),
    list("Qualifications", job.qualifications),
    list("Requirements", job.keywords),
  ]
    .filter(Boolean)
    .join("\n\n");
}
