"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { KanbanIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { DashboardPanel, DashboardPanelHeader } from "./DashboardPanel";
import { computeInsights } from "@/lib/applications";

// Teal's empty row: round tinted icon, one line, a quiet action below.
function EmptyNote({ icon: Icon, children, action }) {
  return (
    <div className="mt-4 flex flex-1 flex-col justify-between gap-4 border-t border-[var(--landing-line)] pt-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--landing-primary-soft)] text-[var(--landing-ink-soft)]">
          <Icon size={20} aria-hidden="true" />
        </span>
        <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">{children}</p>
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
  const shown = stages.filter((s) => s.count > 0);

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
        <div className="mt-5 flex flex-1 flex-col gap-3">
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
          {/* One bar, split by stage. Colors come from lib/applications so
              they match the board. */}
          <div
            className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--landing-paper-strong)]"
            role="img"
            aria-label={shown
              .map((s) => `${t(`stages.${s.key}`)} ${s.count}`)
              .join(", ")}
          >
            {shown.map((s) => (
              <span
                key={s.key}
                style={{
                  width: `${(s.count / insights.total) * 100}%`,
                  background: s.color,
                }}
                className="h-full"
              />
            ))}
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {stages.map((s) => (
              <li key={s.key} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: s.color }}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate text-[var(--landing-ink-soft)]">
                  {t(`stages.${s.key}`)}
                </span>
                <span className="font-medium tabular-nums text-foreground">
                  {s.count}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-[var(--landing-line)] pt-4">
            <div>
              <dt className="text-xs text-muted-foreground">{t("pipeline.applied")}</dt>
              <dd className="mt-1 font-outfit text-2xl font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground">
                {insights.applied}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t("pipeline.interviews")}</dt>
              <dd className="mt-1 font-outfit text-2xl font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground">
                {insights.interviews}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t("pipeline.responseRate")}</dt>
              <dd className="mt-1 font-outfit text-2xl font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground">
                {insights.applied > 0 ? `${insights.responseRate}%` : t("pipeline.na")}
              </dd>
            </div>
          </dl>
        </>
      )}
    </DashboardPanel>
  );
}
