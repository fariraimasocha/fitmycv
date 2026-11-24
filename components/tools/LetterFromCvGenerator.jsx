"use client";

// Client-side job application letter generator used by
// /job-application-letter-generator.
//
// ponytail: runs entirely in the browser, like the summary generator, and
// reuses its readers for the role title, shared skills and result lines. It
// fills a letter template; it does not write prose, so the copy never calls it
// AI. The upgrade path, when the letter needs real rewriting, is the
// signed-in tailor, which also writes the cover letter.

import { useMemo, useState } from "react";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

import ResumeFileField from "@/components/tools/ResumeFileField";
import HandoffCta from "@/components/tools/HandoffCta";
import ToolShell, {
  ToolStepActions,
  ToolStepBack,
} from "@/components/tools/ToolShell";
import { CV_JOB_STEPS } from "@/components/tools/ToolStepper";
import {
  CopyButton,
  JOB_IS_LINK,
  TOOL_PRIVACY,
  ToolProgress,
  ToolSubmitButton,
  useToolRun,
} from "@/components/tools/tool-run";
import { isLinkOnly } from "@/lib/ats-detect";
import {
  extractRoleTitle,
  extractTerms,
  findResultLines,
  findYearsOfExperience,
  preferredCasing,
  stem,
  tokenize,
} from "@/lib/summary-helpers";
import { trackEvent } from "@/lib/analytics";
import { notCompanyTerm } from "@/lib/keywords";

// pure-region-start
const RESULT_SLOT = "[Add one result from your CV with a number in it.]";

function listOf(items) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Fills the letter from facts the caller already checked: the title comes
 * from the posting, every skill is in both documents, every result is a CV
 * line. Returns the full letter and a short one.
 */
function buildLetters({ title, company, name, years, skills, results }) {
  const where = company ? ` at ${company}` : "";
  const sign = `Yours sincerely,\n${name || "[Your name]"}`;
  const open =
    `I am writing to apply for the ${title} position${where}.` +
    (years
      ? ` I have ${years}+ years of experience in this kind of work.`
      : "");
  const proof = [
    skills.length
      ? `In my work I use ${listOf(skills.slice(0, 4))}, which this role asks for.`
      : null,
    results[0] || RESULT_SLOT,
  ]
    .filter(Boolean)
    .join(" ");
  const extra = results[1]
    ? `Another example from my recent work: ${results[1]}`
    : null;
  const close = `I would welcome the chance to discuss how I can help ${company || "your team"}. Thank you for considering my application.`;

  const full = ["Dear Hiring Manager,", open, proof, extra, close, sign]
    .filter(Boolean)
    .join("\n\n");
  const short = ["Dear Hiring Manager,", `${open} ${proof}`, close, sign].join(
    "\n\n",
  );
  return [
    {
      id: "full",
      shape: "Full letter",
      hint: "Four short paragraphs. Use it as an email body or attach it as a PDF.",
      text: full,
    },
    {
      id: "short",
      shape: "Short letter",
      hint: "For an email or a form with a small text box.",
      text: short,
    },
  ];
}
// pure-region-end

const fieldClass =
  "w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-accent)]";
const labelClass =
  "font-outfit text-sm font-extrabold text-[var(--landing-ink)]";

function Pill({ label, present }) {
  const Icon = present ? CheckIcon : XIcon;
  return (
    <li
      className={
        present
          ? "inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
          : "inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.07)] px-3 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
      }
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

function readLetter(jobText, cvText, company, name, currentYear) {
  const cvStems = new Set(tokenize(cvText).map(stem));
  const job = extractRoleTitle(jobText);
  const title = job.title || extractRoleTitle(cvText).title;
  const keepTerm = notCompanyTerm(jobText);
  // The title and the company name are not skills, so neither is a gap.
  const skipStems = new Set(tokenize(`${title || ""} ${company}`).map(stem));

  const terms = extractTerms(jobText, 24)
    .filter((item) => /[a-z]/.test(item.term) && keepTerm(item.term))
    .filter((item) => !item.words.every((word) => skipStems.has(stem(word))))
    .map((item) => ({
      term: item.term,
      label: preferredCasing(item.term, jobText),
      present: item.words.every((word) => cvStems.has(stem(word))),
    }));
  const matched = terms.filter((t) => t.present);
  const missing = terms.filter((t) => !t.present);
  if (!title) return { title: null, matched, missing, letters: [] };

  const results = findResultLines(
    cvText,
    matched.map((t) => t.term),
  );
  const letters = buildLetters({
    title,
    company: company.trim(),
    name: name.trim(),
    years: findYearsOfExperience(cvText, currentYear)?.years ?? null,
    skills: matched.map((t) => t.label),
    results,
  });
  return {
    title,
    fromPosting: Boolean(job.title),
    matched,
    missing,
    letters,
    hasResult: results.length > 0,
  };
}

function LetterResult({ result, jobText, cvText }) {
  const missingCount = result.missing.length;
  return (
    <div className="landing-rise mx-auto w-full max-w-2xl">
      {result.letters.length ? (
        <>
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            Your application letter for{" "}
            <span className="text-[var(--landing-primary-dark)]">
              {result.title}
            </span>
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            {result.fromPosting
              ? "The role comes from the posting."
              : "We could not find a job title in the posting, so this uses the title in your CV."}{" "}
            Every skill is in both your CV and the posting, and every result is
            a line from your CV.
            {result.hasResult
              ? ""
              : " Your CV has no line with a number in it, so the letter marks where your result goes."}
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {result.letters.map((letter) => (
              <li
                key={letter.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                      {letter.shape}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-[var(--landing-ink-soft)]">
                      {letter.hint}
                    </p>
                  </div>
                  <CopyButton
                    tool="letter_from_cv"
                    text={letter.text}
                    message="Letter copied"
                    ariaLabel={`Copy the ${letter.shape.toLowerCase()}`}
                    onCopied={() =>
                      trackEvent("application_letter_copied", { shape: letter.id })
                    }
                  />
                </div>
                <p className="whitespace-pre-line break-words text-sm font-semibold leading-7 text-[var(--landing-ink)]">
                  {letter.text}
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
            Neither document names a role we recognise. Paste the full advert,
            including the title at the top, then try again.
          </p>
        </>
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
            Your letter leaves these out because your CV never mentions them. An
            employer reads the letter and the CV together, so a gap in one shows
            in both.
          </p>
        </>
      ) : null}

      {/* Same handoff as the ATS checker: the posting goes to the tailor, and a
          new user's CV goes to onboarding so they skip the upload. */}
      <HandoffCta
        source="application_letter"
        jobText={jobText}
        cvText={cvText}
        track={{ missing_count: missingCount }}
        title={
          missingCount
            ? "Close these gaps"
            : "Send a CV that matches the letter"
        }
        body={
          missingCount
            ? `This posting asks for ${missingCount} ${missingCount === 1 ? "term" : "terms"} your CV never mentions. FitMyCV rewrites your CV and cover letter against it, using the experience you already have.`
            : "Your CV already covers this posting's terms. FitMyCV rewrites your CV against it so the strongest evidence sits at the top."
        }
        label={missingCount ? "Close these gaps" : "Tailor my CV"}
      />
    </div>
  );
}

export default function LetterFromCvGenerator() {
  const [step, setStep] = useState(1);
  const [jobText, setJobText] = useState("");
  const [cvText, setCvText] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [cvBusy, setCvBusy] = useState(false);
  const [currentYear] = useState(() => new Date().getFullYear());
  const { running, ran, start, reset } = useToolRun("letter_from_cv");

  const jobIsLink = isLinkOnly(jobText);
  const jobTooShort = jobText.trim().length < 40 || jobIsLink;
  const cvTooShort = cvText.trim().length < 40;

  const result = useMemo(() => {
    if (!ran || jobTooShort || cvTooShort) return null;
    return readLetter(jobText, cvText, company, name, currentYear);
  }, [
    ran,
    jobTooShort,
    cvTooShort,
    jobText,
    cvText,
    company,
    name,
    currentYear,
  ]);

  const goStep = (n) => {
    if (n < 3) reset();
    setStep(n);
  };

  return (
    <ToolShell steps={CV_JOB_STEPS} current={result ? 3 : step} onStepSelect={goStep}>
      {!result && step === 1 ? (
        <div className="mx-auto w-full max-w-xl">
          <ResumeFileField
            id="letter-cv-text"
            variant="hero"
            hideLabel
            value={cvText}
            onChange={(text) => {
              setCvText(text);
              reset();
            }}
            onBusyChange={setCvBusy}
            onReady={(text) => {
              if (text.trim().length >= 40) setStep(2);
            }}
          />
          {!cvTooShort && !cvBusy ? (
            <ToolStepActions hint={TOOL_PRIVACY}>
              <ToolSubmitButton
                label="Continue"
                busyLabel="Reading your CV"
                running={false}
                disabled={false}
                onClick={() => setStep(2)}
                type="button"
              />
            </ToolStepActions>
          ) : null}
        </div>
      ) : null}

      {!result && step === 2 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (jobTooShort || cvTooShort || cvBusy) return;
            start();
            trackEvent("application_letter_generated", {});
          }}
          className="mx-auto flex w-full max-w-xl flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="letter-job-text" className={labelClass}>
              Job description
            </label>
            <textarea
              id="letter-job-text"
              value={jobText}
              onChange={(e) => {
                setJobText(e.target.value);
                reset();
              }}
              rows={10}
              autoFocus
              placeholder="Paste the full text of the job advert here."
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="letter-company" className={labelClass}>
                Company name{" "}
                <span className="font-semibold text-[var(--landing-ink-soft)]">
                  (optional)
                </span>
              </label>
              <input
                id="letter-company"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  reset();
                }}
                placeholder="Greenfield Logistics"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="letter-name" className={labelClass}>
                Your name{" "}
                <span className="font-semibold text-[var(--landing-ink-soft)]">
                  (optional)
                </span>
              </label>
              <input
                id="letter-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  reset();
                }}
                autoComplete="name"
                placeholder="Thandiwe Moyo"
                className={fieldClass}
              />
            </div>
          </div>

          <ToolStepActions
            hint={
              jobIsLink
                ? JOB_IS_LINK
                : jobTooShort
                  ? "Paste the full job posting to continue."
                  : TOOL_PRIVACY
            }
          >
            <ToolSubmitButton
              label="Write my letter"
              busyLabel="Writing your letter"
              running={running}
              disabled={jobTooShort || cvTooShort || cvBusy}
            />
            <ToolStepBack label="Back to resume" onClick={() => goStep(1)} />
          </ToolStepActions>
        </form>
      ) : null}

      {!result && step === 2 && running ? (
        <div className="mx-auto w-full max-w-xl">
          <ToolProgress message="Writing your letter" lines={4} />
        </div>
      ) : null}

      {result ? (
        <>
          <LetterResult result={result} jobText={jobText} cvText={cvText} />
          <div className="mt-6 flex justify-center">
            <ToolStepBack
              label="Write another letter"
              onClick={() => {
                setJobText("");
                goStep(2);
              }}
            />
          </div>
        </>
      ) : null}
    </ToolShell>
  );
}