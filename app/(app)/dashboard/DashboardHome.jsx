"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  StackIcon,
  BuildingsIcon,
  EnvelopeIcon,
  PlusIcon,
  ArrowRightIcon,
  FileTextIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
  DashboardEmptyState,
  DashboardActivation,
  DashboardActivityChart,
  DashboardPipelineCard,
} from "@/components/dashboard";
import { buildWeeklyCounts, weekStartDates } from "@/lib/activity-series";
import Loader from "@/components/Loader";
import { getActivationSteps } from "@/lib/activation-steps";
import { dateLocale } from "@/i18n/routing";

const WEEKS = 12;

const noSubscribe = () => () => {};

// The server renders in UTC and has no idea of the visitor's clock, so
// anything that depends on local time is read on the client only. Server HTML
// says "Hello", leaves the date and relative days blank, and counts no weeks.
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function getFormattedDate(locale) {
  return new Date().toLocaleDateString(dateLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Midnight today in the visitor's time zone. Stays the same number all day,
// so useSyncExternalStore sees a stable snapshot.
function getStartOfToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

function formatRelativeDay(value, today, t, locale) {
  if (today === null) return "";
  const date = new Date(value);
  const start = new Date(today);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const days = Math.round((start - day) / 86400000);
  if (days <= 0) return t("today");
  if (days === 1) return t("yesterday");
  if (days < 7) return t("daysAgo", { days });
  // today is null on the server, so this only runs in the visitor's browser.
  // react-doctor-disable-next-line react-doctor/no-locale-format-in-render
  return date.toLocaleDateString(dateLocale(locale), { day: "numeric", month: "short" });
}

function TotalRow({ href, icon: Icon, label, value, thisWeek }) {
  const t = useTranslations("dashboard.home");
  return (
    <li>
      <Link
        href={href}
        className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-[var(--landing-paper-soft)]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
          <Icon size={17} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">
            {label}
          </span>
          <span className="block text-xs text-muted-foreground">
            {/* null: the week is not known until the client renders. */}
            {thisWeek === null
              ? "\u00a0"
              : typeof thisWeek === "number"
                ? thisWeek > 0
                  ? t("thisWeek", { count: thisWeek })
                  : t("noneThisWeek")
                : t("notAvailable")}
          </span>
        </span>
        <span className="font-outfit text-2xl font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground">
          {value}
        </span>
        <ArrowRightIcon
          size={14}
          className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

const LOAD_ERROR = "Couldn't load this page. Refresh and try again.";

async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(LOAD_ERROR);
  return res.json();
}

async function fetchTailoredCVs() {
  const json = await fetchData("/api/tailored-cv");
  if (!Array.isArray(json.data)) {
    throw new Error("Tailored CV response did not contain a list");
  }
  return json.data;
}

async function fetchCompanyResearch() {
  const json = await fetchData("/api/company-research");
  return json.data ?? json;
}

async function fetchReferenceCV() {
  return (await fetchData("/api/resume")).data ?? null;
}

async function fetchApplications() {
  return (await fetchData("/api/applications")).data ?? [];
}

function useWeeklyStats(tailoredCVs, researches, today) {
  return useMemo(() => {
    const cvs = tailoredCVs ?? [];
    const letters = cvs.filter((cv) => cv.hasCoverLetter);
    if (today === null) {
      const empty = new Array(WEEKS).fill(0);
      return {
        coverLetterCount: letters.length,
        cvWeekly: empty,
        letterWeekly: empty,
        researchWeekly: empty,
        weekStarts: [],
      };
    }
    return {
      coverLetterCount: letters.length,
      cvWeekly: buildWeeklyCounts(cvs, WEEKS, today),
      letterWeekly: buildWeeklyCounts(letters, WEEKS, today),
      researchWeekly: buildWeeklyCounts(researches, WEEKS, today),
      weekStarts: weekStartDates(WEEKS, today),
    };
  }, [tailoredCVs, researches, today]);
}

// null this-week counts mean the client has not rendered yet. A null
// researchCount means research could not be loaded.
function TotalsPanel({
  today,
  tailoredCount,
  coverLetterCount,
  researchCount,
  cvWeekly,
  letterWeekly,
  researchWeekly,
}) {
  const t = useTranslations("dashboard.home");
  const thisWeek = (weekly) => (today === null ? null : weekly.at(-1));
  return (
    <DashboardPanel delay={0.1} className="lg:col-span-4">
      <DashboardPanelHeader
        title={t("totals.title")}
        description={t("totals.description")}
      />
      <ul className="mt-3 flex flex-1 flex-col divide-y divide-[var(--landing-line)]">
        <TotalRow
          href="/dashboard/tailored"
          icon={StackIcon}
          label={t("totals.cvs")}
          value={tailoredCount}
          thisWeek={thisWeek(cvWeekly)}
        />
        <TotalRow
          href="/dashboard/tailored"
          icon={EnvelopeIcon}
          label={t("totals.letters")}
          value={coverLetterCount}
          thisWeek={thisWeek(letterWeekly)}
        />
        <TotalRow
          href="/dashboard/company-research"
          icon={BuildingsIcon}
          label={t("totals.research")}
          value={researchCount ?? t("totals.na")}
          thisWeek={researchCount === null ? undefined : thisWeek(researchWeekly)}
        />
      </ul>
    </DashboardPanel>
  );
}

function RecentCVsPanel({ cvs, today }) {
  const t = useTranslations("dashboard.home");
  const locale = useLocale();
  return (
    <DashboardPanel delay={0.15} className="lg:col-span-7">
      <DashboardPanelHeader
        title={t("recent.title")}
        description={t("recent.description")}
        href="/dashboard/tailored"
        linkLabel={t("viewAll")}
      />
      <ul className="mt-3 flex flex-col divide-y divide-[var(--landing-line)]">
        {cvs.map((cv) => (
          <li key={cv._id}>
            <Link
              href={`/dashboard/tailored/${cv._id}`}
              className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-[var(--landing-paper-soft)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]">
                <FileTextIcon size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {cv.jobTitle || t("untitledRole")}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {cv.jobCompany || t("companyNotSet")}
                </span>
              </span>
              {cv.hasCoverLetter && (
                <span className="hidden items-center gap-1 text-xs font-medium text-[var(--landing-success)] sm:inline-flex">
                  <CheckCircleIcon size={14} weight="fill" aria-hidden="true" />
                  {t("coverLetter")}
                </span>
              )}
              <span className="w-20 shrink-0 text-end text-xs tabular-nums text-muted-foreground">
                {formatRelativeDay(cv.createdAt, today, t, locale)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  );
}

function ResearchPanel({ briefs, today }) {
  const t = useTranslations("dashboard.home");
  const locale = useLocale();
  const hasBriefs = briefs.length > 0;
  return (
    <DashboardPanel delay={0.25}>
      <DashboardPanelHeader
        title={t("research.title")}
        description={
          hasBriefs ? t("research.description") : t("research.emptyDescription")
        }
        href={hasBriefs ? "/dashboard/company-research" : undefined}
        linkLabel={t("viewAll")}
      />
      {hasBriefs ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {briefs.map((brief) => (
            <li key={brief._id}>
              <Link
                href={`/dashboard/company-research/${brief._id}`}
                className="dashboard-list-row group flex h-full flex-col gap-3 p-3.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
                  <BuildingsIcon size={17} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {brief.companyName || t("research.unnamed")}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 break-words whitespace-normal text-muted-foreground">
                    {brief.jobTitle ||
                      formatRelativeDay(brief.createdAt, today, t, locale)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-start gap-4 rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-surface)] text-[var(--landing-ink-soft)] landing-inset-edge">
              <MagnifyingGlassIcon size={17} aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
              {t("research.empty")}
            </p>
          </div>
          <Link
            href="/dashboard/company-research"
            className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
          >
            {t("research.cta")}
          </Link>
        </div>
      )}
    </DashboardPanel>
  );
}

function useDashboardData(isPremium, today) {
  const tailoredQuery = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: fetchTailoredCVs,
  });

  const researchQuery = useQuery({
    queryKey: ["company-research"],
    // Behind requirePremium too. Free accounts only ever got a 402 here.
    enabled: isPremium,
    queryFn: fetchCompanyResearch,
  });

  const { data: referenceCV, isLoading: referenceCVLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: fetchReferenceCV,
  });

  // /api/applications is behind requirePremium, so only premium accounts
  // fetch it. The pipeline card shows an upgrade nudge for everyone else.
  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    enabled: isPremium,
    queryFn: fetchApplications,
  });

  const tailoredCVs = tailoredQuery.data;
  const tailoredCount = tailoredCVs?.length ?? 0;
  const researchKnown =
    !researchQuery.isLoading &&
    !researchQuery.isError &&
    Array.isArray(researchQuery.data);
  const researches = useMemo(
    () => (researchKnown ? researchQuery.data : []),
    [researchKnown, researchQuery.data],
  );
  const stats = useWeeklyStats(tailoredCVs, researches, today);

  const recentCVs = useMemo(
    () =>
      [...(tailoredCVs ?? [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [tailoredCVs],
  );

  const recentResearch = useMemo(
    () =>
      [...researches]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    [researches],
  );

  const applications = applicationsQuery.data;
  const activationSteps = useMemo(() => {
    const done = {
      resume: Boolean(referenceCV),
      tailor: tailoredCount > 0,
      applications: (applications?.length ?? 0) > 0,
    };
    return getActivationSteps(isPremium).map((step) => ({
      ...step,
      done: done[step.key],
    }));
  }, [referenceCV, tailoredCount, applications, isPremium]);

  // Hold the checklist back until both queries have answered, so a completed
  // user does not see it flash on every dashboard load.
  const showActivation =
    !referenceCVLoading &&
    !tailoredQuery.isLoading &&
    !tailoredQuery.isError &&
    activationSteps.some((step) => !step.done);

  return {
    tailoredQuery,
    tailoredCount,
    isFirstUse:
      tailoredQuery.isSuccess &&
      Array.isArray(tailoredCVs) &&
      tailoredCVs.length === 0,
    researchCount: researchKnown ? researches.length : null,
    stats,
    recentCVs,
    recentResearch,
    applications,
    applicationsLoading: isPremium && applicationsQuery.isLoading,
    activationSteps,
    showActivation,
  };
}

function DashboardContent({ data, today, isPremium }) {
  const t = useTranslations("dashboard.home");
  const { tailoredQuery, stats } = data;

  const series = useMemo(
    () => [
      { id: "cvs", label: t("series.cvs"), counts: stats.cvWeekly },
      { id: "letters", label: t("series.letters"), counts: stats.letterWeekly },
      { id: "research", label: t("series.research"), counts: stats.researchWeekly },
    ],
    [stats, t],
  );

  if (tailoredQuery.isLoading) {
    return <Loader fullPage={false} className="min-h-50" />;
  }
  if (tailoredQuery.isError) {
    return (
      <DashboardEmptyState
        icon={WarningCircleIcon}
        title={t("error.title")}
        description={t("error.description")}
        actionLabel={tailoredQuery.isFetching ? t("error.retrying") : t("error.retry")}
        onAction={() => tailoredQuery.refetch()}
        actionDisabled={tailoredQuery.isFetching}
        delay={0.05}
        className="min-h-50"
      />
    );
  }
  if (data.isFirstUse) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: the chart carries the story, totals sit beside it. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-12">
        <DashboardActivityChart
          series={series}
          weekStarts={stats.weekStarts}
          delay={0.05}
          className="lg:col-span-8"
        />
        <TotalsPanel
          today={today}
          tailoredCount={data.tailoredCount}
          coverLetterCount={stats.coverLetterCount}
          researchCount={data.researchCount}
          cvWeekly={stats.cvWeekly}
          letterWeekly={stats.letterWeekly}
          researchWeekly={stats.researchWeekly}
        />
      </div>

      {/* Row 2: what you made recently, and where applications stand. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-12">
        <RecentCVsPanel cvs={data.recentCVs} today={today} />

        <DashboardPipelineCard
          applications={data.applications}
          isPremium={isPremium}
          isLoading={data.applicationsLoading}
          delay={0.2}
          className="lg:col-span-5"
        />
      </div>

      {/* Row 3: company research. */}
      <ResearchPanel briefs={data.recentResearch} today={today} />
    </div>
  );
}

export default function DashboardHome() {
  const t = useTranslations("dashboard.home");
  const locale = useLocale();
  const { data: session } = useSession();
  const formattedDate = useSyncExternalStore(
    noSubscribe,
    () => getFormattedDate(locale),
    () => "\u00a0",
  );
  const greeting = useSyncExternalStore(noSubscribe, getTimeOfDay, () => "default");
  const today = useSyncExternalStore(noSubscribe, getStartOfToday, () => null);
  const firstName = session?.user?.name?.split(" ")[0];
  const isPremium = Boolean(session?.user?.isPremium);
  const data = useDashboardData(isPremium, today);
  const { activationSteps, showActivation } = data;

  return (
    <DashboardPageShell width="full">
      <DashboardPageHeader
        title={
          <span suppressHydrationWarning>
            {firstName
              ? t(`greeting.${greeting}`, { name: firstName })
              : t(`greetingNoName.${greeting}`)}
          </span>
        }
        description={formattedDate}
        actions={
          <>
            <Link href="/dashboard/resume" className="dashboard-secondary-btn">
              <FileTextIcon size={16} aria-hidden="true" />
              {t("myCv")}
            </Link>
            {/* While the checklist shows, its "Now" step is the one primary
                action. A second filled button here would compete with it. */}
            <Link
              href="/dashboard/tailor"
              className={showActivation ? "dashboard-secondary-btn" : "dashboard-primary-btn"}
            >
              <PlusIcon size={16} weight="bold" aria-hidden="true" />
              {t("tailorMyCv")}
            </Link>
          </>
        }
      />

      {showActivation && <DashboardActivation steps={activationSteps} />}

      <DashboardContent data={data} today={today} isPremium={isPremium} />
    </DashboardPageShell>
  );
}
