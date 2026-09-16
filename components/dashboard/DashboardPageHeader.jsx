"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * One header for every page in the shell. Title left, actions right, both on
 * the same baseline at sm and up. Actions should be `.dashboard-primary-btn`
 * or `.dashboard-secondary-btn` so a pair is always the same height.
 *
 * `eyebrow` is accepted for backwards compatibility and ignored: the sidebar
 * already names the section, so the label was saying the same thing twice.
 */
export function DashboardPageHeader({
  title,
  description,
  action,
  actions,
  meta,
  className,
  delay = 0,
}) {
  const reduceMotion = useReducedMotion();
  const trailing = actions ?? action;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {meta && (
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {meta}
          </div>
        )}
        <h1 className="font-outfit text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <div className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {trailing && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 [&>a]:w-full [&>button]:w-full sm:[&>a]:w-auto sm:[&>button]:w-auto">
          {trailing}
        </div>
      )}
    </motion.div>
  );
}
