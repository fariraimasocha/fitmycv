"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  CalendarIcon,
  BinocularsIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
} from "@/components/dashboard";

export default function CompanyResearchPage() {
  const { data: briefs, isLoading } = useQuery({
    queryKey: ["company-research"],
    queryFn: async () => {
      const res = await fetch("/api/company-research");
      if (!res.ok) throw new Error("Failed to fetch company research");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="Company Research"
        description="Interview prep briefs automatically generated when you extract a job listing."
        action={
          briefs?.length > 0 ? (
            <Button
              asChild
              className="rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90"
            >
              <Link href="/dashboard/tailor">
                <PlusIcon size={16} />
                New brief
              </Link>
            </Button>
          ) : null
        }
      />

      {!briefs || briefs.length === 0 ? (
        <DashboardEmptyState
          icon={BinocularsIcon}
          title="No company briefs yet"
          description="Paste a job URL on Tailor CV to auto-generate your first company brief."
          actionLabel="Go to Tailor CV"
          actionHref="/dashboard/tailor"
        />
      ) : (
        <div className="space-y-2">
          {briefs.map((brief, index) => (
            <motion.div
              key={brief._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Link href={`/dashboard/company-research/${brief._id}`}>
                <Card className="dashboard-list-row group cursor-pointer rounded-2xl border-border py-0 gap-0">
                  <CardContent className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-sm font-bold text-[var(--landing-primary-dark)]">
                      {(brief.companyName?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:underline">
                        {brief.companyName}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        {brief.jobTitle && (
                          <span className="inline-flex items-center gap-1 truncate">
                            <BriefcaseIcon size={12} aria-hidden="true" />
                            {brief.jobTitle}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon size={12} aria-hidden="true" />
                          <FormattedDate date={brief.createdAt} />
                        </span>
                      </div>
                      {brief.summary && (
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {brief.summary}
                        </p>
                      )}
                    </div>
                    <ArrowRightIcon
                      size={14}
                      className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardPageShell>
  );
}
