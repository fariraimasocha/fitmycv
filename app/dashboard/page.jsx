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
  TrendUpIcon,
  PenIcon,
  KanbanIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import Link from "next/link";
import {
  DashboardPageShell,
  DashboardStatCard,
  DashboardStatGrid,
} from "@/components/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function buildChartData(cvs = []) {
  const days = 30;
  const now = new Date();
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map[key] = {
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      count: 0,
    };
  }
  cvs.forEach((cv) => {
    const key = new Date(cv.createdAt).toISOString().slice(0, 10);
    if (map[key]) map[key].count += 1;
  });
  return Object.values(map);
}

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

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const { data: tailoredCVs } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: async () => {
      const res = await fetch("/api/tailored-cv");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
  });

  const { data: companyResearches } = useQuery({
    queryKey: ["company-research"],
    queryFn: async () => {
      const res = await fetch("/api/company-research");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data ?? json;
    },
  });

  const tailoredCount = tailoredCVs?.length ?? 0;
  const researchCount = Array.isArray(companyResearches)
    ? companyResearches.length
    : 0;

  const { thisWeekCount, coverLetterCount, chartData } = useMemo(() => {
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const cvs = tailoredCVs ?? [];
    return {
      thisWeekCount: cvs.filter((cv) => new Date(cv.createdAt) >= oneWeekAgo).length,
      coverLetterCount: cvs.filter((cv) => cv.coverLetter && cv.coverLetter.trim().length > 0).length,
      chartData: buildChartData(cvs),
    };
  }, [tailoredCVs, now]);

  const statCards = [
    {
      label: "Tailored CVs",
      value: tailoredCount,
      subtitle:
        thisWeekCount > 0
          ? `+${thisWeekCount} this week`
          : "No new CVs this week",
      icon: StackIcon,
      positive: thisWeekCount > 0,
      delay: 0,
    },
    {
      label: "Company Researches",
      value: researchCount,
      subtitle: "Companies researched",
      icon: BuildingsIcon,
      delay: 0.05,
    },
    {
      label: "Jobs This Week",
      value: thisWeekCount,
      subtitle: "Applications in last 7 days",
      icon: BriefcaseIcon,
      delay: 0.1,
    },
    {
      label: "Cover Letters",
      value: coverLetterCount,
      subtitle: "Generated with your CVs",
      icon: EnvelopeIcon,
      delay: 0.15,
    },
  ];

  return (
    <DashboardPageShell width="wide">
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

      <DashboardStatGrid>
        {statCards.map((card) => (
          <DashboardStatCard key={card.label} {...card} />
        ))}
      </DashboardStatGrid>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/tailor"
          className="dashboard-list-row group flex items-center justify-between gap-3 px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
              <PenIcon size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Tailor a CV</p>
              <p className="text-xs text-muted-foreground">Paste a job URL to get started</p>
            </div>
          </div>
          <ArrowRightIcon
            size={16}
            className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/dashboard/applications"
          className="dashboard-list-row group flex items-center justify-between gap-3 px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
              <KanbanIcon size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">View applications</p>
              <p className="text-xs text-muted-foreground">Track your job pipeline</p>
            </div>
          </div>
          <ArrowRightIcon
            size={16}
            className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 pb-0 sm:px-6 sm:py-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Activity
            </CardTitle>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
              <TrendUpIcon size={16} aria-hidden="true" />
            </span>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6">
            <p className="mb-4 text-xs text-muted-foreground">Last 30 days</p>
            <ResponsiveContainer width="100%" height={220} className="sm:!h-[300px]">
              <BarChart
                data={chartData}
                margin={{ top: 2, right: 4, left: -28, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "oklch(0.45 0.038 244)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "var(--landing-shadow-sm)",
                    fontSize: "12px",
                  }}
                  labelStyle={{
                    color: "var(--foreground)",
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: "var(--muted-foreground)" }}
                  formatter={(value) => [value, "CVs"]}
                  cursor={{ fill: "oklch(0.92 0.06 174)", opacity: 0.45 }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--landing-accent)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                  isAnimationActive={true}
                  animationEasing="ease-in-out"
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardPageShell>
  );
}
