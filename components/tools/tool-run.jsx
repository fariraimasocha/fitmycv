"use client";

// Shared run state for the free tools. Every tool scores in the browser in a
// few milliseconds, so this is about feedback, not throughput: the click paints
// a pending state, and the result only renders once that state has been up long
// enough to read.
// ponytail: one timer, no queue. If a tool ever does real async work, swap the
// timeout for the promise and keep the same shape.

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleNotchIcon } from "@phosphor-icons/react";

const MIN_PENDING_MS = 550;

export function useToolRun() {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = useCallback(() => {
    clearTimeout(timer.current);
    setRan(false);
    setRunning(true);
    timer.current = setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, MIN_PENDING_MS);
  }, []);

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
      className="landing-primary-btn font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
      {...rest}
    >
      {running ? (
        <>
          <CircleNotchIcon size={15} className="animate-spin" aria-hidden="true" />
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
