"use client";

// Skills section from a job description and a CV, used by
// /resume-skills-generator.
//
// ponytail: runs in the browser like the summary generator. No API route, no
// model call, no storage. The posting decides the order, the CV decides what
// may be listed: a skill the CV never mentions goes in the gap list, never in
// the section.

import { useEffect, useMemo, useState } from "react";
import { CheckIcon, QuotesIcon, XIcon } from "@phosphor-icons/react";

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
import { cvJobDetail, pickedCard, revealDelay } from "@/components/tools/reveal";
import { evidenceFor, postingSkills } from "@/lib/interview-questions";
import { isLinkOnly } from "@/lib/ats-detect";
import { trackEvent } from "@/lib/analytics";

const MAX_LISTED = 12;

export default function SkillsSectionGenerator() {
  const [step, setStep] = useState(1);
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun("skills_section");
  const [currentYear] = useState(() => new Date().getFullYear());
  // The skills line the user copied. Text, so a rerun clears it.
  const [picked, setPicked] = useState("");

  const jobIsLink = isLinkOnly(jobText);
  const jobTooShort = jobText.trim().length < 40 || jobIsLink;
  const resumeTooShort = resumeText.trim().length < 40;

  const result = useMemo(() => {
    if (!ran || jobTooShort || resumeTooShort) return null;
    const { title, matched, missing } = postingSkills(jobText, resumeText, currentYear);
    const listed = matched.slice(0, MAX_LISTED).map((item) => ({
      ...item,
      evidence: evidenceFor(item.term, resumeText),
    }));
    return { title, listed, missing, line: listed.map((item) => item.label).join(", ") };
  }, [ran, jobText, resumeText, jobTooShort, resumeTooShort, currentYear]);

  const gapCount = result?.missing.length ?? 0;

  useEffect(() => {
    if (!result) return;
    trackEvent("skills_section_generated", { listed: result.listed.length, gaps: gapCount });
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
            id="skills-resume-text"
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
              htmlFor="skills-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Job description
            </label>
            <textarea
              id="skills-job-text"
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
              label="Build my skills section"
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
            lines={3}
          />
        </div>
      ) : null}

      {result ? (
        <div className="landing-rise mx-auto w-full max-w-2xl">
          {result.listed.length ? (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                Your skills section for{" "}
                <span className="text-[var(--landing-primary-dark)]">{result.title ?? "this job"}</span>
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                Only skills that appear in both your CV and the posting, in the
                order the posting stresses them.
              </p>
              <div
                className={`mt-5 flex flex-col gap-3 rounded-2xl border p-5 transition-colors sm:flex-row sm:items-start sm:justify-between ${pickedCard(picked === result.line)}`}
              >
                <p className="text-base font-semibold leading-7 text-[var(--landing-ink)]">
                  <span className="font-extrabold">Skills: </span>
                  {result.line}
                </p>
                <CopyButton
                  tool="skills_section"
                  text={result.line}
                  message="Skills copied"
                  ariaLabel="Copy your skills section"
                  onCopied={() => setPicked(result.line)}
                />
              </div>

              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                Where your CV proves each one
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {result.listed.map((item, i) => (
                  <li
                    key={item.term}
                    style={revealDelay(i)}
                    className="tool-reveal flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3"
                  >
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--landing-ink)]">
                      <CheckIcon size={12} aria-hidden="true" className="text-[var(--landing-success)]" />
                      {item.label}
                    </span>
                    {item.evidence ? (
                      <span className="flex gap-2 text-sm leading-6 text-[var(--landing-ink-soft)]">
                        <QuotesIcon size={14} weight="fill" aria-hidden="true" className="mt-1.25 shrink-0 text-[var(--landing-accent)]" />
                        {item.evidence}
                      </span>
                    ) : (
                      <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                        Your CV names it but never shows it in use. Add one
                        bullet where you did.
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                Your CV and this posting share no skills yet
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                Nothing from the posting appears in your CV, so there is nothing
                safe to list. Check the gaps below, or paste the full posting
                with its requirements.
              </p>
            </>
          )}

          {gapCount ? (
            <>
              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                The job wants these, your CV does not show them
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.missing.map((item, i) => (
                  <li
                    key={item.term}
                    style={revealDelay(i)}
                    className="tool-reveal inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
                  >
                    <XIcon size={12} aria-hidden="true" className="text-[var(--landing-coral)]" />
                    {item.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                List one only if you have really used it, and add a bullet that
                shows where.
              </p>
            </>
          ) : null}

          <HandoffCta
            title={
              gapCount === 1
                ? "1 skill the job wants is missing from your CV"
                : gapCount
                  ? `${gapCount} skills the job wants are missing from your CV`
                  : "Skills sorted. Now the rest of the CV"
            }
            body="A skills list only helps when your bullets back it up. Sign up free and FitMyCV tailors your whole CV to this posting, using only your real experience."
            label={gapCount ? "Close the gaps" : "Tailor my CV to this job"}
            source="skills"
            jobText={jobText}
            cvText={resumeText}
            track={{ gaps: gapCount }}
          />

          <div className="mt-6 flex justify-center">
            <ToolStepBack
              label="Build for another job"
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
