"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

function formatNumber(value, decimals) {
  const safe = Number.isFinite(value) ? value : 0;
  if (decimals > 0) return safe.toFixed(decimals);
  return String(Math.round(safe));
}

export function AnimatedNumber({
  value,
  decimals = 0,
  minDigits,
  className,
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const current = useRef(reduce ? Number(value) || 0 : 0);
  const numeric = Number(value) || 0;
  const formatted = formatNumber(numeric, decimals);
  const reserved = Math.max(
    formatted.replace("-", "").length,
    minDigits ?? 0,
    1
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduce) {
      current.current = numeric;
      node.textContent = formatNumber(numeric, decimals);
      return;
    }

    const controls = animate(current.current, numeric, {
      type: "spring",
      stiffness: 120,
      damping: 22,
      onUpdate: (latest) => {
        current.current = latest;
        node.textContent = formatNumber(latest, decimals);
      },
    });

    return () => controls.stop();
  }, [numeric, decimals, reduce]);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      style={{ minWidth: `${reserved}ch` }}
    >
      {formatNumber(current.current, decimals)}
    </span>
  );
}
