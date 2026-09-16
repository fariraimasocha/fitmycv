"use client";

import { cn } from "@/lib/utils";
import { DashboardPanel } from "./DashboardPanel";

/**
 * A row of small facts with an icon each, split by hairlines. Used under a
 * page header to say where things stand before the main content starts.
 *
 * items: [{ icon, label, value, tone?: "accent" | "success" }]
 * `columns` controls the lg breakpoint; the strip is 2-up on mobile.
 */
export function DashboardStatStrip({ items, columns = items.length, className, delay = 0.05 }) {
  const lgCols =
    {
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "lg:grid-cols-6",
    }[columns] ?? "lg:grid-cols-4";

  return (
    <DashboardPanel pad={false} className={className} delay={delay}>
      <dl
        className={cn(
          "grid grid-cols-2 divide-y divide-[var(--landing-line)] sm:grid-cols-3 sm:divide-y-0 sm:divide-x",
          lgCols,
        )}
      >
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-3 sm:px-5">
            {item.icon && (
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                  item.tone === "accent" &&
                    "bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]",
                  item.tone === "success" &&
                    "bg-[var(--landing-success-soft)] text-[var(--landing-success)]",
                  !item.tone && "bg-[var(--landing-primary-soft)] text-foreground",
                )}
              >
                <item.icon size={16} aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="truncate text-sm font-semibold tabular-nums text-foreground">
                {item.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </DashboardPanel>
  );
}
