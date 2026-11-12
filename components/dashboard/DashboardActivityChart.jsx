"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardTabBar } from "./DashboardTabBar";
import { DashboardPanel } from "./DashboardPanel";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { dateLocale } from "@/i18n/routing";

function formatWeekLabel(date, locale) {
  // English keeps the en-GB date order it always had.
  return date.toLocaleDateString(dateLocale(locale), {
    day: "numeric",
    month: "short",
  });
}

/**
 * One chart, several series. `series` is a list of
 * { id, label, counts, total } where counts lines up with `weekStarts` and
 * total is the all-time count.
 */
export function DashboardActivityChart({
  series,
  weekStarts,
  className,
  delay = 0,
}) {
  const t = useTranslations("dashboard.activity");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const chartConfig = {
    count: { label: t("count"), color: "var(--dash-accent)" },
  };
  const [activeId, setActiveId] = useState(series[0]?.id);
  const active = series.find((s) => s.id === activeId) ?? series[0];

  const counts = active?.counts ?? [];
  const thisWeek = counts.at(-1) ?? 0;
  const lastWeek = counts.at(-2) ?? 0;
  const delta = thisWeek - lastWeek;

  // weekStarts is empty until the client knows the visitor's date.
  const data = counts.map((count, index) => {
    const start = weekStarts[index];
    const label = start ? formatWeekLabel(start, locale) : "";
    return {
      label,
      week: t("weekOf", { date: label }),
      count,
    };
  });

  return (
    <DashboardPanel className={className} delay={delay}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-outfit text-base font-semibold text-dash-ink">
            {t("title")}
          </h2>
          <p className="mt-1 text-xs text-dash-muted">
            {t("lastWeeks", { count: counts.length })}
          </p>
        </div>
        <DashboardTabBar
          ariaLabel={t("chooseSeries")}
          tabs={series.map((s) => ({ id: s.id, label: s.label }))}
          activeTab={active?.id}
          onTabChange={setActiveId}
        />
      </div>

      <dl className="mt-6 grid grid-cols-3 divide-x divide-dash-line sm:max-w-lg">
        {[
          [t("thisWeek"), <AnimatedNumber key="n" value={thisWeek} />],
          [t("vsLastWeek"), delta > 0 ? `+${delta}` : delta],
          [t("allTime"), active?.total ?? 0],
        ].map(([label, value], i) => (
          <div key={label} className={i === 0 ? "pe-4" : "px-4"}>
            <dt className="text-xs text-dash-muted">{label}</dt>
            <dd className="mt-1 font-outfit text-2xl font-semibold leading-none tabular-nums text-dash-ink">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <ChartContainer
        id={`activity-${active?.id}`}
        config={chartConfig}
        className="mt-6 h-52 w-full"
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--dash-line)"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={28}
            tick={{ fontSize: 12, fill: "var(--dash-muted)" }}
          />
          <YAxis hide domain={[0, "dataMax + 1"]} allowDecimals={false} />
          <ChartTooltip
            cursor={{ stroke: "var(--dash-line)" }}
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
            fill="none"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={!reduceMotion}
          />
        </AreaChart>
      </ChartContainer>
    </DashboardPanel>
  );
}
