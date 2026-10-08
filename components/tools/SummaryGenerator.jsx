"use client";

// Client-side professional summary generator used by
// /professional-summary-generator.
//
// ponytail: runs entirely in the browser, the same as the headline generator.
// No API route, no model call, no storage. It fills the formula from the
// summary guide (title and level, domain and years, one result with a number)
// with the posting's role title, the skills both documents share, and a real
// line from the CV that carries a number. The upgrade path, when a summary
// needs real rewriting, is the signed-in tailoring flow.
//
// The helpers between the two marker comments are copied from
// HeadlineGenerator.jsx rather than imported, matching BulletRewriter. Move
// them to lib/ if a fourth tool needs them. Checked by scripts/check-tools.mjs.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  SparkleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import ResumeFileField from "@/components/tools/ResumeFileField";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff } from "@/lib/ats-handoff";
import { trackEvent } from "@/lib/analytics";

// pure-helpers:start

// Words that carry no signal when matching a CV against a posting. The second
// block is job-advert boilerplate. Without it the top of the list fills up with
// "strong experience", "essential", and "responsibilities".
const STOP_WORDS = new Set(
  `a about above after again against all also am an and any are as at be because been before being below between both but by can cannot could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves

   ability able across additional advantage apply applicant applicants bonus build built candidate candidates career company culture description desirable duties employment ensure ensuring environment essential etc excellent experience familiar familiarity fast focus following friendly get getting good great growing help including involved job join key like looking love make making must need needs new nice offer opportunity part passionate people plus position preferred proven provide ran range required requirement requirements responsibilities responsibility role roles run running skill skills strong take team teams understanding using want well work working world would years`
    .split(/\s+/)
    .filter(Boolean)
);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^[-./]+|[-./]+$/g, ""))
    .filter((word) => word.length > 1);
}

/**
 * Crude suffix stripping so "mentored" matches "mentor" and "services" matches
 * "service". Not a real stemmer. It only needs to stop obvious inflections from
 * being reported as missing.
 */
function stem(word) {
  if (word.length <= 4) return word;
  for (const suffix of ["ing", "ies", "ed", "es", "s"]) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      const base = word.slice(0, -suffix.length);
      return suffix === "ies" ? `${base}y` : base;
    }
  }
  return word;
}

const isContent = (word) => word && !STOP_WORDS.has(word);

/**
 * Ranks the terms a posting leans on. Unigrams score by frequency; bigrams are
 * only admitted when the exact phrase recurs, which keeps real compounds
 * ("design systems", "incident response") and drops one-off prose fragments.
 */
function extractTerms(text, limit) {
  const tokens = tokenize(text);
  const unigrams = new Map();
  const bigrams = new Map();

  tokens.forEach((token, i) => {
    if (isContent(token)) unigrams.set(token, (unigrams.get(token) || 0) + 1);

    const next = tokens[i + 1];
    if (!isContent(token) || !isContent(next)) return;
    const phrase = `${token} ${next}`;
    bigrams.set(phrase, (bigrams.get(phrase) || 0) + 1);
  });

  const scored = [
    ...[...bigrams.entries()]
      .filter(([, count]) => count >= 2)
      .map(([term, count]) => ({
        term,
        count,
        score: count * 1.8,
        words: term.split(" "),
      })),
    ...[...unigrams.entries()].map(([term, count]) => ({
      term,
      count,
      score: count,
      words: [term],
    })),
  ].sort((a, b) => b.score - a.score);

  // A unigram already carried by a higher-ranked phrase adds nothing.
  const kept = [];
  for (const item of scored) {
    const covered =
      item.words.length === 1 &&
      kept.some((other) => other.words.length > 1 && other.words.includes(item.term));
    if (!covered) kept.push(item);
    if (kept.length >= limit) break;
  }
  return kept;
}

// Seniority words a posting puts in front of the role noun. "head" and "vice"
// are handled as the start of "head of" and "vice president".
const SENIORITY_WORDS = new Set(
  `junior associate senior staff principal lead head director manager chief vp graduate trainee intern apprentice deputy`.split(
    " "
  )
);

// The nouns a job title ends on. Stemmed on both sides, so "Engineers" and
// "Analysts" match too.
const ROLE_NOUNS = new Set(
  `engineer developer designer analyst manager scientist consultant specialist coordinator accountant nurse teacher marketer architect administrator technician researcher strategist writer editor recruiter controller planner buyer therapist pharmacist paralegal officer assistant director lead supervisor representative advisor auditor bookkeeper chef driver electrician surveyor programmer tester copywriter producer trader underwriter actuary dietitian midwife physiotherapist solicitor barrister lawyer economist statistician cashier salesperson technologist practitioner`
    .split(" ")
    .map(stem)
);

// Small words that sit inside a title without breaking it.
const TITLE_CONNECTORS = new Set(["of", "and", "for", "in"]);

// Capitalised words that start a heading rather than a title. A run that hits
// one of these restarts after it, so "About The Role Senior Analyst" still
// yields "Senior Analyst".
const NON_TITLE_WORDS = new Set(
  `about apply applying we our you your the this that job jobs role roles position description overview summary company team what who why how requirements responsibilities benefits salary location remote hybrid onsite full part time contract permanent department reports duties qualifications experience skills must nice essential desirable please note candidate candidates title`.split(
    " "
  )
);

const DOMAIN_TERMS = [
  "fintech",
  "healthcare",
  "saas",
  "ecommerce",
  "e-commerce",
  "b2b",
  "b2c",
  "enterprise",
  "marketplace",
  "logistics",
  "insurance",
  "banking",
  "payments",
  "retail",
  "education",
  "gaming",
  "media",
  "nonprofit",
  "government",
  "telecoms",
  "manufacturing",
  "cybersecurity",
  "biotech",
  "pharma",
  "energy",
  "travel",
  "hospitality",
  "automotive",
  "aerospace",
  "legal",
  "advertising",
  "recruitment",
  "construction",
  "agriculture",
  "public sector",
  "financial services",
  "real estate",
  "supply chain",
];

function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Capitalises each word, keeping any word that already carries inner capitals. */
function titleCase(value) {
  return value
    .split(" ")
    .map((word) => {
      if (/[A-Z]/.test(word.slice(1))) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Returns the way a term is actually written in the source text, so "sql"
 * comes back as "SQL" and "figma" as "Figma". Falls back to the term as given.
 */
function preferredCasing(term, text) {
  const pattern = new RegExp(
    `(?:^|[^A-Za-z0-9])(${escapeForRegExp(term)})(?![A-Za-z0-9])`,
    "gi"
  );
  const variants = new Map();
  for (const match of text.matchAll(pattern)) {
    variants.set(match[1], (variants.get(match[1]) || 0) + 1);
  }
  let best = null;
  let bestCount = 0;
  for (const [variant, count] of variants) {
    if (count > bestCount) {
      best = variant;
      bestCount = count;
    }
  }
  // A summary is a sentence, not a headline: keep the source's own casing so
  // "dashboards" stays lowercase and "Tableau" keeps its capital.
  if (best) return best;
  return term;
}

/** Trims a capitalised word run down to the title that ends it. */
function runToTitle(run) {
  let end = -1;
  for (let i = run.length - 1; i >= 0; i -= 1) {
    if (ROLE_NOUNS.has(stem(run[i].toLowerCase()))) {
      end = i;
      break;
    }
  }
  if (end === -1) return null;

  let start = Math.max(0, end - 3);
  for (let i = end; i >= start; i -= 1) {
    const word = run[i].toLowerCase();
    if (i !== end && NON_TITLE_WORDS.has(word)) {
      start = i + 1;
      break;
    }
  }
  while (start < end && TITLE_CONNECTORS.has(run[start].toLowerCase())) start += 1;

  const words = run.slice(start, end + 1);
  if (!words.length || words.length > 5) return null;
  return words.join(" ");
}

/**
 * Pulls the role title out of a document. Postings state it near the top and
 * repeat it, so the most frequent title-shaped phrase is a good guess. Returns
 * `confident: false` when only the lowercase fallback found something, and
 * `title: null` when nothing matched at all, so the caller can say so.
 */
function extractRoleTitle(text) {
  const empty = { title: null, seniority: null, roleNoun: null, confident: false };
  if (!text || !text.trim()) return empty;

  const tokens = text.match(/[A-Za-z][A-Za-z+&/.'-]*/g) || [];
  const counts = new Map();
  let run = [];

  const flush = () => {
    const title = run.length ? runToTitle(run) : null;
    if (title) {
      const key = title.toLowerCase();
      const entry = counts.get(key) || { title, count: 0, words: title.split(" ").length };
      entry.count += 1;
      counts.set(key, entry);
    }
    run = [];
  };

  for (const token of tokens) {
    const capitalised = /^[A-Z]/.test(token);
    const connector = TITLE_CONNECTORS.has(token.toLowerCase());
    if (capitalised || (connector && run.length)) run.push(token);
    else flush();
  }
  flush();

  let picked = null;
  for (const entry of counts.values()) {
    if (
      !picked ||
      entry.count > picked.count ||
      (entry.count === picked.count && entry.words > picked.words)
    ) {
      picked = entry;
    }
  }

  if (picked) return describeTitle(picked.title, true);

  // Lowercase fallback: the most frequent role noun plus the content word in
  // front of it. Used when a posting is pasted in all lowercase.
  const words = tokenize(text);
  const nounCounts = new Map();
  words.forEach((word, i) => {
    if (!ROLE_NOUNS.has(stem(word))) return;
    const before = words[i - 1];
    const phrase = before && isContent(before) ? `${before} ${word}` : word;
    nounCounts.set(phrase, (nounCounts.get(phrase) || 0) + 1);
  });

  let fallback = null;
  let fallbackCount = 0;
  for (const [phrase, count] of nounCounts) {
    if (count > fallbackCount) {
      fallback = phrase;
      fallbackCount = count;
    }
  }
  if (!fallback) return empty;
  return describeTitle(titleCase(fallback), false);
}

function describeTitle(title, confident) {
  const words = title.split(" ");
  const first = words[0].toLowerCase();
  let seniority = null;
  if (SENIORITY_WORDS.has(first)) {
    seniority = words[1] && words[1].toLowerCase() === "of" ? `${words[0]} of` : words[0];
  }
  const roleNoun = words[words.length - 1];
  return { title, seniority, roleNoun, confident };
}

/**
 * Reads years of experience out of a resume. A stated number wins. Otherwise
 * the span between the earliest year on the page and either the latest year or
 * today, when the resume says the current role is ongoing.
 */
function findYearsOfExperience(text, currentYear) {
  if (!text) return null;

  const stated = [...text.matchAll(/(\d{1,2})\s*\+?\s*(?:years|yrs|year)\b/gi)]
    .map((match) => Number(match[1]))
    .filter((value) => value >= 1 && value <= 45);
  if (stated.length) return { years: Math.max(...stated), source: "stated" };

  const found = [...text.matchAll(/\b(19[7-9]\d|20\d{2})\b/g)]
    .map((match) => Number(match[1]))
    .filter((year) => year >= 1970 && year <= currentYear);
  if (!found.length) return null;

  const earliest = Math.min(...found);
  const ongoing = /\b(present|current|currently|now|to date|ongoing)\b/i.test(text);
  const latest = ongoing ? currentYear : Math.max(...found);
  const span = latest - earliest;
  if (span < 2 || span > 45) return null;
  return { years: span, source: "dates" };
}

/** The domain word both documents use, if there is one. */
function sharedDomain(jobText, resumeText) {
  const job = jobText.toLowerCase();
  const resume = resumeText.toLowerCase();
  for (const term of DOMAIN_TERMS) {
    const pattern = new RegExp(
      `(?:^|[^a-z0-9])${escapeForRegExp(term)}(?![a-z0-9])`,
      "i"
    );
    if (pattern.test(job) && pattern.test(resume)) return term;
  }
  return null;
}

// Shown in place of a result when the CV has no line with a number in it.
const RESULT_SLOT = "[Add one result with a number, such as a percentage, a count or a budget.]";

// A number that is only a date says nothing about impact, so years and date
// ranges are removed before a line is checked for digits.
const DATE_PATTERN =
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(?:19|20)\d{2}\b|\b(?:19[7-9]\d|20\d{2})\b|\b\d{1,2}\/\d{2,4}\b/gi;

// Markers that a number is a result: a percentage, money, a multiple, scale.
const IMPACT_PATTERN =
  /%|percent|[$£€₦]|\b(?:usd|gbp|eur|zar|kes|ngn)\b|\b\d+(?:\.\d+)?\s*(?:x|k|m|bn|million|billion|thousand)\b/i;

/** Splits CV text into candidate lines, whether or not the PDF kept breaks. */
function resumeLines(text) {
  return text
    .split(/\n+|[•▪●◦]\s*|(?<=[.;])\s+(?=[A-Z])/)
    .map((line) => line.replace(/^[\s*·>-]+/, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** Capitalised first letter, one closing full stop. */
function asSentence(line) {
  const trimmed = line.replace(/[\s.;,:]+$/, "");
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`;
}

/**
 * Picks CV lines that carry a result: a number that is not a date, in a line
 * short enough to sit inside a summary. Impact markers rank first, then lines
 * that use a term the posting asks for.
 */
function findResultLines(resumeText, matchedTerms = []) {
  if (!resumeText) return [];
  const stems = matchedTerms.map((term) => term.split(" ").map(stem));

  return resumeLines(resumeText)
    .filter((line) => line.length >= 30 && line.length <= 200)
    .filter((line) => !/@|https?:\/\/|www\.|\+?\d[\d\s()-]{8,}\d/.test(line))
    .filter((line) => /\d/.test(line.replace(DATE_PATTERN, "")))
    .map((line, index) => {
      const lineStems = new Set(tokenize(line).map(stem));
      const termHits = stems.filter((words) =>
        words.every((word) => lineStems.has(word))
      ).length;
      const impact = IMPACT_PATTERN.test(line) ? 3 : 0;
      return { text: asSentence(line), score: impact + termHits, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.text);
}

function withArticle(phrase) {
  return `${/^[aeiou]/i.test(phrase) ? "an" : "a"} ${phrase}`;
}

/** "A", "A and B", "A, B and C". */
function listOf(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * The whole readout: matched terms, gaps, and three summaries. Every skill in
 * a summary appears in both documents, and every result is a line from the
 * CV, so a summary never claims something the CV does not say.
 */
function generateSummaries(jobText, resumeText, currentYear) {
  const terms = extractTerms(jobText, 24);
  const resumeStems = new Set(tokenize(resumeText).map(stem));
  const scored = terms.map((item) => ({
    ...item,
    present: item.words.every((word) => resumeStems.has(stem(word))),
  }));

  const jobTitle = extractRoleTitle(jobText);
  const resumeTitle = extractRoleTitle(resumeText);
  const chosen = jobTitle.title ? jobTitle : resumeTitle;
  const titleSource = jobTitle.title ? "posting" : resumeTitle.title ? "resume" : null;
  const titleWords = new Set(chosen.title ? tokenize(chosen.title).map(stem) : []);

  // Words from the role title are the title, not skills, so they sit in
  // neither list. Otherwise "Senior Data" shows up as a missing skill.
  const skillTerms = scored.filter(
    (item) => !item.words.every((word) => titleWords.has(stem(word)))
  );
  const matched = skillTerms
    .filter((item) => item.present)
    .map((item) => ({ term: item.term, label: preferredCasing(item.term, jobText) }));
  const missing = skillTerms
    .filter((item) => !item.present)
    .map((item) => ({ term: item.term, label: preferredCasing(item.term, jobText) }));

  const base = { matched, missing, titleSource, confident: chosen.confident };
  if (!chosen.title) {
    return { ...base, title: null, years: null, result: null, summaries: [] };
  }

  const title = chosen.title;
  const seniorTitle =
    chosen.seniority || !jobTitle.seniority ? title : `${jobTitle.seniority} ${title}`;
  const years = findYearsOfExperience(resumeText, currentYear);
  const domain = sharedDomain(jobText, resumeText);
  // Mid-sentence, "in fintech" reads right and "in Fintech" does not. Keep a
  // casing only when it is a real one, like SaaS or B2B.
  const casedDomain = domain ? preferredCasing(domain, jobText) : null;
  const domainLabel =
    casedDomain && /[A-Z]/.test(casedDomain.slice(1)) ? casedDomain : domain;
  const skills = matched
    .filter((item) => !domain || item.term !== domain)
    .map((item) => item.label);
  const results = findResultLines(resumeText, matched.map((item) => item.term));
  const result = results[0] || null;
  const resultText = result || RESULT_SLOT;

  const where = domainLabel ? ` in ${domainLabel}` : "";
  const topSkills = skills.slice(0, 3);
  const drafts = [];

  // Without years or a domain the opening line has nothing to say beyond the
  // title, so the skills join it instead of standing alone.
  const opening = years
    ? asSentence(`${seniorTitle} with ${years.years}+ years of experience${where}`)
    : domainLabel
      ? asSentence(`${seniorTitle} working${where}`)
      : null;
  drafts.push({
    shape: "The formula",
    hint: "Title and level, then domain and years, then one result. Works for almost any CV.",
    text: [
      opening,
      opening
        ? topSkills.length
          ? asSentence(`Skilled in ${listOf(topSkills)}`)
          : null
        : asSentence(
            topSkills.length ? `${seniorTitle} skilled in ${listOf(topSkills)}` : seniorTitle
          ),
      resultText,
    ]
      .filter(Boolean)
      .join(" "),
    claims: [...(years ? [`${years.years}+ years`] : []), ...(domainLabel ? [domainLabel] : []), ...topSkills],
  });

  const leadSkills = skills.slice(0, 2);
  drafts.push({
    shape: "Result first",
    hint: "Opens on your strongest number. Good when the result is more impressive than the title.",
    text: [
      resultText,
      asSentence(
        `${withArticle(title)} ${leadSkills.length ? `who works across ${listOf(leadSkills)}` : "ready to do the same again"}${years ? `, with ${years.years}+ years in the field` : ""}`
      ),
    ].join(" "),
    claims: [...leadSkills, ...(years ? [`${years.years}+ years`] : [])],
  });

  const second = results[1] || null;
  const focus = skills.slice(0, 2);
  drafts.push({
    shape: "Short and plain",
    hint: second
      ? "Two lines for a one page CV. Uses a second result from your CV so it does not repeat the first."
      : "Two lines for a one page CV, when space at the top is tight.",
    text: [
      asSentence(`${seniorTitle}${focus.length ? ` focused on ${listOf(focus)}` : ""}${where}`),
      second || resultText,
    ].join(" "),
    claims: [...focus, ...(domainLabel ? [domainLabel] : [])],
  });

  const seen = new Set();
  const summaries = [];
  for (const draft of drafts) {
    const key = draft.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    summaries.push({
      ...draft,
      id: `summary-${summaries.length + 1}`,
      hasSlot: draft.text.includes(RESULT_SLOT),
    });
  }

  return { ...base, title, years, result, summaries };
}

// pure-helpers:end

// Shown before anyone runs the tool. People searching "professional summary
// examples" land here too, so the empty state answers that first.
const EXAMPLE_SUMMARIES = [
  {
    stage: "Graduate",
    text: "Statistics graduate aiming for a junior data analyst role. Built a final year project analysing five years of city transport data in Python and SQL.",
  },
  {
    stage: "Mid-level",
    text: "Digital marketing manager with 6+ years in B2B SaaS. Skilled in paid social, lifecycle email and HubSpot. Grew qualified leads 40% in a year on a flat budget.",
  },
  {
    stage: "Senior",
    text: "Senior backend engineer with 10+ years in payments. Led the move to event driven services that cut checkout failures by a third.",
  },
];

function Pill({ label, present }) {
  return (
    <li
      className={
        present
          ? "inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
          : "inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
      }
    >
      {present ? (
        <CheckIcon
          size={11}
          weight="bold"
          aria-hidden="true"
          className="text-[var(--landing-success)]"
        />
      ) : (
        <XIcon
          size={11}
          weight="bold"
          aria-hidden="true"
          className="text-[var(--landing-coral)]"
        />
      )}
      {label}
    </li>
  );
}

export default function SummaryGenerator() {
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();
  const [copiedId, setCopiedId] = useState(null);
  // Captured once so the render body stays pure. Years read from date ranges
  // need a "today" to count up to.
  const [currentYear] = useState(() => new Date().getFullYear());
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const jobTooShort = jobText.trim().length < 40;
  const resumeTooShort = resumeText.trim().length < 40;

  const result = useMemo(() => {
    if (!ran || jobTooShort || resumeTooShort) return null;
    return generateSummaries(jobText, resumeText, currentYear);
  }, [ran, jobText, resumeText, jobTooShort, resumeTooShort, currentYear]);

  async function copySummary(id, text) {
    try {
      if (!navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Summary copied");
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
      toast.error("Copy failed. Select the summary and copy it yourself.");
    }
  }

  // Same handoff as the ATS checkers: the posting rides along in
  // sessionStorage, so /dashboard/tailor opens with it already filled in.
  const handleTailorHandoff = () => {
    saveAtsHandoff({ jobText, score: null, source: "summary" });
    trackEvent("ats_handoff_cta", {
      score: null,
      source: "summary",
      signed_in: Boolean(session?.user),
    });
    const dest = "/dashboard/tailor";
    if (session?.user) {
      router.push(dest);
      return;
    }
    const authUrl = `/auth?next=${encodeURIComponent(dest)}`;
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

  return (
    <div className="landing-card rounded-3xl p-4 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="summary-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Paste the job description
            </label>
            <textarea
              id="summary-job-text"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={10}
              placeholder="Paste the full text of the job posting here…"
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>

          <ResumeFileField
            id="summary-resume-text"
            label="Your CV"
            value={resumeText}
            onChange={(text) => {
              setResumeText(text);
              reset();
            }}
            onBusyChange={setCvBusy}
          />
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Write my summary"
            busyLabel="Writing your summaries"
            running={running}
            disabled={jobTooShort || resumeTooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? "Reading your CV"
              : running
                ? "Matching your CV to the posting"
                : jobTooShort || resumeTooShort
                  ? "Add the job description and your CV to start."
                  : "Your CV is read in this tab. Nothing is stored."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Writing your summaries" lines={3} /> : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
          {result.summaries.length ? (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {result.summaries.length} summaries for{" "}
                <span className="text-[var(--landing-primary-dark)]">{result.title}</span>
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {result.titleSource === "posting"
                  ? "The title comes from the posting. Every skill appears in both your CV and the posting, and every result is a line from your CV."
                  : "We could not find a job title in the posting, so this uses the title in your CV. Every skill appears in both documents."}
                {result.confident
                  ? ""
                  : " The title is a best guess from the wording. Edit it if it is wrong."}
                {result.result
                  ? ""
                  : " Your CV has no line with a number in it, so each summary marks where your result goes."}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {result.summaries.map((summary) => (
                  <li
                    key={summary.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                          {summary.shape}
                        </p>
                        <p className="mt-2 text-base font-semibold leading-7 text-[var(--landing-ink)]">
                          {summary.text}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copySummary(summary.id, summary.text)}
                        className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
                        aria-label={`Copy summary: ${summary.shape}`}
                      >
                        {copiedId === summary.id ? (
                          <>
                            <CheckIcon size={13} weight="bold" aria-hidden="true" />
                            Copied
                          </>
                        ) : (
                          <>
                            <CopyIcon size={13} weight="bold" aria-hidden="true" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs leading-6 text-[var(--landing-ink-soft)]">
                      {summary.claims.length
                        ? `Claims ${summary.claims.join(", ")}. Keep only what your CV can evidence. `
                        : ""}
                      {summary.hasSlot ? "Replace the bracket with a real number before you use it. " : ""}
                      {summary.hint}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                We could not find a job title
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                Neither document names a role we recognise, so a summary would
                be a guess. Paste the full posting, including the title at the
                top, or add your current job title to your CV, then try again.
              </p>
            </>
          )}

          <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
            Matched from your CV
          </p>
          {result.matched.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {result.matched.map(({ term, label }) => (
                <Pill key={term} label={label} present />
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-7 text-[var(--landing-ink-soft)]">
              Your CV and this posting share almost no vocabulary. Fix that
              before the summary. Start with the{" "}
              <Link
                href="/ats-resume-checker"
                className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
              >
                ATS resume checker
              </Link>
              .
            </p>
          )}

          {result.missing.length ? (
            <>
              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                In the posting, not in your CV
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.missing.map(({ term, label }) => (
                  <Pill key={term} label={label} present={false} />
                ))}
              </ul>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                None of these can go in your summary yet. Add the ones you can
                honestly evidence to a bullet first, then run it again.
              </p>
            </>
          ) : null}

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.25)] bg-[oklch(0.92_0.06_174_/_0.4)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                Summary done. Is the rest of the CV?
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                Sign up free and FitMyCV rewrites your whole CV and cover letter
                against this posting, keeping your real experience.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTailorHandoff}
              className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              Tailor my whole CV to this job
              <ArrowRightIcon
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="inline-flex items-center gap-2 font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            <SparkleIcon
              size={15}
              weight="fill"
              aria-hidden="true"
              className="text-[var(--landing-accent)]"
            />
            Professional summary examples
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            Yours will be built from the posting you paste and the results your
            CV already shows. Here is the shape they take.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {EXAMPLE_SUMMARIES.map(({ stage, text }) => (
              <li
                key={stage}
                className="flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 sm:flex-row sm:items-start sm:gap-4"
              >
                <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)] sm:w-28 sm:shrink-0 sm:pt-0.5">
                  {stage}
                </span>
                <span className="text-sm font-semibold leading-6 text-[var(--landing-ink)]">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
