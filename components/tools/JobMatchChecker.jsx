"use client";

// Free resume ↔ job match. Runs in the browser. A dropped PDF is read
// locally. The rewrite lives behind /tailor-cv-from-job-link so this page
// can stay unlimited and account-free.
//
// Stepped shell (Upload → Add job → View results) mirrors the Jobscan free
// tool pattern, in FitMyCV colours.

import { useMemo, useState } from "react";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import HandoffCta from "@/components/tools/HandoffCta";
import ToolSiblingLink from "@/components/tools/ToolSiblingLink";
import ToolShell, {
  ToolStepActions,
  ToolStepBack,
} from "@/components/tools/ToolShell";
import { CV_JOB_STEPS } from "@/components/tools/ToolStepper";
import {
  JOB_IS_LINK,
  TOOL_PRIVACY,
  ToolProgress,
  ToolSubmitButton,
  useToolRun,
} from "@/components/tools/tool-run";
import { isLinkOnly } from "@/lib/ats-detect";
import { scoreResumeJobMatch } from "@/lib/resume-job-match";

const HIGH_MATCH_SCORE = 75;

function ScoreRing({ value }) {
  const tone =
    value >= 75
      ? "var(--landing-success)"
      : value >= 50
        ? "var(--landing-accent)"
        : "var(--landing-coral)";

  return (
    <div
      className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${tone} ${value * 3.6}deg, oklch(0.905 0.02 83) 0deg)`,
      }}
      role="img"
      aria-label={`Match score: ${value} percent`}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--landing-paper-soft)]">
        <span className="font-outfit text-3xl font-extrabold text-[var(--landing-ink)]">
          {value}%
        </span>
        <span className="font-outfit text-xs font-extrabold uppercase tracking-widest text-[var(--landing-ink-soft)]">
          Match
        </span>
      </div>
    </div>
  );
}

function MatchBar({ label, value }) {
  const tone =
    value >= 75
      ? "bg-[var(--landing-success)]"
      : value >= 50
        ? "bg-[var(--landing-accent)]"
        : "bg-[var(--landing-coral)]";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
          {label}
        </span>
        <span className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
          {value}%
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SkillChip({ term, present }) {
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
      {term}
    </li>
  );
}

export default function JobMatchChecker() {
  const [step, setStep] = useState(1);
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun("job_match");

  const jobIsLink = isLinkOnly(jobText);
  const jobTooShort = jobText.trim().length < 40 || jobIsLink;
  const cvTooShort = cvText.trim().length < 40;

  const result = useMemo(() => {
    if (!ran || jobTooShort || cvTooShort) return null;
    return scoreResumeJobMatch(jobText, cvText);
  }, [ran, jobText, cvText, jobTooShort, cvTooShort]);

  const highMatch =
    typeof result?.overall === "number" && result.overall >= HIGH_MATCH_SCORE;
  // Same voice as the ATS checker ending so the two tools feel like one product.
  const ctaTitle = highMatch
    ? "Lock this match into a tailored CV"
    : "Close these gaps in a rewrite";
  const ctaBody = highMatch
    ? "Your match is strong. Keep this posting and rewrite your CV against it, using the experience you already have."
    : "Keep this posting and FitMyCV works the missing terms into your bullets, using the experience you already have.";
  const ctaLabel = highMatch
    ? "Tailor my CV to this job"
    : "Rewrite my CV for this job";

  const goStep = (n) => {
    if (n < 3) reset();
    setStep(n);
  };

  return (
    <ToolShell steps={CV_JOB_STEPS} current={result ? 3 : step} onStepSelect={goStep}>
      {!result && step === 1 ? (
        <div className="mx-auto w-full max-w-xl">
          <ResumeFileField
            id="resume-text"
            variant="hero"
            hideLabel
            value={cvText}
            onChange={(text) => {
              setCvText(text);
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
            if (jobTooShort || cvTooShort || cvBusy) return;
            start();
          }}
          className="mx-auto flex w-full max-w-xl flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Job description
            </label>
            <textarea
              id="job-text"
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
              label="Check my match"
              busyLabel="Checking your match"
              running={running}
              disabled={jobTooShort || cvTooShort || cvBusy}
            />
            <ToolStepBack label="Back to resume" onClick={() => goStep(1)} />
          </ToolStepActions>
        </form>
      ) : null}

      {!result && step === 2 && running ? (
        <div className="mx-auto w-full max-w-xl">
          <ToolProgress message="Checking your match" lines={4} />
        </div>
      ) : null}

      {result ? (
        <div className="landing-rise mx-auto w-full max-w-2xl">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <ScoreRing value={result.overall} />
            <div>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {result.overall >= 75
                  ? "Strong match for this posting"
                  : result.overall >= 50
                    ? "Partial match. A tailoring pass is worth it."
                    : "Weak match for this posting"}
              </p>
              <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--landing-ink-soft)]">
                Combined from skills, keywords, and experience signals in your
                CV and this posting. It is a coverage score, not a prediction
                that you will get an interview.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                Strong matches
              </p>
              {result.skills.strong.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.skills.strong.map((term) => (
                    <SkillChip key={term} term={term} present />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  No named skills from the posting showed up on your resume yet.
                </p>
              )}
            </div>

            <div>
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                Missing or weak matches
              </p>
              {result.skills.missing.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.skills.missing.map((term) => (
                    <SkillChip key={term} term={term} present={false} />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  Your resume mentions every named skill we could read from the
                  posting.
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <MatchBar label="Experience match" value={result.experience.score} />
            <MatchBar label="Skills match" value={result.skills.score} />
            <MatchBar label="Keyword match" value={result.keywords.score} />
          </div>

          <div className="mt-8">
            <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              What to improve
            </p>
            <ol className="mt-3 flex flex-col gap-2">
              {result.improvements.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3"
                >
                  <span className="font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-6 text-[var(--landing-ink)]">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <HandoffCta
            title={ctaTitle}
            body={ctaBody}
            label={ctaLabel}
            source="job_match"
            jobText={jobText}
            cvText={cvText}
            score={result.overall}
          />

          <ToolSiblingLink
            href="/ats-resume-checker"
            label="Or check ATS keywords for this posting"
            source="job_match_to_ats"
            cvText={cvText}
            jobText={jobText}
          />

          <div className="mt-6 flex justify-center">
            <ToolStepBack
              label="Check another job"
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
