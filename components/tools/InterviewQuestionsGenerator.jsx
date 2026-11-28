"use client";

// Interview questions from a job description, used by
// /interview-questions-from-job-description.
//
// ponytail: runs in the browser like the summary generator. No API route, no
// model call, no storage. lib/interview-questions.js picks the questions from
// the posting and the proof lines from the CV.

import { useEffect, useMemo, useState } from "react";
import { QuotesIcon, WarningCircleIcon } from "@phosphor-icons/react";

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
  cvJobDetail,
  revealDelay,
  useToolRun,
} from "@/components/tools/tool-run";
import { generateInterviewQuestions } from "@/lib/interview-questions";
import { isLinkOnly } from "@/lib/ats-detect";
import { trackEvent } from "@/lib/analytics";

const KIND_LABEL = {
  role: "About the role",
  skill: "From the posting, on your CV",
  gap: "From the posting, missing from your CV",
};

export default function InterviewQuestionsGenerator() {
  const [step, setStep] = useState(1);
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun("interview_questions");
  const [currentYear] = useState(() => new Date().getFullYear());

  const jobIsLink = isLinkOnly(jobText);
  const jobTooShort = jobText.trim().length < 40 || jobIsLink;
  const resumeTooShort = resumeText.trim().length < 40;

  const result = useMemo(() => {
    if (!ran || jobTooShort || resumeTooShort) return null;
    return generateInterviewQuestions(jobText, resumeText, currentYear);
  }, [ran, jobText, resumeText, jobTooShort, resumeTooShort, currentYear]);

  const gapCount = result?.questions.filter((q) => q.kind === "gap").length ?? 0;

  useEffect(() => {
    if (!result) return;
    trackEvent("interview_questions_generated", {
      questions: result.questions.length,
      gaps: gapCount,
    });
  }, [result, gapCount]);

  const goStep = (n) => {
    if (n < 3) reset();
    setStep(n);
  };

  return (
    <ToolShell steps={CV_JOB_STEPS} current={result ? 3 : step} onStepSelect={goStep}>
      {!result && step === 1 ? (
        <div className="mx-auto w-full max-w-xl">
          <ResumeFileField
            id="interview-resume-text"
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

      {!result && step === 2 && !running ? (
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
              htmlFor="interview-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Job description
            </label>
            <textarea
              id="interview-job-text"
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
              label="Get my questions"
              busyLabel="Reading the posting"
              running={running}
              disabled={jobTooShort || resumeTooShort || cvBusy}
            />
            <ToolStepBack label="Back to resume" onClick={() => goStep(1)} />
          </ToolStepActions>
        </form>
      ) : null}

      {!result && step === 2 && running ? (
        <div className="mx-auto w-full max-w-xl">
          <ToolProgress
            message="Reading the posting"
            detail={cvJobDetail(resumeText, jobText)}
            lines={4}
          />
        </div>
      ) : null}

      {result ? (
        <div className="landing-rise mx-auto w-full max-w-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {result.questions.length} questions for{" "}
                <span className="text-[var(--landing-primary-dark)]">
                  {result.title ?? "this job"}
                </span>
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                Picked from what the posting asks for. Every proof line is
                copied from your CV.
              </p>
            </div>
            <CopyButton
              tool="interview_questions"
              label="Copy all"
              message="Questions copied"
              ariaLabel="Copy all questions"
              text={result.questions
                .map((q) =>
                  [q.q, q.evidence ? `Your proof: ${q.evidence}` : null, q.tip].filter(Boolean).join("\n")
                )
                .join("\n\n")}
            />
          </div>

          {/* Peak: the tally, then each question dealt on its own beat. No gaps
              gets the one glow. */}
          {result.questions.length ? (
            <p
              className={`mt-5 inline-flex rounded-full px-3 py-1 font-outfit text-xs font-extrabold tabular-nums ${
                gapCount
                  ? "bg-[var(--landing-paper-strong)] text-[var(--landing-ink-soft)]"
                  : "peak-glow bg-[var(--landing-success-soft)] text-[var(--landing-success)]"
              }`}
            >
              {gapCount
                ? `${gapCount} ${gapCount === 1 ? "gap" : "gaps"} to prepare for`
                : "No skill gaps found"}
            </p>
          ) : null}

          <ol className="mt-6 flex flex-col gap-3">
            {result.questions.map((q, i) => (
              <li
                key={q.id}
                style={revealDelay(i, 150)}
                className={
                  q.kind === "gap"
                    ? "tool-reveal flex flex-col gap-2 rounded-2xl border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.05)] p-5"
                    : "tool-reveal flex flex-col gap-2 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5"
                }
              >
                <p className="inline-flex items-center gap-1.5 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                  {q.kind === "gap" ? (
                    <WarningCircleIcon
                      size={14}
                      aria-hidden="true"
                      className="text-[var(--landing-coral)]"
                    />
                  ) : null}
                  {KIND_LABEL[q.kind]}
                </p>
                <p className="text-base font-bold leading-7 text-[var(--landing-ink)]">{q.q}</p>
                {q.evidence ? (
                  <p className="flex gap-2 rounded-xl bg-[var(--landing-accent-soft)] px-3 py-2 text-sm leading-6 text-[var(--landing-ink)]">
                    <QuotesIcon
                      size={14}
                      weight="fill"
                      aria-hidden="true"
                      className="mt-1.25 shrink-0 text-[var(--landing-accent)]"
                    />
                    <span>
                      <span className="font-bold">Your proof: </span>
                      {q.evidence}
                    </span>
                  </p>
                ) : null}
                <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">{q.tip}</p>
              </li>
            ))}
          </ol>

          <HandoffCta
            title={
              gapCount === 1
                ? "1 of these questions hits a gap in your CV"
                : gapCount
                  ? `${gapCount} of these questions hit gaps in your CV`
                  : "Your CV covers what they will ask"
            }
            body={
              gapCount
                ? "Close them before they read it. Sign up free and FitMyCV tailors your CV to this posting, using only your real experience."
                : "Make sure the recruiter sees that too. Sign up free and FitMyCV tailors your CV to this posting, using only your real experience."
            }
            label={gapCount ? "Close the gaps" : "Tailor my CV to this job"}
            source="interview"
            jobText={jobText}
            cvText={resumeText}
            track={{ gaps: gapCount }}
          />

          <div className="mt-6 flex justify-center">
            <ToolStepBack
              label="Try another job"
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