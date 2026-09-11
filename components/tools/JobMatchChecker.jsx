"use client";

// Free resume ↔ job match. Runs in the browser. A dropped PDF is read
// locally. The rewrite lives behind /tailor-cv-from-job-link so this page
// can stay unlimited and account-free.

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { scoreResumeJobMatch } from "@/lib/resume-job-match";

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
          size={11}
          weight="bold"
          aria-hidden="true"
          className="text-[var(--landing-success)]"
        />
      ) : (
        <XIcon
          size={11}
          weight="bold"
          aria-hidden="true"
          className="text-[var(--landing-coral)]"
        />
      )}
      {term}
    </li>
  );
}

export default function JobMatchChecker() {
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();

  const jobTooShort = jobText.trim().length < 40;
  const cvTooShort = cvText.trim().length < 40;

  const result = useMemo(() => {
    if (!ran || jobTooShort || cvTooShort) return null;
    return scoreResumeJobMatch(jobText, cvText);
  }, [ran, jobText, cvText, jobTooShort, cvTooShort]);

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <ResumeFileField
            id="resume-text"
            label="Your resume"
            value={cvText}
            onChange={(text) => {
              setCvText(text);
              reset();
            }}
            onBusyChange={setCvBusy}
          />

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
              rows={10}
              placeholder="Paste the full text of the job posting here."
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Check my match"
            busyLabel="Checking your match"
            running={running}
            disabled={jobTooShort || cvTooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? "Reading your CV"
              : running
                ? "Comparing your CV with the posting"
                : jobTooShort || cvTooShort
                ? "Add your CV and the full job description."
                : "Your CV is read in this tab. Nothing is stored."}
          </p>
        </div>
      </form>

      {running ? (
        <ToolProgress message="Checking your match" lines={4} />
      ) : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
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
              Top 5 things to improve
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

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.25)] bg-[oklch(0.92_0.06_174_/_0.4)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                Tailor my CV to this job
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                FitMyCV rewrites your CV and cover letter against the posting,
                using the experience you already have.
              </p>
            </div>
            <Link
              href="/tailor-cv-from-job-link"
              className="landing-primary-btn group shrink-0 font-outfit text-sm"
            >
              Tailor my CV to this job
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
