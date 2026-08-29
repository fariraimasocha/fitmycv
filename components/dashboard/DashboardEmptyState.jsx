"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  actionDisabled = false,
  className,
  delay = 0.05,
}) {
  const reduceMotion = useReducedMotion();
  const action = actionLabel && (actionHref || onAction) && (
    actionHref ? (
      <Button
        asChild
        className="rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90"
      >
        <Link
          href={actionHref}
          aria-disabled={actionDisabled}
          tabIndex={actionDisabled ? -1 : undefined}
          onClick={actionDisabled ? (event) => event.preventDefault() : undefined}
        >
          {actionLabel}
        </Link>
      </Button>
    ) : (
      <Button
        type="button"
        onClick={onAction}
        disabled={actionDisabled}
        className="rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90"
      >
        {actionLabel}
      </Button>
    )
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn("dashboard-card rounded-2xl border-border py-0 gap-0", className)}>
        <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:py-16">
          {Icon && (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--landing-primary-soft)]">
              <Icon
                size={28}
                className="text-[var(--landing-primary-dark)]"
                aria-hidden="true"
              />
            </div>
          )}
          <div className="flex max-w-sm flex-col gap-1.5">
            <h3 className="font-outfit text-lg font-semibold text-foreground">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </CardContent>
      </Card>
    </motion.div>
  );
}
