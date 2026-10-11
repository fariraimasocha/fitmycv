"use client";

// Free LinkedIn profile checker. The person pastes their headline, About and
// skills next to a job posting and sees which of the posting's terms each
// section covers. Runs in the browser. Pasted text, not a profile URL:
// fetching LinkedIn profiles is against LinkedIn's terms.

import { useMemo, useState } from "react";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";

import HandoffCta from "@/components/tools/HandoffCta";
import { ToolProgress, ToolSubmitButton, useToolRun } from "@/components/tools/tool-run";
import { checkProfile, SECTIONS } from "@/lib/linkedin-check";
import { trackEvent } from "@/lib/analytics";

const field =
  "w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-3 text-sm text-[var(--landing-ink)]";
const fieldLabel = "font-outfit text-sm font-extrabold text-[var(--landing-ink)]";

const SECTION_LABEL = { headline: "Headline", about: "About", skills: "Skills" };

function Result({ result }) {
  return (
    <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
      <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
        Your profile covers {result.score}% of the terms this posting leans on
      </p>
      {result.forHeadline.length ? (
        <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
          Your headline is the line recruiters see under your name in search. These are already on
          your profile but not in it: <strong className="text-[var(--landing-ink)]">{result.forHeadline.join(", ")}</strong>.
        </p>
      ) : null}
      {result.missing.length ? (
        <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">
          Not on your profile at all: <strong className="text-[var(--landing-ink)]">{result.missing.join(", ")}</strong>.
          Add the ones you can back up to your About or Skills.
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-xs font-bold uppercase tracking-widest text-[var(--landing-ink-soft)]">
              <th className="py-2 text-start font-bold">Term</th>
              {SECTIONS.map((s) => (
                <th key={s} className="px-2 py-2 text-center font-bold">{SECTION_LABEL[s]}</th>
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
                      <CheckIcon size={16} weight="bold" className="inline text-[var(--landing-success)]" aria-label="Found" />
                    ) : (
                      <MinusIcon size={16} className="inline text-[var(--landing-ink-soft)]" aria-label="Missing" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HandoffCta
        title="Do the same for your CV"
        body="FitMyCV rewrites your CV against a job posting, in the posting's own words, using only what is already in your experience."
        label="Tailor my CV to this job"
        source="linkedin_check"
      />
    </div>
  );
}

export default function LinkedInProfileChecker() {
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
        <div className="flex flex-col gap-2">
          <label htmlFor="li-job" className={fieldLabel}>Job posting</label>
          <textarea
            id="li-job"
            rows={6}
            value={job}
            onChange={(e) => {
              setJob(e.target.value);
              reset();
            }}
            placeholder="Paste the full job description"
            className={field}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="li-headline" className={fieldLabel}>Your LinkedIn headline</label>
          <input
            id="li-headline"
            value={profile.headline}
            onChange={set("headline")}
            placeholder="Backend Engineer | Go, Kubernetes, Payments"
            className={field}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="li-about" className={fieldLabel}>Your About section</label>
          <textarea id="li-about" rows={5} value={profile.about} onChange={set("about")} className={field} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="li-skills" className={fieldLabel}>Your skills</label>
          <textarea
            id="li-skills"
            rows={3}
            value={profile.skills}
            onChange={set("skills")}
            placeholder="Copy them from the Skills section of your profile"
            className={field}
          />
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Check my profile"
            busyLabel="Comparing your profile"
            running={running}
            disabled={tooShort}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            Read in this tab. Nothing is stored.
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Comparing your profile" lines={4} /> : null}

      {result ? <Result result={result} /> : null}
    </div>
  );
}
