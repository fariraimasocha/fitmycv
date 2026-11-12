"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ScalesIcon,
  SparkleIcon,
  SpinnerGapIcon,
  CheckIcon,
  LightbulbIcon,
  ArrowsLeftRightIcon,
} from "@phosphor-icons/react";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
  DashboardSectionTitle,
  DashboardEmptyState,
  ProGate,
} from "@/components/dashboard";
import { initials } from "@/lib/applications";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const MAX_SELECTED = 4;
const MIN_SELECTED = 2;

// Score keys returned by the API. Labels come from messages at render.
const DIMENSIONS = [
  "roleFit",
  "compensation",
  "growth",
  "culture",
  "techStack",
  "workLifeBalance",
  "companyStage",
  "brand",
];

// Score bands read from the same success and accent ramp as the rest of the
// dashboard: green for strong, ink for good, muted for middling, terracotta for weak.
function scoreTone(score) {
  if (score >= 8) return "bg-[var(--landing-success-soft)] text-[var(--landing-success)]";
  if (score >= 6) return "bg-[var(--landing-primary-soft)] text-foreground";
  if (score >= 4) return "bg-[var(--landing-paper-soft)] text-muted-foreground";
  return "bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]";
}

function ScoreChip({ score }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-12 items-center justify-center rounded-full px-2 text-xs font-semibold tabular-nums",
        scoreTone(score)
      )}
    >
      {score}/10
    </span>
  );
}

// One row of the checklist. The whole row is the hit target, the square on the
// left shows the state, and the hairline list keeps every row the same height.
function OfferOption({ app, selected, disabled, onToggle }) {
  const t = useTranslations("dashboard.compare");
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "flex min-h-16 w-full items-center gap-3 px-4 py-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 sm:px-4",
          selected ? "bg-[var(--landing-primary-soft)]" : "hover:bg-[var(--landing-paper-soft)]",
          disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
        )}
      >
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors",
            selected
              ? "border-foreground bg-foreground text-background"
              : "border-[var(--landing-ink-faint)] bg-[var(--landing-surface)]"
          )}
          aria-hidden="true"
        >
          {selected && <CheckIcon size={12} weight="bold" />}
        </span>
        <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-[var(--landing-surface)] font-outfit text-xs font-semibold text-foreground ring-1 ring-inset ring-[var(--landing-line)] sm:flex">
          {initials(app.jobCompany)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">
            {app.jobTitle || t("untitledRole")}
          </span>
          <span className="mt-1 block truncate text-xs text-muted-foreground">
            {app.jobCompany || t("companyNotSet")}
          </span>
        </span>
        {app.matchGrade && (
          <span className="inline-flex h-6 shrink-0 items-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-2 text-xs font-medium tabular-nums text-muted-foreground">
            {app.matchGrade}
          </span>
        )}
      </button>
    </li>
  );
}

function SelectionSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="tool-skeleton h-5 w-40 rounded-sm" />
      <div className="dashboard-card divide-y divide-[var(--landing-line)] overflow-hidden rounded-lg">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex min-h-16 items-center gap-3 px-4 sm:px-4">
            <div className="tool-skeleton size-5 rounded-sm" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="tool-skeleton h-3.5 w-1/3 rounded-sm" />
              <div className="tool-skeleton h-3 w-1/4 rounded-sm" />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-end px-4 py-3 sm:px-4">
          <div className="tool-skeleton h-control w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function Compare() {
  const t = useTranslations("dashboard.compare");
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error(t("loadError"));
      const json = await res.json();
      return json.data;
    },
  });

  const compareMutation = useMutation({
    mutationFn: async () => {
      const selectedOffers = (applications || []).filter((a) =>
        selectedIds.includes(a._id)
      );
      const res = await fetch("/api/compare-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offers: selectedOffers }),
      });
      if (!res.ok) throw new Error(t("compareError"));
      return res.json();
    },
    onSuccess: (result) => {
      if (result.data) setComparisonResult(result.data);
      trackEvent("offers_compared", { offer_count: selectedIds.length });
      toast.success(t("comparisonReady"));
    },
    onError: () => toast.error(t("compareToastError")),
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <DashboardPageShell>
        <DashboardPageHeader title={t("title")} description={t("description")} />
        <SelectionSkeleton />
      </DashboardPageShell>
    );
  }

  const apps = applications || [];
  const selectedCount = selectedIds.length;
  const canCompare = selectedCount >= MIN_SELECTED && !compareMutation.isPending;
  const comparisons = comparisonResult?.comparisons ?? [];

  return (
    <DashboardPageShell>
      <DashboardPageHeader title={t("title")} description={t("description")} />

      {apps.length === 0 ? (
        <DashboardEmptyState
          icon={ScalesIcon}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("emptyAction")}
          actionHref="/dashboard/applications"
        />
      ) : (
        <section className="flex flex-col gap-3">
          <DashboardSectionTitle title={t("selectTitle")} />
          <DashboardPanel pad={false} as="div" delay={0.05}>
            <ul aria-label={t("selectTitle")} className="divide-y divide-[var(--landing-line)]">
              {apps.map((app) => {
                const isSelected = selectedIds.includes(app._id);
                const disabled = !isSelected && selectedCount >= MAX_SELECTED;
                return (
                  <OfferOption
                    key={app._id}
                    app={app}
                    selected={isSelected}
                    disabled={disabled}
                    onToggle={() => !disabled && toggleSelect(app._id)}
                  />
                );
              })}
            </ul>
            {/* The one primary action sits under the list, next to the running count. */}
            <div className="flex flex-col gap-3 border-t border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
              <p aria-live="polite" className="text-sm tabular-nums text-muted-foreground">
                {t("selectedCount", { count: selectedCount, max: MAX_SELECTED })}
              </p>
              <button
                type="button"
                onClick={() => compareMutation.mutate()}
                disabled={!canCompare}
                className="dashboard-primary-btn w-full sm:w-auto"
              >
                {compareMutation.isPending ? (
                  <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <SparkleIcon size={16} aria-hidden="true" />
                )}
                {compareMutation.isPending ? t("comparing") : t("compareSelected")}
              </button>
            </div>
          </DashboardPanel>
        </section>
      )}

      {comparisonResult && (
        <div className="flex flex-col gap-4">
          <DashboardPanel pad={false} delay={0.05}>
            <div className="border-b border-[var(--landing-line)] px-4 py-4 sm:px-4">
              <DashboardPanelHeader
                title={t("matrixTitle")}
                description={t("matrixDescription")}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--landing-line)]">
                    <th
                      scope="col"
                      className="sticky start-0 z-10 w-40 bg-[var(--landing-surface)] px-4 py-3 text-start text-xs font-medium text-muted-foreground sm:px-4"
                    >
                      {t("dimension")}
                    </th>
                    {comparisons.map((c) => (
                      <th
                        key={c.id || c.company}
                        scope="col"
                        className="min-w-40 px-4 py-3 text-end align-bottom"
                      >
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {c.company}
                        </span>
                        <span className="block truncate text-xs font-normal text-muted-foreground">
                          {c.jobTitle}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--landing-line)]">
                  {DIMENSIONS.map((key) => (
                    <tr key={key} className="transition-colors hover:bg-[var(--landing-paper-soft)]">
                      <th
                        scope="row"
                        className="sticky start-0 z-10 bg-[var(--landing-surface)] px-4 py-3 text-start text-sm font-medium text-foreground sm:px-4"
                      >
                        {t(`dimensions.${key}`)}
                      </th>
                      {comparisons.map((c) => (
                        <td key={c.id || c.company} className="px-4 py-3 text-end align-top">
                          {c.scores?.[key] ? (
                            <div className="flex flex-col items-end gap-1">
                              <ScoreChip score={c.scores[key].score} />
                              {c.scores[key].note && (
                                <p className="max-w-56 text-xs leading-5 text-muted-foreground">
                                  {c.scores[key].note}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">{t("notAvailable")}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
                    <th
                      scope="row"
                      className="sticky start-0 z-10 bg-[var(--landing-paper-soft)] px-4 py-3 text-start text-sm font-semibold text-foreground sm:px-4"
                    >
                      {t("total")}
                    </th>
                    {comparisons.map((c) => (
                      <td key={c.id || c.company} className="px-4 py-3 text-end">
                        <span className="font-outfit text-base font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground">
                          {typeof c.totalScore === "number" ? c.totalScore.toFixed(1) : t("notAvailable")}
                        </span>
                        {typeof c.totalScore === "number" && (
                          <span className="text-xs text-muted-foreground">/10</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </DashboardPanel>

          <div className="grid items-start gap-4 lg:grid-cols-2">
            {comparisonResult.recommendation && (
              <DashboardPanel delay={0.1}>
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--landing-success-soft)] text-[var(--landing-success)]">
                    <LightbulbIcon size={16} weight="fill" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-outfit text-sm font-semibold text-foreground">{t("recommendation")}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {comparisonResult.recommendation}
                    </p>
                  </div>
                </div>
              </DashboardPanel>
            )}

            {comparisonResult.tradeoffs?.length > 0 && (
              <DashboardPanel delay={0.15}>
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--landing-primary-soft)] text-foreground">
                    <ArrowsLeftRightIcon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-outfit text-sm font-semibold text-foreground">{t("keyTradeoffs")}</h2>
                    <ul className="mt-2 flex flex-col gap-2">
                      {comparisonResult.tradeoffs.map((tradeoff, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                          <span
                            className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-accent)]"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">{tradeoff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </DashboardPanel>
            )}
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

export default function ComparePage() {
  return (
    <ProGate feature="compare" namespace="dashboard.compare">
      <Compare />
    </ProGate>
  );
}
