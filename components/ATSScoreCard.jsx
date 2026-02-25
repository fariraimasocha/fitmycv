"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircleIcon,
  XCircleIcon,
  LightbulbIcon,
  WarningIcon,
} from "@phosphor-icons/react";

function ScoreGauge({ score }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "#22c55e"
      : score >= 60
        ? "#f59e0b"
        : "#ef4444";

  const label =
    score >= 80
      ? "Excellent"
      : score >= 60
        ? "Good"
        : "Needs Work";

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/20"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{score}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value }) {
  const color =
    value >= 80
      ? "bg-green-500"
      : value >= 60
        ? "bg-amber-400"
        : "bg-red-400";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted/30">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function KeywordChip({ keyword, variant }) {
  const styles =
    variant === "matched"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {keyword}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export default function ATSScoreCard({ atsData, isLoading }) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Analyzing ATS Compatibility…</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!atsData) {
    return (
      <Card className="rounded-2xl border shadow-lg">
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          ATS score will appear here after tailoring your resume.
        </CardContent>
      </Card>
    );
  }

  const { score, breakdown, keywordsMatched, keywordsMissing, formattingNotes, recommendations } =
    atsData;

  return (
    <Card className="rounded-2xl border shadow-lg">
      <CardHeader>
        <CardTitle className="text-base">ATS Compatibility Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score + Breakdown */}
        <div className="flex items-start gap-6">
          <div className="relative flex shrink-0 items-center justify-center">
            <ScoreGauge score={score} />
          </div>
          <div className="flex-1 space-y-3">
            <BreakdownBar label="Keywords Match" value={breakdown.keywords} />
            <BreakdownBar label="Skills Coverage" value={breakdown.skills} />
            <BreakdownBar label="Experience Relevance" value={breakdown.experience} />
            <BreakdownBar label="Section Completeness" value={breakdown.sectionCompleteness} />
          </div>
        </div>

        {/* Keywords Matched */}
        {keywordsMatched.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircleIcon size={16} weight="fill" />
              Keywords Found ({keywordsMatched.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywordsMatched.map((kw) => (
                <KeywordChip key={kw} keyword={kw} variant="matched" />
              ))}
            </div>
          </div>
        )}

        {/* Keywords Missing */}
        {keywordsMissing.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
              <XCircleIcon size={16} weight="fill" />
              Missing Keywords ({keywordsMissing.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywordsMissing.map((kw) => (
                <KeywordChip key={kw} keyword={kw} variant="missing" />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LightbulbIcon size={16} weight="fill" className="text-amber-500" />
              Recommendations
            </div>
            <ul className="space-y-1.5">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-amber-500">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Formatting Notes */}
        {formattingNotes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-400">
              <WarningIcon size={16} weight="fill" />
              Formatting Notes
            </div>
            <ul className="space-y-1.5">
              {formattingNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-orange-500">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
