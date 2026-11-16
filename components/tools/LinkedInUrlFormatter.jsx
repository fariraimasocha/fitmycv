"use client";

// Client-side LinkedIn URL cleaner used by /linkedin-url-for-resume.
//
// ponytail: string work in the browser, the same as the file name tool. No
// API route, no storage, and no request to LinkedIn, so it cannot tell
// whether a profile exists. It only tidies the URL the user pasted. The pure
// helpers between the markers are checked by scripts/check-tools.mjs.

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon, CopyIcon, WarningIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

// pure-helpers:start

// Path starts that are LinkedIn pages but not a personal profile. Each one
// has its own message under `notProfile` in messages/<locale>/tools/link.json.
const NOT_PROFILE = new Set(["company", "school", "showcase", "posts", "feed", "jobs", "pulse", "pub"]);

// LinkedIn adds a run of digits or hex to a handle when you never picked one.
const AUTO_SUFFIX = /-(?=[0-9a-f]*\d)[0-9a-f]{5,}$|-\d{3,}$/i;

/**
 * Parses whatever the user pasted into a LinkedIn profile handle.
 * Returns { handle, removed, prefix } on success or { error } when it is not
 * a profile link. `removed` lists message keys for what was stripped, so the
 * tool can say so, and `prefix` is the country subdomain when one went.
 * `error` is a message key, or "" for empty input.
 */
function parseLinkedInUrl(input) {
  let text = String(input ?? "")
    .trim()
    .replace(/^[<"'(\s]+|[>"')\s]+$/g, "");
  if (!text) return { error: "" };

  // A bare handle, like the part after /in/.
  if (/^[\p{L}\p{N}_-]+$/u.test(text) && !/^linkedin$/i.test(text)) {
    return { handle: text, removed: [], prefix: "" };
  }

  if (/^\/?in\//i.test(text)) text = `linkedin.com/${text.replace(/^\//, "")}`;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = `https://${text}`;

  let url;
  try {
    url = new URL(text);
  } catch {
    return { error: "notLink" };
  }

  const host = url.hostname.toLowerCase();
  if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) {
    return { error: "notLinkedIn" };
  }

  const removed = [];
  const sub = host.slice(0, -"linkedin.com".length).replace(/\.$/, "");
  const prefix = sub && sub !== "www" && sub !== "m" && sub !== "mobile" ? sub : "";
  if (sub === "m" || sub === "mobile") removed.push("mobile");
  else if (prefix) removed.push("country");
  if (url.search) removed.push("tracking");
  if (url.hash) removed.push("fragment");

  const segments = url.pathname.split("/").filter(Boolean);
  const first = (segments[0] || "").toLowerCase();
  if (first !== "in") {
    if (NOT_PROFILE.has(first)) return { error: `notProfile.${first}` };
    return { error: "notProfile.other" };
  }
  if (!segments[1]) {
    return { error: "noHandle" };
  }

  let handle = segments[1];
  try {
    handle = decodeURIComponent(handle);
  } catch {
    // A malformed escape is left as typed and flagged by findLinkIssues.
  }
  if (segments.length > 2) removed.push("path");
  if (url.pathname.endsWith("/")) removed.push("slash");

  return { handle, removed, prefix };
}

/** The short form for the printed CV and the full form for the hyperlink. */
function formatLinks(handle) {
  const clean = handle.toLowerCase();
  return {
    short: `linkedin.com/in/${clean}`,
    full: `https://www.linkedin.com/in/${clean}`,
  };
}

/** Message keys for things about the handle that are worth the user fixing. */
function findLinkIssues(handle) {
  const issues = [];
  if (AUTO_SUFFIX.test(handle)) issues.push("autoSuffix");
  if (/[^A-Za-z0-9-]/.test(handle)) issues.push("oddCharacters");
  if (handle.length < 3) issues.push("tooShort");
  return issues;
}

// pure-helpers:end

const EXAMPLE = "https://uk.linkedin.com/in/farirai-masocha-4b2a19c3?originalSubdomain=zw";

export default function LinkedInUrlFormatter() {
  const t = useTranslations("tools.link");
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");

  const result = useMemo(() => {
    const isExample = !value.trim();
    const parsed = parseLinkedInUrl(isExample ? EXAMPLE : value);
    if (!parsed.handle) return { isExample, error: parsed.error };
    return {
      isExample,
      ...formatLinks(parsed.handle),
      removed: parsed.removed,
      prefix: parsed.prefix,
      issues: findLinkIssues(parsed.handle),
    };
  }, [value]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(""), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (key, text) => {
    if (!navigator?.clipboard?.writeText) {
      setCopyError(t("copyBlocked"));
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyError("");
      setCopied(key);
      toast.success(t("copied"));
    } catch {
      setCopyError(t("copyBlocked"));
    }
  };

  const options = result.short
    ? [
        {
          key: "short",
          text: result.short,
          badge: t("shortBadge"),
          note: t("shortNote"),
        },
        {
          key: "full",
          text: result.full,
          note: t("fullNote"),
        },
      ]
    : [];

  return (
    <div className="landing-card rounded-3xl p-4 sm:p-8">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="linkedin-url"
          className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
        >
          {t("label")}
        </label>
        <input
          id="linkedin-url"
          type="text"
          inputMode="url"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setCopyError("");
          }}
          placeholder={t("placeholder")}
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
        />
      </div>

      <p className="mt-4 text-xs font-semibold text-[var(--landing-ink-soft)]">
        {t("hint")}
      </p>

      <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {result.isExample ? t("exampleHeading") : t("resultHeading")}
          </p>
          {result.isExample ? (
            <span className="rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-1 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              {t("exampleBadge")}
            </span>
          ) : null}
        </div>

        {result.error ? (
          <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-[oklch(0.75_0.14_75_/_0.35)] bg-[oklch(0.75_0.14_75_/_0.09)] px-4 py-2.5 text-sm leading-6 text-[var(--landing-ink)]">
            <WarningIcon
              size={15}
              weight="bold"
              aria-hidden="true"
              className="mt-1 shrink-0 text-[var(--landing-accent)]"
            />
            {t(result.error)}
          </p>
        ) : (
          <>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
              {result.isExample
                ? t("exampleIntro")
                : t("resultIntro")}
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {options.map((option) => (
                <li
                  key={option.key}
                  className="flex flex-col gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold break-all text-[var(--landing-ink)]">
                        {option.text}
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

                  {!result.isExample ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(option.key, option.text)}
                      aria-label={t("copyAria", { link: option.text })}
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
                          {t("copiedButton")}
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

            <div className="mt-6 rounded-2xl border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                {t("previewHeading")}
              </p>
              <p className="mt-2 break-all text-sm leading-6 text-[var(--landing-ink)]">
                {t("previewLine")} |{" "}
                <span className="font-semibold underline decoration-[var(--landing-line)] underline-offset-4">
                  {result.short}
                </span>
              </p>
            </div>

            {result.removed?.length && !result.isExample ? (
              <p className="mt-4 text-sm leading-6 text-[var(--landing-ink-soft)]">
                {t("removed", {
                  items: result.removed
                    .map((key) => t(`removedItem.${key}`, { prefix: result.prefix }))
                    .join(t("listSeparator")),
                })}
              </p>
            ) : null}

            {result.issues?.length ? (
              <div className="mt-8">
                <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                  {t("issuesHeading")}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {result.issues.map((issue) => (
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
                      {t(`issue.${issue}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}

        <p aria-live="polite" className="sr-only">
          {copied ? t("copied") : ""}
        </p>
        {copyError ? (
          <p className="mt-4 text-sm font-semibold text-[var(--landing-coral)]">{copyError}</p>
        ) : null}
      </div>
    </div>
  );
}
