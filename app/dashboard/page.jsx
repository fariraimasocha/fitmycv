"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  StackIcon,
  BuildingsIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PenIcon,
  KanbanIcon,
  ArrowRightIcon,
  FileTextIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  DashboardPageShell,
  DashboardStatCard,
  DashboardEmptyState,
  DashboardActivation,
} from "@/components/dashboard";
import { buildWeeklyCounts } from "@/lib/activity-series";
import Loader from "@/components/Loader";
import { getActivationSteps } from "@/lib/activation-steps";

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

export default function DashboardPage() {
  const { data: session } = useSession();
  const [formattedDate] = useState(() => getFormattedDate());
  const [greeting] = useState(() => getTimeOfDay());
  const [now] = useState(() => Date.now());

  const reduceMotion = useReducedMotion();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

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

  const isPremium = Boolean(session?.user?.isPremium);

  const { data: referenceCV, isLoading: referenceCVLoading } = useQuery({
    queryKey: ["reference-cv"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data ?? null;
    },
  });

  // /api/applications is behind requirePremium, so only free-of-paywall
  // accounts fetch it — and only premium accounts get that third step.
  const { data: applications } = useQuery({
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
  const companyResearchesKnown =
    !companyResearchesLoading &&
    !companyResearchesError &&
    Array.isArray(companyResearches);
  const researchCount = companyResearchesKnown ? companyResearches.length : "—";

  const {
    thisWeekCount,
    coverLetterCount,
    cvWeekly,
    researchWeekly,
    jobsWeekly,
    letterWeekly,
  } = useMemo(() => {
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const cvs = tailoredCVs ?? [];
    const researches = Array.isArray(companyResearches)
      ? companyResearches
      : [];
    const letters = cvs.filter((cv) => cv.hasCoverLetter);
    return {
      thisWeekCount: cvs.filter((cv) => new Date(cv.createdAt) >= oneWeekAgo)
        .length,
      coverLetterCount: letters.length,
      cvWeekly: buildWeeklyCounts(cvs, 16, now),
      researchWeekly: buildWeeklyCounts(researches, 16, now),
      jobsWeekly: buildWeeklyCounts(cvs, 8, now),
      letterWeekly: buildWeeklyCounts(letters, 16, now),
    };
  }, [tailoredCVs, companyResearches, now]);

  const recentCVs = useMemo(() => {
    return [...(tailoredCVs ?? [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [tailoredCVs]);

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

      <div className="flex flex-col gap-1">
        <span className="landing-meta-line">Dashboard</span>
        <h1
          suppressHydrationWarning
          className="font-outfit text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl"
        >
          Good {greeting}, {firstName} <span aria-hidden="true">👋</span>
        </h1>
        {formattedDate && (
          <p
            suppressHydrationWarning
            className="text-sm font-medium text-muted-foreground"
          >
            {formattedDate}
          </p>
        )}
      </div>

      {showActivation && <DashboardActivation steps={activationSteps} />}

      {tailoredCVsLoading ? (
        <Loader fullPage={false} className="min-h-50" />
      ) : tailoredCVsError ? (
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title="Couldn't load your dashboard"
          description="We couldn't load your tailored CVs. Try again in a moment."
          actionLabel={tailoredCVsFetching ? "Retrying…" : "Try again"}
          onAction={() => refetchTailoredCVs()}
          actionDisabled={tailoredCVsFetching}
          delay={0.05}
          className="min-h-50"
        />
      ) : isFirstUse ? null : (
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="grid items-start gap-3 sm:gap-4 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <DashboardStatCard
                label="Tailored CVs"
                value={tailoredCount}
                subtitle={
                  thisWeekCount > 0
                    ? `+${thisWeekCount} this week`
                    : "No new CVs this week"
                }
                icon={StackIcon}
                positive={thisWeekCount > 0}
                sparkline={cvWeekly}
                variant="featured"
              >
                {recentCVs.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <ul className="flex flex-col gap-0.5">
                      {recentCVs.map((cv) => (
                        <li key={cv._id}>
                          <Link
                            href={`/dashboard/tailored/${cv._id}`}
                            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-background/70"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                              <FileTextIcon size={15} aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-foreground">
                                {cv.jobTitle || "Untitled position"}
                              </span>
                              {cv.jobCompany && (
                                <span className="block truncate text-xs text-muted-foreground">
                                  {cv.jobCompany}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/dashboard/tailored"
                      className="mt-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      View all tailored CVs
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tailor a CV to see it here.
                  </p>
                )}
              </DashboardStatCard>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
              <DashboardStatCard
                label="Researches"
                value={researchCount}
                icon={BuildingsIcon}
                delay={0.05}
                sparkline={companyResearchesKnown ? researchWeekly : undefined}
              />
              <DashboardStatCard
                label="This week"
                value={thisWeekCount}
                icon={BriefcaseIcon}
                delay={0.1}
                sparkline={jobsWeekly}
              />
              <DashboardStatCard
                label="Cover letters"
                value={coverLetterCount}
                icon={EnvelopeIcon}
                delay={0.15}
                sparkline={letterWeekly}
              />
            </div>
          </div>

          <div className="grid items-stretch gap-3 sm:gap-4 lg:grid-cols-12">
            <Link
              href="/dashboard/tailor"
              className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-foreground px-4 py-4 text-background sm:px-5 lg:col-span-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10">
                  <PenIcon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Tailor a CV</p>
                  <p className="text-xs text-background/70">
                    Paste a job URL to get started
                  </p>
                </div>
              </div>
              <ArrowRightIcon
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/dashboard/applications"
              className="dashboard-list-row group flex min-w-0 items-center justify-between gap-3 px-4 py-4 sm:px-5 lg:col-span-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                  <KanbanIcon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    View applications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Track your job pipeline
                  </p>
                </div>
              </div>
              <ArrowRightIcon
                size={16}
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}
