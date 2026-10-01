"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { DashboardPageShell, DashboardEmptyState } from "@/components/dashboard";

// Renders inside DashboardShell, so the sidebar and header stay put and the
// reader keeps their place. app/error.js would replace the whole shell.
export default function DashboardError({ error, reset }) {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.captureException(error);
    }
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <DashboardPageShell width="narrow">
      <DashboardEmptyState
        icon={WarningCircleIcon}
        title="This page didn't load"
        description="Your CVs and cover letters are safe. Try again, or go back to home."
        actionLabel="Try again"
        onAction={reset}
        secondaryLabel="Go to home"
        secondaryHref="/dashboard"
        compact
        delay={0}
      />
    </DashboardPageShell>
  );
}
