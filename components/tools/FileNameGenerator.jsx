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

// Keep the whole name, extension included, under 100 characters.
const MAX_USER_LENGTH = 84;

// Characters that Windows, macOS or Linux refuse inside a file name.
const ILLEGAL = /[\\/:*?"<>|]/;
const VERSION_WORDS = /\b(final|draft|updated|revised|latest|copy|version|v\d+)\b/i;
const TYPED_EXTENSION = /\.(pdf|docx?|txt|rtf|pages|odt)\b/i;
const ACCENTED = /[\u00c0-\u024f]/;

const trimEdges = (value) => value.replace(/^[-_.]+|[-_.]+$/g, "");

/**
 * Turns one field into a safe file name part. Capitalisation is left alone:
 * people spell their own names, and title casing over them gets it wrong.
 */
export function sanitizePart(value, separator) {
  return trimEdges(
    String(value ?? "")
      .normalize("NFKD") // "e" with an acute accent becomes "e" plus a mark
      .replace(/[\u0300-\u036f]/g, "") // drop the mark, keep the letter
      .replace(/[\\/:*?"<>|]/g, " ") // characters that break uploads
      .replace(/[\u0000-\u001f\u007f]/g, " ") // control characters
      .replace(/[^\p{L}\p{N}\s._-]/gu, " ") // punctuation, symbols, emoji
      .replace(/\s+/g, separator) // whitespace runs collapse to one separator
      .replace(/[-_]{2,}/g, separator)
  );
}

/**
 * Joins the user's parts, caps the length, and always ends with Resume.pdf so
 * the file says what it is even when everything else is stripped away.
 */
export function buildFileName(parts, separator = "-") {
  let stem = parts
    .map((part) => sanitizePart(part, separator))
    .filter(Boolean)
    .join(separator)
    .replace(/[-_]{2,}/g, separator)
    .replace(/\.{2,}/g, ".");

  if (stem.length > MAX_USER_LENGTH) {
    // ponytail: a very long name is cut at the last separator inside the cap,
    // and mid word when there is no separator to cut at.
    const cut = stem.slice(0, MAX_USER_LENGTH);
    const lastSeparator = cut.lastIndexOf(separator);
    stem = lastSeparator > 0 ? cut.slice(0, lastSeparator) : cut;
  }

  stem = trimEdges(stem);
  return stem ? `${stem}${separator}Resume.pdf` : "Resume.pdf";
}

/** True when the parts are long enough that buildFileName has to cut them. */
export function exceedsLimit(parts, separator = "-") {
  return (
    parts
      .map((part) => sanitizePart(part, separator))
      .filter(Boolean)
      .join(separator).length > MAX_USER_LENGTH
  );
}

/**
 * The live warnings. Each one is a thing the user typed that they can fix,
 * not a thing the sanitiser silently did and forgot to mention.
 */
export function findIssues({ name = "", role = "", company = "" }, truncated) {
  const typed = [name, role, company].filter((field) => field.trim());
  if (!typed.length) return [];

  const issues = [];
  if (typed.some((field) => /\s/.test(field.trim()))) {
    issues.push("Spaces are replaced. A raw space turns into %20 in a download link.");
  }
  if (typed.some((field) => VERSION_WORDS.test(field))) {
    issues.push("Leave out final, draft and v2. A version word reads as a working file.");
  }
  if (name.trim() && /\p{Ll}/u.test(name) && name === name.toLowerCase()) {
    issues.push("Your name is all lowercase. Capitalise it. A recruiter reads this name.");
  }
  if (typed.some((field) => TYPED_EXTENSION.test(field))) {
    issues.push("Drop the extension. It is added for you, and PDF is the safer format.");
  }
  if (typed.some((field) => ILLEGAL.test(field))) {
    issues.push('Removed the characters that break uploads: \\ / : * ? " < > |');
  }
  if (typed.some((field) => ACCENTED.test(field))) {
    issues.push("Accents are simplified, so the name is safe on any operating system.");
  }
  if (truncated) {
    issues.push("Trimmed to keep the file name short enough to read at a glance.");
  }
  return issues;
}

// ---- end of pure logic, checked by scripts/check-tools.mjs ----

const EXAMPLE = {
  name: "Farirai Masocha",
  role: "Software Engineer",
  company: "Northwind",
};

const FIELDS = [
  { key: "name", label: "Your full name", placeholder: "Farirai Masocha" },
  { key: "role", label: "Job title", placeholder: "Software Engineer" },
  { key: "company", label: "Company (optional)", placeholder: "Northwind" },
];

export default function FileNameGenerator() {
  const [values, setValues] = useState({ name: "", role: "", company: "" });
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");

  const { options, issues, isExample } = useMemo(() => {
    const empty = !values.name.trim() && !values.role.trim() && !values.company.trim();
    const source = empty ? EXAMPLE : values;
    const { name, role, company } = source;

    const recommended = buildFileName([name, role], "-");
    const truncated = exceedsLimit([name, role, company], "-");

    return {
      isExample: empty,
      issues: empty ? [] : findIssues(values, truncated),
      options: [
        {
          key: "recommended",
          fileName: recommended,
          note: "Use this for most applications. It names you and the role.",
          badge: "Recommended",
        },
        {
          key: "broad",
          fileName: buildFileName([name], "-"),
          note: "Use it when you send the same CV to several different roles.",
        },
        {
          key: "company",
          fileName: company.trim() ? buildFileName([name, role, company], "-") : "",
          note: company.trim()
            ? "Use it when one recruiter is filling several roles at the same company."
            : "Add a company name to build this one.",
        },
        {
          key: "underscore",
          fileName: buildFileName([name, role], "_"),
          note: "Use it when an upload form or an agency asks for underscores.",
        },
      ],
    };
  }, [values]);

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
      setCopyError("Copy is blocked in this browser. Select the name and copy it.");
      return;
    }
    try {
      await navigator.clipboard.writeText(option.fileName);
      setCopyError("");
      setCopied(option.key);
      toast.success("File name copied");
    } catch {
      setCopied("");
      setCopyError("Copy is blocked in this browser. Select the name and copy it.");
    }
  };

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-3">
        {FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-2">
            <label
              htmlFor={`filename-${field.key}`}
              className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
            >
              {field.label}
            </label>
            <input
              id={`filename-${field.key}`}
              type="text"
              value={values[field.key]}
              onChange={update(field.key)}
              placeholder={field.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
            />
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold text-[var(--landing-ink-soft)]">
        Names build as you type. Nothing is uploaded or stored.
      </p>

      <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {isExample ? "Here is what you get" : "Your file names"}
          </p>
          {isExample ? (
            <span className="rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-1 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              Example
            </span>
          ) : null}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
          {isExample
            ? "Type your name and the job title to build your own. Copy the one that fits and rename your file before you upload it."
            : "Copy the one that fits the application, then rename your file before you upload it."}
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
                    className={`font-mono text-sm font-bold break-all ${
                      option.fileName
                        ? "text-[var(--landing-ink)]"
                        : "text-[var(--landing-ink-soft)]"
                    }`}
                  >
                    {option.fileName || "Firstname-Lastname-Role-Company-Resume.pdf"}
                  </span>
                  {option.badge ? (
                    <span className="rounded-full border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.08)] px-2.5 py-1 font-outfit text-xs font-extrabold text-[var(--landing-ink)]">
                      {option.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {option.note}
                </p>
              </div>

              {option.fileName && !isExample ? (
                <button
                  type="button"
                  onClick={() => handleCopy(option)}
                  aria-label={`Copy file name ${option.fileName}`}
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
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon size={14} weight="bold" aria-hidden="true" />
                      Copy
                    </>
                  )}
                </button>
              ) : null}
            </li>
          ))}
        </ul>

        <p aria-live="polite" className="sr-only">
          {copied ? "File name copied" : ""}
        </p>

        {copyError ? (
          <p className="mt-4 text-sm font-semibold text-[var(--landing-coral)]">{copyError}</p>
        ) : null}

        {issues.length ? (
          <div className="mt-8">
            <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              Worth fixing
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
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
