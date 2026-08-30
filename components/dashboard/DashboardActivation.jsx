"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { CheckIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardActivation({ steps, className, delay = 0.05 }) {
  const reduceMotion = useReducedMotion();
  const doneCount = steps.filter((step) => step.done).length;
  const nowIndex = steps.findIndex((step) => !step.done);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        className={cn(
          "dashboard-card rounded-2xl border-border py-0 gap-0",
          className,
        )}
      >
        <CardContent className="dashboard-card-pad py-5 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-outfit text-sm font-semibold text-foreground">
              Get set up
            </h2>
            <div className="flex items-center gap-2.5">
              {steps.length > 2 && (
                <span className="flex gap-1" aria-hidden="true">
                  {steps.map((step, index) => (
                    <span
                      key={step.key}
                      className={cn(
                        "h-0.5 w-6 rounded-full",
                        index < doneCount
                          ? "bg-[var(--landing-accent)]"
                          : "bg-border",
                      )}
                    />
                  ))}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {doneCount} of {steps.length}
              </span>
            </div>
          </div>

          <ol className="mt-4 flex flex-col">
            {steps.map((step, index) => {
              const isNow = index === nowIndex;

              return (
                <li key={step.key} className="flex gap-3.5 sm:gap-4">
                  {/* number rail: dot plus the connector down to the next step */}
                  <div className="flex flex-col items-center pt-1">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                        isNow
                          ? "border-[var(--landing-accent-dark)] bg-[var(--landing-accent-dark)] text-white"
                          : step.done
                            ? "border-[var(--landing-line)] text-[var(--landing-ink-soft)]"
                            : "border-border text-muted-foreground",
                      )}
                    >
                      {step.done ? (
                        <CheckIcon size={11} weight="bold" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    {index < steps.length - 1 && (
                      <span
                        className="w-0.5 flex-1 rounded-full bg-border"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div
                    className={cn(
                      "min-w-0 flex-1",
                      index < steps.length - 1 && "pb-5",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          step.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground",
                        )}
                      >
                        {step.title}
                      </p>
                      {!step.done && (
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider",
                            isNow
                              ? "bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]"
                              : "text-muted-foreground",
                          )}
                        >
                          {isNow ? "NOW" : "NEXT"}
                        </span>
                      )}
                    </div>

                    {!step.done && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    )}

                    {/* only the current step gets a filled button */}
                    {isNow ? (
                      <Link
                        href={step.href}
                        className="landing-primary-btn mt-3 inline-flex text-sm"
                      >
                        {step.cta}
                        <ArrowRightIcon
                          size={15}
                          weight="bold"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      !step.done && (
                        <Link
                          href={step.href}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {step.cta}
                          <ArrowRightIcon
                            size={12}
                            weight="bold"
                            aria-hidden="true"
                          />
                        </Link>
                      )
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  );
}
