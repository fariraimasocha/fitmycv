"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function DashboardPageHeader({
  title,
  description,
  action,
  eyebrow,
  className,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <span className="landing-eyebrow mb-3">{eyebrow}</span>
        )}
        <h1 className="font-outfit text-xl font-extrabold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          {title}
        </h1>
        {description && (
          <div className="mt-1 max-w-xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            {description}
          </div>
        )}
      </div>
      {action && (
        <div className="w-full shrink-0 sm:w-auto [&_a]:w-full sm:[&_a]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
          {action}
        </div>
      )}
    </motion.div>
  );
}
