"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircleIcon,
  XCircleIcon,
  LightbulbIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { ArcGauge } from "@/components/charts/ArcGauge";
import { PillTrack } from "@/components/charts/PillTrack";

function scoreColor(score) {
  if (score >= 80) return "var(--landing-success)";
  if (score >= 60) return "var(--landing-ink)";
  return "var(--landing-accent)";
}

function scoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs Work";
}

function BreakdownRow({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <PillTrack value={value} color={scoreColor(value)} />
    </div>
  );
}

function KeywordChip({ keyword, variant }) {
  const styles =
    variant === "matched"
      ? "border border-[#c8e6d4] bg-[#eef8f1] text-[var(--landing-success)]"
      : "border border-[#f0d4cc] bg-[#fdf3ef] text-[var(--landing-accent)]";

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
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
        <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
        <div className="w-full flex-1 space-y-3">
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ATSScoreCard({ atsData, isLoading, preScore }) {
  if (isLoading) {
    return (
      <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
        <CardHeader className="dashboard-card-pad">
          <CardTitle className="text-base">Analyzing ATS Compatibility…</CardTitle>
        </CardHeader>
        <CardContent className="dashboard-card-pad pt-0">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!atsData) {
    return (
      <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          ATS score will appear here after tailoring your CV.
        </CardContent>
      </Card>
    );
  }

  const {
    score,
    breakdown = {},
    keywordsMatched = [],
    keywordsMissing = [],
    formattingNotes = [],
    recommendations = [],
  } = atsData;
  const label = scoreLabel(score);
  const color = scoreColor(score);
  const delta =
    typeof preScore === "number" && score > preScore ? score - preScore : 0;

  return (
    <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
      <CardHeader className="dashboard-card-pad">
        <CardTitle className="text-base">ATS Compatibility Score</CardTitle>
      </CardHeader>
      <CardContent className="dashboard-card-pad space-y-6 pt-0">
        {delta > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-[#eef8f1] px-3 py-2 text-sm">
            <span className="font-medium text-[var(--landing-success)]">
              Score improved {preScore} to {score}
            </span>
            <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-[#c8e6d4] px-2 py-0.5 text-xs font-bold text-[var(--landing-success)]">
              +
              <AnimatedNumber value={delta} minDigits={2} />
            </span>
          </div>
        )}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
          <ArcGauge
            value={score}
            max={100}
            size={96}
            color={color}
            label={`ATS Score: ${score} out of 100, ${label}`}
          >
            <AnimatedNumber
              value={score}
              className="text-center text-2xl font-bold leading-none text-foreground"
            />
            <span className="mt-0.5 text-xs text-muted-foreground">{label}</span>
          </ArcGauge>
          <div className="w-full flex-1 space-y-3">
            <BreakdownRow label="Keywords Match" value={breakdown.keywords ?? 0} />
            <BreakdownRow label="Skills Coverage" value={breakdown.skills ?? 0} />
            <BreakdownRow label="Experience Relevance" value={breakdown.experience ?? 0} />
            <BreakdownRow label="Section Completeness" value={breakdown.sectionCompleteness ?? 0} />
          </div>
        </div>

        {keywordsMatched.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--landing-success)]">
              <CheckCircleIcon size={16} weight="fill" aria-hidden="true" />
              Keywords found
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywordsMatched.map((kw) => (
                <KeywordChip key={kw} keyword={kw} variant="matched" />
              ))}
            </div>
          </div>
        )}

        {keywordsMissing.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--landing-accent)]">
              <XCircleIcon size={16} weight="fill" aria-hidden="true" />
              Missing keywords
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywordsMissing.map((kw) => (
                <KeywordChip key={kw} keyword={kw} variant="missing" />
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LightbulbIcon size={16} weight="fill" className="text-[var(--landing-ink)]" aria-hidden="true" />
              Recommendations
            </div>
            <ul className="space-y-1.5">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  <span className="mt-0.5 shrink-0 text-[var(--landing-ink-soft)]">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {formattingNotes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--landing-ink)]">
              <WarningIcon size={16} weight="fill" aria-hidden="true" />
              Formatting Notes
            </div>
            <ul className="space-y-1.5">
              {formattingNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  <span className="mt-0.5 shrink-0 text-[var(--landing-ink-soft)]">•</span>
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
