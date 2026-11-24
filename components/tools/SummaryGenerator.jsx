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
// The readers live in lib/summary-helpers.js, shared with the job application
// letter generator. They started as a copy of HeadlineGenerator.jsx's helpers.

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import HandoffCta from "@/components/tools/HandoffCta";
import ToolShell, {
  ToolStepActions,
  ToolStepBack,
} from "@/components/tools/ToolShell";
import { CV_JOB_STEPS } from "@/components/tools/ToolStepper";
import {
  CopyButton,
  JOB_IS_LINK,
  TOOL_PRIVACY,
  ToolProgress,
  ToolSubmitButton,
  useToolRun,
} from "@/components/tools/tool-run";
import { isLinkOnly } from "@/lib/ats-detect";
import { notCompanyTerm } from "@/lib/keywords";
import { generateSummaries } from "@/lib/summary-helpers";

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
          size={12}
          aria-hidden="true"
          className="text-[var(--landing-success)]"
        />
      ) : (
        <XIcon
          size={12}
          aria-hidden="true"
          className="text-[var(--landing-coral)]"
        />
      )}
      {label}
    </li>
  );
}

export default function SummaryGenerator() {
  const [step, setStep] = useState(1);
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun("summary");
  // Captured once so the render body stays pure. Years read from date ranges
  // need a "today" to count up to.
  const [currentYear] = useState(() => new Date().getFullYear());

  const jobIsLink = isLinkOnly(jobText);
  const jobTooShort = jobText.trim().length < 40 || jobIsLink;
  const resumeTooShort = resumeText.trim().length < 40;

  const result = useMemo(() => {
    if (!ran || jobTooShort || resumeTooShort) return null;
    const keep = notCompanyTerm(jobText);
    const out = generateSummaries(jobText, resumeText, currentYear);
    return {
      ...out,
      matched: out.matched.filter((item) => keep(item.term)),
      missing: out.missing.filter((item) => keep(item.term)),
    };
  }, [ran, jobText, resumeText, jobTooShort, resumeTooShort, currentYear]);

  const goStep = (n) => {
    if (n < 3) reset();
    setStep(n);
  };

  return (
    <ToolShell steps={CV_JOB_STEPS} current={result ? 3 : step} onStepSelect={goStep}>
      {!result && step === 1 ? (
        <div className="mx-auto w-full max-w-xl">
          <ResumeFileField
            id="summary-resume-text"
            variant="hero"
            hideLabel
            value={resumeText}
            onChange={(text) => {
              setResumeText(text);
              reset();
            }}
            onBusyChange={setCvBusy}
            onReady={(text) => {
              if (text.trim().length >= 40) setStep(2);
            }}
          />
          {!resumeTooShort && !cvBusy ? (
            <ToolStepActions hint={TOOL_PRIVACY}>
              <ToolSubmitButton
                label="Continue"
                busyLabel="Reading your CV"
                running={false}
                disabled={false}
                onClick={() => setStep(2)}
                type="button"
              />
            </ToolStepActions>
          ) : null}
        </div>
      ) : null}

      {!result && step === 2 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (jobTooShort || resumeTooShort || cvBusy) return;
            start();
          }}
          className="mx-auto flex w-full max-w-xl flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="summary-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Job description
            </label>
            <textarea
              id="summary-job-text"
              value={jobText}
              onChange={(e) => {
                setJobText(e.target.value);
                reset();
              }}
              rows={12}
              autoFocus
              placeholder="Paste the full text of the job posting here."
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-accent)]"
            />
          </div>

          <ToolStepActions
            hint={
              jobIsLink
                ? JOB_IS_LINK
                : jobTooShort
                  ? "Paste the full job posting to continue."
                  : TOOL_PRIVACY
            }
          >
            <ToolSubmitButton
              label="Write my summary"
              busyLabel="Writing your summaries"
              running={running}
              disabled={jobTooShort || resumeTooShort || cvBusy}
            />
            <ToolStepBack label="Back to resume" onClick={() => goStep(1)} />
          </ToolStepActions>
        </form>
      ) : null}

      {!result && step === 2 && running ? (
        <div className="mx-auto w-full max-w-xl">
          <ToolProgress message="Writing your summaries" lines={3} />
        </div>
      ) : null}

      {result ? (
        <div className="landing-rise mx-auto w-full max-w-2xl">
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
                      <CopyButton
                        tool="summary"
                        text={summary.text}
                        message="Summary copied"
                        ariaLabel={`Copy summary: ${summary.shape}`}
                      />
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

          <HandoffCta
            title="Summary done. Is the rest of the CV?"
            body="Sign up free and FitMyCV rewrites your whole CV and cover letter against this posting, keeping your real experience."
            label="Tailor my whole CV to this job"
            source="summary"
            jobText={jobText}
            cvText={resumeText}
          />

          <div className="mt-6 flex justify-center">
            <ToolStepBack
              label="Write for another job"
              onClick={() => {
                setJobText("");
                goStep(2);
              }}
            />
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
}
