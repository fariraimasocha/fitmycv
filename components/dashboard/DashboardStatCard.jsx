"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardStatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  positive,
  delay = 0,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        className={cn(
          "dashboard-stat-card rounded-2xl border-border py-0 gap-0 transition-shadow hover:shadow-[var(--landing-shadow-sm)]",
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between px-3 py-2.5 pb-0 sm:px-4 sm:py-3">
          <CardTitle className="text-xs font-semibold text-muted-foreground sm:text-sm">
            {label}
          </CardTitle>
          {Icon && (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)] sm:h-8 sm:w-8">
              <Icon size={15} aria-hidden="true" />
            </span>
          )}
        </CardHeader>
        <CardContent className="px-3 pb-2.5 pt-0 sm:px-4 sm:pb-3 sm:pt-1">
          <p className="font-outfit text-xl font-extrabold leading-none text-foreground sm:text-2xl">
            {value}
          </p>
          {subtitle && (
            <p
              className={cn(
                "mt-1 text-xs font-medium leading-tight",
                positive
                  ? "text-[var(--landing-success)]"
                  : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardStatGrid({ children, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}
