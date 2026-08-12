"use client";

import { cn } from "@/lib/utils";

export function DashboardTabBar({ tabs, activeTab, onTabChange, className, ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("dashboard-tab-pills w-full sm:w-auto", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          data-active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className="dashboard-tab-pill"
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
