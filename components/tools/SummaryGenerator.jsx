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

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  SparkleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

import ResumeFileField from "@/components/tools/ResumeFileField";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { notCompanyTerm } from "@/lib/keywords";
import { generateSummaries } from "@/lib/summary-helpers";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff } from "@/lib/ats-handoff";
import { trackEvent } from "@/lib/analytics";



// Shown before anyone runs the tool. People searching "professional summary
// examples" land here too, so the empty state answers that first. The texts
// stay English in every locale because the tool writes English summaries.
const EXAMPLE_SUMMARIES = [
  {
    stage: "graduate",
    text: "Statistics graduate aiming for a junior data analyst role. Built a final year project analysing five years of city transport data in Python and SQL.",
  },
  {
    stage: "mid",
    text: "Digital marketing manager with 6+ years in B2B SaaS. Skilled in paid social, lifecycle email and HubSpot. Grew qualified leads 40% in a year on a flat budget.",
  },
  {
    stage: "senior",
    text: "Senior backend engineer with 10+ years in payments. Led the move to event driven services that cut checkout failures by a third.",
  },
];

// lib/summary-helpers.js names each draft in English and is shared with the
// application letter generator, so the labels are looked up here instead.
// ponytail: keyed on the English strings; a renamed shape falls back to English.
const SHAPE_KEYS = {
  "The formula": "formula",
  "Result first": "resultFirst",
  "Short and plain": "short",
};

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
      {label}
    </li>
  );
}

export default function SummaryGenerator() {
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();
  const t = useTranslations("tools.summary");
  const locale = useLocale();
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();
  const [copiedId, setCopiedId] = useState(null);
  // Captured once so the render body stays pure. Years read from date ranges
  // need a "today" to count up to.
  const [currentYear] = useState(() => new Date().getFullYear());
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const jobTooShort = jobText.trim().length < 40;
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

  async function copySummary(id, text) {
    try {
      if (!navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(t("toastCopied"));
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
      toast.error(t("toastFailed"));
    }
  }

  // Same handoff as the ATS checkers: the posting rides along in
  // sessionStorage, so /dashboard/tailor opens with it already filled in.
  const handleTailorHandoff = () => {
    saveAtsHandoff({ jobText, score: null, source: "summary" });
    trackEvent("ats_handoff_cta", {
      score: null,
      source: "summary",
      signed_in: Boolean(session?.user),
    });
    const dest = "/dashboard/tailor";
    if (session?.user) {
      router.push(dest);
      return;
    }
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
        {locale !== "en" ? (
          <p className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-3 text-sm leading-6 text-[var(--landing-ink)]">
            {t("englishOnly")}
          </p>
        ) : null}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="summary-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              {t("jobLabel")}
            </label>
            <textarea
              id="summary-job-text"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={10}
              placeholder={t("jobPlaceholder")}
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>

          <ResumeFileField
            id="summary-resume-text"
            label={t("cvLabel")}
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
            label={t("submit")}
            busyLabel={t("busy")}
            running={running}
            disabled={jobTooShort || resumeTooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? t("statusReading")
              : running
                ? t("statusMatching")
                : jobTooShort || resumeTooShort
                  ? t("statusNeedInput")
                  : t("statusPrivate")}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message={t("busy")} lines={3} /> : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
          {result.summaries.length ? (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {t.rich("resultHeading", {
                  count: result.summaries.length,
                  title: result.title,
                  role: (chunks) => (
                    <span className="text-[var(--landing-primary-dark)]">{chunks}</span>
                  ),
                })}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {result.titleSource === "posting"
                  ? t("fromPosting")
                  : t("fromResume")}
                {result.confident ? "" : ` ${t("titleGuess")}`}
                {result.result ? "" : ` ${t("noResult")}`}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {result.summaries.map((summary) => {
                  const shapeKey = SHAPE_KEYS[summary.shape];
                  // The short shape has two hints: with and without a second result.
                  const hintKey =
                    shapeKey === "short" && summary.hint.includes("second result")
                      ? "shortSecond"
                      : shapeKey;
                  return (
                  <li
                    key={summary.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                          {shapeKey ? t(`shapes.${shapeKey}`) : summary.shape}
                        </p>
                        <p className="mt-2 text-base font-semibold leading-7 text-[var(--landing-ink)]">
                          {summary.text}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copySummary(summary.id, summary.text)}
                        className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
                        aria-label={t("copyAria", { shape: shapeKey ? t(`shapes.${shapeKey}`) : summary.shape })}
                      >
                        {copiedId === summary.id ? (
                          <>
                            <CheckIcon size={13} weight="bold" aria-hidden="true" />
                            {t("copied")}
                          </>
                        ) : (
                          <>
                            <CopyIcon size={13} weight="bold" aria-hidden="true" />
                            {t("copy")}
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs leading-6 text-[var(--landing-ink-soft)]">
                      {summary.claims.length
                        ? `${t("claims", { list: summary.claims.join(", ") })} `
                        : ""}
                      {summary.hasSlot ? `${t("slot")} ` : ""}
                      {hintKey ? t(`hints.${hintKey}`) : summary.hint}
                    </p>
                  </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {t("noTitleHeading")}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {t("noTitleBody")}
              </p>
            </>
          )}

          <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
            {t("matchedHeading")}
          </p>
          {result.matched.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {result.matched.map(({ term, label }) => (
                <Pill key={term} label={label} present />
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-7 text-[var(--landing-ink-soft)]">
              {t.rich("noMatch", {
                link: (chunks) => (
                  <Link
                    href={locale === "en" ? "/ats-resume-checker" : `/${locale}/ats-resume-checker`}
                    className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          )}

          {result.missing.length ? (
            <>
              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                {t("missingHeading")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.missing.map(({ term, label }) => (
                  <Pill key={term} label={label} present={false} />
                ))}
              </ul>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {t("missingBody")}
              </p>
            </>
          ) : null}

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                {t("ctaTitle")}
              </p>
              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
                {t("ctaBody")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTailorHandoff}
              className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              {t("ctaButton")}
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
          <p className="inline-flex items-center gap-2 font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            <SparkleIcon
              size={15}
              weight="fill"
              aria-hidden="true"
              className="text-[var(--landing-accent)]"
            />
            {t("examplesHeading")}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            {t("examplesBody")}
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {EXAMPLE_SUMMARIES.map(({ stage, text }) => (
              <li
                key={stage}
                className="flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 sm:flex-row sm:items-start sm:gap-4"
              >
                <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)] sm:w-28 sm:shrink-0 sm:pt-0.5">
                  {t(`stages.${stage}`)}
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
