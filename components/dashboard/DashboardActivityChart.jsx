"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardTabBar } from "./DashboardTabBar";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { cn } from "@/lib/utils";

const CHART_CONFIG = {
  count: { label: "Count", color: "var(--landing-accent)" },
};

function formatWeekLabel(date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * One chart, several series. `series` is a list of
 * { id, label, counts } where counts lines up with `weekStarts`.
 */
export function DashboardActivityChart({
  series,
  weekStarts,
  className,
  delay = 0,
}) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(series[0]?.id);
  const active = series.find((s) => s.id === activeId) ?? series[0];

  const counts = active?.counts ?? [];
  const thisWeek = counts.at(-1) ?? 0;
  const lastWeek = counts.at(-2) ?? 0;
  const delta = thisWeek - lastWeek;
  const total = counts.reduce((sum, n) => sum + n, 0);

  const data = counts.map((count, index) => {
    const start = weekStarts[index];
    return {
      label: formatWeekLabel(start),
      week: `Week of ${formatWeekLabel(start)}`,
      count,
    };
  });

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn("min-w-0", className)}
    >
      <Card className="dashboard-card h-full gap-0 rounded-lg py-0">
        <CardContent className="dashboard-card-pad flex h-full flex-col">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-outfit text-sm font-semibold text-foreground">
                Activity
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Last {counts.length} weeks
              </p>
            </div>
            <DashboardTabBar
              ariaLabel="Choose what the chart shows"
              tabs={series.map((s) => ({ id: s.id, label: s.label }))}
              activeTab={active?.id}
              onTabChange={setActiveId}
            />
          </div>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-[var(--landing-line)]">
            <div className="pr-4">
              <dt className="text-xs font-medium text-muted-foreground">This week</dt>
              <dd className="mt-1">
                <AnimatedNumber
                  value={thisWeek}
                  className="font-outfit text-2xl font-semibold leading-none tracking-[-0.02em] text-foreground"
                />
              </dd>
            </div>
            <div className="px-4">
              <dt className="text-xs font-medium text-muted-foreground">vs last week</dt>
              <dd
                className={cn(
                  "mt-1 font-outfit text-2xl font-semibold leading-none tabular-nums tracking-[-0.02em]",
                  delta > 0
                    ? "text-[var(--landing-success)]"
                    : delta < 0
                      ? "text-[var(--landing-accent-dark)]"
                      : "text-foreground",
                )}
              >
                {delta > 0 ? `+${delta}` : delta}
              </dd>
            </div>
            <div className="pl-4">
              <dt className="text-xs font-medium text-muted-foreground">Total in range</dt>
              <dd className="mt-1 font-outfit text-2xl font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground">
                {total}
              </dd>
            </div>
          </dl>

          <ChartContainer
            id={`activity-${active?.id}`}
            config={CHART_CONFIG}
            className="mt-4 h-52 w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            >
              <defs>
                <linearGradient id="activity-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-count)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--landing-line)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
                tick={{ fontSize: 11 }}
              />
              <YAxis hide domain={[0, "dataMax + 1"]} allowDecimals={false} />
              <ChartTooltip
                cursor={{ stroke: "var(--landing-line)" }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(_, items) => items?.[0]?.payload?.week}
                    formatter={(value) => (
                      <div className="flex flex-1 items-center justify-between gap-4">
                        <span className="text-muted-foreground">
                          {active?.label}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {value}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
                fill="url(#activity-fill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={!reduceMotion}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
