"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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

const WEEKS = 12;

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatRelativeDay(value, now) {
  const date = new Date(value);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const days = Math.round((start - day) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function CheckoutRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("checkout") === "pending") {
      const plan = searchParams.get("plan") ?? "lifetime";
      router.replace(`/api/polar/checkout?plan=${plan}`);
    }
  }, [searchParams, router]);
  return null;
}

function TotalRow({ href, icon: Icon, label, value, thisWeek }) {
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
            {typeof thisWeek === "number"
              ? thisWeek > 0
                ? `+${thisWeek} this week`
                : "None this week"
              : "Not available"}
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

export default function DashboardPage() {
  const { data: session } = useSession();
  const [formattedDate] = useState(() => getFormattedDate());
  const [greeting] = useState(() => getTimeOfDay());
  const [now] = useState(() => Date.now());
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const isPremium = Boolean(session?.user?.isPremium);

  const {
    data: tailoredCVs,
    isLoading: tailoredCVsLoading,
    isError: tailoredCVsError,
    isFetching: tailoredCVsFetching,
    refetch: refetchTailoredCVs,
  } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: async () => {
      const res = await fetch("/api/tailored-cv");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (!Array.isArray(json.data)) {
        throw new Error("Tailored CV response did not contain a list");
      }
      return json.data;
    },
  });

  const {
    data: companyResearches,
    isLoading: companyResearchesLoading,
    isError: companyResearchesError,
  } = useQuery({
    queryKey: ["company-research"],
    queryFn: async () => {
      const res = await fetch("/api/company-research");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const { data: referenceCV, isLoading: referenceCVLoading } = useQuery({
    queryKey: ["reference-cv"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data ?? null;
    },
  });

  // /api/applications is behind requirePremium, so only premium accounts
  // fetch it. The pipeline card shows an upgrade nudge for everyone else.
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["applications"],
    enabled: isPremium,
    queryFn: async () => {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data ?? [];
    },
  });

  const tailoredCount = tailoredCVs?.length ?? 0;
  const isFirstUse =
    !tailoredCVsLoading &&
    !tailoredCVsError &&
    Array.isArray(tailoredCVs) &&
    tailoredCVs.length === 0;
  const researchKnown =
    !companyResearchesLoading &&
    !companyResearchesError &&
    Array.isArray(companyResearches);
  const researches = useMemo(
    () => (researchKnown ? companyResearches : []),
    [researchKnown, companyResearches],
  );

  const {
    coverLetterCount,
    cvWeekly,
    letterWeekly,
    researchWeekly,
    weekStarts,
  } = useMemo(() => {
    const cvs = tailoredCVs ?? [];
    const letters = cvs.filter((cv) => cv.hasCoverLetter);
    return {
      coverLetterCount: letters.length,
      cvWeekly: buildWeeklyCounts(cvs, WEEKS, now),
      letterWeekly: buildWeeklyCounts(letters, WEEKS, now),
      researchWeekly: buildWeeklyCounts(researches, WEEKS, now),
      weekStarts: weekStartDates(WEEKS, now),
    };
  }, [tailoredCVs, researches, now]);

  const series = useMemo(
    () => [
      { id: "cvs", label: "Tailored CVs", counts: cvWeekly },
      { id: "letters", label: "Cover letters", counts: letterWeekly },
      { id: "research", label: "Research", counts: researchWeekly },
    ],
    [cvWeekly, letterWeekly, researchWeekly],
  );

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
    !tailoredCVsLoading &&
    !tailoredCVsError &&
    activationSteps.some((step) => !step.done);

  return (
    <DashboardPageShell width="full">
      <Suspense fallback={null}>
        <CheckoutRedirect />
      </Suspense>

      <DashboardPageHeader
        title={
          <span suppressHydrationWarning>
            Good {greeting}, {firstName}
          </span>
        }
        description={<span suppressHydrationWarning>{formattedDate}</span>}
        actions={
          <>
            <Link href="/dashboard/resume" className="dashboard-secondary-btn">
              <FileTextIcon size={16} aria-hidden="true" />
              My CV
            </Link>
            <Link href="/dashboard/tailor" className="dashboard-primary-btn">
              <PlusIcon size={16} weight="bold" aria-hidden="true" />
              Tailor a CV
            </Link>
          </>
        }
      />

      {showActivation && <DashboardActivation steps={activationSteps} />}

      {tailoredCVsLoading ? (
        <Loader fullPage={false} className="min-h-50" />
      ) : tailoredCVsError ? (
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title="Couldn't load your dashboard"
          description="We couldn't load your tailored CVs. Try again in a moment."
          actionLabel={tailoredCVsFetching ? "Retrying" : "Try again"}
          onAction={() => refetchTailoredCVs()}
          actionDisabled={tailoredCVsFetching}
          delay={0.05}
          className="min-h-50"
        />
      ) : isFirstUse ? null : (
        <div className="flex flex-col gap-4">
          {/* Row 1: the chart carries the story, totals sit beside it. */}
          <div className="grid items-stretch gap-4 lg:grid-cols-12">
            <DashboardActivityChart
              series={series}
              weekStarts={weekStarts}
              delay={0.05}
              className="lg:col-span-8"
            />
            <DashboardPanel delay={0.1} className="lg:col-span-4">
              <DashboardPanelHeader
                title="Totals"
                description="Everything you have made"
              />
              <ul className="mt-3 flex flex-1 flex-col divide-y divide-[var(--landing-line)]">
                <TotalRow
                  href="/dashboard/tailored"
                  icon={StackIcon}
                  label="Tailored CVs"
                  value={tailoredCount}
                  thisWeek={cvWeekly.at(-1)}
                />
                <TotalRow
                  href="/dashboard/tailored"
                  icon={EnvelopeIcon}
                  label="Cover letters"
                  value={coverLetterCount}
                  thisWeek={letterWeekly.at(-1)}
                />
                <TotalRow
                  href="/dashboard/company-research"
                  icon={BuildingsIcon}
                  label="Company research"
                  value={researchKnown ? researches.length : "n/a"}
                  thisWeek={researchKnown ? researchWeekly.at(-1) : undefined}
                />
              </ul>
            </DashboardPanel>
          </div>

          {/* Row 2: what you made recently, and where applications stand. */}
          <div className="grid items-stretch gap-4 lg:grid-cols-12">
            <DashboardPanel delay={0.15} className="lg:col-span-7">
              <DashboardPanelHeader
                title="Recent tailored CVs"
                description="Open one to review, edit or download"
                href="/dashboard/tailored"
                linkLabel="View all"
              />
              <ul className="mt-3 flex flex-col divide-y divide-[var(--landing-line)]">
                {recentCVs.map((cv) => (
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
                          {cv.jobTitle || "Untitled position"}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {cv.jobCompany || "Company not set"}
                        </span>
                      </span>
                      {cv.hasCoverLetter && (
                        <span className="hidden items-center gap-1 text-xs font-medium text-[var(--landing-success)] sm:inline-flex">
                          <CheckCircleIcon
                            size={14}
                            weight="fill"
                            aria-hidden="true"
                          />
                          Cover letter
                        </span>
                      )}
                      <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                        {formatRelativeDay(cv.createdAt, now)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </DashboardPanel>

            <DashboardPipelineCard
              applications={applications}
              isPremium={isPremium}
              isLoading={isPremium && applicationsLoading}
              delay={0.2}
              className="lg:col-span-5"
            />
          </div>

          {/* Row 3: company research. */}
          <DashboardPanel delay={0.25}>
            <DashboardPanelHeader
              title="Company research"
              description={
                recentResearch.length > 0
                  ? "Briefs on the companies you are applying to"
                  : "Know the company before the interview"
              }
              href={
                recentResearch.length > 0
                  ? "/dashboard/company-research"
                  : undefined
              }
              linkLabel="View all"
            />
            {recentResearch.length > 0 ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {recentResearch.map((brief) => (
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
                          {brief.companyName || "Unnamed company"}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {brief.jobTitle ||
                            formatRelativeDay(brief.createdAt, now)}
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
                    Paste a job URL to get a brief on the company, its funding
                    and team size.
                  </p>
                </div>
                <Link
                  href="/dashboard/company-research"
                  className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
                >
                  Research a company
                </Link>
              </div>
            )}
          </DashboardPanel>
        </div>
      )}
    </DashboardPageShell>
  );
}
