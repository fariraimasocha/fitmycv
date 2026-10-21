"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { CrownIcon } from "@phosphor-icons/react";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardPageShell } from "./DashboardPageShell";

/**
 * Wraps a Pro-only page. Free users get the page header and one upgrade card,
 * the same on every Pro page, instead of an empty list the server would refuse
 * to fill. `namespace` is the page's own messages, for its title.
 *
 * ponytail: reads the session the (app) layout already hydrates, so there is
 * no extra request. The API routes still enforce Pro on their own.
 */
export function ProGate({ feature, namespace, children }) {
  const { data: session, status } = useSession();
  const tPage = useTranslations(namespace);
  const t = useTranslations("dashboard.proGate");

  if (status === "loading" || session?.user?.isPremium) return children;

  return (
    <DashboardPageShell>
      <DashboardPageHeader title={tPage("title")} description={tPage("description")} />
      <DashboardEmptyState
        icon={CrownIcon}
        title={t(`${feature}.title`)}
        description={t(`${feature}.description`)}
        actionLabel={t("action")}
        actionHref="/dashboard/upgrade"
      />
    </DashboardPageShell>
  );
}
