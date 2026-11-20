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
import { CheckIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";

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
import { isLinkOnly } from "@/lib/ats-detect";
import { notCompanyTerm } from "@/lib/keywords";
import { generateSummaries } from "@/lib/summary-helpers";

// Shown before anyone runs the tool. People searching "professional summary
// examples" land here too, so the empty state answers that first.
const EXAMPLE_SUMMARIES = [
  {
    stage: "Graduate",
    text: "Statistics graduate aiming for a junior data analyst role. Built a final year project analysing five years of city transport data in Python and SQL.",
  },
  {
    stage: "Mid-level",
    text: "Digital marketing manager with 6+ years in B2B SaaS. Skilled in paid social, lifecycle email and HubSpot. Grew qualified leads 40% in a year on a flat budget.",
  },
  {
    stage: "Senior",
    text: "Senior backend engineer with 10+ years in payments. Led the move to event driven services that cut checkout failures by a third.",
  },
];

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
              htmlFor="summary-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Paste the job description
            </label>
            <textarea
              id="summary-job-text"
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
            id="summary-resume-text"
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
            label="Write my summary"
            busyLabel="Writing your summaries"
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

      {running ? <ToolProgress message="Writing your summaries" lines={3} /> : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
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
        </div>
      ) : (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="inline-flex items-center gap-2 font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            <SparkleIcon
              size={16}
              weight="fill"
              aria-hidden="true"
              className="text-[var(--landing-accent)]"
            />
            Professional summary examples
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            Yours will be built from the posting you paste and the results your
            CV already shows. Here is the shape they take.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {EXAMPLE_SUMMARIES.map(({ stage, text }) => (
              <li
                key={stage}
                className="flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 sm:flex-row sm:items-start sm:gap-4"
              >
                <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)] sm:w-28 sm:shrink-0 sm:pt-0.5">
                  {stage}
                </span>
                <span className="text-sm font-semibold leading-6 text-[var(--landing-ink)]">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
