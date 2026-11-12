"use client";

import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Format, Loupe } from "@lucasmarkes/hairline/react";
import { UPLOAD_STAGES } from "@/utils/upload-resume";

export default function UploadProgress({ progress, stage }) {
  const t = useTranslations("tailor.upload");
  const label = t(`stages.${stage}`);
  const stageIndex = UPLOAD_STAGES.findIndex((s) => s.id === stage);
  const activeIndex =
    stage === "complete" ? UPLOAD_STAGES.length : Math.max(stageIndex, 0);
  // ponytail: two figures, not five. Only "preparing" (pdf.js in the browser)
  // is real work on its own; the later stages are a timer over one request.
  const Figure = stage === "preparing" ? Loupe : Format;

  return (
    // Sits inside the caller's panel, so no card of its own.
    <div className="space-y-4">
      <Figure
        play={stage !== "complete"}
        intensity={0.6}
        aria-hidden="true"
        className="mx-auto w-full max-w-40 [--hairline-plate:var(--landing-surface)]"
      />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--landing-ink)]">{label}</p>
          <p className="text-xs text-[var(--landing-ink-soft)]">
            {t("step", {
              current: Math.min(activeIndex + 1, UPLOAD_STAGES.length),
              total: UPLOAD_STAGES.length,
            })}
          </p>
        </div>
        <span className="font-outfit text-base font-semibold text-[var(--landing-ink)]">
          {Math.round(progress)}%
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]"
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

      <ul className="divide-y divide-[var(--landing-line)] border-t border-[var(--landing-line)]">
        {UPLOAD_STAGES.map((item, index) => {
          const done = stage === "complete" || index < activeIndex;
          const active = stage !== "complete" && index === activeIndex;

          return (
            <li
              key={item.id}
              className={`flex items-center gap-3 py-3 text-sm ${
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
              {t(`stages.${item.id}`)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
