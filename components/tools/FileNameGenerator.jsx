"use client";

// Client-side resume file name builder used by /resume-file-name-generator.
//
// ponytail: the whole tool is string work in the browser. There is no API
// route, no storage and no download, because a file name is not a file. The
// only real logic here is the sanitiser, and scripts/check-tools.mjs
// runs it against the awkward inputs.

import { useEffect, useMemo, useState } from "react";
import { CheckIcon, CopyIcon, WarningIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { buildFileName, exceedsLimit } from "@/utils/pdf-filename";

// Characters that Windows, macOS or Linux refuse inside a file name.
const ILLEGAL = /[\\/:*?"<>|]/;
const VERSION_WORDS = /\b(final|draft|updated|revised|latest|copy|version|v\d+)\b/i;
const TYPED_EXTENSION = /\.(pdf|docx?|txt|rtf|pages|odt)\b/i;
const ACCENTED = /[\u00c0-\u024f]/;
const ILLEGAL_LIST = '\\ / : * ? " < > |';

// English text for each warning, kept here so scripts/check-tools.mjs can read
// it. The component shows the translated message with the same key.
const ISSUES = {
  spaces: "Spaces are replaced. A raw space turns into %20 in a download link.",
  version: "Leave out final, draft and v2. A version word reads as a working file.",
  lowercase: "Your name is all lowercase. Capitalise it. A recruiter reads this name.",
  extension: "Drop the extension. It is added for you, and PDF is the safer format.",
  illegal: `Removed the characters that break uploads: ${ILLEGAL_LIST}`,
  accented: "Accents are simplified, so the name is safe on any operating system.",
  truncated: "Trimmed to keep the file name short enough to read at a glance.",
};

/**
 * The live warnings. Each one is a thing the user typed that they can fix,
 * not a thing the sanitiser silently did and forgot to mention.
 */
export function findIssues({ name = "", role = "", company = "" }, truncated) {
  const typed = [name, role, company].filter((field) => field.trim());
  if (!typed.length) return [];

  const issues = [];
  if (typed.some((field) => /\s/.test(field.trim()))) {
    issues.push(ISSUES.spaces);
  }
  if (typed.some((field) => VERSION_WORDS.test(field))) {
    issues.push(ISSUES.version);
  }
  if (name.trim() && /\p{Ll}/u.test(name) && name === name.toLowerCase()) {
    issues.push(ISSUES.lowercase);
  }
  if (typed.some((field) => TYPED_EXTENSION.test(field))) {
    issues.push(ISSUES.extension);
  }
  if (typed.some((field) => ILLEGAL.test(field))) {
    issues.push(ISSUES.illegal);
  }
  if (typed.some((field) => ACCENTED.test(field))) {
    issues.push(ISSUES.accented);
  }
  if (truncated) {
    issues.push(ISSUES.truncated);
  }
  return issues;
}

// ---- end of pure logic, checked by scripts/check-tools.mjs ----

const ISSUE_KEY = Object.fromEntries(Object.entries(ISSUES).map(([key, text]) => [text, key]));

const FIELDS = ["name", "role", "company"];

export default function FileNameGenerator() {
  const t = useTranslations("tools.filename");
  // The example doubles as the placeholders. The role is translated so the
  // example shows what happens to an accented title.
  const exampleName = t("fields.name.placeholder");
  const exampleRole = t("fields.role.placeholder");
  const exampleCompany = t("fields.company.placeholder");
  // "Resume" in English, the local word elsewhere, e.g. "CV" in French.
  const label = t("fileLabel");
  const [values, setValues] = useState({ name: "", role: "", company: "" });
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");

  const { options, issues, isExample } = useMemo(() => {
    const empty = !values.name.trim() && !values.role.trim() && !values.company.trim();
    const source = empty ? { name: exampleName, role: exampleRole, company: exampleCompany } : values;
    const { name, role, company } = source;

    const recommended = buildFileName([name, role], "-", label);
    const truncated = exceedsLimit([name, role, company], "-");

    return {
      isExample: empty,
      issues: empty ? [] : findIssues(values, truncated),
      options: [
        {
          key: "recommended",
          fileName: recommended,
          note: "recommended",
          badge: true,
        },
        {
          key: "broad",
          fileName: buildFileName([name], "-", label),
          note: "broad",
        },
        {
          key: "company",
          fileName: company.trim() ? buildFileName([name, role, company], "-", label) : "",
          note: company.trim() ? "company" : "companyEmpty",
        },
        {
          key: "underscore",
          fileName: buildFileName([name, role], "_", label),
          note: "underscore",
        },
      ],
    };
  }, [values, exampleName, exampleRole, exampleCompany, label]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(""), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const update = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setCopyError("");
  };

  const handleCopy = async (option) => {
    if (!navigator?.clipboard?.writeText) {
      setCopied("");
      setCopyError(t("copyBlocked"));
      return;
    }
    try {
      await navigator.clipboard.writeText(option.fileName);
      setCopyError("");
      setCopied(option.key);
      toast.success(t("toastCopied"));
    } catch {
      setCopied("");
      setCopyError(t("copyBlocked"));
    }
  };

  return (
    <div className="landing-card rounded-3xl p-4 sm:p-8">
      <div className="grid gap-5 md:grid-cols-3">
        {FIELDS.map((field) => (
          <div key={field} className="flex flex-col gap-2">
            <label
              htmlFor={`filename-${field}`}
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              {t(`fields.${field}.label`)}
            </label>
            <input
              id={`filename-${field}`}
              type="text"
              value={values[field]}
              onChange={update(field)}
              placeholder={t(`fields.${field}.placeholder`)}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold text-[var(--landing-ink-soft)]">
        {t("private")}
      </p>

      <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {isExample ? t("exampleHeading") : t("heading")}
          </p>
          {isExample ? (
            <span className="rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-1 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              {t("exampleBadge")}
            </span>
          ) : null}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
          {isExample ? t("exampleIntro") : t("intro")}
        </p>

        <ul className="mt-6 flex flex-col gap-3">
          {options.map((option) => (
            <li
              key={option.key}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm ${
                      option.fileName
                        ? "font-mono font-bold break-all text-[var(--landing-ink)]"
                        : "font-semibold text-[var(--landing-ink-soft)]"
                    }`}
                  >
                    {option.fileName || t("companySlot")}
                  </span>
                  {option.badge ? (
                    <span className="rounded-full border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)] px-2.5 py-1 font-outfit text-xs font-extrabold text-[var(--landing-ink)]">
                      {t("recommended")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {t(`notes.${option.note}`)}
                </p>
              </div>

              {option.fileName && !isExample ? (
                <button
                  type="button"
                  onClick={() => handleCopy(option)}
                  aria-label={t("copyAria", { name: option.fileName })}
                  className="landing-secondary-btn landing-secondary-btn-sm shrink-0 font-outfit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
                >
                  {copied === option.key ? (
                    <>
                      <CheckIcon
                        size={14}
                        weight="bold"
                        aria-hidden="true"
                        className="text-[var(--landing-success)]"
                      />
                      {t("copied")}
                    </>
                  ) : (
                    <>
                      <CopyIcon size={14} weight="bold" aria-hidden="true" />
                      {t("copy")}
                    </>
                  )}
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        <p aria-live="polite" className="sr-only">
          {copied ? t("toastCopied") : ""}
        </p>

        {copyError ? (
          <p className="mt-4 text-sm font-semibold text-[var(--landing-coral)]">{copyError}</p>
        ) : null}

        {issues.length ? (
          <div className="mt-8">
            <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              {t("worthFixing")}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {issues.map((issue) => (
                <li
                  key={issue}
                  className="flex items-start gap-2.5 rounded-xl border border-[oklch(0.75_0.14_75_/_0.35)] bg-[oklch(0.75_0.14_75_/_0.09)] px-4 py-2.5 text-sm leading-6 text-[var(--landing-ink)]"
                >
                  <WarningIcon
                    size={15}
                    weight="bold"
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[var(--landing-accent)]"
                  />
                  {ISSUE_KEY[issue] ? t(`issues.${ISSUE_KEY[issue]}`, { chars: ILLEGAL_LIST }) : issue}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
