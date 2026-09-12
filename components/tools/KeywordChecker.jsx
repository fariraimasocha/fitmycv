"use client";

// Client-side keyword checker used by /ats-resume-checker (match mode),
// /free-ats-keyword-checker (keywords mode) and /missing-resume-keywords
// (gaps mode).
//
// ponytail: the extraction runs entirely in the browser. No API route, no
// model call, no storage. A dropped PDF is read locally with unpdf. It is a
// heuristic, not the tailoring engine, and that is the point: it costs
// nothing to run and never sends anyone's CV anywhere. The real rewrite lives
// behind /tailor-cv-from-job-link.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import LeadEmailCapture from "@/components/tools/LeadEmailCapture";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";

// Words that carry no signal when matching a CV against a posting. The second
// block is job-advert boilerplate. Without it the top of the list fills up
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
 * "service". Not a real stemmer. It only needs to stop obvious inflections
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

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * Ranks the terms a posting leans on. Unigrams score by frequency; bigrams are
 * only admitted when the exact phrase recurs, which keeps real compounds
 * ("project management", "incident response") and drops one-off prose
 * fragments ("build distributed", "run services").
 *
 * `score` is the ranking weight (bigrams are boosted). `count` is the raw
 * number of times the term appears, which is the only number gaps mode is
 * allowed to put on screen.
 *
 * ponytail: `count` counts the literal token, so a posting that writes
 * "managing" three times and "manage" once reports them as two terms rather
 * than one term mentioned four times. Stemming is applied when matching
 * against the CV, not when counting the posting.
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
        <span className="font-outfit text-xs font-extrabold uppercase tracking-widest text-[var(--landing-ink-soft)]">
          match
        </span>
      </div>
    </div>
  );
}

export default function KeywordChecker({ mode = "match" }) {
  const matchMode = mode === "match";
  const gapsMode = mode === "gaps";
  // Both scoring modes need the CV as well as the posting.
  const needsCv = matchMode || gapsMode;
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();

  const result = useMemo(() => {
    if (!ran || jobText.trim().length < 40) return null;

    const withCv = mode === "match" || mode === "gaps";
    const terms = extractTerms(jobText, withCv ? 24 : 30);
    if (!withCv) return { terms };

    // A phrase counts as covered when the CV contains all of its words.
    // Requiring the exact adjacent wording would report "payments platform" as
    // missing from a CV that says "built the payments service".
    const cvStems = new Set(tokenize(cvText).map(stem));
    const scored = terms.map((item) => ({
      ...item,
      present: item.words.every((word) => cvStems.has(stem(word))),
    }));
    const missing = scored.filter((item) => !item.present);

    if (mode === "gaps") {
      return {
        terms: scored,
        // Gaps mode ranks by the honest mention count, not the ranking weight,
        // because the count is the number shown next to each term.
        missing: [...missing].sort(
          (a, b) => b.count - a.count || a.term.localeCompare(b.term)
        ),
        covered: scored.filter((item) => item.present),
      };
    }

    const weightTotal = scored.reduce((sum, item) => sum + item.score, 0);
    const weightHit = scored
      .filter((item) => item.present)
      .reduce((sum, item) => sum + item.score, 0);

    return {
      terms: scored,
      score: weightTotal ? Math.round((weightHit / weightTotal) * 100) : 0,
      missing,
    };
  }, [ran, jobText, cvText, mode]);

  const tooShort = jobText.trim().length < 40;

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
        }}
        className="flex flex-col gap-5"
      >
        <div className={needsCv ? "grid gap-5 md:grid-cols-2" : ""}>
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
              rows={needsCv ? 10 : 12}
              placeholder="Paste the full text of the job posting here…"
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>

          {needsCv ? (
            <ResumeFileField
              id="cv-text"
              label="Your CV"
              value={cvText}
              onChange={(text) => {
                setCvText(text);
                reset();
              }}
              onBusyChange={setCvBusy}
            />
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label={
              gapsMode
                ? "Find missing keywords"
                : matchMode
                  ? "Score my CV"
                  : "Extract keywords"
            }
            busyLabel={
              gapsMode
                ? "Finding your gaps"
                : matchMode
                  ? "Scoring your CV"
                  : "Reading the posting"
            }
            running={running}
            disabled={tooShort || cvBusy || (needsCv && cvText.trim().length < 40)}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? "Reading your CV"
              : running
                ? "Working through the posting"
                : needsCv
                ? "Your CV is read in this tab. Nothing is stored."
                : "Runs entirely in your browser. Nothing is stored."}
          </p>
        </div>
      </form>

      {running ? (
        <ToolProgress
          message={
            gapsMode
              ? "Finding your gaps"
              : matchMode
                ? "Scoring your CV"
                : "Reading the posting"
          }
          lines={5}
        />
      ) : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
          {gapsMode ? (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {result.missing.length
                  ? `${plural(result.missing.length, "keyword")} missing from your CV`
                  : "Nothing missing from your CV"}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {result.missing.length
                  ? `This posting leans on ${result.terms.length} terms and your CV mentions ${result.covered.length} of them. The rest are below, ranked by how often the posting mentions each one. Add the ones you can honestly evidence.`
                  : `Your CV mentions all ${result.terms.length} terms this posting leans on. Check that each one sits inside a bullet with a result attached, not only in a skills list.`}
              </p>

              {result.missing.length ? (
                <ol className="mt-6 grid gap-2 sm:grid-cols-2">
                  {result.missing.map(({ term, count }) => (
                    <li
                      key={term}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.06)] px-4 py-3"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--landing-ink)]">
                        <XIcon
                          size={12}
                          weight="bold"
                          aria-hidden="true"
                          className="shrink-0 text-[var(--landing-coral)]"
                        />
                        <span className="truncate">{term}</span>
                      </span>
                      <span className="shrink-0 font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)]">
                        <span aria-hidden="true" className="tabular-nums">
                          Mentioned {count}x
                        </span>
                        <span className="sr-only">
                          Mentioned {count} times in the job description
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}

              {result.covered.length ? (
                <details className="mt-8 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4">
                  <summary className="cursor-pointer rounded-lg font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2">
                    Already covered ({result.covered.length})
                  </summary>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {result.covered.map(({ term }) => (
                      <li
                        key={term}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--landing-line)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
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
                </details>
              ) : null}
            </>
          ) : matchMode ? (
            <>
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <ScoreRing value={result.score} />
                <div>
                  <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                    {result.score >= 75
                      ? "Strong keyword coverage"
                      : result.score >= 50
                        ? "Partial coverage. Worth a tailoring pass"
                        : "Weak coverage for this posting"}
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--landing-ink-soft)]">
                    {result.missing.length
                      ? `Your CV covers ${result.terms.length - result.missing.length} of the ${result.terms.length} terms this posting leans on. The ones below are missing. Add the ones you can honestly evidence.`
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

              <LeadEmailCapture
                score={result.score}
                missingKeywordCount={result.missing.length}
              />
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
                    <span className="font-outfit text-xs font-extrabold tabular-nums text-[var(--landing-ink-soft)]">
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
                {gapsMode
                  ? "Fix these gaps with FitMyCV"
                  : "Want the rewrite, not just the diagnosis?"}
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                {gapsMode
                  ? "Paste the job link and FitMyCV works the missing terms into your bullets, using the experience you already have."
                  : "Paste the job link and FitMyCV rewrites your CV and cover letter against the posting, keeping your real experience."}
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
      ) : null}
    </div>
  );
}
