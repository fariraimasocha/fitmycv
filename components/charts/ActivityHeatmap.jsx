"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function cellTone(count) {
  if (count <= 0) return "bg-[var(--landing-primary-soft)]";
  if (count === 1) return "bg-[#e4b8ab]";
  if (count === 2) return "bg-[#d4846c]";
  return "bg-[var(--landing-accent)]";
}

export function ActivityHeatmap({ cells = [], className }) {
  const [active, setActive] = useState(null);
  const weekCount = cells.length > 0 ? cells[cells.length - 1].weekIndex + 1 : 0;
  const total = useMemo(
    () => cells.reduce((sum, cell) => sum + cell.count, 0),
    [cells]
  );

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = "";
    for (let week = 0; week < weekCount; week++) {
      const first = cells[week * 7];
      const month = first?.month ?? "";
      labels.push(month !== lastMonth ? month : "");
      if (month) lastMonth = month;
    }
    return labels;
  }, [cells, weekCount]);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex gap-2">
        <div className="flex w-3 shrink-0 flex-col">
          <div className="h-4" />
          <div className="grid flex-1 grid-rows-7 gap-1 text-[10px] leading-none text-muted-foreground">
            {DAY_LABELS.map((label, index) => (
              <span key={`${label}-${index}`} className="flex items-center">
                {index % 2 === 0 ? label : ""}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="min-w-140 space-y-1">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }}
            >
              {monthLabels.map((month, week) => (
                <span
                  key={`month-${week}`}
                  className="h-4 truncate text-[10px] leading-none text-muted-foreground"
                >
                  {month}
                </span>
              ))}
            </div>
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
                gridTemplateRows: "repeat(7, minmax(0, 1fr))",
                gridAutoFlow: "column",
              }}
            >
              {cells.map((cell) => (
                <button
                  key={cell.date}
                  type="button"
                  className={cn(
                    "aspect-square w-full rounded-[3px] transition-opacity hover:opacity-80",
                    cellTone(cell.count),
                    active?.date === cell.date && "ring-1 ring-foreground/30"
                  )}
                  aria-label={`${cell.label}: ${cell.count} CVs`}
                  onMouseEnter={() => setActive(cell)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(cell)}
                  onBlur={() => setActive(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <p className="min-h-4 tabular-nums">
          {active
            ? `${active.label} · ${active.count} ${active.count === 1 ? "CV" : "CVs"}`
            : `${total} CVs in the last ${weekCount} weeks`}
        </p>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--landing-primary-soft)]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#e4b8ab]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[#d4846c]" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--landing-accent)]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
