"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  CheckIcon,
  FileTextIcon,
  KanbanIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const STEP_ICONS = {
  resume: FileTextIcon,
  tailor: SparkleIcon,
  applications: KanbanIcon,
};

// Teal's Getting Started list: a progress bar over divided rows, each with a
// round tinted icon, a title and one line of body, and its button on the
// right. Only the current step gets the filled button, so one thing leads.
export function DashboardActivation({ steps, className, delay = 0.05 }) {
  const t = useTranslations("dashboard.activation");
  const reduceMotion = useReducedMotion();
  const doneCount = steps.filter((step) => step.done).length;
  const nowIndex = steps.findIndex((step) => !step.done);
  const percent = steps.length ? (doneCount / steps.length) * 100 : 0;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      aria-labelledby="activation-title"
      className={cn("dashboard-card dashboard-card-pad rounded-lg", className)}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="activation-title"
          className="font-outfit text-base font-semibold text-foreground"
        >
          {t("title")}
        </h2>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {t("progress", { done: doneCount, total: steps.length })}
        </span>
      </div>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]"
        role="progressbar"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-label={t("progress", { done: doneCount, total: steps.length })}
      >
        <motion.div
          className="h-full origin-left rounded-full bg-[var(--landing-accent)] rtl:origin-right"
          style={{ width: `${percent}%` }}
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.15, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>

      <ol className="mt-2 flex flex-col divide-y divide-[var(--landing-line)]">
        {steps.map((step, index) => {
          const isNow = index === nowIndex;
          const Icon = STEP_ICONS[step.key] ?? FileTextIcon;

          return (
            <li
              key={step.key}
              aria-current={isNow ? "step" : undefined}
              className="flex flex-col gap-3 py-4 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    step.done
                      ? "bg-[var(--landing-success-soft)] text-[var(--landing-success)]"
                      : isNow
                        ? "bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]"
                        : "bg-[var(--landing-primary-soft)] text-[var(--landing-ink-soft)]",
                  )}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      step.done ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {t(`steps.${step.key}.title`)}
                  </p>
                  <p className="mt-0.5 text-sm leading-6 text-muted-foreground">
                    {t(`steps.${step.key}.description`)}
                  </p>
                </div>
              </div>

              <div className="ps-13 sm:ps-0">
                {step.done ? (
                  <span className="inline-flex h-control-sm items-center gap-1.5 rounded-full bg-[var(--landing-success-soft)] px-3 text-sm font-medium text-[var(--landing-success)]">
                    {t("done")}
                    <CheckIcon size={14} weight="bold" aria-hidden="true" />
                  </span>
                ) : (
                  <Link
                    href={step.href}
                    className={cn(
                      "shrink-0",
                      isNow
                        ? "dashboard-primary-btn dashboard-primary-btn-sm"
                        : "dashboard-secondary-btn dashboard-secondary-btn-sm",
                    )}
                  >
                    {t(`steps.${step.key}.cta`)}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}
