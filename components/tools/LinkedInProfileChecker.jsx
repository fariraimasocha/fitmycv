"use client";

// Free LinkedIn profile checker. The person pastes their headline, About and
// skills next to a job posting and sees which of the posting's terms each
// section covers. Runs in the browser. Pasted text, not a profile URL:
// fetching LinkedIn profiles is against LinkedIn's terms.

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";

import HandoffCta from "@/components/tools/HandoffCta";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { checkProfile, SECTIONS } from "@/lib/linkedin-check";
import { trackEvent } from "@/lib/analytics";

const field =
  "w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-3 text-sm text-[var(--landing-ink)]";
const fieldLabel = "font-outfit text-sm font-extrabold text-[var(--landing-ink)]";

const strong = (chunks) => <strong className="text-[var(--landing-ink)]">{chunks}</strong>;

function Result({ result }) {
  const t = useTranslations("tools.linkedin-profile");
  const list = (terms) => terms.join(t("listSeparator"));
  return (
    <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
      <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
        {t("score", { score: result.score })}
      </p>
      {result.forHeadline.length ? (
        <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
          {t.rich("forHeadline", { terms: list(result.forHeadline), strong })}
        </p>
      ) : null}
      {result.missing.length ? (
        <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
          {t.rich("missing", { terms: list(result.missing), strong })}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-xs font-bold uppercase tracking-widest text-[var(--landing-ink-soft)]">
              <th className="py-2 text-start font-bold">{t("termColumn")}</th>
              {SECTIONS.map((s) => (
                <th key={s} className="px-2 py-2 text-center font-bold">{t(`section.${s}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.terms.map((t) => (
              <tr key={t.term} className="border-t border-[var(--landing-line)]">
                <td className="py-2 font-semibold text-[var(--landing-ink)]">{t.term}</td>
                {SECTIONS.map((s) => (
                  <td key={s} className="px-2 py-2 text-center">
                    {t.found[s] ? (
                      <CheckIcon size={16} weight="bold" className="inline text-[var(--landing-success)]" aria-label={t("found")} />
                    ) : (
                      <MinusIcon size={16} className="inline text-[var(--landing-ink-soft)]" aria-label={t("notFound")} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HandoffCta
        title={t("ctaTitle")}
        body={t("ctaBody")}
        label={t("ctaLabel")}
        source="linkedin_check"
      />
    </div>
  );
}

export default function LinkedInProfileChecker() {
  const t = useTranslations("tools.linkedin-profile");
  const locale = useLocale();
  const [job, setJob] = useState("");
  const [profile, setProfile] = useState({ headline: "", about: "", skills: "" });
  const { running, ran, start, reset } = useToolRun();
  const profileText = SECTIONS.map((s) => profile[s]).join("\n");
  const tooShort = job.trim().length < 80 || profileText.trim().length < 20;

  const result = useMemo(
    () => (ran && !tooShort ? checkProfile(job, profile) : null),
    [ran, tooShort, job, profile]
  );

  const set = (key) => (e) => {
    setProfile((p) => ({ ...p, [key]: e.target.value }));
    reset();
  };

  return (
    <div className="landing-card rounded-3xl p-4 sm:p-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
          trackEvent("linkedin_profile_checked");
        }}
        className="flex flex-col gap-5"
      >
        {locale !== "en" ? (
          <p className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-3 text-sm leading-6 text-[var(--landing-ink)]">
            {t("englishOnly")}
          </p>
        ) : null}
        <div className="flex flex-col gap-2">
          <label htmlFor="li-job" className={fieldLabel}>{t("jobLabel")}</label>
          <textarea
            id="li-job"
            rows={6}
            value={job}
            onChange={(e) => {
              setJob(e.target.value);
              reset();
            }}
            placeholder={t("jobPlaceholder")}
            className={field}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="li-headline" className={fieldLabel}>{t("headlineLabel")}</label>
          <input
            id="li-headline"
            value={profile.headline}
            onChange={set("headline")}
            placeholder={t("headlinePlaceholder")}
            className={field}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="li-about" className={fieldLabel}>{t("aboutLabel")}</label>
          <textarea id="li-about" rows={5} value={profile.about} onChange={set("about")} className={field} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="li-skills" className={fieldLabel}>{t("skillsLabel")}</label>
          <textarea
            id="li-skills"
            rows={3}
            value={profile.skills}
            onChange={set("skills")}
            placeholder={t("skillsPlaceholder")}
            className={field}
          />
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label={t("submit")}
            busyLabel={t("busy")}
            running={running}
            disabled={tooShort}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {t("privacy")}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message={t("busy")} lines={4} /> : null}

      {result ? <Result result={result} /> : null}
    </div>
  );
}
