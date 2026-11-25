"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  blackFridayCountdownParts,
  isBlackFridayActive,
  msUntilBlackFridayEnds,
} from "@/lib/black-friday";

function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * @param {{ variant?: "banner" | "popup" }} props
 */
export default function BlackFridayCountdown({ variant = "popup" }) {
  const [ms, setMs] = useState(() => msUntilBlackFridayEnds());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isBlackFridayActive()) return undefined;
    const tick = () => setMs(msUntilBlackFridayEnds());
    tick();
    const id = setInterval(tick, reduceMotion ? 1000 : 250);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const { days, hours, minutes, seconds, ended } = blackFridayCountdownParts(ms);
  if (ended) return null;

  const cells = [
    { label: "Days", short: "d", value: pad(days) },
    { label: "Hrs", short: "h", value: pad(hours) },
    { label: "Min", short: "m", value: pad(minutes) },
    { label: "Sec", short: "s", value: pad(seconds) },
  ];

  if (variant === "banner") {
    return (
      <span
        className="inline-flex items-center gap-1 font-outfit text-xs font-semibold tabular-nums tracking-wide text-[var(--landing-accent)] sm:text-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="font-medium text-white/70">Ends in</span>
        {cells.map((cell, i) => (
          <span key={cell.label} className="inline-flex items-baseline gap-0.5">
            {i > 0 ? <span className="px-0.5 text-white/35" aria-hidden="true">:</span> : null}
            <span className="text-white">{cell.value}</span>
            <span className="text-[0.65em] uppercase text-white/50">{cell.short}</span>
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2" aria-live="polite" aria-atomic="true">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-lg border border-white/20 px-1 py-2 text-center"
        >
          <div className="font-outfit text-xl font-bold tabular-nums text-white sm:text-2xl">
            {cell.value}
          </div>
          <div className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--landing-accent)]">
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}
