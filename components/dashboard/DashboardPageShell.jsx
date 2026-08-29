"use client";

import { cn } from "@/lib/utils";

const WIDTH = {
  narrow: "max-w-3xl",
  default: "max-w-4xl",
  wide: "max-w-5xl",
  full: "max-w-6xl",
};

export function DashboardPageShell({ children, width = "default", className }) {
  return (
    <div
      className={cn(
        // space-y-6 marks chapter breaks between blocks; groups inside a block
        // use gap-3, so related things stay tighter than unrelated ones.
        "dashboard-page mx-auto w-full min-w-0 space-y-6 px-3 py-4 sm:px-6 sm:py-6",
        WIDTH[width] ?? WIDTH.default,
        className
      )}
    >
      {children}
    </div>
  );
}
