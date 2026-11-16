"use client";

// Free resume ↔ job match. Runs in the browser. A dropped PDF is read
// locally. The rewrite lives behind /tailor-cv-from-job-link so this page
// can stay unlimited and account-free.

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import { CtaCard } from "@/components/tools/HandoffCta";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff } from "@/lib/ats-handoff";
import { scoreResumeJobMatch } from "@/lib/resume-job-match";
import { trackEvent } from "@/lib/analytics";

const HIGH_MATCH_SCORE = 75;

function ScoreRing({ value }) {
  const t = useTranslations("tools.job-match");
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
      aria-label={t("scoreAria", { value })}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--landing-paper-soft)]">
        <span className="font-outfit text-3xl font-extrabold text-[var(--landing-ink)]">
          {value}%
        </span>
        <span className="font-outfit text-xs font-extrabold uppercase tracking-widest text-[var(--landing-ink-soft)]">
          {t("scoreUnit")}
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
  const t = useTranslations("tools.job-match");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();
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

  const handleTailorHandoff = () => {
    const text = jobText.trim();
    if (!text) return;
    const score =
      typeof result?.overall === "number" ? result.overall : null;
    saveAtsHandoff({ jobText: text, score, source: "job_match" });
    trackEvent("ats_handoff_cta", {
      score,
      source: "job_match",
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

  const highMatch =
    typeof result?.overall === "number" && result.overall >= HIGH_MATCH_SCORE;
  const cta = highMatch ? "ctaHigh" : "ctaGaps";

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
          <ResumeFileField
            id="resume-text"
            label={t("cvLabel")}
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
              {t("jobLabel")}
            </label>
            <textarea
              id="job-text"
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
        </div>

        {locale !== "en" ? (
          <p className="text-xs font-semibold leading-6 text-[var(--landing-ink-soft)]">
            {t("englishOnly")}
          </p>
        ) : null}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label={t("submit")}
            busyLabel={t("busy")}
            running={running}
            disabled={jobTooShort || cvTooShort || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? t("readingCv")
              : running
                ? t("comparing")
                : jobTooShort || cvTooShort
                ? t("needBoth")
                : t("privacy")}
          </p>
        </div>
      </form>

      {running ? (
        <ToolProgress message={t("busy")} lines={4} />
      ) : null}

      {result ? (
        <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <ScoreRing value={result.overall} />
            <div>
              <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                {result.overall >= 75
                  ? t("verdictStrong")
                  : result.overall >= 50
                    ? t("verdictPartial")
                    : t("verdictWeak")}
              </p>
              <p className="mt-2 max-w-lg text-sm leading-7 text-[var(--landing-ink-soft)]">
                {t("scoreNote")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                {t("strongHeading")}
              </p>
              {result.skills.strong.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.skills.strong.map((term) => (
                    <SkillChip key={term} term={term} present />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {t("strongEmpty")}
                </p>
              )}
            </div>

            <div>
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                {t("missingHeading")}
              </p>
              {result.skills.missing.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.skills.missing.map((term) => (
                    <SkillChip key={term} term={term} present={false} />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {t("missingEmpty")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <MatchBar label={t("barExperience")} value={result.experience.score} />
            <MatchBar label={t("barSkills")} value={result.skills.score} />
            <MatchBar label={t("barKeywords")} value={result.keywords.score} />
          </div>

          <div className="mt-8">
            <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              {t("improveHeading")}
            </p>
            <ol className="mt-3 flex flex-col gap-2">
              {result.tips.map(({ key, values }, i) => (
                <li
                  key={result.improvements[i]}
                  className="flex items-start gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3"
                >
                  <span className="font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-6 text-[var(--landing-ink)]">
                    {t(`tips.${key}`, {
                      ...values,
                      level: values.level ? t(`levels.${values.level.replace(" ", "_")}`) : "",
                    })}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <CtaCard
            title={t(`${cta}.title`)}
            body={t(`${cta}.body`)}
            label={t(`${cta}.label`)}
            onClick={handleTailorHandoff}
          />
        </div>
      ) : null}
    </div>
  );
}
