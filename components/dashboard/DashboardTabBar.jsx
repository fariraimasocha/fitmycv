"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Liquid } from "liquid-gooey";
import { cn } from "@/lib/utils";

// The active fill is one liquid pill behind the tabs. We slide it with CSS and
// liquid-gooey's "move" effect trails it, so it stretches between tabs instead
// of jumping. The tab buttons sit above the liquid layer, so their text and
// focus rings are never filtered. liquid-gooey snaps under reduced motion.
export function DashboardTabBar({ tabs, activeTab, onTabChange, className, ariaLabel }) {
  const listRef = useRef(null);
  const [pill, setPill] = useState(null); // { left, width, track } in px

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const tab = list.querySelector('[data-active="true"]');
      // Hidden bars (display: none at some breakpoints) measure 0. Skip them.
      if (!tab || !tab.offsetWidth) return setPill(null);
      // Track = the tabs' own extent. Not scrollWidth: that counts this layer
      // too, so it could never shrink once wide.
      const last = list.querySelector('[role="tab"]:last-of-type');
      const track = last.offsetLeft + last.offsetWidth;
      setPill({ left: tab.offsetLeft, width: tab.offsetWidth, track });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeTab, tabs.length]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      data-liquid={pill ? "true" : undefined}
      className={cn("dashboard-tab-pills relative w-full sm:w-auto sm:self-start", className)}
    >
      {pill && (
        // Liquid sets position: relative on its own root, so this wrapper is
        // what takes it out of the tab row's flow.
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{ width: pill.track }}
        >
          <Liquid fill="var(--landing-primary-soft)" className="h-full">
            <Liquid.Item effect="move">
              <div
                className="absolute inset-y-0 left-0 rounded-md transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
              />
            </Liquid.Item>
          </Liquid>
        </div>
      )}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          data-active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className="dashboard-tab-pill relative"
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
