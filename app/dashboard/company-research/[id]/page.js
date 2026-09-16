"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowSquareOutIcon,
  BinocularsIcon,
  BriefcaseIcon,
  CalendarIcon,
  LightbulbIcon,
  NewspaperIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import CompanyResearchCard from "@/components/CompanyResearchCard";
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
  DashboardStatStrip,
} from "@/components/dashboard";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

const LIST_HREF = "/dashboard/company-research";
const DATE_FORMAT = { day: "numeric", month: "short", year: "numeric" };

function BackLink() {
  return (
    <Link
      href={LIST_HREF}
      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon size={16} aria-hidden="true" />
      Back to company research
    </Link>
  );
}

function LoadingBrief() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <div className="tool-skeleton h-8 w-64 max-w-full rounded-md" />
        <div className="tool-skeleton h-4 w-40 max-w-full rounded-md" />
      </div>
      <div className="tool-skeleton h-14 rounded-lg" />
      <div className="tool-skeleton h-96 rounded-lg" />
    </div>
  );
}

function Rise({ children, delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function CompanyResearchDetailPage() {
  const { id } = useParams();
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);

  const {
    data: brief,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["company-research", id],
    queryFn: async () => {
      const res = await fetch(`/api/company-research/${id}`);
      if (!res.ok) throw new Error("Failed to fetch company research");
      const json = await res.json();
      return json.data;
    },
  });

  useEffect(() => {
    if (brief?.companyName) setDetailLabel(brief.companyName);
    return () => setDetailLabel(null);
  }, [brief?.companyName, setDetailLabel]);

  if (isLoading) {
    return (
      <DashboardPageShell width="narrow">
        <BackLink />
        <LoadingBrief />
      </DashboardPageShell>
    );
  }

  if (isError) {
    return (
      <DashboardPageShell width="narrow">
        <BackLink />
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title="Couldn't load this brief"
          description="Check your connection and try again."
          actionLabel={isFetching ? "Retrying…" : "Try again"}
          onAction={() => refetch()}
          actionDisabled={isFetching}
          secondaryLabel="Back to company research"
          secondaryHref={LIST_HREF}
        />
      </DashboardPageShell>
    );
  }

  if (!brief) {
    return (
      <DashboardPageShell width="narrow">
        <BackLink />
        <DashboardEmptyState
          icon={BinocularsIcon}
          title="This brief is not available"
          description="It may have been removed. Your other briefs are still in the list."
          actionLabel="Back to company research"
          actionHref={LIST_HREF}
        />
      </DashboardPageShell>
    );
  }

  const newsCount = brief.recentNews?.length ?? 0;
  const tipsCount = brief.positioningTips?.length ?? 0;

  return (
    <DashboardPageShell width="narrow">
      <BackLink />

      <DashboardPageHeader
        title={brief.companyName || "Unnamed company"}
        description={
          brief.jobTitle
            ? `Brief for the ${brief.jobTitle} role.`
            : "Brief on the company behind this job."
        }
        actions={
          brief.jobUrl ? (
            <a
              href={brief.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dashboard-secondary-btn"
            >
              <ArrowSquareOutIcon size={16} aria-hidden="true" />
              Open job posting
            </a>
          ) : null
        }
      />

      <DashboardStatStrip
        columns={4}
        items={[
          {
            icon: BriefcaseIcon,
            label: "Role",
            value: brief.jobTitle || "Not set",
            tone: "accent",
          },
          {
            icon: CalendarIcon,
            label: "Added",
            value: <FormattedDate date={brief.createdAt} options={DATE_FORMAT} />,
          },
          { icon: NewspaperIcon, label: "News items", value: newsCount },
          {
            icon: LightbulbIcon,
            label: "Positioning tips",
            value: tipsCount,
            tone: "success",
          },
        ]}
      />

      <Rise delay={0.1}>
        <CompanyResearchCard brief={brief} isLoading={false} />
      </Rise>
    </DashboardPageShell>
  );
}
