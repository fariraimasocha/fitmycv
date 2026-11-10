"use client";

import { useMemo } from "react";
import { Loupe } from "@lucasmarkes/hairline/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import {
  CalendarIcon,
  BinocularsIcon,
  BriefcaseIcon,
  BuildingsIcon,
  ArrowRightIcon,
  PlusIcon,
  StackIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
  ProGate,
  DashboardStatStrip,
  DashboardPanel,
} from "@/components/dashboard";

const DATE_FORMAT = { day: "numeric", month: "short", year: "numeric" };

function LoadingRows() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="tool-skeleton h-16 rounded-lg" />
      <div className="dashboard-card divide-y divide-[var(--landing-line)] overflow-hidden rounded-lg">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-4 sm:px-5">
            <div className="tool-skeleton size-9 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="tool-skeleton h-3.5 w-1/3 rounded-sm" />
              <div className="tool-skeleton h-3 w-1/4 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BriefRow({ brief, index }) {
  const t = useTranslations("dashboard.companyResearch.list");
  const reduceMotion = useReducedMotion();
  const name = brief.companyName || t("unnamed");

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={`/dashboard/company-research/${brief._id}`}
        className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--landing-paper-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 sm:px-5"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--landing-primary-soft)] font-outfit text-sm font-semibold text-foreground">
          {(name[0] ?? "?").toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">
            {name}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            {brief.jobTitle && (
              <span className="inline-flex min-w-0 max-w-full items-center gap-1">
                <BriefcaseIcon size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{brief.jobTitle}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 tabular-nums">
              <CalendarIcon size={12} className="shrink-0" aria-hidden="true" />
              <FormattedDate date={brief.createdAt} options={DATE_FORMAT} />
            </span>
          </span>
          {brief.summary && (
            <span className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">
              {brief.summary}
            </span>
          )}
        </span>
        <ArrowRightIcon
          size={16}
          className="shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden="true"
        />
      </Link>
    </motion.li>
  );
}

function CompanyResearch() {
  const t = useTranslations("dashboard.companyResearch.list");
  const {
    data: briefs,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["company-research"],
    queryFn: async () => {
      const res = await fetch("/api/company-research");
      if (!res.ok) throw new Error(t("loadError"));
      const json = await res.json();
      return json.data;
    },
  });

  const sorted = useMemo(
    () =>
      [...(briefs ?? [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [briefs],
  );

  const companyCount = useMemo(
    () =>
      new Set(
        sorted
          .map((brief) => brief.companyName?.trim().toLowerCase())
          .filter(Boolean),
      ).size,
    [sorted],
  );

  const hasBriefs = sorted.length > 0;
  const newest = sorted[0];

  return (
    <DashboardPageShell>
      <DashboardPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          hasBriefs ? (
            <Link href="/dashboard/tailor" className="dashboard-primary-btn">
              <PlusIcon size={16} weight="bold" aria-hidden="true" />
              {t("addJob")}
            </Link>
          ) : null
        }
      />

      {isLoading ? (
        <LoadingRows />
      ) : isError ? (
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title={t("errorTitle")}
          description={t("errorDescription")}
          actionLabel={isFetching ? t("retrying") : t("tryAgain")}
          onAction={() => refetch()}
          actionDisabled={isFetching}
        />
      ) : !hasBriefs ? (
        <DashboardEmptyState
          icon={BinocularsIcon}
          figure={Loupe}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("addJob")}
          actionHref="/dashboard/tailor"
        />
      ) : (
        <>
          <DashboardStatStrip
            columns={3}
            items={[
              {
                icon: StackIcon,
                label: t("briefs"),
                value: sorted.length,
                tone: "accent",
              },
              { icon: BuildingsIcon, label: t("companies"), value: companyCount },
              {
                icon: CalendarIcon,
                label: t("newest"),
                value: (
                  <FormattedDate date={newest.createdAt} options={DATE_FORMAT} />
                ),
              },
            ]}
          />
          <DashboardPanel pad={false} as="div" delay={0.05}>
            <ul className="divide-y divide-[var(--landing-line)]">
              {sorted.map((brief, index) => (
                <BriefRow key={brief._id} brief={brief} index={index} />
              ))}
            </ul>
          </DashboardPanel>
        </>
      )}
    </DashboardPageShell>
  );
}

export default function CompanyResearchPage() {
  return (
    <ProGate feature="companyResearch" namespace="dashboard.companyResearch.list">
      <CompanyResearch />
    </ProGate>
  );
}
