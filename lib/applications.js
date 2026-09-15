// Pipeline stages, input cleaning, and the numbers behind the Applications
// Insights view. Insights are ported from Reactive Resume's
// features/applications/insights.ts. Pure, and shared by the API routes, the
// board, the table and the insights view.

// Stored keys predate the rename, so "evaluated" shows as Saved and
// "interviewing" as Interview. Relabelling avoids a data migration. Colors are
// Reactive Resume's stage colors.
export const STAGES = [
  { key: "evaluated", label: "Saved", color: "oklch(0.62 0 0)" },
  { key: "applied", label: "Applied", color: "oklch(0.52 0.19 285)" },
  { key: "screening", label: "Screening", color: "oklch(0.45 0.08 195)" },
  { key: "interviewing", label: "Interview", color: "oklch(0.5 0.1 70)" },
  { key: "offer", label: "Offer", color: "oklch(0.55 0.15 152)" },
  { key: "rejected", label: "Rejected", color: "oklch(0.63 0.12 22)" },
  { key: "withdrawn", label: "Withdrawn", color: "oklch(0.72 0 0)" },
];

export const STAGE_BY_KEY = Object.fromEntries(STAGES.map((s) => [s.key, s]));
export const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.key, s.label]));

// Deterministic initials tile color, so a company reads the same on the board
// and in the table. Ported from tile-color.ts.
const TILE_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-fuchsia-500",
];

export function tileColor(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return TILE_COLORS[Math.abs(hash) % TILE_COLORS.length];
}

export function initials(name = "") {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return letters.toUpperCase() || "?";
}

const TEXT_LIMITS = {
  jobTitle: 200,
  jobCompany: 200,
  jobUrl: 2000,
  location: 200,
  salary: 100,
  source: 100,
  jobDescription: 20000,
  notes: 10000,
  followUpNote: 500,
};

const clip = (value, max) => String(value ?? "").trim().slice(0, max);

/** The fields a user may set on an application, trimmed and capped. Anything else is dropped. */
export function pickApplicationFields(body = {}) {
  const out = {};
  for (const [field, max] of Object.entries(TEXT_LIMITS)) {
    if (typeof body[field] === "string") out[field] = clip(body[field], max);
  }
  // Rendered as a link, so anything but http(s) is refused.
  if (out.jobUrl && !/^https?:\/\//i.test(out.jobUrl)) out.jobUrl = "";

  if (Array.isArray(body.tags)) {
    out.tags = [...new Set(body.tags.map((tag) => clip(tag, 40)).filter(Boolean))].slice(0, 10);
  }
  if (Array.isArray(body.contacts)) {
    out.contacts = body.contacts
      .map((c) => ({
        name: clip(c?.name, 100),
        role: clip(c?.role, 100),
        kind: clip(c?.kind, 50),
        email: clip(c?.email, 200),
        phone: clip(c?.phone, 50),
      }))
      .filter((c) => c.name)
      .slice(0, 20);
  }
  if (typeof body.archived === "boolean") out.archived = body.archived;
  return out;
}

/** The forward pipeline. Rejected and withdrawn are outcomes, not steps. */
const FORWARD = ["evaluated", "applied", "screening", "interviewing", "offer"];

/**
 * How far an application got, as an index into FORWARD. Reads the history,
 * not just the current status, so an application rejected after an interview
 * still counts as having reached the interview.
 */
function furthestStage(app) {
  const stages = [
    app.status,
    ...(app.statusHistory || []).filter((e) => (e.kind ?? "stage") === "stage").map((e) => e.status),
  ];
  return Math.max(0, ...stages.map((s) => FORWARD.indexOf(s)));
}

const percent = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

export function computeInsights(applications) {
  const total = applications.length;
  const furthest = applications.map(furthestStage);
  const reached = FORWARD.map((_, i) => furthest.filter((f) => f >= i).length);
  const count = (status) => applications.filter((a) => a.status === status).length;

  const funnel = FORWARD.map((key, i) => ({
    key,
    label: STAGE_LABEL[key],
    color: STAGE_BY_KEY[key].color,
    count: count(key),
    reached: reached[i],
    share: percent(reached[i], total),
    conversion: i === 0 ? null : reached[i - 1] > 0 ? percent(reached[i], reached[i - 1]) : null,
  }));

  return {
    total,
    applied: reached[1],
    // Past "applied" means someone on the other side responded.
    responseRate: percent(reached[2], reached[1]),
    interviews: reached[3],
    offers: count("offer"),
    rejected: count("rejected"),
    funnel,
  };
}

/**
 * Counts dates into the last `weeks` calendar weeks, Sunday first, oldest to
 * newest. `now` is passed in so callers can keep render pure.
 */
export function computeTimeline(dates, now, weeks = 8) {
  const thisWeek = new Date(now);
  thisWeek.setHours(0, 0, 0, 0);
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());

  // setDate rather than adding milliseconds, so daylight saving never shifts a label.
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const start = new Date(thisWeek);
    start.setDate(thisWeek.getDate() - (weeks - 1 - i) * 7);
    return {
      start: start.getTime(),
      label: `${start.getMonth() + 1}/${start.getDate()}`,
      count: 0,
    };
  });

  for (const date of dates) {
    const time = new Date(date).getTime();
    if (Number.isNaN(time) || time < buckets[0].start) continue;
    const bucket = buckets.findLast((b) => b.start <= time);
    if (bucket) bucket.count += 1;
  }

  return buckets.map(({ label, count }) => ({ label, count }));
}
