"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  ReadCvLogoIcon,
  PenIcon,
  StackIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
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
      router.replace("/api/polar/checkout");
    }
  }, [searchParams, router]);
  return null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(getFormattedDate());
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const { data: referenceCV } = useQuery({
    queryKey: ["reference-cv"],
    queryFn: () => fetch("/api/reference-cv").then((r) => r.json()),
  });

  const { data: tailoredCVs } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: async () => {
      const res = await fetch("/api/tailored-cv");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
  });

  const hasReferenceCV = !!referenceCV?.data;
  const tailoredCount = tailoredCVs?.length ?? 0;
  const latestCV = tailoredCVs?.[0] ?? null;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekCount = tailoredCVs?.filter(
    (cv) => new Date(cv.createdAt) >= oneWeekAgo
  ).length ?? 0;
  const chartData = buildChartData(tailoredCVs ?? []);

  const quickActions = [
    {
      icon: ReadCvLogoIcon,
      title: "My Resume",
      description: "Upload and manage your base CV",
      href: "/dashboard/resume",
    },
    {
      icon: PenIcon,
      title: "Tailor Resume",
      description: "Paste a job URL to generate a tailored CV",
      href: "/dashboard/tailor",
    },
    {
      icon: StackIcon,
      title: "Tailored CVs",
      description: "View all your generated CVs",
      href: "/dashboard/tailored",
    },
  ];

  // Determine onboarding state
  const step1Done = hasReferenceCV;
  const step2Done = tailoredCount > 0;
  const onboardingComplete = step1Done && step2Done;

  // Next CTA for the banner
  const nextStep = !step1Done
    ? { label: "Upload your CV", href: "/dashboard/resume" }
    : !step2Done
    ? { label: "Tailor your first resume", href: "/dashboard/tailor" }
    : null;

  const onboardingSteps = [
    {
      label: "Upload your CV",
      description: "Add your base resume so we can tailor it",
      done: step1Done,
      href: "/dashboard/resume",
    },
    {
      label: "Tailor to a job",
      description: "Paste a job URL and generate a custom resume",
      done: step2Done,
      href: step1Done ? "/dashboard/tailor" : null,
    },
    {
      label: "Download your documents",
      description: "Get your tailored CV and cover letter as PDFs",
      done: false,
      href: null,
      locked: !step2Done,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <Suspense fallback={null}>
        <CheckoutRedirect />
      </Suspense>

      {/* A. Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold font-outfit">
          Good {getTimeOfDay()}, {firstName} <span aria-hidden="true">👋</span>
        </h1>
        {formattedDate && (
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        )}
      </div>

      {/* B. Getting Started Banner — shown until first CV is tailored */}
      {!onboardingComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-xl border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/* Left: steps */}
                <div className="flex-1 p-5 sm:p-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Getting started · {step1Done ? (step2Done ? "3" : "2") : "1"} of 3
                  </p>
                  <ol className="flex flex-col gap-3">
                    {onboardingSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {s.done ? (
                          <CheckCircleIcon
                            size={20}
                            weight="fill"
                            className="text-foreground shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        ) : (
                          <CircleIcon
                            size={20}
                            className={`shrink-0 mt-0.5 ${s.locked ? "text-border" : "text-muted-foreground"}`}
                            aria-hidden="true"
                          />
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-sm font-medium leading-tight ${
                              s.done
                                ? "line-through text-muted-foreground"
                                : s.locked
                                ? "text-muted-foreground/50"
                                : "text-foreground"
                            }`}
                          >
                            {s.label}
                          </span>
                          {!s.done && !s.locked && (
                            <span className="text-xs text-muted-foreground">
                              {s.description}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Right: CTA */}
                {nextStep && (
                  <div className="flex items-center justify-start sm:justify-center sm:border-l border-t sm:border-t-0 border-border px-5 py-4 sm:px-6 sm:min-w-[200px]">
                    <Link
                      href={nextStep.href}
                      className="group inline-flex items-center gap-2 font-outfit font-semibold text-sm bg-foreground text-background rounded-[10px] px-5 py-2.5 transition-all duration-200 hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
                    >
                      {nextStep.label}
                      <ArrowRightIcon
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* C. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 — Total Tailored CVs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="rounded-xl border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tailored CVs
              </CardTitle>
              <StackIcon size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <motion.p
                className="text-3xl font-semibold"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {tailoredCount}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tailored resumes generated
              </p>
              {thisWeekCount > 0 && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  +{thisWeekCount} this week
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 2 — Most Recent Resume */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="rounded-xl border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Most Recent Resume
              </CardTitle>
              <ReadCvLogoIcon size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {latestCV ? (
                <>
                  <p className="text-base font-semibold leading-tight line-clamp-1">
                    {latestCV.jobTitle || "Untitled Role"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {latestCV.jobCompany && (
                      <span>{latestCV.jobCompany} · </span>
                    )}
                    {new Date(latestCV.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <Link
                    href={`/dashboard/tailored/${latestCV._id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium mt-2 hover:underline text-foreground"
                  >
                    View resume <ArrowRightIcon size={12} />
                  </Link>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No CVs yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Card 3 — Activity Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="rounded-xl border-border h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Activity
              </CardTitle>
              <CalendarIcon size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-xs text-muted-foreground mb-3">Last 30 days</p>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={chartData} margin={{ top: 2, right: 4, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    interval={6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
                    itemStyle={{ color: "hsl(var(--muted-foreground))" }}
                    formatter={(value) => [value, "CVs"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                    animationEasing="ease-in-out"
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* D. Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="group">
            <Card className="rounded-xl border-border h-full transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <action.icon size={20} className="text-foreground" />
                  </div>
                  <ArrowRightIcon
                    size={16}
                    className="text-muted-foreground transition-transform group-hover:translate-x-1"
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{action.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
