"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { LockSimpleIcon, MapPinIcon, SparkleIcon } from "@phosphor-icons/react";
import { DashboardPanel, DashboardPanelHeader } from "./DashboardPanel";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const MATCH_COUNT = 3;

async function fetchMatches() {
  const res = await fetch(`/api/matches?n=${MATCH_COUNT}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Couldn't load matching jobs.");
  return Array.isArray(json.data) ? json.data : [];
}

function MatchRow({ job, primary }) {
  const t = useTranslations("dashboard.home.matches");
  const onClick = () => trackEvent("home_match_clicked", { locked: Boolean(job.locked) });
  const btn = cn(
    "tap-target w-full shrink-0 sm:w-auto",
    primary && !job.locked
      ? "dashboard-primary-btn dashboard-primary-btn-sm"
      : "dashboard-secondary-btn dashboard-secondary-btn-sm",
  );

  return (
    <li className="flex flex-col gap-3 py-4 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{job.title}</p>
        {/* Free viewers get no company in the response, so there is nothing to
            show here, only a note for screen readers. */}
        {job.locked && <span className="sr-only">{t("companyHidden")}</span>}
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {!job.locked && job.company && <span>{job.company}</span>}
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3.5 shrink-0" aria-hidden="true" />
              {job.location}
            </span>
          )}
          <span>{t("fit", { fit: job.fit })}</span>
          {job.isNew && (
            <span className="rounded-full bg-[var(--landing-accent-soft)] px-2 py-0.5 font-medium text-[var(--landing-accent-dark)]">
              {t("new")}
            </span>
          )}
        </p>
      </div>
      {job.locked ? (
        <Link href="/dashboard/upgrade" onClick={onClick} className={btn}>
          <LockSimpleIcon size={16} aria-hidden="true" />
          {t("unlock")}
        </Link>
      ) : job.applyUrl && (
        <Link
          href={`/dashboard/tailor?url=${encodeURIComponent(job.applyUrl)}&auto=1`}
          onClick={onClick}
          className={btn}
        >
          <SparkleIcon size={16} aria-hidden="true" />
          {t("tailor")}
        </Link>
      )}
    </li>
  );
}

// Jobs from the crawled pool that share keywords with your CV. The fit number
// and the "new" label come straight from /api/matches, so nothing here is made up.
export function HomeMatchesCard({ hasCV, className, delay = 0.05 }) {
  const t = useTranslations("dashboard.home.matches");
  const { data, isError } = useQuery({
    queryKey: ["matches", MATCH_COUNT],
    queryFn: fetchMatches,
  });
  const jobs = data ?? [];

  let body;
  if (isError) {
    body = <p className="mt-4 border-t border-dash-line pt-4 text-sm text-muted-foreground">{t("error")}</p>;
  } else if (data && jobs.length === 0) {
    body = (
      <div className="mt-4 flex flex-col items-start gap-4 border-t border-dash-line pt-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            {hasCV ? t("emptyTitle") : t("emptyNoCvTitle")}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {hasCV ? t("emptyDescription") : t("emptyNoCvDescription")}
          </p>
        </div>
        <Link href="/dashboard/jobs" className="dashboard-secondary-btn dashboard-secondary-btn-sm tap-target">
          {t("browse")}
        </Link>
      </div>
    );
  } else if (jobs.length > 0) {
    body = (
      <ul className="mt-2 flex flex-col divide-y divide-dash-line">
        {jobs.map((job, index) => (
          <MatchRow key={job.id} job={job} primary={index === 0} />
        ))}
      </ul>
    );
  }

  return (
    <DashboardPanel delay={delay} className={className}>
      <DashboardPanelHeader
        title={t("title")}
        description={t("description")}
        href={jobs.length > 0 ? "/dashboard/jobs" : undefined}
        linkLabel={t("browse")}
      />
      {body}
    </DashboardPanel>
  );
}
