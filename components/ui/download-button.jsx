"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLineDownIcon, CheckIcon, SpinnerGapIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const ICON_LAYER =
  "absolute inset-0 grid place-items-center transition-opacity duration-300 ease-out motion-reduce:transition-none";
const LABEL_LAYER =
  "col-start-1 row-start-1 whitespace-nowrap text-left transition-opacity ease-out motion-reduce:transition-none";

/**
 * Download button with an idle -> downloading -> done phase animation.
 * `onDownload` may return false to cancel the animation (e.g. we showed an
 * upgrade modal instead of downloading).
 */
export function DownloadButton({
  className,
  label = "Download PDF",
  downloadingLabel = "Preparing PDF...",
  doneLabel = "Downloaded",
  idleIcon,
  downloadMs = 1400,
  resetMs = 1800,
  onDownload,
  ...props
}) {
  const [phase, setPhase] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const schedule = (fn, ms) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fn, ms);
  };

  const handleClick = () => {
    if (phase !== "idle") return;
    if (onDownload?.() === false) return;

    setPhase("downloading");
    schedule(() => {
      setPhase("done");
      schedule(() => setPhase("idle"), resetMs);
    }, downloadMs);
  };

  const idle = phase === "idle";
  const downloading = phase === "downloading";
  const done = phase === "done";

  return (
    <button
      type="button"
      data-phase={phase}
      aria-busy={downloading || undefined}
      onClick={handleClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-4 font-outfit text-sm font-semibold outline-none select-none",
        "transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        idle && "cursor-pointer bg-foreground text-background hover:opacity-90 active:scale-[0.96]",
        downloading && "cursor-default bg-foreground/70 text-background",
        done && "cursor-default bg-emerald-600 text-white",
        className
      )}
      {...props}
    >
      <span className="sr-only" aria-live="polite">
        {downloading ? downloadingLabel : done ? doneLabel : ""}
      </span>

      <span className="relative size-4 shrink-0">
        <span aria-hidden className={cn(ICON_LAYER, idle ? "opacity-100" : "opacity-0")}>
          {idleIcon ?? <ArrowLineDownIcon size={16} />}
        </span>
        <span aria-hidden className={cn(ICON_LAYER, downloading ? "opacity-100" : "opacity-0")}>
          <SpinnerGapIcon size={16} className="animate-spin motion-reduce:animate-none" />
        </span>
        <span aria-hidden className={cn(ICON_LAYER, done ? "opacity-100" : "opacity-0")}>
          <CheckIcon size={16} weight="bold" />
        </span>
      </span>

      <span className="grid">
        {[
          [label, idle],
          [downloadingLabel, downloading],
          [doneLabel, done],
        ].map(([text, active], i) => (
          <span
            key={i}
            aria-hidden={!active}
            className={cn(
              LABEL_LAYER,
              active ? "opacity-100 duration-300 delay-200" : "opacity-0 duration-200"
            )}
          >
            {text}
          </span>
        ))}
      </span>
    </button>
  );
}
