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
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
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
      router.replace("/api/polar/checkout");
    }
  }, [searchParams, router]);
  return null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [formattedDate] = useState(() => getFormattedDate());
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
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <Suspense fallback={null}>
        <CheckoutRedirect />
      </Suspense>

      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold font-outfit">
          Good {getTimeOfDay()}, {firstName} <span aria-hidden="true">👋</span>
        </h1>
        {formattedDate && (
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: card.delay }}
          >
            <Card className="rounded-xl border-border h-full">
              <CardHeader className="flex flex-row items-center justify-between px-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon size={18} className="text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pt-0">
                <motion.p
                  className="text-2xl font-semibold"
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: card.delay + 0.1 }}
                >
                  {card.value}
                </motion.p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity Graph */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="rounded-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activity
            </CardTitle>
            <TrendUpIcon size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-xs text-muted-foreground mb-4">Last 30 days</p>
            <ResponsiveContainer width="100%" height={300}>
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
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
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
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: 500,
                  }}
                  itemStyle={{ color: "hsl(var(--muted-foreground))" }}
                  formatter={(value) => [value, "CVs"]}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--foreground))"
                  radius={[3, 3, 0, 0]}
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
    </div>
  );
}
