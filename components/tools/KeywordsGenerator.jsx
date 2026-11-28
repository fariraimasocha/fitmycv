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
import { CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import HandoffCta from "@/components/tools/HandoffCta";
import ToolShell, {
  ToolStepActions,
  ToolStepBack,
} from "@/components/tools/ToolShell";
import { KEYWORDS_STEPS } from "@/components/tools/ToolStepper";
import {
  CopyButton,
  TOOL_PRIVACY,
  ToolProgress,
  ToolSubmitButton,
  revealDelay,
  useToolRun,
  wordCount,
} from "@/components/tools/tool-run";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { stem, tokenize } from "@/lib/keywords";
import { trackEvent } from "@/lib/analytics";

const labelClass =
  "font-outfit text-sm font-extrabold text-[var(--landing-ink)]";

function Pill({ label, present, index = 0 }) {
  const base =
    "tool-reveal inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]";
  if (present === undefined) {
    return (
      <li
        style={revealDelay(index)}
        className={`${base} border-[var(--landing-line)] bg-[var(--landing-paper)]`}
      >
        {label}
      </li>
    );
  }
  const Icon = present ? CheckIcon : XIcon;
  return (
    <li
      style={revealDelay(index)}
      className={`${base} ${
        present
          ? "border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)]"
          : "border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)]"
      }`}
    >
      <Icon
        size={12}
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

export default function KeywordsGenerator({ roles = [] }) {
  const [step, setStep] = useState(1);
  const [slug, setSlug] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const { running, ran, start, reset } = useToolRun("keywords_generator");

  const role = roles.find((r) => r.slug === slug) ?? null;
  const allTerms = useMemo(
    () => (role ? role.groups.flatMap((g) => g.terms) : []),
    [role],
  );
  const cvTooShort = cvText.trim().length < 40;

  const covered = useMemo(
    () =>
      ran && !cvTooShort && role
        ? coveredTerms(allTerms, cvText)
        : null,
    [ran, cvText, cvTooShort, role, allTerms],
  );

  const missingCount = covered ? allTerms.length - covered.size : 0;

  const goStep = (n) => {
    if (n < 3) reset();
    setStep(n);
  };

  return (
    <ToolShell steps={KEYWORDS_STEPS} current={covered ? 3 : step} onStepSelect={goStep}>
      {!covered && step === 1 ? (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="keywords-role" className={labelClass}>
              Pick your job title
            </label>
            <select
              id="keywords-role"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                reset();
                if (e.target.value)
                  trackEvent("keywords_generated", { role: e.target.value });
              }}
              className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm text-[var(--landing-ink)] outline-none transition-colors focus:border-[var(--landing-accent)]"
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

          {slug ? (
            <ToolStepActions hint={TOOL_PRIVACY}>
              <ToolSubmitButton
                label="Continue"
                busyLabel="Continue"
                running={false}
                disabled={false}
                onClick={() => setStep(2)}
                type="button"
              />
            </ToolStepActions>
          ) : null}
        </div>
      ) : null}

      {!covered && step === 2 && role && !running ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (cvTooShort || cvBusy) return;
            start();
          }}
          className="mx-auto w-full max-w-xl"
        >
          <ResumeFileField
            id="keywords-cv-text"
            variant="hero"
            hideLabel
            value={cvText}
            onChange={(text) => {
              setCvText(text);
              reset();
            }}
            onBusyChange={setCvBusy}
          />

          <ToolStepActions
            hint={
              cvTooShort
                ? "Add your CV to check it against the list."
                : TOOL_PRIVACY
            }
          >
            <ToolSubmitButton
              label="Check my CV"
              busyLabel="Checking your CV"
              running={running}
              disabled={cvTooShort || cvBusy}
            />
            <ToolStepBack label="Back to title" onClick={() => goStep(1)} />
          </ToolStepActions>
        </form>
      ) : null}

      {!covered && step === 2 && role && running ? (
        <div className="mx-auto w-full max-w-xl">
          <ToolProgress
            message="Checking your CV"
            detail={`Checking ${wordCount(cvText)} words of your CV for ${allTerms.length} ${role.role} keywords.`}
            lines={2}
          />
        </div>
      ) : null}

      {covered && role ? (
        <div className="landing-rise mx-auto w-full max-w-2xl">
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
            <CopyButton
              tool="keywords_generator"
              text={allTerms.join(", ")}
              label="Copy all"
              message="Keywords copied"
              ariaLabel="Copy all keywords"
            />
          </div>

          {/* Peak: the tally counts up first, then the pills land. A full
              house gets the one glow. */}
          <p
            role="status"
            className={`mt-6 inline-flex flex-wrap items-baseline gap-x-1.5 rounded-2xl px-4 py-3 font-outfit text-base font-extrabold text-[var(--landing-ink)] ${
              missingCount
                ? "bg-[var(--landing-paper-strong)]"
                : "peak-glow bg-[var(--landing-success-soft)]"
            }`}
          >
            <span>
              Your CV covers{" "}
              {/* The live region reads the final number, not every frame of the count. */}
              <span aria-hidden="true"><AnimatedNumber value={covered.size} /></span>
              <span className="sr-only">{covered.size}</span> of {allTerms.length}.
            </span>
            <span>
              {missingCount === 1
                ? "1 is marked in red below."
                : missingCount
                  ? `${missingCount} are marked in red below.`
                  : "Every term on the list is there."}
            </span>
          </p>

          {role.groups.map((group, g) => (
            <div key={group.title} className="mt-6">
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                {group.title}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.terms.map((term, i) => (
                  <Pill
                    key={term}
                    label={term}
                    present={covered.has(term)}
                    index={g + i}
                  />
                ))}
              </ul>
            </div>
          ))}

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

          <div className="mt-6 flex justify-center">
            <ToolStepBack
              label="Pick another title"
              onClick={() => {
                setSlug("");
                setCvText("");
                goStep(1);
              }}
            />
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
}