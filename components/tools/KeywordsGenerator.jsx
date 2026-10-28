"use client";

// Resume keywords generator used by /resume-keywords-generator. Pick a job
// title, get the grouped keyword list from content/resume-keywords.js, then
// drop a CV to see which terms it already covers.
//
// ponytail: the lists are the same ones behind the per-role keyword pages,
// passed in as props so the long page prose stays out of the client bundle.
// A title we have no list for points at the posting-based keyword checker.

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckIcon, CopyIcon, XIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import ResumeFileField from "@/components/tools/ResumeFileField";
import HandoffCta from "@/components/tools/HandoffCta";
import {
  ToolProgress,
  ToolSubmitButton,
  useToolRun,
} from "@/components/tools/tool-run";
import { stem, tokenize } from "@/lib/keywords";
import { trackEvent } from "@/lib/analytics";

const labelClass =
  "font-outfit text-sm font-extrabold text-[var(--landing-ink)]";

function Pill({ label, present }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]";
  if (present === undefined) {
    return (
      <li
        className={`${base} border-[var(--landing-line)] bg-[var(--landing-paper)]`}
      >
        {label}
      </li>
    );
  }
  const Icon = present ? CheckIcon : XIcon;
  return (
    <li
      className={`${base} ${
        present
          ? "border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)]"
          : "border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)]"
      }`}
    >
      <Icon
        size={11}
        weight="bold"
        aria-hidden="true"
        className={
          present
            ? "text-[var(--landing-success)]"
            : "text-[var(--landing-coral)]"
        }
      />
      {label}
    </li>
  );
}

// "multidisciplinary team (MDT)" counts when the CV uses either form.
function termForms(term) {
  const short = term.match(/\(([^)]+)\)/)?.[1];
  const long = term.replace(/\s*\([^)]*\)/g, "");
  return short ? [long, short] : [term];
}

/** The terms the CV covers: every word of a form, the ATS checker's rule. */
function coveredTerms(terms, cvText) {
  const cvStems = new Set(tokenize(cvText).map(stem));
  return new Set(
    terms.filter((term) =>
      termForms(term).some((form) =>
        tokenize(form).every((w) => cvStems.has(stem(w))),
      ),
    ),
  );
}

function RoleKeywords({ role }) {
  const [cvText, setCvText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun();

  const allTerms = useMemo(() => role.groups.flatMap((g) => g.terms), [role]);

  const covered = useMemo(
    () =>
      ran && cvText.trim().length >= 40 ? coveredTerms(allTerms, cvText) : null,
    [ran, cvText, allTerms],
  );

  const missingCount = covered ? allTerms.length - covered.size : 0;

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(allTerms.join(", "));
      toast.success("Keywords copied");
    } catch {
      toast.error("Copy failed. Select the keywords and copy them yourself.");
    }
  }

  return (
    <div className="landing-rise mt-8 border-t border-[var(--landing-line)] pt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {allTerms.length} resume keywords for{" "}
            <span className="text-[var(--landing-primary-dark)]">
              {role.plural}
            </span>
          </p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            Only add the ones you have done, and put each one inside a bullet
            with a result.{" "}
            <Link
              href={`/${role.slug}-resume-keywords`}
              className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
            >
              See where each group belongs
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
        >
          <CopyIcon size={13} weight="bold" aria-hidden="true" />
          Copy all
        </button>
      </div>

      {role.groups.map((group) => (
        <div key={group.title} className="mt-6">
          <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
            {group.title}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.terms.map((term) => (
              <Pill
                key={term}
                label={term}
                present={covered ? covered.has(term) : undefined}
              />
            ))}
          </ul>
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          start();
        }}
        className="mt-8 flex flex-col gap-4 border-t border-[var(--landing-line)] pt-8"
      >
        <ResumeFileField
          id="keywords-cv-text"
          label="Check your CV against this list"
          value={cvText}
          onChange={(text) => {
            setCvText(text);
            reset();
          }}
          onBusyChange={setCvBusy}
          rows={6}
        />
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ToolSubmitButton
            label="Check my CV"
            busyLabel="Checking your CV"
            running={running}
            disabled={cvText.trim().length < 40 || cvBusy}
          />
          <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {cvBusy
              ? "Reading your CV"
              : "Your CV is read in this tab. Nothing is stored."}
          </p>
        </div>
      </form>

      {running ? <ToolProgress message="Checking your CV" lines={2} /> : null}

      {covered ? (
        <p
          role="status"
          className="mt-6 font-outfit text-base font-extrabold text-[var(--landing-ink)]"
        >
          Your CV covers {covered.size} of {allTerms.length}.{" "}
          {missingCount
            ? `${missingCount} are marked in red above.`
            : "Every term on the list is there."}
        </p>
      ) : null}

      <HandoffCta
        title={missingCount ? "Close these gaps" : "Now match it to one job"}
        body={
          missingCount
            ? `Your CV is missing ${missingCount} of the terms ${role.role} postings use. Paste a job link and FitMyCV works in the ones you have done, using your real experience.`
            : "A list is general. Paste a job link and FitMyCV rewrites your CV and cover letter for that exact posting."
        }
        label={missingCount ? "Close these gaps" : "Tailor my CV"}
        source="keywords_generator"
        cvText={cvText}
      />
    </div>
  );
}

export default function KeywordsGenerator({ roles = [] }) {
  const [slug, setSlug] = useState("");
  const role = roles.find((r) => r.slug === slug) ?? null;

  return (
    <div className="landing-card rounded-3xl p-4 sm:p-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="keywords-role" className={labelClass}>
          Pick your job title
        </label>
        <select
          id="keywords-role"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            if (e.target.value)
              trackEvent("keywords_generated", { role: e.target.value });
          }}
          className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm text-[var(--landing-ink)]"
        >
          <option value="">Choose a role</option>
          {roles.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.role}
            </option>
          ))}
        </select>
        <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
          Role not listed? Paste the advert into the{" "}
          <Link
            href="/free-ats-keyword-checker"
            className="text-[var(--landing-primary-dark)] underline underline-offset-4"
          >
            ATS keyword checker
          </Link>{" "}
          and it pulls the keywords from that posting.
        </p>
      </div>

      {role ? <RoleKeywords key={role.slug} role={role} /> : null}
    </div>
  );
}
