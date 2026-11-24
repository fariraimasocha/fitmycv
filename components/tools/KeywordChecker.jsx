"use client";

// Client-side keyword checker used by /ats-resume-checker (match mode),
// /free-ats-keyword-checker (keywords mode) and /missing-resume-keywords
// (gaps mode).
//
// ponytail: the extraction runs entirely in the browser. No API route, no
// model call, no storage. A dropped PDF is read locally with unpdf. It is a
// heuristic, not the tailoring engine, and that is the point: it costs
// nothing to run and never sends anyone's CV anywhere. The rewrite CTA saves
// the job text and sends signed-in users straight into /dashboard/tailor.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import LeadEmailCapture from "@/components/tools/LeadEmailCapture";
import ToolShell, {
  ToolStepActions,
  ToolStepBack,
} from "@/components/tools/ToolShell";
import {
  CV_JOB_STEPS,
  JOB_ONLY_STEPS,
} from "@/components/tools/ToolStepper";
import { ArcGauge } from "@/components/charts/ArcGauge";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import {
  CopyButton,
  TOOL_PRIVACY,
  ToolProgress,
  ToolSubmitButton,
  useToolRun,
} from "@/components/tools/tool-run";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { readJobDraft, saveAtsHandoff, saveCvHandoff, saveJobDraft } from "@/lib/ats-handoff";
import { isLinkOnly } from "@/lib/ats-detect";
import { trackEvent } from "@/lib/analytics";
import { extractTerms, stem, tokenize } from "@/lib/keywords";

// The score is the peak of this tool, so it fills and counts up instead of
// appearing static. ArcGauge and AnimatedNumber both fall back to the final
// value under reduced motion.
function ScoreRing({ value }) {
  const t = useTranslations("pages.tools.keywordChecker");
  const tone =
    value >= 75
      ? "var(--landing-success)"
      : value >= 50
        ? "var(--landing-accent)"
        : "var(--landing-coral)";

  return (
    <ArcGauge
      value={value}
      size={112}
      strokeWidth={9}
      color={tone}
      label={t("scoreLabel", { value })}
      trackClassName="text-[var(--landing-line)]"
    >
      <span className="font-outfit text-2xl font-extrabold text-[var(--landing-ink)]">
        <AnimatedNumber value={value} />%
      </span>
      <span className="font-outfit text-xs font-extrabold uppercase tracking-widest text-[var(--landing-ink-soft)]">
        {t("scoreUnit")}
      </span>
    </ArcGauge>
  );
}

const HIGH_MATCH_SCORE = 75;
const MIN_JOB_CHARS = 40;

// Returns the message key of the bottom handoff card.
function handoffKey({ gapsMode, score }) {
  if (typeof score === "number" && score >= HIGH_MATCH_SCORE) return "handoffHigh";
  return gapsMode ? "handoffGaps" : "handoffMatch";
}

export default function KeywordChecker({ mode = "match" }) {
  const matchMode = mode === "match";
  const gapsMode = mode === "gaps";
  // Both scoring modes need the CV as well as the posting.
  const needsCv = matchMode || gapsMode;
  const t = useTranslations("pages.tools.keywordChecker");
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();
  const [step, setStep] = useState(1);
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const tool = `ats_checker_${mode}`;
  const { running, ran, start, reset } = useToolRun(tool);
  const steps = needsCv ? CV_JOB_STEPS : JOB_ONLY_STEPS;
  const resultsStep = needsCv ? 3 : 2;
  // Shown under the button, not as a toast. Toasts in the corner were missed
  // and the button looked like it did nothing.
  const [formError, setFormError] = useState("");
  // Runs started on this page. From the second one on, the result offers the
  // rewrite more directly: someone iterating wants the fix, not another score.
  const [runs, setRuns] = useState(0);

  // Someone who goes to sign-in and comes back should find the posting still
  // pasted. Read after mount, the server has no storage.
  useEffect(() => {
    const draft = readJobDraft();
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the sessionStorage draft on mount */
    if (draft) setJobText(draft);
  }, []);

  const result = useMemo(() => {
    if (!ran || jobText.trim().length < MIN_JOB_CHARS) return null;

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

  // One event per completed run. `result` recomputes on every keystroke in the
  // job field, because the score updates live, so the ref scopes the event to
  // the run rather than to the render. check_index is what makes the
  // iterate-against-many-postings pattern legible: someone on their eighth pass
  // is not the same user as someone on their first, and until now this page
  // sent nothing at all.
  const runReported = useRef(false);
  const checksThisSession = useRef(0);

  useEffect(() => {
    if (!ran) {
      runReported.current = false;
      return;
    }
    if (runReported.current || !result) return;

    runReported.current = true;
    checksThisSession.current += 1;
    trackEvent("ats_check_completed", {
      mode,
      check_index: checksThisSession.current,
      term_count: result.terms.length,
      ...(typeof result.score === "number" ? { score: result.score } : {}),
      ...(result.missing ? { missing_count: result.missing.length } : {}),
    });
  }, [ran, result, mode]);

  // On a phone the result renders below the fold, so the reveal would go
  // unseen. Bring it up once per run, not on every live rescore.
  const resultRef = useRef(null);
  useEffect(() => {
    if (!ran || !window.matchMedia("(max-width: 639px)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  }, [ran]);

  const jobChars = jobText.trim().length;
  const tooShort = jobChars < MIN_JOB_CHARS;
  const cvTooShort = needsCv && cvText.trim().length < 40;

  const goStep = (n) => {
    if (n < resultsStep) reset();
    setFormError("");
    setStep(n);
  };

  const submitLabel = gapsMode
    ? t("submitGaps")
    : matchMode
      ? t("submitMatch")
      : t("submitKeywords");
  const busyLabel = gapsMode
    ? t("busyGaps")
    : matchMode
      ? t("busyMatch")
      : t("busyKeywords");

  const ctaKey = handoffKey({
    gapsMode,
    score: typeof result?.score === "number" ? result.score : null,
  });

  const handleTailorHandoff = (placement) => {
    const text = jobText.trim();
    if (!text) return;
    const score =
      typeof result?.score === "number" ? result.score : null;
    saveAtsHandoff({
      jobText: text,
      score,
      source: gapsMode ? "gaps" : matchMode ? "match" : "keywords",
    });
    trackEvent("ats_handoff_cta", {
      score,
      source: gapsMode ? "gaps" : matchMode ? "match" : "keywords",
      signed_in: Boolean(session?.user),
      placement,
      check_count: runs,
    });
    const dest = "/dashboard/tailor";
    if (session?.user) {
      router.push(dest);
      return;
    }
    // New users skip the PDF upload: onboarding's paste box gets this CV.
    if (cvText.trim()) saveCvHandoff(cvText, "ats_checker");
    const authUrl = `/auth?next=${encodeURIComponent(dest)}`;
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

  // The next step sits beside the score, not only at the bottom of the
  // results. People checking again and again never scrolled down to it.
  const missingCount = result?.missing?.length ?? 0;
  const repeatCheck = runs >= 2;
  const topCta =
    needsCv && result ? (
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm font-semibold leading-6 text-[var(--landing-ink)]">
          {repeatCheck
            ? t("topRepeat", { count: runs })
            : missingCount
              ? t("topMissing", { count: missingCount })
              : t("topStrong")}
        </p>
        <button
          type="button"
          onClick={() => handleTailorHandoff("top")}
          className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
        >
          {repeatCheck ? t("topCtaRepeat") : t("topCta")}
          <ArrowRightIcon
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    ) : null;

  const runCheck = () => {
    if (isLinkOnly(jobText)) {
      setFormError(t("errorLink"));
      return;
    }
    if (tooShort || cvTooShort) {
      setFormError(
        tooShort && cvTooShort
          ? t("errorBoth")
          : tooShort
            ? t("errorJob")
            : t("errorCv")
      );
      return;
    }
    setFormError("");
    setRuns((n) => n + 1);
    start();
  };

  return (
    <ToolShell steps={steps} current={result ? resultsStep : step} onStepSelect={goStep}>
      {needsCv && !result && step === 1 ? (
        <div className="mx-auto w-full max-w-xl">
          <ResumeFileField
            id="cv-text"
            variant="hero"
            hideLabel
            label={t("cvLabel")}
            value={cvText}
            onChange={(text) => {
              setCvText(text);
              setFormError("");
              reset();
            }}
            onBusyChange={setCvBusy}
            onReady={(text) => {
              if (text.trim().length >= 40) setStep(2);
            }}
          />
          {!cvTooShort && !cvBusy ? (
            <ToolStepActions hint={TOOL_PRIVACY}>
              <ToolSubmitButton
                type="button"
                label="Continue"
                busyLabel={t("readingCv")}
                running={false}
                disabled={false}
                onClick={() => setStep(2)}
              />
            </ToolStepActions>
          ) : null}
        </div>
      ) : null}

      {((needsCv && !result && step === 2) || (!needsCv && step === 1)) && !running ? (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            runCheck();
          }}
          className="mx-auto flex w-full max-w-xl flex-col gap-5"
        >
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              {t("jobLabel")}{" "}
              <span className="font-sans text-xs font-semibold text-[var(--landing-ink-soft)]">
                {t("required")}
              </span>
            </label>
            <textarea
              id="job-text"
              value={jobText}
              onChange={(e) => {
                setJobText(e.target.value);
                saveJobDraft(e.target.value);
                setFormError("");
              }}
              rows={12}
              autoFocus={needsCv}
              required
              minLength={MIN_JOB_CHARS}
              aria-describedby="job-text-count"
              placeholder={t("jobPlaceholder")}
              className="min-w-0 w-full max-w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-base leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-accent)] sm:text-sm"
            />
            <p
              id="job-text-count"
              aria-live="polite"
              className={`text-xs font-semibold tabular-nums ${
                tooShort
                  ? "text-[var(--landing-ink-soft)]"
                  : "text-[var(--landing-accent)]"
              }`}
            >
              {tooShort
                ? t("jobTooShort", { count: jobChars, min: MIN_JOB_CHARS })
                : t("jobAdded")}
            </p>
          </div>

          <ToolStepActions
            hint={
              formError
                ? formError
                : cvBusy
                  ? t("readingCv")
                  : t("privacy")
            }
          >
            <ToolSubmitButton
              label={submitLabel}
              busyLabel={busyLabel}
              running={running}
              disabled={cvBusy}
            />
            {needsCv ? (
              <ToolStepBack label="Back to resume" onClick={() => goStep(1)} />
            ) : null}
          </ToolStepActions>
          {formError ? (
            <p role="alert" className="text-center text-xs font-semibold text-[var(--landing-coral)]">
              {formError}
            </p>
          ) : null}
        </form>
      ) : null}

      {((needsCv && !result && step === 2) || (!needsCv && step === 1)) && running ? (
        <div className="mx-auto w-full max-w-xl">
          <ToolProgress message={busyLabel} lines={5} />
        </div>
      ) : null}

      {result ? (
        <div ref={resultRef} className="landing-rise mx-auto w-full max-w-2xl scroll-mt-24">
          {gapsMode ? (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {result.missing.length
                  ? t("gapsMissingTitle", { count: result.missing.length })
                  : t("gapsNoneTitle")}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {result.missing.length
                  ? t("gapsMissingBody", { total: result.terms.length, covered: result.covered.length })
                  : t("gapsNoneBody", { total: result.terms.length })}
              </p>
              {topCta}

              {result.missing.length ? (
                <div className="mt-6 flex items-center justify-between gap-3">
                  <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                    {t("missingHeading")}
                  </p>
                  <CopyButton tool={tool} text={result.missing.map(({ term }) => term).join(", ")} />
                </div>
              ) : null}

              {result.missing.length ? (
                <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                  {result.missing.map(({ term, count }) => (
                    <li
                      key={term}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.06)] px-4 py-3"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--landing-ink)]">
                        <XIcon
                          size={12}
                          aria-hidden="true"
                          className="shrink-0 text-[var(--landing-coral)]"
                        />
                        <span className="truncate">{term}</span>
                      </span>
                      <span className="shrink-0 font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)]">
                        <span aria-hidden="true" className="tabular-nums">
                          {t("mentionedShort", { count })}
                        </span>
                        <span className="sr-only">
                          {t("mentionedLong", { count })}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}

              {result.covered.length ? (
                <details className="mt-8 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4">
                  <summary className="cursor-pointer rounded-lg font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2">
                    {t("alreadyCoveredCount", { count: result.covered.length })}
                  </summary>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {result.covered.map(({ term }) => (
                      <li
                        key={term}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--landing-line)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
                      >
                        <CheckIcon
                          size={12}
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
                      ? t("scoreStrong")
                      : result.score >= 50
                        ? t("scorePartial")
                        : t("scoreWeak")}
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--landing-ink-soft)]">
                    {result.missing.length
                      ? t("matchMissingBody", { covered: result.terms.length - result.missing.length, total: result.terms.length })
                      : t("matchNoneBody")}
                  </p>
                </div>
              </div>
              {topCta}

              {result.missing.length ? (
                <>
                  <div className="mt-8 flex items-center justify-between gap-3">
                    <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                      {t("missingHeading")}
                    </p>
                    <CopyButton tool={tool} text={result.missing.map(({ term }) => term).join(", ")} />
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {result.missing.map(({ term }) => (
                      <li
                        key={term}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
                      >
                        <XIcon
                          size={12}
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
                {t("coveredHeading")}
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
                        size={12}
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                    {t("keywordsTitle", { count: result.terms.length })}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                    {t("keywordsBody")}
                  </p>
                </div>
                <CopyButton tool={tool} text={result.terms.map(({ term }) => term).join(", ")} />
              </div>
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

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                {t(`${ctaKey}.title`)}
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                {t(`${ctaKey}.body`)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTailorHandoff("bottom")}
              className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              {t(`${ctaKey}.cta`)}
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* The tailor is the one next step. The emailed copy is a quieter
              option underneath it, not a second ending above it. */}
          {gapsMode ? (
            <LeadEmailCapture
              score={result.score}
              missingKeywordCount={result.missing.length}
            />
          ) : null}

          <div className="mt-6 flex justify-center">
            <ToolStepBack
              label={needsCv ? "Check another job" : "Try another posting"}
              onClick={() => {
                goStep(needsCv ? 2 : 1);
              }}
            />
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
}
