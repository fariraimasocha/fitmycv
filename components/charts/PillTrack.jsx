"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function PillTrack({
  value,
  max = 100,
  color = "var(--landing-accent)",
  className,
}) {
  const reduce = useReducedMotion();
  const progress = Math.min(Math.max((Number(value) || 0) / max, 0), 1);

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted/30",
        className
      )}
    >
      <motion.div
        className="h-full w-full origin-left rounded-full"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 120, damping: 24 }
        }
      />
    </div>
  );
}
