"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { KanbanIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { DashboardPanel, DashboardPanelHeader } from "./DashboardPanel";
import { computeInsights } from "@/lib/applications";

// Empty row: a plain icon, one line, a quiet action below.
function EmptyNote({ icon: Icon, children, action }) {
  return (
    <div className="mt-4 flex flex-1 flex-col justify-between gap-4 border-t border-dash-line pt-4">
      <div className="flex items-start gap-3 text-dash-muted">
        <Icon size={20} aria-hidden="true" className="mt-1 shrink-0" />
        <p className="text-sm leading-6">{children}</p>
      </div>
      {action}
    </div>
  );
}

export function DashboardPipelineCard({
  applications,
  isPremium,
  isLoading,
  className,
  delay = 0,
}) {
  const t = useTranslations("dashboard");
  if (!isPremium) {
    return (
      <DashboardPanel className={className} delay={delay}>
        <DashboardPanelHeader title={t("pipeline.title")} description={t("pipeline.proOnly")} />
        <EmptyNote
          icon={LockSimpleIcon}
          action={
            <Link href="/dashboard/upgrade" className="dashboard-secondary-btn w-full">
              {t("pipeline.seePlans")}
            </Link>
          }
        >
          {t("pipeline.upsell")}
        </EmptyNote>
      </DashboardPanel>
    );
  }

  const rows = Array.isArray(applications) ? applications : [];
  const active = rows.filter((a) => !a.archived);
  const insights = computeInsights(active);
  const stages = insights.funnel;

  return (
    <DashboardPanel className={className} delay={delay}>
      <DashboardPanelHeader
        title={t("pipeline.title")}
        description={
          insights.total > 0
            ? t("pipeline.inPipeline", { count: insights.total })
            : t("pipeline.nothingYet")
        }
        href="/dashboard/applications"
        linkLabel={t("pipeline.openBoard")}
      />

      {isLoading ? (
        <div className="mt-4 flex flex-1 flex-col gap-3">
          <div className="tool-skeleton h-2.5 rounded-full" />
          <div className="tool-skeleton h-4 w-2/3 rounded-sm" />
          <div className="tool-skeleton h-4 w-1/2 rounded-sm" />
        </div>
      ) : insights.total === 0 ? (
        <EmptyNote
          icon={KanbanIcon}
          action={
            <Link
              href="/dashboard/applications"
              className="dashboard-secondary-btn dashboard-secondary-btn-sm self-start"
            >
              {t("pipeline.openPipeline")}
            </Link>
          }
        >
          {t("pipeline.empty")}
        </EmptyNote>
      ) : (
        <>
          {/* Counts are where each application sits now. The bar is its share
              of the pipeline, in the one accent color. */}
          <ul className="mt-4 mb-4 flex flex-col divide-y divide-dash-line">
            {stages.map((s) => (
              <li key={s.key} className="flex items-center gap-3 py-3 text-sm">
                <span className="w-20 shrink-0 truncate text-dash-muted">
                  {t(`stages.${s.key}`)}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-dash-line" aria-hidden="true">
                  <span
                    className="block h-full rounded-full bg-dash-accent"
                    style={{ width: `${(s.count / insights.total) * 100}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-end font-medium tabular-nums text-dash-ink">
                  {s.count}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-baseline justify-between border-t border-dash-line pt-4">
            <span className="text-xs text-dash-muted">{t("pipeline.responseRate")}</span>
            <span className="font-outfit text-2xl font-semibold leading-none tabular-nums text-dash-ink">
              {insights.applied > 0 ? `${insights.responseRate}%` : t("pipeline.na")}
            </span>
          </div>
        </>
      )}
    </DashboardPanel>
  );
}
