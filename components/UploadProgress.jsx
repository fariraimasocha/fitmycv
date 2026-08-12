"use client";

import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { UPLOAD_STAGES } from "@/utils/upload-resume";

export default function UploadProgress({ progress, stage, label }) {
  const stageIndex = UPLOAD_STAGES.findIndex((s) => s.id === stage);
  const activeIndex =
    stage === "complete" ? UPLOAD_STAGES.length : Math.max(stageIndex, 0);

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--landing-ink)]">{label}</p>
          <p className="text-xs text-[var(--landing-ink-soft)]">
            Step {Math.min(activeIndex + 1, UPLOAD_STAGES.length)} of{" "}
            {UPLOAD_STAGES.length}
          </p>
        </div>
        <span className="font-outfit text-lg font-semibold text-[var(--landing-ink)]">
          {Math.round(progress)}%
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-[var(--landing-accent)] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-2">
        {UPLOAD_STAGES.map((item, index) => {
          const done = stage === "complete" || index < activeIndex;
          const active = stage !== "complete" && index === activeIndex;

          return (
            <li
              key={item.id}
              className={`flex items-center gap-2.5 text-sm ${
                active
                  ? "font-semibold text-[var(--landing-ink)]"
                  : done
                    ? "text-[var(--landing-success)]"
                    : "text-[var(--landing-ink-soft)]"
              }`}
            >
              {done ? (
                <CheckCircleIcon size={16} weight="fill" aria-hidden="true" />
              ) : (
                <CircleIcon
                  size={16}
                  weight={active ? "fill" : "regular"}
                  className={active ? "text-[var(--landing-accent)]" : undefined}
                  aria-hidden="true"
                />
              )}
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
