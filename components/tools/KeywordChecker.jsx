"use client";

// Client-side keyword checker used by /ats-resume-checker (match mode) and
// /free-ats-keyword-checker (keywords mode).
//
// ponytail: the extraction runs entirely in the browser — no API route, no
// model call, no storage. It is a heuristic, not the tailoring engine, and
// that is the point: it costs nothing to run, works offline, and never sends
// anyone's CV anywhere. The real rewrite lives behind /tailor-cv-from-job-link.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react";

// Words that carry no signal when matching a CV against a posting. The second
// block is job-advert boilerplate — without it the top of the list fills up
// with "strong experience", "essential", and "responsibilities".
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
 * "service". Not a real stemmer — it only needs to stop obvious inflections
 * from being reported as missing keywords.
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
 * ("project management", "incident response") and drops one-off prose
 * fragments ("build distributed", "run services").
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

function ScoreRing({ value }) {
  const tone =
    value >= 75
      ? "var(--landing-success)"
      : value >= 50
        ? "var(--landing-accent)"
        : "var(--landing-coral)";

  return (
    <div
      className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${tone} ${value * 3.6}deg, oklch(0.905 0.02 83) 0deg)`,
      }}
      role="img"
      aria-label={`Keyword match score: ${value} percent`}
    >
      <div className="flex h-22 w-22 flex-col items-center justify-center rounded-full bg-[var(--landing-paper-soft)]">
        <span className="font-outfit text-2xl font-extrabold text-[var(--landing-ink)]">
          {value}%
        </span>
        <span className="font-outfit text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)]">
          match
        </span>
      </div>
    </div>
  );
}

export default function KeywordChecker({ mode = "match" }) {
  const matchMode = mode === "match";
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted || jobText.trim().length < 40) return null;

    const terms = extractTerms(jobText, matchMode ? 24 : 30);
    if (!matchMode) return { terms };

    // A phrase counts as covered when the CV contains all of its words —
    // requiring the exact adjacent wording would report "payments platform" as
    // missing from a CV that says "built the payments service".
    const cvStems = new Set(tokenize(cvText).map(stem));
    const scored = terms.map((item) => ({
      ...item,
      present: item.words.every((word) => cvStems.has(stem(word))),
    }));

    const weightTotal = scored.reduce((sum, item) => sum + item.score, 0);
    const weightHit = scored
      .filter((item) => item.present)
      .reduce((sum, item) => sum + item.score, 0);

    return {
      terms: scored,
      score: weightTotal ? Math.round((weightHit / weightTotal) * 100) : 0,
      missing: scored.filter((item) => !item.present),
    };
  }, [submitted, jobText, cvText, matchMode]);

  const tooShort = jobText.trim().length < 40;

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="flex flex-col gap-5"
      >
        <div className={matchMode ? "grid gap-5 md:grid-cols-2" : ""}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Paste the job description
            </label>
            <textarea
              id="job-text"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={matchMode ? 10 : 12}
              placeholder="Paste the full text of the job posting here…"
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>

          {matchMode ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="cv-text"
                className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
              >
                Paste your CV text
              </label>
              <textarea
                id="cv-text"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={10}
                placeholder="Open your CV, select all, copy, and paste it here…"
                className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={tooShort}
            className="landing-primary-btn font-outfit text-sm disabled:cursor-not-allowed disabled:opacity-45"
          >
            {matchMode ? "Score my CV" : "Extract keywords"}
          </button>
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            Runs entirely in your browser. Nothing is uploaded or stored.
          </p>
        </div>
      </form>

      {result ? (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          {matchMode ? (
            <>
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <ScoreRing value={result.score} />
                <div>
                  <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                    {result.score >= 75
                      ? "Strong keyword coverage"
                      : result.score >= 50
                        ? "Partial coverage — worth a tailoring pass"
                        : "Weak coverage for this posting"}
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--landing-ink-soft)]">
                    {result.missing.length
                      ? `Your CV covers ${result.terms.length - result.missing.length} of the ${result.terms.length} terms this posting leans on. The ones below are missing — add the ones you can honestly evidence.`
                      : "Your CV mentions every significant term in this posting. Check that each one appears inside a bullet with a result attached, not only in a skills list."}
                  </p>
                </div>
              </div>

              {result.missing.length ? (
                <>
                  <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                    Missing from your CV
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {result.missing.map(({ term }) => (
                      <li
                        key={term}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
                      >
                        <XIcon
                          size={11}
                          weight="bold"
                          aria-hidden="true"
                          className="text-[var(--landing-coral)]"
                        />
                        {term}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                Already covered
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.terms
                  .filter((item) => item.present)
                  .map(({ term }) => (
                    <li
                      key={term}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
                    >
                      <CheckIcon
                        size={11}
                        weight="bold"
                        aria-hidden="true"
                        className="text-[var(--landing-success)]"
                      />
                      {term}
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                The {result.terms.length} terms this posting leans on
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                Ranked by how much weight the posting gives them. Work down the
                list and make sure each one you can honestly claim appears in a
                bullet on your CV with a result attached.
              </p>
              <ol className="mt-6 grid gap-2 sm:grid-cols-2">
                {result.terms.map(({ term }, i) => (
                  <li
                    key={term}
                    className="flex items-center gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-2.5"
                  >
                    <span className="font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-[var(--landing-ink)]">
                      {term}
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.25)] bg-[oklch(0.92_0.06_174_/_0.4)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                Want the rewrite, not just the diagnosis?
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                Paste the job link and FitMyCV rewrites your CV and cover letter
                against the posting, keeping your real experience.
              </p>
            </div>
            <Link
              href="/tailor-cv-from-job-link"
              className="landing-primary-btn group shrink-0 font-outfit text-sm"
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
      ) : null}
    </div>
  );
}
