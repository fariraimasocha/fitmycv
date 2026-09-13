"use client";

import { cn } from "@/lib/utils";

export function DashboardFilterPills({ tabs, activeKey, onChange, className }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-full items-center overflow-x-auto rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] p-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:inline-flex sm:w-fit [&::-webkit-scrollbar]:hidden",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeKey === tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors sm:px-3.5",
            activeKey === tab.key
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {typeof tab.count === "number" && (
            <span
              className={cn(
                "tabular-nums",
                activeKey === tab.key ? "opacity-80" : "opacity-60"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
