"use client";

import { useTranslations } from "next-intl";
import { DashboardPageShell, DashboardPageHeader } from "@/components/dashboard";
import JobsBrowser from "@/app/(site)/jobs/JobsBrowser";

// The same feed as the public /jobs page, inside the app shell, so Find jobs
// in the sidebar keeps you in the app instead of dropping you on the
// marketing layout.
export default function DashboardJobsPage() {
  const t = useTranslations("dashboard.jobs");
  return (
    <DashboardPageShell>
      <DashboardPageHeader title={t("title")} description={t("description")} />
      <JobsBrowser className="flex flex-col gap-5" />
    </DashboardPageShell>
  );
}
