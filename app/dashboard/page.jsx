"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  ReadCvLogoIcon,
  PenIcon,
  StackIcon,
  ArrowRightIcon,
  CalendarIcon,
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

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <Suspense fallback={null}>
        <CheckoutRedirect />
      </Suspense>
      {/* A. Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold font-outfit">
          Good {getTimeOfDay()}, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground" suppressHydrationWarning>{getFormattedDate()}</p>
      </div>

      {/* B. Stats Row */}
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

      {/* C. Quick Actions */}
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

      {/* D. Getting Started Checklist (only if no reference CV) */}
      {!hasReferenceCV && (
        <Card className="rounded-xl border-border bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold font-outfit">
              Getting Started
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Follow these steps to generate your first tailored CV.
            </p>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {[
                {
                  step: 1,
                  text: "Upload your reference CV",
                  href: "/dashboard/resume",
                },
                {
                  step: 2,
                  text: "Paste a job listing URL",
                  href: "/dashboard/tailor",
                },
                {
                  step: 3,
                  text: "Download your tailored CV and cover letter",
                  href: null,
                },
              ].map(({ step, text, href }) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {step}
                  </span>
                  {href ? (
                    <Link
                      href={href}
                      className="text-sm underline underline-offset-2 hover:text-foreground text-muted-foreground transition-colors"
                    >
                      {text}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">{text}</span>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
