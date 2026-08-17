"use client";

import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { Sparkline } from "@/components/charts/Sparkline";
import { cn } from "@/lib/utils";

export function DashboardStatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  positive,
  delay = 0,
  sparkline,
  variant = "default",
  className,
  children,
}) {
  const numeric = typeof value === "number";
  const reduceMotion = useReducedMotion();
  const featured = variant === "featured";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(featured && "min-w-0")}
    >
      <Card
        className={cn(
          "dashboard-stat-card flex flex-col overflow-hidden rounded-2xl border-border py-0 gap-0 transition-shadow hover:shadow-[var(--landing-shadow-sm)]",
          featured ? "bg-[var(--landing-paper-soft)]" : "h-full",
          className
        )}
      >
        <CardHeader
          className={cn(
            "flex shrink-0 flex-row items-center justify-between pb-0",
            featured ? "px-4 pt-4 sm:px-6 sm:pt-6" : "px-3 py-2.5 sm:px-4 sm:py-3"
          )}
        >
          <CardTitle
            className={cn(
              "font-semibold text-muted-foreground",
              featured ? "text-sm" : "text-xs sm:text-sm"
            )}
          >
            {label}
          </CardTitle>
          {Icon && (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]",
                featured ? "h-9 w-9" : "h-7 w-7 sm:h-8 sm:w-8"
              )}
            >
              <Icon size={featured ? 18 : 15} aria-hidden="true" />
            </span>
          )}
        </CardHeader>
        <CardContent
          className={cn(
            featured
              ? "flex flex-col px-4 pb-4 pt-3 sm:px-6 sm:pb-5"
              : "px-3 pb-2.5 pt-0 sm:px-4 sm:pb-3 sm:pt-1"
          )}
        >
          <div className="flex shrink-0 items-end justify-between gap-3">
            {numeric ? (
              <AnimatedNumber
                value={value}
                className={cn(
                  "font-outfit font-extrabold leading-none tracking-tight text-foreground",
                  featured ? "text-5xl sm:text-6xl" : "text-xl sm:text-2xl"
                )}
              />
            ) : (
              <p
                className={cn(
                  "font-outfit font-extrabold leading-none text-foreground",
                  featured ? "text-5xl sm:text-6xl" : "text-xl sm:text-2xl"
                )}
              >
                {value}
              </p>
            )}
            {subtitle && featured && (
              <span
                className={cn(
                  "mb-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                  positive
                    ? "bg-[#eef8f1] text-[var(--landing-success)]"
                    : "bg-[var(--landing-primary-soft)] text-muted-foreground"
                )}
              >
                {subtitle}
              </span>
            )}
          </div>
          {subtitle && !featured && (
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
          {sparkline && (
            <div
              className={cn(
                featured ? "relative -mx-4 mt-3 h-16 sm:-mx-6" : "mt-3"
              )}
            >
              <Sparkline
                values={sparkline}
                fill
                className={cn(
                  "w-full text-[var(--landing-accent)]",
                  featured ? "h-16" : "h-8"
                )}
              />
            </div>
          )}
          {featured && children && (
            <div className="mt-3 flex flex-col border-t border-border/70 pt-3">
              {children}
            </div>
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
