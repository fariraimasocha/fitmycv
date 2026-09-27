"use client";

// Client-side LinkedIn URL cleaner used by /linkedin-url-for-resume.
//
// ponytail: string work in the browser, the same as the file name tool. No
// API route, no storage, and no request to LinkedIn, so it cannot tell
// whether a profile exists. It only tidies the URL the user pasted. The pure
// helpers between the markers are checked by scripts/check-tools.mjs.

import { useEffect, useMemo, useState } from "react";
import { CheckIcon, CopyIcon, WarningIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

// pure-helpers:start

// Path starts that are LinkedIn pages but not a personal profile.
const NOT_PROFILE = {
  company: "That is a company page. Paste the link to your own profile, the one with /in/ in it.",
  school: "That is a school page. Paste the link to your own profile, the one with /in/ in it.",
  showcase: "That is a showcase page. Paste the link to your own profile, the one with /in/ in it.",
  posts: "That is a link to a post. Paste the link to your own profile, the one with /in/ in it.",
  feed: "That is a link to your feed or a post. Paste the link to your profile, the one with /in/ in it.",
  jobs: "That is a job listing. Paste the link to your own profile, the one with /in/ in it.",
  pulse: "That is a link to an article. Paste the link to your own profile, the one with /in/ in it.",
  pub: "That is an old style profile link. Open your profile and copy the address from the browser, which now uses /in/.",
};

// LinkedIn adds a run of digits or hex to a handle when you never picked one.
const AUTO_SUFFIX = /-(?=[0-9a-f]*\d)[0-9a-f]{5,}$|-\d{3,}$/i;

/**
 * Parses whatever the user pasted into a LinkedIn profile handle.
 * Returns { handle, removed } on success or { error } when it is not a
 * profile link. `removed` lists what was stripped, so the tool can say so.
 */
function parseLinkedInUrl(input) {
  let text = String(input ?? "")
    .trim()
    .replace(/^[<"'(\s]+|[>"')\s]+$/g, "");
  if (!text) return { error: "" };

  // A bare handle, like the part after /in/.
  if (/^[\p{L}\p{N}_-]+$/u.test(text) && !/^linkedin$/i.test(text)) {
    return { handle: text, removed: [] };
  }

  if (/^\/?in\//i.test(text)) text = `linkedin.com/${text.replace(/^\//, "")}`;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = `https://${text}`;

  let url;
  try {
    url = new URL(text);
  } catch {
    return { error: "That does not look like a link. Paste the address from your profile page." };
  }

  const host = url.hostname.toLowerCase();
  if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) {
    return { error: "That is not a LinkedIn link. Paste the address from your LinkedIn profile page." };
  }

  const removed = [];
  const sub = host.slice(0, -"linkedin.com".length).replace(/\.$/, "");
  if (sub === "m" || sub === "mobile") removed.push("the mobile m. prefix");
  else if (sub && sub !== "www") removed.push(`the ${sub}. country prefix`);
  if (url.search) removed.push("the tracking text after the ?");
  if (url.hash) removed.push("the # fragment");

  const segments = url.pathname.split("/").filter(Boolean);
  const first = (segments[0] || "").toLowerCase();
  if (first !== "in") {
    if (NOT_PROFILE[first]) return { error: NOT_PROFILE[first] };
    return { error: "That link does not point at a profile. Profile links have /in/ followed by your name." };
  }
  if (!segments[1]) {
    return { error: "The link stops after /in/. Copy the full address from your profile page." };
  }

  let handle = segments[1];
  try {
    handle = decodeURIComponent(handle);
  } catch {
    // A malformed escape is left as typed and flagged by findLinkIssues.
  }
  if (segments.length > 2) removed.push("the language or page part after your name");
  if (url.pathname.endsWith("/")) removed.push("the trailing slash");

  return { handle, removed };
}

/** The short form for the printed CV and the full form for the hyperlink. */
function formatLinks(handle) {
  const clean = handle.toLowerCase();
  return {
    short: `linkedin.com/in/${clean}`,
    full: `https://www.linkedin.com/in/${clean}`,
  };
}

/** Things about the handle itself that are worth the user fixing. */
function findLinkIssues(handle) {
  const issues = [];
  if (AUTO_SUFFIX.test(handle)) {
    issues.push(
      "Your link ends in a string of numbers or letters that LinkedIn added. A custom URL with just your name reads better on a CV. The steps are below."
    );
  }
  if (/[^A-Za-z0-9-]/.test(handle)) {
    issues.push(
      "Your link has characters other than letters, numbers and hyphens. Some PDF readers and applicant tracking systems break the link at those. A custom URL fixes it."
    );
  }
  if (handle.length < 3) {
    issues.push("That handle is very short. Check you copied the whole address from your profile.");
  }
  return issues;
}

// pure-helpers:end

const EXAMPLE = "https://uk.linkedin.com/in/farirai-masocha-4b2a19c3?originalSubdomain=zw";

export default function LinkedInUrlFormatter() {
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
      setCopyError("Copy is blocked in this browser. Select the link and copy it.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyError("");
      setCopied(key);
      toast.success("Link copied");
    } catch {
      setCopyError("Copy is blocked in this browser. Select the link and copy it.");
    }
  };

  const options = result.short
    ? [
        {
          key: "short",
          text: result.short,
          badge: "For the CV",
          note: "Type this as the visible text in your contact line. It is short and easy to read.",
        },
        {
          key: "full",
          text: result.full,
          note: "Use this as the hyperlink behind that text, so a click opens your profile.",
        },
      ]
    : [];

  return (
    <div className="landing-card rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="linkedin-url"
          className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
        >
          Your LinkedIn profile link
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
          placeholder="https://www.linkedin.com/in/your-name"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]"
        />
      </div>

      <p className="mt-4 text-xs font-semibold text-[var(--landing-ink-soft)]">
        Paste the address from your profile page. The link is cleaned as you type.
        Nothing is uploaded or stored.
      </p>

      <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            {result.isExample ? "Here is what you get" : "Your CV links"}
          </p>
          {result.isExample ? (
            <span className="rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-1 font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
              Example
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
            {result.error}
          </p>
        ) : (
          <>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--landing-ink-soft)]">
              {result.isExample
                ? "Paste your own link above to clean it. This example comes from a messy country link with tracking text."
                : "Copy the short form into your CV and put the full form behind it as the hyperlink."}
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
                      aria-label={`Copy link ${option.text}`}
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

            <div className="mt-6 rounded-2xl border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                How it looks in your CV header
              </p>
              <p className="mt-2 break-all text-sm leading-6 text-[var(--landing-ink)]">
                Your Name | City, Country | you@email.com |{" "}
                <span className="font-semibold underline decoration-[var(--landing-line)] underline-offset-4">
                  {result.short}
                </span>
              </p>
            </div>

            {result.removed?.length && !result.isExample ? (
              <p className="mt-4 text-sm leading-6 text-[var(--landing-ink-soft)]">
                Removed {result.removed.join(", ")}.
              </p>
            ) : null}

            {result.issues?.length ? (
              <div className="mt-8">
                <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                  Worth fixing
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
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}

        <p aria-live="polite" className="sr-only">
          {copied ? "Link copied" : ""}
        </p>
        {copyError ? (
          <p className="mt-4 text-sm font-semibold text-[var(--landing-coral)]">{copyError}</p>
        ) : null}
      </div>
    </div>
  );
}
