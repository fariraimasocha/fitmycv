"use client";

// Interview questions from a job description, used by
// /interview-questions-from-job-description.
//
// ponytail: runs in the browser like the summary generator. No API route, no
// model call, no storage. lib/interview-questions.js picks the questions from
// the posting and the proof lines from the CV.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  QuotesIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import ResumeFileField from "@/components/tools/ResumeFileField";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { generateInterviewQuestions } from "@/lib/interview-questions";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff, saveCvHandoff } from "@/lib/ats-handoff";
import { trackEvent } from "@/lib/analytics";

const KIND_LABEL = {
  role: "About the role",
  skill: "From the posting, on your CV",
  gap: "From the posting, missing from your CV",
};

// Shown before anyone runs the tool, for people searching for the common
// questions rather than their own.
const COMMON_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want this role?",
  "Tell me about a time you solved a hard problem.",
  "What is your biggest weakness?",
  "Where do you see yourself in three years?",
];

export default function InterviewQuestionsGenerator() {
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();
  const [copied, setCopied] = useState(false);
  const [currentYear] = useState(() => new Date().getFullYear());
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const jobTooShort = jobText.trim().length < 40;
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

  async function copyAll() {
    const text = result.questions
      .map((q) => [q.q, q.evidence ? `Your proof: ${q.evidence}` : null, q.tip].filter(Boolean).join("\n"))
      .join("\n\n");
    try {
      if (!navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Questions copied");
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      toast.error("Copy failed. Select the questions and copy them yourself.");
    }
  }

  // Same handoff as the ATS checker: the posting opens in the tailor, and a
  // new user finds this CV already in onboarding's paste box.
  const handleTailorHandoff = () => {
    saveAtsHandoff({ jobText: jobText.trim(), score: null, source: "interview" });
    trackEvent("ats_handoff_cta", {
      score: null,
      source: "interview",
      signed_in: Boolean(session?.user),
      gaps: gapCount,
    });
    const dest = "/dashboard/tailor";
    if (session?.user) {
      router.push(dest);
      return;
    }
    saveCvHandoff(resumeText, "interview");
    const authUrl = `/auth?next=${encodeURIComponent(dest)}`;
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

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
              htmlFor="interview-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              Paste the job description
            </label>
            <textarea
              id="interview-job-text"
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
            id="interview-resume-text"
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
            label="Get my questions"
            busyLabel="Reading the posting"
            running={running}
            disabled={jobTooShort || resumeTooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? "Reading your CV"
              : running
                ? "Matching your CV to the posting"
                : jobTooShort || resumeTooShort
                  ? "Add the job description and your CV to start."
                  : "Your CV is read in this tab. Nothing is stored."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Reading the posting" lines={4} /> : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
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
            <button
              type="button"
              onClick={copyAll}
              className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              {copied ? (
                <>
                  <CheckIcon size={13} weight="bold" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon size={13} weight="bold" aria-hidden="true" />
                  Copy all
                </>
              )}
            </button>
          </div>

          <ol className="mt-6 flex flex-col gap-3">
            {result.questions.map((q) => (
              <li
                key={q.id}
                className={
                  q.kind === "gap"
                    ? "flex flex-col gap-2 rounded-2xl border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.05)] p-5"
                    : "flex flex-col gap-2 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5"
                }
              >
                <p className="inline-flex items-center gap-1.5 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                  {q.kind === "gap" ? (
                    <WarningCircleIcon
                      size={13}
                      weight="bold"
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
                      className="mt-1 shrink-0 text-[var(--landing-accent)]"
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

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                {gapCount
                  ? `${gapCount} of these questions hit gaps in your CV`
                  : "Your CV covers what they will ask"}
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                {gapCount
                  ? "Close them before they read it. Sign up free and FitMyCV tailors your CV to this posting, using only your real experience."
                  : "Make sure the recruiter sees that too. Sign up free and FitMyCV tailors your CV to this posting, using only your real experience."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTailorHandoff}
              className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              {gapCount ? "Close the gaps" : "Tailor my CV to this job"}
              <ArrowRightIcon
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
          <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            Questions almost every interview asks
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            Add the posting and your CV to get the ones this job will ask, with
            the line from your CV that answers each.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {COMMON_QUESTIONS.map((q) => (
              <li
                key={q}
                className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--landing-ink)]"
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
