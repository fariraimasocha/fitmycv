"use client";

// Skills section from a job description and a CV, used by
// /resume-skills-generator.
//
// ponytail: runs in the browser like the summary generator. No API route, no
// model call, no storage. The posting decides the order, the CV decides what
// may be listed: a skill the CV never mentions goes in the gap list, never in
// the section.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRightIcon, CheckIcon, CopyIcon, QuotesIcon, XIcon } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import ResumeFileField from "@/components/tools/ResumeFileField";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { evidenceFor, postingSkills } from "@/lib/interview-questions";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff, saveCvHandoff } from "@/lib/ats-handoff";
import { trackEvent } from "@/lib/analytics";

const MAX_LISTED = 12;

// Shown before anyone runs the tool, for people searching for examples.
const EXAMPLE_SECTIONS = [
  { role: "dataAnalyst", text: "SQL, Python, Tableau, Power BI, A/B testing, Excel, stakeholder reporting" },
  { role: "nurse", text: "Triage, IV therapy, wound care, EPIC, discharge planning, patient education" },
  { role: "softwareEngineer", text: "TypeScript, React, Node.js, PostgreSQL, AWS, CI/CD, code review" },
];

export default function SkillsSectionGenerator() {
  const t = useTranslations("tools.skills");
  const locale = useLocale();
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

  async function copyLine() {
    try {
      if (!navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(result.line);
      setCopied(true);
      toast.success(t("toastCopied"));
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      toast.error(t("toastCopyFailed"));
    }
  }

  // Same handoff as the ATS checker: the posting opens in the tailor, and a
  // new user finds this CV already in onboarding's paste box.
  const handleTailorHandoff = () => {
    saveAtsHandoff({ jobText: jobText.trim(), score: null, source: "skills" });
    trackEvent("ats_handoff_cta", {
      score: null,
      source: "skills",
      signed_in: Boolean(session?.user),
      gaps: gapCount,
    });
    const dest = "/dashboard/tailor";
    if (session?.user) {
      router.push(dest);
      return;
    }
    saveCvHandoff(resumeText, "skills");
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
              htmlFor="skills-job-text"
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              {t("jobLabel")}
            </label>
            <textarea
              id="skills-job-text"
              value={jobText}
              onChange={(e) => {
                setJobText(e.target.value);
                reset();
              }}
              rows={10}
              placeholder={t("jobPlaceholder")}
              className="w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>

          <ResumeFileField
            id="skills-resume-text"
            label={t("resumeLabel")}
            value={resumeText}
            onChange={(text) => {
              setResumeText(text);
              reset();
            }}
            onBusyChange={setCvBusy}
          />
        </div>

        {locale !== "en" ? (
          <p className="text-xs leading-5 text-[var(--landing-ink-soft)]">
            {t("englishOnly")}
          </p>
        ) : null}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label={t("submit")}
            busyLabel={t("busy")}
            running={running}
            disabled={jobTooShort || resumeTooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? t("statusReadingCv")
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
          {result.listed.length ? (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {t.rich("resultHeading", {
                  title: result.title ?? t("thisJob"),
                  hl: (chunks) => (
                    <span className="text-[var(--landing-primary-dark)]">{chunks}</span>
                  ),
                })}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {t("resultBody")}
              </p>
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-base font-semibold leading-7 text-[var(--landing-ink)]">
                  <span className="font-extrabold">{t("skillsLabel")} </span>
                  {result.line}
                </p>
                <button
                  type="button"
                  onClick={copyLine}
                  className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
                >
                  {copied ? (
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

              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                {t("proofHeading")}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {result.listed.map((item) => (
                  <li
                    key={item.term}
                    className="flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3"
                  >
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--landing-ink)]">
                      <CheckIcon size={12} weight="bold" aria-hidden="true" className="text-[var(--landing-success)]" />
                      {item.label}
                    </span>
                    {item.evidence ? (
                      <span className="flex gap-2 text-sm leading-6 text-[var(--landing-ink-soft)]">
                        <QuotesIcon size={13} weight="fill" aria-hidden="true" className="mt-1 shrink-0 text-[var(--landing-accent)]" />
                        {item.evidence}
                      </span>
                    ) : (
                      <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                        {t("noProof")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {t("noSharedHeading")}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {t("noSharedBody")}
              </p>
            </>
          )}

          {gapCount ? (
            <>
              <p className="mt-8 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                {t("gapHeading")}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.missing.map((item) => (
                  <li
                    key={item.term}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
                  >
                    <XIcon size={11} weight="bold" aria-hidden="true" className="text-[var(--landing-coral)]" />
                    {item.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                {t("gapBody")}
              </p>
            </>
          ) : null}

          <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                {gapCount ? t("ctaGapsTitle", { count: gapCount }) : t("ctaDoneTitle")}
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
              {gapCount ? t("ctaGapsLabel") : t("ctaDoneLabel")}
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
            {t("examplesHeading")}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            {t("examplesBody")}
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {EXAMPLE_SECTIONS.map(({ role, text }) => (
              <li
                key={role}
                className="flex flex-col gap-1 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 sm:flex-row sm:items-start sm:gap-4"
              >
                <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)] sm:w-36 sm:shrink-0 sm:pt-0.5">
                  {t(`exampleRoles.${role}`)}
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
