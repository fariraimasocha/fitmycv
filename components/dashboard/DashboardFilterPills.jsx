"use client";

import { cn } from "@/lib/utils";

// Same track and tab recipe as DashboardTabBar, so every tab row in the app
// looks the same. Takes key/activeKey/onChange because its callers filter lists.
export function DashboardFilterPills({ tabs, activeKey, onChange, className }) {
  return (
    <div role="tablist" className={cn("dashboard-tab-pills w-full sm:w-auto sm:self-start", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeKey === tab.key}
          data-active={activeKey === tab.key}
          onClick={() => onChange(tab.key)}
          className="dashboard-tab-pill"
        >
          <span>
            {tab.label}
            {typeof tab.count === "number" && (
              <span className="ms-2 tabular-nums opacity-70">{tab.count}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
