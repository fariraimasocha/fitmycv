"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TargetIcon,
  CurrencyDollarIcon,
  UsersThreeIcon,
  WarningCircleIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";

const gradeColor = (grade) => {
  if (!grade || grade === "N/A") return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  const letter = grade.charAt(0);
  if (letter === "A") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (letter === "B") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  if (letter === "C") return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
};

const globalScoreColor = (score) => {
  if (score >= 4) return "#22c55e";
  if (score >= 3) return "#3b82f6";
  if (score >= 2) return "#f59e0b";
  return "#ef4444";
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

function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 32;
  const normalized = (score / 5) * 100;
  const offset = circumference - (normalized / 100) * circumference;
  const color = globalScoreColor(score);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="-rotate-90"
        role="img"
        aria-label={`Match score: ${score} out of 5`}
      >
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/20"
        />
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" aria-hidden="true">
        <span className="text-xl font-bold leading-none tabular-nums">{score.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">/5</span>
      </div>
    </div>
  );
}

function DimensionChip({ dimKey, dimension }) {
  const meta = dimensionMeta[dimKey];
  if (!meta) return null;
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="text-xs text-muted-foreground">{meta.label}</span>
      <span
        className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${gradeColor(dimension.grade)}`}
      >
        {dimension.grade}
      </span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
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
      <Card className="rounded-2xl border shadow-lg border shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Scoring job match...</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!scoreData) return null;

  const { globalScore, globalGrade, recommendation, dimensions } = scoreData;

  return (
    <Card className="rounded-2xl border shadow-lg border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Job Match Score</span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${gradeColor(globalGrade)}`}
          >
            {globalGrade}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ScoreRing score={globalScore} />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium" style={{ color: globalScoreColor(globalScore) }}>
              {globalScoreLabel(globalScore)}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {Object.entries(dimensions).map(([key, dim]) => (
            <DimensionChip key={key} dimKey={key} dimension={dim} />
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          {expanded ? (
            <>
              Hide details <CaretUpIcon size={12} />
            </>
          ) : (
            <>
              Show details <CaretDownIcon size={12} />
            </>
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
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${gradeColor(dim.grade)}`}>
                      {dim.grade}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
