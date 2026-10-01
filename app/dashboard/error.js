"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { DashboardPageShell, DashboardEmptyState } from "@/components/dashboard";

// Renders inside DashboardShell, so the sidebar and header stay put and the
// reader keeps their place. app/error.js would replace the whole shell.
export default function DashboardError({ error, reset }) {
  const t = useTranslations("errors.dashboard");

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
        title={t("title")}
        description={t("description")}
        actionLabel={t("retry")}
        onAction={reset}
        secondaryLabel={t("home")}
        secondaryHref="/dashboard"
        compact
        delay={0}
      />
    </DashboardPageShell>
  );
}
