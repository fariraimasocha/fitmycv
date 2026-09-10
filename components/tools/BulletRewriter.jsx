"use client";

// Client-side resume bullet rewriter used by /resume-bullet-rewriter.
//
// ponytail: the rewrite is a weak-verb map plus metric slot templates, run in
// the browser. No API route, no model call, no storage. The ceiling is real: it
// cannot know the user's numbers, it cannot judge whether a rewrite is true,
// and it only recognises the openers listed in WEAK_OPENERS. The upgrade path
// is the authenticated flow behind /tailor-cv-from-job-link, which reads the
// posting and rewrites the whole CV against it.
//
// The pure region below is duplicated from KeywordChecker.jsx on purpose
// (tokenize, stem, extractTerms). Sharing it would mean a new module the two
// tools both import; that is the upgrade if a third tool needs it.
// Self check: npm run check:tools

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react";

// pure-region-start

// Words that carry no signal when reading a posting. The second block is
// job-advert boilerplate, without which the top of the list fills up with
// "strong experience", "essential", and "responsibilities".
const STOP_WORDS = new Set(
  `a about above after again against all also am an and any are as at be because been before being below between both but by can cannot could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves

   ability able across additional advantage apply applicant applicants bonus candidate candidates career company culture description desirable duties employment ensure ensuring environment essential etc excellent experience familiar familiarity fast focus following friendly get getting good great growing help including involved job join key like looking love make making must need needs new nice offer opportunity part passionate people plus position preferred proven provide range required requirement requirements responsibilities responsibility role roles skill skills strong take team teams understanding using want well work working world would years`
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
 * being reported as terms the bullet is missing.
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
 * ("incident response") and drops one-off prose fragments ("run services").
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
      .map(([term, count]) => ({ term, score: count * 1.8, words: term.split(" ") })),
    ...[...unigrams.entries()].map(([term, count]) => ({
      term,
      score: count,
      words: [term],
    })),
  ].sort((a, b) => b.score - a.score);

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

/**
 * Verb families. Each one carries the action verbs that replace a weak opener
 * (also shown as the verb bank) and the metric tails that mark where a number
 * belongs. Tails deliberately cover different metric kinds, so three variants
 * differ in what they ask you to measure, not only in wording.
 */
const VERB_FAMILIES = {
  ownership: {
    label: "Ownership and leadership",
    hint: "You are describing something you owned or ran.",
    verbs: [
      "Owned",
      "Led",
      "Directed",
      "Ran",
      "Drove",
      "Coordinated",
      "Headed",
      "Scoped",
      "Steered",
      "Chaired",
      "Championed",
      "Rebuilt",
    ],
    tails: [
      ", leading a team of [number].",
      ", covering a [amount] budget.",
      ", delivering [number] releases a [quarter].",
      ", cutting [metric] by [percentage].",
      ", across [number] [teams or sites].",
    ],
    hints: ["team", "project", "budget", "roadmap", "stakeholder", "programme", "vendor", "staff"],
  },
  support: {
    label: "Customer and people support",
    hint: "You are describing work you did for customers or colleagues.",
    verbs: [
      "Resolved",
      "Advised",
      "Coached",
      "Trained",
      "Guided",
      "Enabled",
      "Unblocked",
      "Mentored",
      "Equipped",
      "Briefed",
      "Handled",
      "Answered",
    ],
    tails: [
      ", clearing [number] a [week].",
      ", holding [percentage] satisfaction.",
      ", cutting first response time to under [number] hours.",
      ", onboarding [number] new users a [month].",
      ", for [number] accounts.",
    ],
    hints: ["customer", "client", "support", "ticket", "training", "onboarding", "user", "queue"],
  },
  delivery: {
    label: "Building and shipping",
    hint: "You are describing something you helped build or launch.",
    verbs: [
      "Built",
      "Shipped",
      "Delivered",
      "Launched",
      "Designed",
      "Rebuilt",
      "Prototyped",
      "Migrated",
      "Integrated",
      "Released",
      "Engineered",
      "Rolled out",
    ],
    tails: [
      ", in [number] weeks.",
      ", now used by [number] people a [month].",
      ", lifting [metric] by [percentage].",
      ", replacing [number] manual steps.",
      ", ahead of a [date] deadline.",
    ],
    hints: ["feature", "product", "app", "release", "code", "website", "campaign", "platform"],
  },
  process: {
    label: "Process and efficiency",
    hint: "You are describing a process you kept running or improved.",
    verbs: [
      "Streamlined",
      "Automated",
      "Simplified",
      "Documented",
      "Audited",
      "Tightened",
      "Reworked",
      "Consolidated",
      "Cut",
      "Redesigned",
      "Corrected",
      "Standardised",
    ],
    tails: [
      ", saving [number] hours a [week].",
      ", cutting [metric] by [percentage].",
      ", removing [amount] of yearly cost.",
      ", across [number] [reports or accounts].",
      ", holding [percentage] accuracy.",
    ],
    hints: ["process", "workflow", "reporting", "compliance", "quality", "inventory", "payroll", "invoice"],
  },
  analysis: {
    label: "Data and analysis",
    hint: "You are describing something you measured or investigated.",
    verbs: [
      "Modelled",
      "Diagnosed",
      "Quantified",
      "Benchmarked",
      "Mapped",
      "Segmented",
      "Surfaced",
      "Measured",
      "Validated",
      "Traced",
      "Forecast",
      "Analysed",
    ],
    tails: [
      ", across [number] [records].",
      ", informing a [amount] decision.",
      ", which moved [metric] by [percentage].",
      ", covering [number] [months] of history.",
      ", cutting reporting time by [number] hours.",
    ],
    hints: ["data", "analysis", "report", "dashboard", "metric", "forecast", "research", "sql"],
  },
  general: {
    label: "General action verbs",
    hint: "No single family stood out, so these work anywhere.",
    verbs: [
      "Delivered",
      "Improved",
      "Increased",
      "Reduced",
      "Introduced",
      "Negotiated",
      "Secured",
      "Recovered",
      "Accelerated",
      "Won",
      "Grew",
      "Fixed",
    ],
    tails: [
      ", reaching [number] [users] a [month].",
      ", improving [metric] by [percentage].",
      ", saving [number] hours a [week].",
      ", worth [amount] a year.",
      ", within [number] months.",
    ],
    hints: [],
  },
};

/**
 * Openers that describe a duty rather than a result. Matched longest first, so
 * "responsible for managing" beats "responsible for".
 */
const WEAK_OPENERS = [
  ["was responsible for managing", "ownership"],
  ["responsible for managing", "ownership"],
  ["was responsible for", "ownership"],
  ["responsible for", "ownership"],
  ["accountable for", "ownership"],
  ["in charge of", "ownership"],
  ["duties included", "ownership"],
  ["tasked with", "ownership"],
  ["looked after", "ownership"],
  ["took care of", "ownership"],
  ["managed", "ownership"],
  ["oversaw", "ownership"],
  ["supervised", "ownership"],
  ["provided support for", "support"],
  ["provided support to", "support"],
  ["assisted with", "support"],
  ["assisted in", "support"],
  ["assisted", "support"],
  ["helped with", "support"],
  ["helped to", "support"],
  ["helped", "support"],
  ["supported", "support"],
  ["aided", "support"],
  ["dealt with", "support"],
  ["handled", "support"],
  ["worked closely with", "delivery"],
  ["collaborated on", "delivery"],
  ["contributed to", "delivery"],
  ["participated in", "delivery"],
  ["took part in", "delivery"],
  ["was involved in", "delivery"],
  ["involved in", "delivery"],
  ["was part of", "delivery"],
  ["part of", "delivery"],
  ["worked on", "delivery"],
  ["worked with", "delivery"],
  ["responsible for maintaining", "process"],
  ["carried out", "process"],
  ["administered", "process"],
  ["maintained", "process"],
  ["monitored", "process"],
  ["performed", "process"],
  ["processed", "process"],
  ["conducted", "process"],
  ["executed", "process"],
  ["ensured", "process"],
  ["kept track of", "analysis"],
  ["reported on", "analysis"],
  ["looked at", "analysis"],
  ["gathered", "analysis"],
  ["tracked", "analysis"],
].sort((a, b) => b[0].length - a[0].length);

const VAGUE_WORDS = ["various", "several", "multiple", "numerous", "many", "a number of"];

/** Strips list markers, leading pronouns, and stray spacing from raw input. */
function normalizeBullet(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[-*•·\d.)\s]+/, "")
    .replace(/^(?:i|we)\s+/i, "")
    .trim();
}

/** Returns [phrase, family] for the weak opener this bullet starts with. */
function detectOpener(bullet) {
  const lower = bullet.toLowerCase();
  return (
    WEAK_OPENERS.find(([phrase]) => {
      if (!lower.startsWith(phrase)) return false;
      const next = lower.charAt(phrase.length);
      return next === "" || next === " ";
    }) || null
  );
}

function detectFamily(bullet, opener) {
  if (opener) return opener[1];
  const words = new Set(tokenize(bullet).map(stem));
  const match = Object.entries(VERB_FAMILIES).find(([, spec]) =>
    spec.hints.some((hint) => words.has(stem(hint)))
  );
  return match ? match[0] : "general";
}

/** Removes the opener and any preposition it leaves behind. Keeps articles. */
function stripOpener(bullet, phrase) {
  return bullet
    .slice(phrase.length)
    .replace(/^\s*(?:for|to|with|of|on|in|by|at)\s+/i, "")
    .replace(/[.;,\s]+$/, "")
    .trim();
}

/**
 * A stable number derived from the text, so two people with different bullets
 * get different verbs while the same bullet always rewrites the same way. This
 * is the deterministic stand-in for randomness, which would break rendering.
 */
function fingerprint(text) {
  let hash = 7;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 99991;
  }
  return hash;
}

/** Builds three rewrites with fill-in slots. Never invents a number. */
function rewriteBullet(text) {
  const clean = normalizeBullet(text);
  const opener = detectOpener(clean);
  const family = detectFamily(clean, opener);
  const spec = VERB_FAMILIES[family];
  const seed = fingerprint(clean);
  const pick = (list, i) => list[(seed + i) % list.length];

  let variants;
  if (opener) {
    const rest = stripOpener(clean, opener[0]) || "[what you owned]";
    variants = [0, 1, 2].map((i) => `${pick(spec.verbs, i)} ${rest}${pick(spec.tails, i)}`);
  } else {
    const kept = clean.replace(/[.;,\s]+$/, "").trim();
    const head = kept ? kept.charAt(0).toUpperCase() + kept.slice(1) : "[your bullet]";
    variants = [0, 1, 2].map((i) => `${head}${pick(spec.tails, i)}`);
  }

  return { family, label: spec.label, opener: opener ? opener[0] : null, variants };
}

/** One line per problem, each naming the fix. No score, no grade. */
function diagnoseBullet(text) {
  const clean = normalizeBullet(text);
  const raw = String(text || "").trim();
  const opener = detectOpener(clean);
  const words = clean.split(/\s+/).filter(Boolean);
  const notes = [];

  notes.push(
    opener
      ? {
          tone: "warn",
          text: `Opens with "${opener[0]}", which names a duty. Start with an action verb instead.`,
        }
      : { tone: "ok", text: "Opens with an action verb. Keep it and add the numbers." }
  );

  notes.push(
    /\d/.test(clean)
      ? { tone: "ok", text: "Has a number. Check it is the one a hiring manager cares about." }
      : {
          tone: "warn",
          text: "No number anywhere. Add how many, how often, how much, or how much faster.",
        }
  );

  if (words.length > 28) {
    notes.push({
      tone: "warn",
      text: `${words.length} words. Cut it to under 25 so it fits on two lines.`,
    });
  }

  const pronoun = raw.match(/\b(I|my|me|we|our|us)\b/i);
  if (pronoun) {
    notes.push({
      tone: "warn",
      text: `Uses "${pronoun[0]}". Drop pronouns from CV bullets and lead with the verb.`,
    });
  }

  const vague = VAGUE_WORDS.find((word) => clean.toLowerCase().includes(word));
  if (vague) {
    notes.push({
      tone: "warn",
      text: `"${vague}" hides the count. Replace it with the real figure.`,
    });
  }

  notes.push({
    tone: "note",
    text: raw.endsWith(".")
      ? "Ends with a full stop. Use the same ending on every bullet."
      : "No full stop at the end. Fine, as long as every other bullet matches.",
  });

  return notes;
}

/**
 * Terms the posting leans on that this bullet never mentions. Suggestions only:
 * we have no way to know whether the person did the work.
 */
function tailoringTerms(bullet, jobText, limit = 8) {
  if (jobText.trim().length < 40) return [];
  const bulletStems = new Set(tokenize(bullet).map(stem));
  return extractTerms(jobText, 18)
    .filter((item) => !item.words.every((word) => bulletStems.has(stem(word))))
    .slice(0, limit)
    .map((item) => item.term);
}

// pure-region-end

const EXAMPLE_BULLET = "Managed customer support tickets.";

const EXAMPLE_JOB = `Customer Support Specialist. You will own the support queue, resolve customer tickets across email and chat, and keep first response time under two hours. We look for careful troubleshooting, clear written communication, and hands-on time with Zendesk. You will escalate bugs to the product team and keep the help centre documentation current. Support in a SaaS company is preferred.`;

const SLOT_CLASS =
  "rounded-md border border-[oklch(0.47_0.125_177_/_0.25)] bg-[oklch(0.92_0.06_174_/_0.55)] px-1.5 py-0.5 font-bold text-[var(--landing-primary-dark)]";

/** Renders [slots] as obvious placeholders rather than text to paste as is. */
function SlottedText({ text }) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith("[") && part.endsWith("]") ? (
      <span key={`${part}-${i}`} className={SLOT_CLASS}>
        {part}
      </span>
    ) : (
      <span key={`text-${i}`}>{part}</span>
    )
  );
}

function NoteIcon({ tone }) {
  if (tone === "ok") {
    return (
      <CheckIcon
        size={14}
        weight="bold"
        aria-hidden="true"
        className="mt-1 shrink-0 text-[var(--landing-success)]"
      />
    );
  }
  if (tone === "warn") {
    return (
      <XIcon
        size={14}
        weight="bold"
        aria-hidden="true"
        className="mt-1 shrink-0 text-[var(--landing-coral)]"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-ink-soft)]"
    />
  );
}

export default function BulletRewriter() {
  const [bullet, setBullet] = useState("");
  const [jobText, setJobText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;
    const clean = normalizeBullet(bullet);
    if (clean.split(/\s+/).filter(Boolean).length < 3) return null;

    const rewrite = rewriteBullet(bullet);
    return {
      ...rewrite,
      notes: diagnoseBullet(bullet),
      terms: tailoringTerms(bullet, jobText),
      verbs: VERB_FAMILIES[rewrite.family].verbs,
      familyHint: VERB_FAMILIES[rewrite.family].hint,
    };
  }, [submitted, bullet, jobText]);

  const tooShort = normalizeBullet(bullet).split(/\s+/).filter(Boolean).length < 3;
  const jobStarted = jobText.trim().length > 0;

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="bullet-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Paste one bullet from your CV
            </label>
            <textarea
              id="bullet-text"
              value={bullet}
              onChange={(e) => setBullet(e.target.value)}
              rows={4}
              placeholder="Managed customer support tickets."
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
            <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
              One bullet at a time works best.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="bullet-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Paste the job description (optional)
            </label>
            <textarea
              id="bullet-job-text"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={4}
              placeholder="Paste the posting to see which of its terms you could work in…"
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
            <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
              Leave this empty to just rewrite the bullet.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={tooShort}
            className="landing-primary-btn font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Rewrite this bullet
          </button>
          <button
            type="button"
            onClick={() => {
              setBullet(EXAMPLE_BULLET);
              setJobText(EXAMPLE_JOB);
              setSubmitted(true);
            }}
            className="landing-secondary-btn font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
          >
            Try an example
          </button>
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            Runs entirely in your browser. Nothing is uploaded or stored.
          </p>
        </div>
      </form>

      {result ? (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            Three ways to rewrite it
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            Each one opens with an action verb and marks where a number belongs.
            The highlighted slots are yours to fill. This tool does not know your
            numbers, so pick figures you can defend in an interview.
          </p>

          <ol className="mt-6 flex flex-col gap-3">
            {result.variants.map((variant, i) => (
              <li
                key={variant}
                className="flex items-start gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-4"
              >
                <span className="mt-0.5 font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-7 text-[var(--landing-ink)]">
                  <SlottedText text={variant} />
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
            What to fix in the original
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {result.notes.map((note) => (
              <li key={note.text} className="flex items-start gap-2.5">
                <NoteIcon tone={note.tone} />
                <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {note.text}
                </span>
              </li>
            ))}
          </ul>

          {result.terms.length ? (
            <>
              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                Terms from the posting you could work in
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                The posting leans on these and your bullet never says them. Add
                only the ones you actually did.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.terms.map((term) => (
                  <li
                    key={term}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
                  >
                    {term}
                  </li>
                ))}
              </ul>
            </>
          ) : jobStarted ? (
            <p className="mt-8 text-sm leading-7 text-[var(--landing-ink-soft)]">
              Paste more of the posting to see which of its terms this bullet is
              missing. A line or two is not enough to rank.
            </p>
          ) : null}

          <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
            Action verbs for {result.label.toLowerCase()}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            {result.familyHint} Swap in whichever one is most accurate.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.verbs.map((verb) => (
              <li
                key={verb}
                className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
              >
                <CheckIcon
                  size={11}
                  weight="bold"
                  aria-hidden="true"
                  className="text-[var(--landing-success)]"
                />
                {verb}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.25)] bg-[oklch(0.92_0.06_174_/_0.4)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                One bullet down. What about the rest?
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                Paste the job link and FitMyCV rewrites every bullet against that
                posting, keeping your real experience and your real numbers.
              </p>
            </div>
            <Link
              href="/tailor-cv-from-job-link"
              className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              Tailor my CV
              <ArrowRightIcon
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
            What you get back
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Three rewrites",
                body: "Each opens with an action verb and marks where your number goes.",
              },
              {
                title: "A read on the original",
                body: "Weak opener, missing number, pronouns, length. One line each.",
              },
              {
                title: "A verb bank",
                body: "Action verbs for the kind of work this bullet describes.",
              },
            ].map(({ title, body }) => (
              <li
                key={title}
                className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-4"
              >
                <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
                  {title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
