"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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

// Labels live in messages under tailor.ats.severity.<key>.
const SEVERITY = {
  blocker: { dot: "bg-[var(--landing-accent)]" },
  warning: { dot: "bg-amber-500" },
  tip: { dot: "bg-sky-600" },
};

export const SEVERITY_ORDER = ["blocker", "warning", "tip"];

const IMPACT = {
  high: { dot: "bg-[var(--landing-accent)]" },
  medium: { dot: "bg-amber-500" },
  low: { dot: "bg-[var(--landing-success)]" },
};

// Finding copy comes from lib/ats/rules in English. Known codes have a
// translation; anything new falls back to the rule's own text.
function findingText(t, finding, field) {
  const key = `findings.${finding.code}.${field}`;
  return t.has(key) ? t(key) : finding[field];
}

function categoryText(t, key, field, fallback) {
  const path = `categories.${key}.${field}`;
  return t.has(path) ? t(path) : fallback;
}

export function SeverityCount({ severity, count }) {
  const t = useTranslations("tailor.ats");
  const { dot } = SEVERITY[severity];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-2 shrink-0 rounded-full", dot)} aria-hidden="true" />
      {t(`severity.${severity}.count`, { count })}
    </span>
  );
}

/** One finding. With `onJump`, a button under it takes the user to the field. */
export function FindingRow({ finding, location, onJump }) {
  const t = useTranslations("tailor.ats");
  const severity = SEVERITY[finding.severity];
  return (
    <li className={cn("space-y-2 p-3", CARD)}>
      <div className="flex items-start gap-2">
        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", severity.dot)} aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm leading-snug font-medium">{findingText(t, finding, "title")}</p>
          <p className="text-xs leading-normal text-muted-foreground">{findingText(t, finding, "action")}</p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {t(`severity.${finding.severity}.label`)}
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
  const t = useTranslations("tailor.ats");
  const tone = scoreTone(report.score);
  const capCode = report.cappedBy?.[0];
  const capFinding = capCode && report.findings.find((f) => f.code === capCode);
  const capTitle = capFinding?.title && findingText(t, capFinding, "title");
  const delta = typeof preScore === "number" && report.score > preScore ? report.score - preScore : 0;

  return (
    <div className={cn("space-y-3 p-3", CARD)}>
      <div className="flex items-baseline gap-2">
        <AnimatedNumber value={report.score} className={cn("text-4xl leading-none font-bold tabular-nums", tone.text)} />
        <span className="text-sm text-muted-foreground">{t("outOf100")}</span>
        {delta > 0 && (
          <Badge variant="secondary" className="ml-auto bg-[#eef8f1] text-[var(--landing-success)]">
            {t("upFrom", { delta, preScore })}
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
        {t("checksPassed", { passed: report.passedChecks, total: report.totalChecks })}
      </p>
      {capTitle && (
        <p className="rounded-md bg-[var(--landing-paper-soft)] p-2 text-xs leading-normal text-muted-foreground">
          {t("capped", { title: capTitle })}
        </p>
      )}
    </div>
  );
}

function CategorySection({ category, findings }) {
  const t = useTranslations("tailor.ats");
  const tone = scoreTone(category.score);
  return (
    <AccordionItem value={category.key} className={LINE}>
      <AccordionTrigger className="hover:no-underline">
        <span className="flex min-w-0 flex-1 items-center gap-2 pr-2">
          <span className="min-w-0 truncate">{categoryText(t, category.key, "label", category.label)}</span>
          <Badge variant="secondary" className="shrink-0 tabular-nums">
            <span className={tone.text}>{category.score}</span>
          </Badge>
          {findings.length > 0 && (
            <span className="shrink-0 text-xs font-normal text-muted-foreground">{t("toFix", { count: findings.length })}</span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-3">
        <p className="text-xs leading-normal text-muted-foreground">
          {categoryText(t, category.key, "description", CATEGORIES[category.key]?.description)}
          {typeof category.totalChecks === "number" &&
            ` ${t("checksPassedSentence", { passed: category.passedChecks, total: category.totalChecks })}`}
        </p>
        {findings.length === 0 ? (
          <NothingHere>{t("nothingToFix")}</NothingHere>
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
  const t = useTranslations("tailor.ats");
  return (
    <AccordionItem value="content" className={LINE}>
      <AccordionTrigger className="hover:no-underline">
        <span className="flex min-w-0 flex-1 items-center gap-2 pr-2">
          <span className="min-w-0 truncate">{categoryText(t, "content", "label", CATEGORIES.content.label)}</span>
          <Badge variant="outline" className="shrink-0 font-normal">
            {t("notScored")}
          </Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-3">
        <p className="text-xs leading-normal text-muted-foreground">{categoryText(t, "content", "description", CATEGORIES.content.description)}</p>
        {tips.length === 0 ? (
          <NothingHere>{t("nothingToSuggest")}</NothingHere>
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
  const t = useTranslations("tailor.ats");
  if (coverage.total === 0) {
    return (
      <p className={cn("rounded-md border border-dashed p-3 text-xs leading-normal text-muted-foreground", LINE)}>
        {t("coverage.empty")}
      </p>
    );
  }

  const missing = [...new Set([...coverage.skillsMissing, ...coverage.missing])];
  const matched = [...new Set([...coverage.skillsMatched, ...coverage.matched])];

  return (
    <div className={cn("space-y-3 p-3", CARD)}>
      <div className="space-y-1">
        <p className="text-sm leading-none font-medium">
          {t("coverage.found", { matched: coverage.matchedCount, total: coverage.total })}
        </p>
        <p className="text-xs leading-normal text-muted-foreground">
          {t("coverage.note")}
        </p>
      </div>
      {missing.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">{t("coverage.missing")}</p>
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
          <p className="text-xs font-medium text-muted-foreground">{t("coverage.matched")}</p>
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
          {t("coverage.stuffed", { terms: coverage.stuffed.join(", ") })}
        </p>
      )}
    </div>
  );
}

function FixesCard({ recommendations, onApplyFix, applyingFix, appliedFixes }) {
  const t = useTranslations("tailor.ats");
  return (
    <div className={cn("space-y-3 p-3", CARD)}>
      <div className="space-y-1">
        <p className="text-sm leading-none font-medium">{t("fixes.title")}</p>
        <p className="text-xs leading-normal text-muted-foreground">
          {t("fixes.description")}
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
                  {t("fixes.applied")}
                </span>
              ) : (
                onApplyFix && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2 text-xs"
                    disabled={Boolean(applyingFix)}
                    aria-busy={applying}
                    aria-label={t("fixes.applyAria", { fix: rec })}
                    onClick={() => onApplyFix(rec)}
                  >
                    {applying ? <SpinnerGapIcon className="animate-spin" /> : <MagicWandIcon />}
                    {applying ? t("fixes.applying") : t("fixes.apply")}
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
  const t = useTranslations("tailor.ats");
  return (
    <div className="space-y-3">
      {review.summary && <p className="text-sm leading-normal text-muted-foreground">{review.summary}</p>}
      {review.suggestions.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-semibold">{t("review.suggestions")}</h5>
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
                    {t(`impact.${suggestion.impact}`)}
                  </Badge>
                </div>
                {suggestion.section && <p className="text-xs text-muted-foreground">{t("review.inSection", { section: suggestion.section })}</p>}
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
          <h5 className="text-sm font-semibold">{t("review.strengths")}</h5>
          <ul className="list-outside list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {review.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </div>
      )}
      {review.jdAlignment && (
        <div className={cn("space-y-2 p-3", CARD)}>
          <h5 className="text-sm font-semibold">{t("review.againstJob")}</h5>
          {review.jdAlignment.verdict && (
            <p className="text-sm leading-normal text-muted-foreground">{review.jdAlignment.verdict}</p>
          )}
          {review.jdAlignment.missingConcepts.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{t("review.notShown")}</p>
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
        {t("review.disclaimer")}
      </p>
    </div>
  );
}

function AiReviewCard({ cv, jobData, findings }) {
  const t = useTranslations("tailor.ats");
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
        throw new Error(failure.error || t("review.error"));
      }
      return (await res.json()).data;
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className={cn("space-y-3 rounded-md border p-4", LINE)}>
      <div className="flex items-center gap-2">
        <SparkleIcon className="size-4 shrink-0 text-[var(--landing-accent)]" />
        <h4 className="text-sm font-semibold">{t("review.title")}</h4>
      </div>
      <p className="text-sm leading-normal text-muted-foreground">
        {t("review.description")}
      </p>
      <p className="text-xs leading-normal text-muted-foreground">
        {jobData
          ? t("review.sendsWithJob")
          : t("review.sends")}
      </p>
      <Button size="sm" disabled={review.isPending || !cv} onClick={() => review.mutate()}>
        {review.isPending ? <SpinnerGapIcon className="animate-spin" /> : <SparkleIcon />}
        {review.isPending ? t("review.reviewing") : review.data ? t("review.runAgain") : t("review.run")}
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
  const t = useTranslations("tailor.ats");
  if (isLoading) {
    return (
      <div className={cn("space-y-3 p-3", CARD)}>
        <p className="text-sm font-medium">{t("checking")}</p>
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-1.5 w-full rounded-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!atsData) {
    return (
      <div className={cn("rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground", LINE)}>
        {t("empty")}
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
        {t("footer")}
      </p>
    </div>
  );
}
