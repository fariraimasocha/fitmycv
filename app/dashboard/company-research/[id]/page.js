"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowLeftIcon,
  CalendarIcon,
  BriefcaseIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import CompanyResearchCard from "@/components/CompanyResearchCard";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
} from "@/components/dashboard";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

export default function CompanyResearchDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);

  const { data: brief, isLoading } = useQuery({
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
    return <Loader />;
  }

  if (!brief) {
    return (
      <DashboardPageShell width="narrow">
        <p className="text-center text-sm text-[var(--landing-ink-soft)]">
          Company research brief not found.
        </p>
        <Button
          variant="outline"
          className="mx-auto mt-4 rounded-md"
          onClick={() => router.push("/dashboard/company-research")}
        >
          <ArrowLeftIcon size={16} />
          Back to list
        </Button>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="narrow">
      <button
        type="button"
        onClick={() => router.push("/dashboard/company-research")}
        className="flex items-center gap-1 text-sm text-[var(--landing-ink-soft)] transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon size={14} />
        Back to Company Research
      </button>

      <DashboardPageHeader
        title={brief.companyName}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-6 text-[var(--landing-ink-soft)]">
            {brief.jobTitle && (
              <span className="inline-flex items-center gap-1">
                <BriefcaseIcon size={14} />
                {brief.jobTitle}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <CalendarIcon size={14} />
              <FormattedDate date={brief.createdAt} />
            </span>
            {brief.jobUrl && (
              <a
                href={brief.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--landing-accent)] hover:underline"
              >
                <ArrowSquareOutIcon size={14} />
                Job posting
              </a>
            )}
          </span>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <CompanyResearchCard brief={brief} isLoading={false} />
      </motion.div>
    </DashboardPageShell>
  );
}
