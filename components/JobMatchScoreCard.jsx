"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradeBadge, gradeChipClass } from "@/components/GradeBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TargetIcon,
  CurrencyDollarIcon,
  UsersThreeIcon,
  WarningCircleIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { ArcGauge } from "@/components/charts/ArcGauge";
import { PillTrack } from "@/components/charts/PillTrack";

const GRADE_PERCENT = {
  "A+": 100,
  A: 92,
  "B+": 84,
  B: 76,
  "C+": 68,
  C: 58,
  D: 42,
  F: 20,
};

const globalScoreColor = (score) => {
  if (score >= 4) return "var(--landing-success)";
  if (score >= 3) return "var(--landing-ink)";
  if (score >= 2) return "var(--landing-ink-soft)";
  return "var(--landing-accent)";
};

const globalScoreLabel = (score) => {
  if (score >= 4.5) return "Excellent Match";
  if (score >= 4) return "Strong Match";
  if (score >= 3) return "Good Match";
  if (score >= 2) return "Fair Match";
  return "Weak Match";
};

const dimensionMeta = {
  cvMatch: { label: "CV Match", icon: TargetIcon },
  compensation: { label: "Compensation", icon: CurrencyDollarIcon },
  cultureSignals: { label: "Culture", icon: UsersThreeIcon },
  redFlags: { label: "Red Flags", icon: WarningCircleIcon },
};

function gradeToPercent(grade) {
  if (!grade || grade === "N/A") return null;
  return GRADE_PERCENT[grade] ?? GRADE_PERCENT[grade.charAt(0)] ?? null;
}

function DimensionRow({ dimKey, dimension }) {
  const meta = dimensionMeta[dimKey];
  if (!meta) return null;
  const Icon = meta.icon;
  const percent = gradeToPercent(dimension.grade);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Icon size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">{meta.label}</span>
        <span
          className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${gradeChipClass(dimension.grade)}`}
        >
          {dimension.grade}
        </span>
      </div>
      {percent !== null && (
        <PillTrack value={percent} color={globalScoreColor(percent / 20)} />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Skeleton className="h-8 w-full rounded-full" />
        <Skeleton className="h-8 w-full rounded-full" />
        <Skeleton className="h-8 w-full rounded-full" />
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function JobMatchScoreCard({ scoreData, isLoading }) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
        <CardHeader className="px-4 py-4 sm:px-6">
          <CardTitle className="text-base font-semibold">Scoring job match…</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!scoreData) return null;

  const { globalScore, globalGrade, recommendation, dimensions = {} } = scoreData;
  const color = globalScoreColor(globalScore);
  const label = globalScoreLabel(globalScore);

  return (
    <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
      <CardHeader className="px-4 py-4 pb-3 sm:px-6">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <span>Job match</span>
          <GradeBadge grade={globalGrade} size="md" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <ArcGauge
            value={globalScore}
            max={5}
            size={80}
            strokeWidth={6}
            color={color}
            label={`Match score: ${globalScore} out of 5`}
          >
            <AnimatedNumber
              value={globalScore}
              decimals={1}
              className="text-center text-xl font-bold leading-none text-foreground"
            />
            <span className="text-xs text-muted-foreground">/5</span>
          </ArcGauge>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium" style={{ color }}>
              {label}
            </p>
            <p className="text-sm leading-7 text-[var(--landing-ink-soft)]">
              {recommendation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          {Object.entries(dimensions).map(([key, dim]) => (
            <DimensionRow key={key} dimKey={key} dimension={dim} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1 pt-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="relative inline-grid">
            <span className="invisible col-start-1 row-start-1">Show details</span>
            <span className="col-start-1 row-start-1">
              {expanded ? "Hide details" : "Show details"}
            </span>
          </span>
          {expanded ? (
            <CaretUpIcon size={12} aria-hidden="true" />
          ) : (
            <CaretDownIcon size={12} aria-hidden="true" />
          )}
        </button>

        {expanded && (
          <div className="space-y-3 pt-1">
            {Object.entries(dimensions).map(([key, dim]) => {
              const meta = dimensionMeta[key];
              if (!meta) return null;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{meta.label}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${gradeChipClass(dim.grade)}`}>
                      {dim.grade}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {dim.reasoning}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
