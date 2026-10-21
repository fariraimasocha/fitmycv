"use client";

import { useTranslations } from "next-intl";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { DashboardEmptyState } from "./DashboardEmptyState";

/**
 * Shown when a list fails to load, so a network error never reads as "you
 * have nothing here". Pass the tanstack query result.
 */
export function DashboardLoadError({ query, compact }) {
  const t = useTranslations("dashboard.loadError");
  return (
    <DashboardEmptyState
      icon={WarningCircleIcon}
      title={t("title")}
      description={t("description")}
      actionLabel={query.isFetching ? t("retrying") : t("tryAgain")}
      onAction={() => query.refetch()}
      actionDisabled={query.isFetching}
      compact={compact}
    />
  );
}
