"use client";

// Outer shell for every free tool. Puts the stepper above the working area so
// the card never looks blank, and keeps one padding/radius pattern across
// pages. Children render the active step only.

import ToolStepper from "@/components/tools/ToolStepper";

export default function ToolShell({
  steps,
  current,
  onStepSelect,
  children,
  className = "",
}) {
  return (
    <div className={`landing-card rounded-3xl p-5 sm:p-10 ${className}`}>
      {steps?.length ? (
        <div className="mb-8 sm:mb-10">
          <ToolStepper
            steps={steps}
            current={current}
            onStepSelect={onStepSelect}
          />
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Primary continue / submit row under a step. */
export function ToolStepActions({ children, hint }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      {children}
      {hint ? (
        <p className="text-center text-xs font-semibold text-[var(--landing-ink-soft)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Quiet back link under a step, for taking a decision back. */
export function ToolStepBack({ label = "Back", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)] underline underline-offset-4 transition-colors hover:text-[var(--landing-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2"
    >
      {label}
    </button>
  );
}
