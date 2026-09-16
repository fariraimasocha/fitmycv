"use client";

import { useMemo } from "react";
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
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
  DashboardStatStrip,
} from "@/components/dashboard";

const PAGE_TITLE = "Company research";
const PAGE_DESCRIPTION =
  "A brief on each company you tailored a CV for. Read it before the interview.";
const DATE_FORMAT = { day: "numeric", month: "short", year: "numeric" };

function LoadingRows() {
  return (
    <div className="space-y-2" aria-hidden="true">
      <div className="tool-skeleton h-14 rounded-lg" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="tool-skeleton h-16 rounded-lg" />
      ))}
    </div>
  );
}

function BriefRow({ brief, index }) {
  const reduceMotion = useReducedMotion();
  const name = brief.companyName || "Unnamed company";

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={`/dashboard/company-research/${brief._id}`}
        className="dashboard-list-row dashboard-row-pad group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] font-outfit text-sm font-semibold text-foreground">
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
          size={14}
          className="shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden="true"
        />
      </Link>
    </motion.li>
  );
}

export default function CompanyResearchPage() {
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
      if (!res.ok) throw new Error("Failed to fetch company research");
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
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          hasBriefs ? (
            <Link href="/dashboard/tailor" className="dashboard-primary-btn">
              <PlusIcon size={16} weight="bold" aria-hidden="true" />
              Research a company
            </Link>
          ) : null
        }
      />

      {isLoading ? (
        <LoadingRows />
      ) : isError ? (
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title="Couldn't load your briefs"
          description="Check your connection and try again."
          actionLabel={isFetching ? "Retrying…" : "Try again"}
          onAction={() => refetch()}
          actionDisabled={isFetching}
        />
      ) : !hasBriefs ? (
        <DashboardEmptyState
          icon={BinocularsIcon}
          title="Your company briefs will appear here"
          description="Paste a job URL on Tailor CV. We research the company while your CV is tailored."
          actionLabel="Research a company"
          actionHref="/dashboard/tailor"
        />
      ) : (
        <>
          <DashboardStatStrip
            columns={3}
            items={[
              {
                icon: StackIcon,
                label: "Briefs",
                value: sorted.length,
                tone: "accent",
              },
              { icon: BuildingsIcon, label: "Companies", value: companyCount },
              {
                icon: CalendarIcon,
                label: "Newest",
                value: (
                  <FormattedDate date={newest.createdAt} options={DATE_FORMAT} />
                ),
              },
            ]}
          />
          <ul className="space-y-2">
            {sorted.map((brief, index) => (
              <BriefRow key={brief._id} brief={brief} index={index} />
            ))}
          </ul>
        </>
      )}
    </DashboardPageShell>
  );
}
