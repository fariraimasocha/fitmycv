"use client";

// Client-side job duties to resume bullets tool used by
// /job-description-to-resume-bullets.
//
// ponytail: a verb map plus metric slot templates, run in the browser. No API
// route, no model call, no storage. The ceiling is real: it only knows the
// verbs listed below, it cannot know the user's numbers, and a duty written as
// an odd noun phrase gets a generic verb. The upgrade path is the
// authenticated flow behind /tailor-cv-from-job-link.
//
// VERB_FAMILIES and the weak opener list are copied from BulletRewriter.jsx on
// purpose, the same way that file copies its term helpers. Sharing them would
// mean a new module both tools import, which is the upgrade if a third tool
// needs the same lists.
// Self check: npm run check:tools

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";

// pure-helpers:start

const MAX_DUTIES = 20;

// ponytail: one slot for every bullet. Family-specific tails ("leading a team
// of", "with a budget of") guessed at facts the duty never stated and read
// wrong half the time. The family note under each bullet says which number to
// find instead. Richer tails need real judgement: the signed-in tailor flow.
const RESULT_SLOT = ", [result, with a number].";

/**
 * Verb families. Each carries the verbs that replace a weak opener, the metric
 * tails that mark where a number belongs, the words that point a duty at the
 * family, and the note that tells the user which number to go and find.
 */
const VERB_FAMILIES = {
  ownership: {
    // ponytail: verbs that read right in front of almost any object. A wider
    // list gave "Steered the payroll", which a reader notices at once.
    verbs: ["Ran", "Owned", "Led", "Coordinated"],
    tails: [RESULT_SLOT],
    hints: ["team", "project", "budget", "roadmap", "stakeholder", "programme", "vendor", "staff"],
    note: "Add the size of it: people in the team, the budget, or how many projects ran at once.",
  },
  support: {
    verbs: ["Resolved", "Processed"],
    tails: [RESULT_SLOT],
    hints: ["customer", "client", "support", "ticket", "training", "onboarding", "user", "queue", "patient", "student", "enquiry"],
    note: "Add how many a week, how fast you answered, or a satisfaction score.",
  },
  delivery: {
    verbs: ["Built", "Shipped", "Delivered", "Launched", "Designed", "Developed", "Migrated", "Integrated", "Rolled out"],
    tails: [RESULT_SLOT],
    hints: ["feature", "product", "app", "release", "code", "website", "campaign", "platform", "system", "content"],
    note: "Add how long it took, how many people use it, or what changed after launch.",
  },
  process: {
    verbs: ["Streamlined", "Automated", "Documented", "Audited", "Standardised", "Reworked", "Consolidated", "Redesigned", "Tightened"],
    tails: [RESULT_SLOT],
    hints: ["process", "workflow", "reporting", "compliance", "quality", "inventory", "payroll", "invoice", "records", "stock", "schedule"],
    note: "Add hours saved, errors removed, cost cut, or how many records it covered.",
  },
  analysis: {
    verbs: ["Analysed", "Modelled", "Quantified", "Benchmarked", "Mapped", "Measured", "Forecast", "Tracked", "Diagnosed"],
    tails: [RESULT_SLOT],
    hints: ["data", "analysis", "report", "dashboard", "metric", "forecast", "research", "sql", "trend", "kpi"],
    note: "Add how much data, which decision it fed, or the change it led to.",
  },
  general: {
    verbs: ["Delivered", "Improved", "Introduced", "Negotiated", "Secured", "Grew", "Reduced", "Increased", "Fixed"],
    tails: [RESULT_SLOT],
    hints: [],
    note: "Add how many, how often, how much, or how much faster.",
  },
};

/**
 * Phrases that name a duty rather than an action. They are removed and a verb
 * from the family takes their place. Matched longest first.
 */
const WEAK_OPENERS = [
  ["duties included", "ownership"],
  ["duties include", "ownership"],
  ["responsible for", "ownership"],
  ["accountable for", "ownership"],
  ["in charge of", "ownership"],
  ["tasked with", "ownership"],
  ["looked after", "ownership"],
  ["took care of", "ownership"],
  ["take care of", "ownership"],
  ["assisted with", "support"],
  ["assist with", "support"],
  ["assisted in", "support"],
  ["assist in", "support"],
  ["helped with", "support"],
  ["help with", "support"],
  ["helped to", "support"],
  ["help to", "support"],
  ["provide support to", "support"],
  ["provide support for", "support"],
  ["dealt with", "support"],
  ["deal with", "support"],
  ["worked closely with", "delivery"],
  ["work closely with", "delivery"],
  ["contributed to", "delivery"],
  ["contribute to", "delivery"],
  ["participated in", "delivery"],
  ["participate in", "delivery"],
  ["took part in", "delivery"],
  ["take part in", "delivery"],
  ["was involved in", "delivery"],
  ["be involved in", "delivery"],
  ["involved in", "delivery"],
  ["was part of", "delivery"],
  ["be part of", "delivery"],
  ["part of", "delivery"],
  ["worked on", "delivery"],
  ["work on", "delivery"],
  ["worked with", "delivery"],
  ["work with", "delivery"],
].sort((a, b) => b[0].length - a[0].length);

/**
 * Verbs a posting uses that are too vague to lead a bullet. They are swapped
 * for a verb from the family rather than put into the past tense.
 */
const WEAK_VERBS = {
  manage: "ownership",
  oversee: "ownership",
  supervise: "ownership",
  handle: "support",
  support: "support",
  assist: "support",
  help: "support",
  aid: "support",
  work: "delivery",
  participate: "delivery",
  contribute: "delivery",
  collaborate: "delivery",
};

/** Verbs that lead a bullet well once they are in the past tense. */
const STRONG_VERBS = new Set(
  `achieve adapt administer advise allocate analyse analyze answer approve arrange assess audit automate balance book brief budget build calculate care champion chair check clean close coach collect communicate compile complete configure consolidate construct consult control convert coordinate cost counsel create cut debug define deliver deploy design develop diagnose direct document draft drive edit educate enforce engage establish estimate evaluate execute expand facilitate file finalise finalize fix forecast gather generate grow guide hire identify implement improve increase inspect install instruct integrate interview introduce investigate issue launch lead liaise log maintain map market measure mentor migrate model monitor motivate negotiate onboard open operate optimise optimize order organise organize own plan prepare present prioritise prioritize process produce program programme promote propose prospect provide publish purchase rebuild recommend reconcile record recruit redesign reduce refactor refine release repair report research resolve respond restructure review revise run schedule screen secure sell serve set ship simplify solve source staff standardise standardize streamline structure submit supply survey teach test track train translate treat triage troubleshoot tutor update upgrade validate verify visit write`
    .split(/\s+/)
    .filter(Boolean)
);

const IRREGULAR_PAST = {
  build: "built", buy: "bought", catch: "caught", cut: "cut", deal: "dealt",
  do: "did", draw: "drew", drive: "drove", feed: "fed", find: "found",
  forecast: "forecast", give: "gave", grow: "grew", hold: "held", keep: "kept",
  lead: "led", make: "made", meet: "met", pay: "paid", put: "put", run: "ran",
  sell: "sold", send: "sent", set: "set", speak: "spoke", spend: "spent",
  take: "took", teach: "taught", tell: "told", think: "thought", win: "won",
  write: "wrote",
};

// Short verbs that double their last consonant in the past tense.
const DOUBLING = new Set(["plan", "ship", "map", "log", "scan", "chat", "stop", "drop"]);

/** Past tense of a base verb. Covers the regular rules plus the list above. */
function pastTense(verb) {
  const base = verb.toLowerCase();
  if (IRREGULAR_PAST[base]) return IRREGULAR_PAST[base];
  if (DOUBLING.has(base)) return `${base}${base.slice(-1)}ed`;
  if (base.endsWith("e")) return `${base}d`;
  if (/[^aeiou]y$/.test(base)) return `${base.slice(0, -1)}ied`;
  return `${base}ed`;
}

const capitalise = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

/**
 * The base form of a word if it is a known verb, else null. Accepts the base
 * ("manage"), third person ("manages"), past ("managed") and gerund
 * ("managing"), since postings and old CVs use all four.
 */
function verbLemma(word) {
  const w = String(word || "").toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return null;
  const known = (candidate) =>
    STRONG_VERBS.has(candidate) || Object.hasOwn(WEAK_VERBS, candidate) ? candidate : null;
  const candidates = [w];
  if (w.endsWith("ies")) candidates.push(`${w.slice(0, -3)}y`);
  if (w.endsWith("es")) candidates.push(w.slice(0, -2));
  if (w.endsWith("s")) candidates.push(w.slice(0, -1));
  if (w.endsWith("ied")) candidates.push(`${w.slice(0, -3)}y`);
  if (w.endsWith("ed")) candidates.push(w.slice(0, -2), w.slice(0, -1), w.slice(0, -3));
  if (w.endsWith("ing")) candidates.push(w.slice(0, -3), `${w.slice(0, -3)}e`, w.slice(0, -4));
  for (const candidate of candidates) {
    const hit = known(candidate);
    if (hit) return hit;
  }
  // Irregular pasts ("led", "built") only when the base is a verb we know.
  const irregular = Object.keys(IRREGULAR_PAST).find((base) => IRREGULAR_PAST[base] === w);
  return irregular ? known(irregular) : null;
}

/**
 * Splits pasted text into single duties. Handles one per line, bullet
 * characters, numbered lists, and duties run together with semicolons.
 */
function splitDuties(text) {
  const seen = new Set();
  return String(text || "")
    .split(/\n|•|;|\s\*\s|\s·\s/)
    .map((line) =>
      line
        .replace(/^\s*(?:[-*·>]+|\(?\d{1,2}[.)]|\(?[a-z][.)])\s+/i, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((line) => line.split(" ").length >= 3)
    .filter((line) => {
      const key = line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_DUTIES);
}

/** Strips the advert framing around a duty: "You will", "The role involves". */
function stripFraming(duty) {
  return duty
    .replace(/[.;,:\s]+$/, "")
    .replace(/\s*,?\s*etc\.?$/i, "")
    .replace(
      /^(?:the\s+(?:successful\s+)?(?:candidate|post\s*holder|role|job)\s+(?:will|involves|includes)\s+|you\s+will\s+be\s+expected\s+to\s+|you\s+will\s+be\s+|you\s+will\s+|you'll\s+be\s+|you'll\s+|we\s+need\s+you\s+to\s+|expected\s+to\s+|must\s+be\s+able\s+to\s+|ability\s+to\s+|able\s+to\s+|to\s+|i\s+|we\s+)/i,
      ""
    )
    .replace(/^(?:be\s+)?(?:responsible|accountable)\s+for\s+/i, (m) => m.replace(/^be\s+/i, ""))
    .trim();
}

function detectOpener(duty) {
  const lower = duty.toLowerCase();
  return (
    WEAK_OPENERS.find(([phrase]) => {
      if (!lower.startsWith(phrase)) return false;
      const next = lower.charAt(phrase.length);
      return next === "" || next === " ";
    }) || null
  );
}

/** The family whose topic words appear in the duty, or null when none do. */
function topicFamily(text) {
  const words = new Set(
    text
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter(Boolean)
      .map((w) => w.replace(/(?:ing|es|s)$/, ""))
  );
  const match = Object.entries(VERB_FAMILIES).find(([, spec]) =>
    spec.hints.some((hint) => words.has(hint.replace(/(?:ing|es|s)$/, "")))
  );
  return match ? match[0] : null;
}

/**
 * Puts later base form verbs into the past tense too: "Monitor scores and
 * prepare reports" becomes "Monitored scores and prepared reports". Only
 * strong verbs followed by more words, so "support queue" nouns stay put.
 */
function pastTenseLaterVerbs(text) {
  return text.replace(/\b(and|then)\s+([a-z]+)(?=\s+\S)/gi, (match, joiner, word) =>
    STRONG_VERBS.has(word.toLowerCase()) ? `${joiner} ${pastTense(word)}` : match
  );
}

/**
 * Lowercases the first word of a noun phrase duty ("Customer service and
 * complaints") so it reads mid sentence. Leaves acronyms like SQL alone.
 * ponytail: a product name that opens a duty ("Salesforce admin") is
 * lowercased too. The fix, if users hit it, is a small proper noun list.
 */
function lowerFirstWord(text) {
  return text.replace(/^([A-Z])([a-z]+)\b/, (match, head, tail) => `${head.toLowerCase()}${tail}`);
}

/** A stable number from the text, so the same duty always rewrites the same way. */
function fingerprint(text) {
  let hash = 7;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 99991;
  }
  return hash;
}

/** Picks a verb from the family, skipping any already used on this list. */
function pickVerb(family, seed, used) {
  const verbs = VERB_FAMILIES[family].verbs;
  for (let i = 0; i < verbs.length; i += 1) {
    const verb = verbs[(seed + i) % verbs.length];
    if (!used.has(verb.toLowerCase())) return verb;
  }
  return verbs[seed % verbs.length];
}

/**
 * Turns one duty into an achievement bullet: past tense action verb, the work,
 * and a bracketed slot where the user's number goes. Never invents a number.
 */
function dutyToBullet(rawDuty, used = new Set()) {
  const original = String(rawDuty || "").replace(/\s+/g, " ").trim();
  let rest = stripFraming(original);
  const seed = fingerprint(rest.toLowerCase());
  let verb = null;
  // Which verb list to pick from, and which tails and note to use. They can
  // differ: "Responsible for the monthly reports" wants an ownership verb and
  // a reporting number.
  let verbFamily = null;

  // "Responsible for", "Helped with" and friends: drop the phrase entirely.
  // "Work with X to Y" keeps its partner: it becomes "Partnered with X to Y".
  const opener = detectOpener(rest);
  if (opener) {
    verbFamily = opener[1];
    const after = rest.slice(opener[0].length).trim();
    if (/\bwith$/.test(opener[0]) && opener[1] === "delivery") {
      verb = "Partnered";
      rest = `with ${after}`;
    } else {
      rest = after
        .replace(/^(?:the\s+)?(?:day\s+to\s+day\s+)?(?:for|to|with|of|on|in|by|at)\s+/i, "")
        .trim();
    }
  }

  // What is left may open with a verb in any form: "managing", "develop".
  if (!verb) {
    const [first, ...others] = rest.split(" ");
    const lemma = verbLemma(first);
    if (lemma) {
      rest = others.join(" ");
      if (Object.hasOwn(WEAK_VERBS, lemma)) {
        verbFamily = verbFamily || WEAK_VERBS[lemma];
      } else {
        verb = capitalise(pastTense(lemma));
      }
    } else if (!opener) {
      // A noun phrase duty ("Customer service and complaints") reads best
      // with an ownership verb in front of it.
      verbFamily = "ownership";
      rest = lowerFirstWord(rest);
    }
  }

  rest = pastTenseLaterVerbs(rest);
  const tailFamily = topicFamily(rest || original) || verbFamily || "general";
  if (!verb) verb = pickVerb(verbFamily || tailFamily, seed, used);
  used.add(verb.toLowerCase());

  const body = rest.trim() || "[what you did]";
  const tails = VERB_FAMILIES[tailFamily].tails;
  const bullet = `${verb} ${body}${tails[seed % tails.length]}`;

  return { original, bullet, verb, family: tailFamily, note: VERB_FAMILIES[tailFamily].note };
}

/** Rewrites every duty in the pasted text, with no verb repeated where avoidable. */
function dutiesToBullets(text) {
  const used = new Set();
  return splitDuties(text).map((duty) => dutyToBullet(duty, used));
}

// pure-helpers:end

const EXAMPLE_DUTIES = `Responsible for managing the customer support inbox
Handle refunds and billing questions from customers
Maintain the help centre articles and FAQs
Work with the product team to report bugs
Assist with onboarding new customers
Monitor customer satisfaction scores and prepare weekly reports`;

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

export default function DutiesToBullets() {
  const [duties, setDuties] = useState("");
  const [copied, setCopied] = useState(null);
  const resetTimer = useRef(null);
  const { running, ran, start } = useToolRun();

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const bullets = useMemo(() => (ran ? dutiesToBullets(duties) : []), [ran, duties]);
  const tooShort = splitDuties(duties).length === 0;

  async function copy(key, text, message) {
    try {
      if (!navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success(message);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
      toast.error("Copy failed. Select the text and copy it yourself.");
    }
  }

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="duties-text"
            className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
          >
            Paste the duties from your job description
          </label>
          <textarea
            id="duties-text"
            value={duties}
            onChange={(e) => setDuties(e.target.value)}
            rows={7}
            placeholder={"Responsible for managing the support inbox\nHandle refunds and billing questions\nMaintain the help centre articles"}
            className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            One duty per line. Bullet points, numbered lists and semicolons work too. Up to {MAX_DUTIES} duties.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Turn duties into bullets"
            busyLabel="Rewriting your duties"
            running={running}
            disabled={tooShort}
          />
          <button
            type="button"
            onClick={() => {
              setDuties(EXAMPLE_DUTIES);
              start();
            }}
            disabled={running}
            className="landing-secondary-btn font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Try an example
          </button>
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {running
              ? "Rewriting your duties"
              : "Runs entirely in your browser. Nothing is uploaded or stored."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Rewriting your duties" lines={4} /> : null}

      {!running && bullets.length ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {bullets.length === 1 ? "Your duty as a bullet" : `Your ${bullets.length} duties as bullets`}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                Each one opens with an action verb and marks where a number belongs.
                The highlighted slots are yours to fill. This tool does not know your
                numbers, so use figures you can defend in an interview.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copy("all", bullets.map((b) => `• ${b.bullet}`).join("\n"), "All bullets copied")
              }
              className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              {copied === "all" ? (
                <>
                  <CheckIcon size={13} weight="bold" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon size={13} weight="bold" aria-hidden="true" />
                  Copy all
                </>
              )}
            </button>
          </div>

          <ol className="mt-6 flex flex-col gap-3">
            {bullets.map((item, i) => (
              <li
                key={`${item.original}-${i}`}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-xs leading-6 text-[var(--landing-ink-soft)]">
                        Was: {item.original}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-[var(--landing-ink)]">
                        <SlottedText text={item.bullet} />
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(i, item.bullet, "Bullet copied")}
                    className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
                    aria-label={`Copy bullet: ${item.bullet}`}
                  >
                    {copied === i ? (
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
                <p className="ps-8 text-xs leading-6 text-[var(--landing-ink-soft)]">{item.note}</p>
              </li>
            ))}
          </ol>

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.25)] bg-[oklch(0.92_0.06_174_/_0.4)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                Applying for a new job with these?
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
              Tailor these to a new job
              <ArrowRightIcon
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      ) : null}

      {!running && !bullets.length ? (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
            What you get back
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "One bullet per duty",
                body: "Weak openers like 'Responsible for' removed, and a past tense action verb up front.",
              },
              {
                title: "A slot for your number",
                body: "Each bullet marks where a figure belongs, so it reads as a result.",
              },
              {
                title: "Which number to find",
                body: "A note under each bullet on what to count: people, hours, money or change.",
              },
            ].map(({ title, body }) => (
              <li
                key={title}
                className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-4"
              >
                <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
                  {title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[var(--landing-ink-soft)]">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
