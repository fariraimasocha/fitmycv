"use client";

// Shared step rail for the free tools. One pattern across every tool so the
// product feels like one thing: numbered circles, a connector, and a plain
// label. Active uses the brand accent. Completed stays filled so progress is
// visible. Clicking a completed step goes back (undo). Future steps stay inert.

import { CheckIcon } from "@phosphor-icons/react";

export default function ToolStepper({ steps, current, onStepSelect }) {
  return (
    <nav aria-label="Tool steps" className="w-full">
      <ol className="flex items-start justify-center gap-0">
        {steps.map((label, index) => {
          const n = index + 1;
          const state =
            n < current ? "done" : n === current ? "active" : "todo";
          const clickable = state === "done" && typeof onStepSelect === "function";

          return (
            <li
              key={label}
              className={`relative flex flex-1 flex-col items-center ${
                index < steps.length - 1
                  ? "after:absolute after:left-[calc(50%+1.25rem)] after:right-[calc(-50%+1.25rem)] after:top-5 after:h-px after:bg-[var(--landing-line)] after:content-['']"
                  : ""
              }`}
            >
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onStepSelect?.(n)}
                aria-current={state === "active" ? "step" : undefined}
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full font-outfit text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2 ${
                  state === "active"
                    ? "bg-[var(--landing-accent)] text-white"
                    : state === "done"
                      ? "bg-[var(--landing-ink)] text-[var(--landing-on-primary)]"
                      : "border border-[var(--landing-line)] bg-[var(--landing-surface)] text-[var(--landing-ink-soft)]"
                } ${clickable ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}
              >
                {state === "done" ? (
                  <CheckIcon size={16} weight="bold" aria-hidden="true" />
                ) : (
                  n
                )}
              </button>
              <span
                className={`mt-3 max-w-28 text-center font-outfit text-xs font-extrabold leading-4 sm:text-sm ${
                  state === "todo"
                    ? "text-[var(--landing-ink-soft)]"
                    : "text-[var(--landing-ink)]"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Labels shared by the CV + job free tools. */
export const CV_JOB_STEPS = ["Upload resume", "Add job", "View results"];

/** Labels shared by the CV-only free tools. */
export const CV_ONLY_STEPS = ["Upload resume", "View results"];

/** Labels shared by the job-only free tools. */
export const JOB_ONLY_STEPS = ["Add job", "View results"];

/** Resume keywords generator: title list first, then CV check. */
export const KEYWORDS_STEPS = ["Pick a title", "Upload resume", "View results"];
