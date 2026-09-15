"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  MagicWandIcon,
  SparkleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { CATEGORIES } from "@/lib/ats/rules";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's ATS report (report-view, score-header,
// finding-row, jd-coverage) and AI review card, on FitMyCV's colors.

const LINE = "border-[var(--landing-line)]";
const CARD = cn("rounded-md border bg-[var(--landing-surface)]", LINE);

function scoreTone(score) {
  if (score >= 80) return { text: "text-[var(--landing-success)]", bar: "bg-[var(--landing-success)]" };
  if (score >= 60) return { text: "text-amber-600", bar: "bg-amber-600" };
  return { text: "text-[var(--landing-accent)]", bar: "bg-[var(--landing-accent)]" };
}

const SEVERITY = {
  blocker: { label: "Blocker", dot: "bg-[var(--landing-accent)]", plural: ["blocker", "blockers"] },
  warning: { label: "Warning", dot: "bg-amber-500", plural: ["warning", "warnings"] },
  tip: { label: "Tip", dot: "bg-sky-600", plural: ["tip", "tips"] },
};

export const SEVERITY_ORDER = ["blocker", "warning", "tip"];

const IMPACT = {
  high: { label: "High impact", dot: "bg-[var(--landing-accent)]" },
  medium: { label: "Medium impact", dot: "bg-amber-500" },
  low: { label: "Low impact", dot: "bg-[var(--landing-success)]" },
};

export function SeverityCount({ severity, count }) {
  const { dot, plural } = SEVERITY[severity];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-2 shrink-0 rounded-full", dot)} aria-hidden="true" />
      {count} {count === 1 ? plural[0] : plural[1]}
    </span>
  );
}

/** One finding. With `onJump`, a button under it takes the user to the field. */
export function FindingRow({ finding, location, onJump }) {
  const severity = SEVERITY[finding.severity];
  return (
    <li className={cn("space-y-2 p-3", CARD)}>
      <div className="flex items-start gap-2">
        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", severity.dot)} aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm leading-snug font-medium">{finding.title}</p>
          <p className="text-xs leading-normal text-muted-foreground">{finding.action}</p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {severity.label}
        </Badge>
      </div>
      {finding.value && (
        <code className="block min-w-0 truncate rounded bg-[var(--landing-paper-strong)] px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {finding.value}
        </code>
      )}
      {location && onJump && (
        <Button type="button" size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs" onClick={onJump}>
          {location}
          <ArrowRightIcon />
        </Button>
      )}
    </li>
  );
}

function NothingHere({ children }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-md border border-dashed p-2.5", LINE)}>
      <CheckCircleIcon className="size-4 shrink-0 text-[var(--landing-success)]" />
      <span className="text-xs leading-normal text-muted-foreground">{children}</span>
    </div>
  );
}

function ScoreHeader({ report, preScore }) {
  const tone = scoreTone(report.score);
  const capCode = report.cappedBy?.[0];
  const capTitle = capCode && report.findings.find((f) => f.code === capCode)?.title;
  const delta = typeof preScore === "number" && report.score > preScore ? report.score - preScore : 0;

  return (
    <div className={cn("space-y-3 p-3", CARD)}>
      <div className="flex items-baseline gap-2">
        <AnimatedNumber value={report.score} className={cn("text-4xl leading-none font-bold tabular-nums", tone.text)} />
        <span className="text-sm text-muted-foreground">out of 100</span>
        {delta > 0 && (
          <Badge variant="secondary" className="ml-auto bg-[#eef8f1] text-[var(--landing-success)]">
            Up {delta} from {preScore}
          </Badge>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]">
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", tone.bar)}
          style={{ width: `${report.score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {report.passedChecks} of {report.totalChecks} checks passed
      </p>
      {capTitle && (
        <p className="rounded-md bg-[var(--landing-paper-soft)] p-2 text-xs leading-normal text-muted-foreground">
          The score is capped because of a blocking problem: {capTitle}
        </p>
      )}
    </div>
  );
}

function CategorySection({ category, findings }) {
  const tone = scoreTone(category.score);
  return (
    <AccordionItem value={category.key} className={LINE}>
      <AccordionTrigger className="hover:no-underline">
        <span className="flex min-w-0 flex-1 items-center gap-2 pr-2">
          <span className="min-w-0 truncate">{category.label}</span>
          <Badge variant="secondary" className="shrink-0 tabular-nums">
            <span className={tone.text}>{category.score}</span>
          </Badge>
          {findings.length > 0 && (
            <span className="shrink-0 text-xs font-normal text-muted-foreground">{findings.length} to fix</span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-3">
        <p className="text-xs leading-normal text-muted-foreground">
          {CATEGORIES[category.key]?.description}
          {typeof category.totalChecks === "number" &&
            ` ${category.passedChecks} of ${category.totalChecks} checks passed.`}
        </p>
        {findings.length === 0 ? (
          <NothingHere>Nothing to fix here.</NothingHere>
        ) : (
          <ul className="space-y-2">
            {findings.map((finding) => (
              <FindingRow key={`${finding.code}-${finding.path}`} finding={finding} />
            ))}
          </ul>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

/** Unscored advice, kept visually apart so nobody reads it as part of the number. */
function WritingSection({ tips }) {
  return (
    <AccordionItem value="content" className={LINE}>
      <AccordionTrigger className="hover:no-underline">
        <span className="flex min-w-0 flex-1 items-center gap-2 pr-2">
          <span className="min-w-0 truncate">{CATEGORIES.content.label}</span>
          <Badge variant="outline" className="shrink-0 font-normal">
            Not scored
          </Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-3">
        <p className="text-xs leading-normal text-muted-foreground">{CATEGORIES.content.description}</p>
        {tips.length === 0 ? (
          <NothingHere>Nothing to suggest.</NothingHere>
        ) : (
          <ul className="space-y-2">
            {tips.map((tip) => (
              <FindingRow key={`${tip.code}-${tip.path}`} finding={tip} />
            ))}
          </ul>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function JdCoverage({ coverage }) {
  if (coverage.total === 0) {
    return (
      <p className={cn("rounded-md border border-dashed p-3 text-xs leading-normal text-muted-foreground", LINE)}>
        No specific terms could be pulled out of that posting, so it may be mostly boilerplate.
      </p>
    );
  }

  const missing = [...new Set([...coverage.skillsMissing, ...coverage.missing])];
  const matched = [...new Set([...coverage.skillsMatched, ...coverage.matched])];

  return (
    <div className={cn("space-y-3 p-3", CARD)}>
      <div className="space-y-1">
        <p className="text-sm leading-none font-medium">
          {coverage.matchedCount} of {coverage.total} terms found
        </p>
        <p className="text-xs leading-normal text-muted-foreground">
          Counted separately from the score. Coverage doesn&apos;t predict anything.
        </p>
      </div>
      {missing.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Not in your CV</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((term) => (
              <Badge key={term} variant="outline" className="font-normal">
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {matched.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Already covered</p>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((term) => (
              <Badge key={term} variant="secondary" className="font-normal">
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {coverage.stuffed.length > 0 && (
        <p className="text-xs leading-normal text-muted-foreground">
          Repeated far more often than the posting uses them: {coverage.stuffed.join(", ")}. Heavy repetition can read
          as keyword stuffing.
        </p>
      )}
    </div>
  );
}

function FixesCard({ recommendations, onApplyFix, applyingFix, appliedFixes }) {
  return (
    <div className={cn("space-y-3 p-3", CARD)}>
      <div className="space-y-1">
        <p className="text-sm leading-none font-medium">Fixes you can apply</p>
        <p className="text-xs leading-normal text-muted-foreground">
          Each fix edits your tailored CV with AI. Check the result before you download.
        </p>
      </div>
      <ul className="space-y-2">
        {recommendations.map((rec) => {
          const applied = appliedFixes.includes(rec);
          const applying = applyingFix === rec;
          return (
            <li key={rec} className={cn("flex items-start justify-between gap-3 rounded-md border p-3 text-sm", LINE)}>
              <span className="leading-snug">{rec}</span>
              {applied ? (
                <span className="inline-flex shrink-0 items-center gap-1 py-1 text-xs font-medium text-[var(--landing-success)]">
                  <CheckCircleIcon weight="fill" aria-hidden="true" />
                  Applied
                </span>
              ) : (
                onApplyFix && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2 text-xs"
                    disabled={Boolean(applyingFix)}
                    aria-busy={applying}
                    aria-label={`Apply this fix: ${rec}`}
                    onClick={() => onApplyFix(rec)}
                  >
                    {applying ? <SpinnerGapIcon className="animate-spin" /> : <MagicWandIcon />}
                    {applying ? "Applying…" : "Apply"}
                  </Button>
                )
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AiReviewResults({ review }) {
  return (
    <div className="space-y-3">
      {review.summary && <p className="text-sm leading-normal text-muted-foreground">{review.summary}</p>}
      {review.suggestions.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">Suggestions</h5>
          <ul className="space-y-2">
            {review.suggestions.map((suggestion) => (
              <li key={`${suggestion.section ?? ""}:${suggestion.issue}`} className={cn("space-y-2 p-3", CARD)}>
                <div className="flex items-start gap-2">
                  <span
                    className={cn("mt-1.5 size-2 shrink-0 rounded-full", IMPACT[suggestion.impact].dot)}
                    aria-hidden="true"
                  />
                  <p className="min-w-0 flex-1 text-sm leading-snug">{suggestion.issue}</p>
                  <Badge variant="secondary" className="shrink-0">
                    {IMPACT[suggestion.impact].label}
                  </Badge>
                </div>
                {suggestion.section && <p className="text-xs text-muted-foreground">In {suggestion.section}</p>}
                {suggestion.rewrite && (
                  <p className="rounded bg-[var(--landing-paper-soft)] p-2 text-xs leading-normal text-muted-foreground">
                    {suggestion.rewrite}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {review.strengths.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">Strengths</h5>
          <ul className="list-outside list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {review.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </div>
      )}
      {review.jdAlignment && (
        <div className={cn("space-y-2 p-3", CARD)}>
          <h5 className="text-sm font-semibold">Against the job description</h5>
          {review.jdAlignment.verdict && (
            <p className="text-sm leading-normal text-muted-foreground">{review.jdAlignment.verdict}</p>
          )}
          {review.jdAlignment.missingConcepts.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Not shown in your CV</p>
              <div className="flex flex-wrap gap-1.5">
                {review.jdAlignment.missingConcepts.map((concept) => (
                  <Badge key={concept} variant="outline" className="font-normal">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {review.jdAlignment.strengths.length > 0 && (
            <ul className="list-outside list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {review.jdAlignment.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p className="text-xs leading-normal text-muted-foreground">
        This review is a language model&apos;s opinion of your writing. It doesn&apos;t change the score above, and it
        can be wrong. Treat it as a second opinion, not a verdict.
      </p>
    </div>
  );
}

function AiReviewCard({ cv, jobData, findings }) {
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
      if (!res.ok) {
        const failure = await res.json().catch(() => ({}));
        throw new Error(failure.error || "Couldn't review your writing. Try again.");
      }
      return (await res.json()).data;
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className={cn("space-y-3 rounded-md border p-4", LINE)}>
      <div className="flex items-center gap-2">
        <SparkleIcon className="size-4 shrink-0 text-[var(--landing-accent)]" />
        <h4 className="text-sm font-semibold">Review the writing with AI</h4>
      </div>
      <p className="text-sm leading-normal text-muted-foreground">
        The checks above are mechanical. This asks a language model what a reader would think of your bullets, and
        suggests rewrites. It produces no score.
      </p>
      <p className="text-xs leading-normal text-muted-foreground">
        {jobData
          ? "Sends your CV text and the job details to Groq, the AI provider FitMyCV uses."
          : "Sends your CV text to Groq, the AI provider FitMyCV uses."}
      </p>
      <Button size="sm" disabled={review.isPending || !cv} onClick={() => review.mutate()}>
        {review.isPending ? <SpinnerGapIcon className="animate-spin" /> : <SparkleIcon />}
        {review.isPending ? "Reviewing…" : review.data ? "Run again" : "Run AI review"}
      </Button>
      {review.data && <AiReviewResults review={review.data} />}
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
      <div className={cn("space-y-3 p-3", CARD)}>
        <p className="text-sm font-medium">Checking your CV…</p>
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!atsData) {
    return (
      <div className={cn("rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground", LINE)}>
        Your ATS check appears here after you tailor your CV.
      </div>
    );
  }

  const { findings = [], categories = [], coverage, recommendations = [] } = atsData;
  const inCategory = (key) => findings.filter((f) => f.category === key);
  const openCategories = categories.filter((c) => inCategory(c.key).length > 0).map((c) => c.key);

  return (
    <div className="space-y-4">
      <ScoreHeader report={atsData} preScore={preScore} />
      <Accordion type="multiple" defaultValue={openCategories} className={cn("rounded-md border px-3", LINE)}>
        {categories.map((category) => (
          <CategorySection key={category.key} category={category} findings={inCategory(category.key)} />
        ))}
        <WritingSection tips={inCategory("content")} />
      </Accordion>
      {coverage && <JdCoverage coverage={coverage} />}
      {recommendations.length > 0 && (
        <FixesCard
          recommendations={recommendations}
          onApplyFix={onApplyFix}
          applyingFix={applyingFix}
          appliedFixes={appliedFixes}
        />
      )}
      <AiReviewCard cv={cv} jobData={jobData} findings={findings} />
      <p className="text-xs leading-normal text-muted-foreground">
        This checks whether software can read your CV&apos;s details: contact information, sections and dates. It
        doesn&apos;t predict whether an application will be rejected, and no tool can.
      </p>
    </div>
  );
}
