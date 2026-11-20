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
import {
  CopyButton,
  JOB_IS_LINK,
  TOOL_PRIVACY,
  ToolProgress,
  ToolSubmitButton,
  useToolRun,
} from "@/components/tools/tool-run";
import { evidenceFor, postingSkills } from "@/lib/interview-questions";
import { isLinkOnly } from "@/lib/ats-detect";
import { trackEvent } from "@/lib/analytics";

const MAX_LISTED = 12;

// Shown before anyone runs the tool, for people searching for examples.
const EXAMPLE_SECTIONS = [
  { role: "Data analyst", text: "SQL, Python, Tableau, Power BI, A/B testing, Excel, stakeholder reporting" },
  { role: "Nurse", text: "Triage, IV therapy, wound care, EPIC, discharge planning, patient education" },
  { role: "Software engineer", text: "TypeScript, React, Node.js, PostgreSQL, AWS, CI/CD, code review" },
];

export default function SkillsSectionGenerator() {
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun("skills_section");
  const [currentYear] = useState(() => new Date().getFullYear());

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
              htmlFor="skills-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Paste the job description
            </label>
            <textarea
              id="skills-job-text"
              value={jobText}
              onChange={(e) => {
                setJobText(e.target.value);
                reset();
              }}
              rows={10}
              placeholder="Paste the full text of the job posting here…"
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>

          <ResumeFileField
            id="skills-resume-text"
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
            label="Build my skills section"
            busyLabel="Reading the posting"
            running={running}
            disabled={jobTooShort || resumeTooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? "Reading your CV"
              : running
                ? "Matching your CV to the posting"
                : jobIsLink
                  ? JOB_IS_LINK
                  : jobTooShort || resumeTooShort
                    ? "Add the job description and your CV to start."
                    : TOOL_PRIVACY}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Reading the posting" lines={3} /> : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
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
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-base font-semibold leading-7 text-[var(--landing-ink)]">
                  <span className="font-extrabold">Skills: </span>
                  {result.line}
                </p>
                <CopyButton
                  tool="skills_section"
                  text={result.line}
                  message="Skills copied"
                  ariaLabel="Copy your skills section"
                />
              </div>

              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                Where your CV proves each one
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {result.listed.map((item) => (
                  <li
                    key={item.term}
                    className="flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3"
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
                {result.missing.map((item) => (
                  <li
                    key={item.term}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
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
        </div>
      ) : (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            Skills section examples
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            Yours will use only skills from your CV that the posting asks for.
            Here is the shape they take.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {EXAMPLE_SECTIONS.map(({ role, text }) => (
              <li
                key={role}
                className="flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 sm:flex-row sm:items-start sm:gap-4"
              >
                <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)] sm:w-36 sm:shrink-0 sm:pt-0.5">
                  {role}
                </span>
                <span className="text-sm font-semibold leading-6 text-[var(--landing-ink)]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
