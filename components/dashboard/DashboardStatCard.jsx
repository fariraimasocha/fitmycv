"use client";

import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { Area, AreaChart, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

function weekLabel(weeksAgo) {
  if (weeksAgo === 0) return "This week";
  if (weeksAgo === 1) return "Last week";
  return `${weeksAgo} weeks ago`;
}

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
  const chartId = `stat-${label.toLowerCase().replaceAll(" ", "-")}`;
  const chartData =
    sparkline?.map((count, index) => ({
      week: weekLabel(sparkline.length - 1 - index),
      count,
    })) ?? [];
  const chartConfig = {
    count: {
      label,
      color: "var(--landing-accent)",
    },
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(featured && "min-w-0")}
    >
      <Card
        className={cn(
          "dashboard-stat-card flex flex-col overflow-hidden rounded-lg border-[var(--landing-line)] py-0 gap-0",
          featured
            ? "bg-[var(--landing-paper-soft)] transition-colors hover:border-[#ccc5bb]"
            : "h-full",
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
              "font-medium text-muted-foreground",
              featured ? "text-sm" : "text-xs sm:text-sm"
            )}
          >
            {label}
          </CardTitle>
          {Icon && (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-sm bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]",
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
                  "font-outfit font-semibold leading-none tracking-[-0.02em] text-foreground",
                  featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
                )}
              />
            ) : (
              <p
                className={cn(
                  "font-outfit font-semibold leading-none tracking-[-0.02em] text-foreground",
                  featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
                )}
              >
                {value}
              </p>
            )}
            {subtitle && featured && (
              <span
                className={cn(
                  "mb-1 inline-flex rounded-sm px-2 py-0.5 text-xs font-medium",
                  positive
                    ? "bg-[var(--landing-success-soft)] text-[var(--landing-success)]"
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
                "relative mt-3",
                featured ? "-mx-4 sm:-mx-6" : "-mx-3 sm:-mx-4"
              )}
            >
              <ChartContainer
                id={chartId}
                config={chartConfig}
                className={cn("w-full", featured ? "h-20" : "h-14")}
              >
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ top: 6, right: 0, bottom: 2, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`fill-${chartId}`}
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-count)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-count)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  {/* Hidden axis so flat, zero-activity weeks sit inside the
                      plot instead of on the clipped bottom edge. */}
                  <YAxis hide domain={[0, "dataMax + 1"]} />
                  <ChartTooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        labelKey="week"
                        labelFormatter={(_, items) => items?.[0]?.payload?.week}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-count)"
                    strokeWidth={1.75}
                    fill={`url(#fill-${chartId})`}
                    activeDot={{ r: 3.5, strokeWidth: 0 }}
                    isAnimationActive={!reduceMotion}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
          {featured && children && (
            <div className="mt-3 flex flex-col border-t border-[var(--landing-line)] pt-3">
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
