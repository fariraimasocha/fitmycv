"use client";

// Shared run state for the free tools. Every tool scores in the browser in a
// few milliseconds, so this is about feedback, not throughput: the click paints
// a pending state, and the result only renders once that state has been up long
// enough to read.
// ponytail: one timer, no queue. If a tool ever does real async work, swap the
// timeout for the promise and keep the same shape.
//
// The copy button, the "what you get back" block and the two shared lines of
// copy live here too, so every tool handles the same moment the same way.

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, CircleNotchIcon, CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { trackEvent } from "@/lib/analytics";

const MIN_PENDING_MS = 550;

// "Uploaded", not "stored": the posting draft and the sign-up handoff do sit
// in this browser's storage.
export const TOOL_PRIVACY = "Read in this tab. Nothing is uploaded.";

// Shown when lib/ats-detect.js isLinkOnly() is true for a posting box.
export const JOB_IS_LINK = "That is a link. Paste the text of the job posting instead.";

export function useToolRun(tool) {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = useCallback(() => {
    clearTimeout(timer.current);
    setRan(false);
    setRunning(true);
    // One event name for every tool, so their drop-off can be compared.
    trackEvent("tool_run", { tool });
    timer.current = setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, MIN_PENDING_MS);
  }, [tool]);

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setRunning(false);
    setRan(false);
  }, []);

  return { running, ran, start, reset };
}

export function ToolSubmitButton({ label, busyLabel, running, disabled, ...rest }) {
  return (
    <button
      type="submit"
      disabled={disabled || running}
      aria-busy={running}
      className="landing-primary-btn w-full font-outfit text-sm sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
      {...rest}
    >
      {running ? (
        <>
          <CircleNotchIcon size={16} className="animate-spin" aria-hidden="true" />
          {busyLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

// Placeholder rows that match the shape of the result block underneath, so the
// card grows once instead of twice.
export function ToolProgress({ message, lines = 4 }) {
  return (
    <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
      >
        <CircleNotchIcon size={16} className="animate-spin" aria-hidden="true" />
        {message}
      </p>
      <div className="mt-6 flex flex-col gap-3" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="tool-skeleton h-11 rounded-2xl"
            style={{ width: `${100 - i * 7}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Copies `text`. Says "Copied" only once the clipboard has taken it. */
export function CopyButton({ text, tool, label, message, ariaLabel, onCopied }) {
  const t = useTranslations("pages.tools.copy");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      // Throws by itself where there is no clipboard (http, some in-app browsers).
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(message ?? t("copied"));
      trackEvent("tool_copy", { tool });
      onCopied?.();
    } catch {
      toast.error(t("failed"));
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel}
      className="landing-secondary-btn shrink-0 font-outfit text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
    >
      {copied ? (
        <CheckIcon size={14} aria-hidden="true" className="text-[var(--landing-success)]" />
      ) : (
        <CopyIcon size={14} aria-hidden="true" />
      )}
      {copied ? t("copied") : (label ?? t("copy"))}
    </button>
  );
}

/** What the tool returns, shown before the first run so the card is never blank. */
export function ToolPreview({ heading = "What you get back", items }) {
  return (
    <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
      <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
        {heading}
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map(({ title, body }) => (
          <li
            key={title}
            className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-4"
          >
            <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">{title}</p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--landing-ink-soft)]">{body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
