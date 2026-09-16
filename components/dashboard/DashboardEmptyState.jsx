"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The empty state carries the first action. Copy says what appears here and
 * how to make it appear, not that nothing exists.
 *
 * `secondaryLabel` + `secondaryHref` adds a quieter second route.
 * `compact` fits inside a panel rather than filling the page.
 */
export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  actionDisabled = false,
  secondaryLabel,
  secondaryHref,
  compact = false,
  className,
  delay = 0.05,
}) {
  const reduceMotion = useReducedMotion();

  const primary =
    actionLabel &&
    (actionHref ? (
      <Link
        href={actionHref}
        className="dashboard-primary-btn"
        aria-disabled={actionDisabled}
        tabIndex={actionDisabled ? -1 : undefined}
        onClick={actionDisabled ? (event) => event.preventDefault() : undefined}
      >
        {actionLabel}
      </Link>
    ) : onAction ? (
      <button
        type="button"
        onClick={onAction}
        disabled={actionDisabled}
        className="dashboard-primary-btn"
      >
        {actionLabel}
      </button>
    ) : null);

  const secondary =
    secondaryLabel && secondaryHref ? (
      <Link href={secondaryHref} className="dashboard-secondary-btn">
        {secondaryLabel}
      </Link>
    ) : null;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      <div
        className={cn(
          "dashboard-card rounded-lg",
          compact ? "px-5 py-8" : "px-6 py-12 sm:py-16",
        )}
      >
        <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
          {Icon && (
            <span className="landing-inset-edge flex h-12 w-12 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
              <Icon size={22} aria-hidden="true" />
            </span>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="font-outfit text-base font-semibold tracking-[-0.01em] text-foreground">
              {title}
            </h3>
            {description && (
              <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            )}
          </div>
          {(primary || secondary) && (
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              {primary}
              {secondary}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
