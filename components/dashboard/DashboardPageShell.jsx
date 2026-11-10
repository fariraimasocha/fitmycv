"use client";

import { cn } from "@/lib/utils";

// One width for every sidebar route, so the title and content start at the
// same left edge on every page. Pages used to pick from four widths, and the
// content jumped sideways as you moved through the sidebar.
export function DashboardPageShell({ children, className }) {
  return (
    <div
      className={cn(
        // space-y-6 marks chapter breaks between blocks; groups inside a block
        // use gap-3, so related things stay tighter than unrelated ones.
        // Extra bottom padding on small screens clears the Chatwoot FAB.
        "dashboard-page mx-auto w-full max-w-6xl min-w-0 space-y-6 px-3 pt-4 pb-24 sm:px-6 sm:py-6",
        className
      )}
    >
      {children}
    </div>
  );
}
