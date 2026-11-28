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

import { ArcGauge } from "@/components/charts/ArcGauge";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
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
// `detail` is the anticipation line: what is being read, in real counts from
// the input, so the result answers a question the user just watched being asked.
export function ToolProgress({ message, detail, lines = 4 }) {
  return (
    <div className="mt-8 border-t border-[var(--landing-line)] pt-8">
      <div role="status" aria-live="polite">
        <p className="flex items-center gap-2 font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
          <CircleNotchIcon size={16} className="animate-spin" aria-hidden="true" />
          {message}
        </p>
        {detail ? (
          <p className="mt-1.5 pl-6 text-sm leading-6 text-[var(--landing-ink-soft)]">{detail}</p>
        ) : null}
      </div>
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

export const STRONG_SCORE = 75;

/**
 * The reveal on a scored tool: the ring fills and the number counts up. A
 * strong score (75 and up) gets one soft glow, so a good result feels
 * different from a middling one. ArcGauge, AnimatedNumber and the glow all
 * fall back to a still final state under reduced motion.
 */
export function ToolScoreRing({ value, label, unit, size = 112 }) {
  const tone =
    value >= STRONG_SCORE
      ? "var(--landing-success)"
      : value >= 50
        ? "var(--landing-accent)"
        : "var(--landing-coral)";

  return (
    <span className={`inline-flex shrink-0 rounded-full ${value >= STRONG_SCORE ? "peak-glow" : ""}`}>
      <ArcGauge
        value={value}
        size={size}
        strokeWidth={9}
        color={tone}
        label={label}
        trackClassName="text-[var(--landing-line)]"
      >
        <span className="font-outfit text-2xl font-extrabold text-[var(--landing-ink)]">
          <AnimatedNumber value={value} />%
        </span>
        <span className="font-outfit text-xs font-extrabold uppercase tracking-widest text-[var(--landing-ink-soft)]">
          {unit}
        </span>
      </ArcGauge>
    </span>
  );
}

/** Words in a text box, for the anticipation line. */
export function wordCount(text) {
  return (text.trim().match(/\S+/g) || []).length;
}

/** The anticipation line for every tool that reads a CV and a posting. */
export function cvJobDetail(cvText, jobText) {
  return `Comparing ${wordCount(cvText)} words of your CV with ${wordCount(jobText)} words of the posting.`;
}

/**
 * Delay for the nth result item. Pair it with the `tool-reveal` class so items
 * land one after another instead of all at once. Use a longer `step` (150) for
 * the few main cards a generator returns, so each one gets its own beat.
 * ponytail: capped at 8 steps, so a 30 item list still settles in about 0.9s.
 */
export function revealDelay(i, step = 60) {
  return { animationDelay: `${Math.min(i, 8) * step}ms` };
}

/**
 * Classes for a generated option card. The one the user copied is marked as
 * picked and glows once: the afterglow is their choice, not ours.
 */
export function pickedCard(picked) {
  return picked
    ? "peak-glow border-[var(--landing-success)] bg-[var(--landing-success-soft)]"
    : "border-[var(--landing-line)] bg-[var(--landing-paper)]";
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
