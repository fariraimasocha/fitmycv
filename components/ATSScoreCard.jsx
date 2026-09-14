"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircleIcon,
  XCircleIcon,
  LightbulbIcon,
  SpinnerGapIcon,
  MagicWandIcon,
  SparkleIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { ArcGauge } from "@/components/charts/ArcGauge";
import { PillTrack } from "@/components/charts/PillTrack";
import { CATEGORIES } from "@/lib/ats/rules";
import { cn } from "@/lib/utils";

function scoreColor(score) {
  if (score >= 80) return "var(--landing-success)";
  if (score >= 60) return "var(--landing-ink)";
  return "var(--landing-accent)";
}

function scoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs work";
}

const SEVERITY = {
  blocker: {
    label: "Blocker",
    className: "border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]",
  },
  warning: {
    label: "Warning",
    className: "border-[var(--landing-line)] bg-[var(--landing-paper-strong)] text-[var(--landing-ink)]",
  },
  tip: {
    label: "Tip",
    className: "border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]",
  },
};

const IMPACT_LABEL = { high: "High impact", medium: "Medium impact", low: "Low impact" };

/** Rule findings as a list. With `onSelect`, each row is a button that jumps to the field. */
export function FindingList({ findings, onSelect }) {
  if (!findings.length) return null;

  return (
    <ul className="space-y-1">
      {findings.map((finding, i) => {
        const severity = SEVERITY[finding.severity];
        const body = (
          <>
            <span className={cn("mt-0.5 shrink-0 rounded border px-1.5 py-0.5 text-xs font-semibold", severity.className)}>
              {severity.label}
            </span>
            <span className="min-w-0">
              <span className="font-medium text-foreground">{finding.title}</span>
              {finding.value && <span className="text-foreground"> “{finding.value}”</span>}{" "}
              <span className="text-muted-foreground">{finding.action}</span>
            </span>
          </>
        );

        return (
          <li key={`${finding.code}-${finding.path}-${i}`}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(finding.path)}
                className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-[var(--landing-paper-soft)] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                {body}
              </button>
            ) : (
              <div className="flex items-start gap-3 px-2 py-2 text-sm">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}</span>
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {keyword}
    </span>
  );
}

function FixItem({ text, onApply, isApplying, isApplied, disabled }) {
  return (
    <li className="flex items-start justify-between gap-3 text-sm leading-6 text-[var(--landing-ink-soft)]">
      <span className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 text-[var(--landing-ink-soft)]">•</span>
        {text}
      </span>
      {onApply &&
        (isApplied ? (
          <span className="inline-flex shrink-0 items-center gap-1 py-1 text-xs font-medium text-[var(--landing-success)]">
            <CheckCircleIcon size={14} weight="fill" aria-hidden="true" />
            Applied
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-7 shrink-0 rounded-md border-[var(--landing-line)] px-2 text-xs"
            onClick={() => onApply(text)}
            disabled={disabled || isApplying}
            aria-busy={isApplying}
            aria-label={`Apply this fix: ${text}`}
          >
            {isApplying ? (
              <>
                <SpinnerGapIcon size={12} className="animate-spin" aria-hidden="true" />
                Applying…
              </>
            ) : (
              <>
                <MagicWandIcon size={12} aria-hidden="true" />
                Apply
              </>
            )}
          </Button>
        ))}
    </li>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
      <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
      <div className="w-full flex-1 space-y-3">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

function WritingReview({ cv, jobData, findings }) {
  const review = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ats-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv,
          jobData,
          findings: findings.map((f) => ({ code: f.code, severity: f.severity, message: f.title })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error || "Couldn't review your writing. Try again.");
      return json.data;
    },
    onError: (error) => toast.error(error.message),
  });

  const data = review.data;

  return (
    <div className="space-y-3 border-t border-[var(--landing-line)] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Writing review</p>
          <p className="text-xs text-muted-foreground">AI comments on your wording. It never changes the score.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-md border-[var(--landing-line)]"
          onClick={() => review.mutate()}
          disabled={review.isPending || !cv}
          aria-busy={review.isPending}
        >
          {review.isPending ? (
            <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <SparkleIcon size={14} aria-hidden="true" />
          )}
          {review.isPending ? "Reviewing…" : data ? "Review again" : "Review my writing"}
        </Button>
      </div>

      {data && (
        <div className="space-y-4 text-sm">
          {data.summary && <p className="leading-6 text-[var(--landing-ink-soft)]">{data.summary}</p>}

          {data.suggestions.length > 0 && (
            <ul className="space-y-3">
              {data.suggestions.map((s, i) => (
                <li key={i} className="space-y-1.5 rounded-md border border-[var(--landing-line)] p-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-[var(--landing-ink)]">{IMPACT_LABEL[s.impact]}</span>
                    {s.section && <span>{s.section}</span>}
                  </div>
                  <p className="text-foreground">{s.issue}</p>
                  {s.rewrite && (
                    <p className="border-l-2 border-[var(--landing-accent-line)] pl-3 text-[var(--landing-ink-soft)]">
                      {s.rewrite}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {data.strengths.length > 0 && (
            <div className="space-y-1.5">
              <p className="font-medium text-[var(--landing-success)]">What already works</p>
              <ul className="list-disc space-y-1 pl-5 text-[var(--landing-ink-soft)]">
                {data.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {data.jdAlignment && (
            <div className="space-y-2">
              <p className="font-medium">Fit with this role</p>
              {data.jdAlignment.verdict && (
                <p className="leading-6 text-[var(--landing-ink-soft)]">{data.jdAlignment.verdict}</p>
              )}
              {data.jdAlignment.missingConcepts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {data.jdAlignment.missingConcepts.map((c) => (
                    <KeywordChip key={c} keyword={c} variant="missing" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ATSScoreCard({
  atsData,
  isLoading,
  preScore,
  cv,
  jobData,
  onApplyFix,
  applyingFix = null,
  appliedFixes = [],
}) {
  if (isLoading) {
    return (
      <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
        <CardHeader className="dashboard-card-pad">
          <CardTitle className="text-base">Checking your CV…</CardTitle>
        </CardHeader>
        <CardContent className="dashboard-card-pad pt-0">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!atsData) {
    return (
      <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Your ATS check appears here after you tailor your CV.
        </CardContent>
      </Card>
    );
  }

  const {
    score,
    categories = [],
    cappedBy = [],
    passedChecks,
    totalChecks,
    findings = [],
    coverage,
    recommendations = [],
  } = atsData;
  const label = scoreLabel(score);
  const color = scoreColor(score);
  const delta = typeof preScore === "number" && score > preScore ? score - preScore : 0;
  const missingKeywords = coverage ? [...new Set([...coverage.skillsMissing, ...coverage.missing])] : [];
  const matchedKeywords = coverage ? [...new Set([...coverage.skillsMatched, ...coverage.matched])] : [];

  return (
    <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
      <CardHeader className="dashboard-card-pad">
        <CardTitle className="text-base">ATS check</CardTitle>
        <p className="text-sm text-muted-foreground">
          Scored by fixed rules on contact details, sections and dates. Keywords are counted separately.
        </p>
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
          <ArcGauge value={score} max={100} size={96} color={color} label={`ATS score: ${score} out of 100, ${label}`}>
            <AnimatedNumber value={score} className="text-center text-2xl font-bold leading-none text-foreground" />
            <span className="mt-0.5 text-xs text-muted-foreground">{label}</span>
          </ArcGauge>
          <div className="w-full flex-1 space-y-3">
            {categories.map((c) => (
              <BreakdownRow key={c.key} label={c.label} value={c.score} />
            ))}
            <p className="text-xs text-muted-foreground tabular-nums">
              {passedChecks} of {totalChecks} checks passed
            </p>
          </div>
        </div>

        {cappedBy.length > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] px-3 py-2 text-sm text-[var(--landing-accent-dark)]">
            <WarningIcon size={16} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
            Your score is held at {score} until the blockers below are fixed.
          </div>
        )}

        {Object.entries(CATEGORIES).map(([key, { label: categoryLabel }]) => {
          const items = findings.filter((f) => f.category === key);
          if (!items.length) return null;
          return (
            <div key={key} className="space-y-1">
              <p className="text-sm font-medium">{categoryLabel}</p>
              <FindingList findings={items} />
            </div>
          );
        })}

        {coverage && coverage.total > 0 && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">Posting keywords</span>
              <span className="tabular-nums text-muted-foreground">
                {coverage.matchedCount} of {coverage.total} terms found
              </span>
            </div>
            {matchedKeywords.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--landing-success)]">
                  <CheckCircleIcon size={16} weight="fill" aria-hidden="true" />
                  Found in your CV
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchedKeywords.map((kw) => (
                    <KeywordChip key={kw} keyword={kw} variant="matched" />
                  ))}
                </div>
              </div>
            )}
            {missingKeywords.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--landing-accent)]">
                  <XCircleIcon size={16} weight="fill" aria-hidden="true" />
                  Not in your CV
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw) => (
                    <KeywordChip key={kw} keyword={kw} variant="missing" />
                  ))}
                </div>
              </div>
            )}
            {coverage.stuffed.length > 0 && (
              <p className="text-sm text-[var(--landing-ink-soft)]">
                These terms repeat far more often than the posting uses them: {coverage.stuffed.join(", ")}. Heavy
                repetition can read as keyword stuffing.
              </p>
            )}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LightbulbIcon size={16} weight="fill" className="text-[var(--landing-ink)]" aria-hidden="true" />
              Recommendations
            </div>
            <ul className="space-y-1.5">
              {recommendations.map((rec) => (
                <FixItem
                  key={rec}
                  text={rec}
                  onApply={onApplyFix}
                  isApplying={applyingFix === rec}
                  isApplied={appliedFixes.includes(rec)}
                  disabled={Boolean(applyingFix)}
                />
              ))}
            </ul>
          </div>
        )}

        <WritingReview cv={cv} jobData={jobData} findings={findings} />
      </CardContent>
    </Card>
  );
}
