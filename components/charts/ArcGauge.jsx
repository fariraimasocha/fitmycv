"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function ArcGauge({
  value,
  max = 100,
  size = 96,
  strokeWidth,
  color = "var(--landing-accent)",
  label,
  children,
  className,
}) {
  const reduce = useReducedMotion();
  const stroke = strokeWidth ?? Math.max(6, Math.round(size * 0.083));
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max((Number(value) || 0) / max, 0), 1);
  const offset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={label}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/20"
        />
        {reduce ? (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        ) : (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          />
        )}
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
