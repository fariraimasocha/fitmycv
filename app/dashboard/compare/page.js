"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  DashboardEmptyState,
} from "@/components/dashboard";
import { initials } from "@/lib/applications";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const PAGE_TITLE = "Compare Offers";
const PAGE_DESCRIPTION = "Pick 2 to 4 applications and compare them side by side.";
const MAX_SELECTED = 4;
const MIN_SELECTED = 2;

const DIMENSION_LABELS = {
  roleFit: "Role fit",
  compensation: "Compensation",
  growth: "Growth",
  culture: "Culture",
  techStack: "Tech stack",
  workLifeBalance: "Work-life balance",
  companyStage: "Company stage",
  brand: "Brand",
};

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
        "inline-flex h-6 min-w-12 items-center justify-center rounded-md px-2 text-xs font-semibold tabular-nums",
        scoreTone(score)
      )}
    >
      {score}/10
    </span>
  );
}

function OfferOption({ app, selected, disabled, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        selected
          ? "border-foreground bg-[var(--landing-primary-soft)]"
          : "border-[var(--landing-line)] bg-[var(--landing-surface)] hover:border-[#ccc5bb] hover:bg-[var(--landing-paper-soft)]",
        disabled && "cursor-not-allowed opacity-40 hover:border-[var(--landing-line)] hover:bg-[var(--landing-surface)]"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors",
          selected ? "border-foreground bg-foreground text-background" : "border-[var(--landing-line)] bg-[var(--landing-surface)]"
        )}
        aria-hidden="true"
      >
        {selected && <CheckIcon size={12} weight="bold" />}
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] font-outfit text-xs font-semibold text-foreground">
        {initials(app.jobCompany)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          {app.jobTitle || "Untitled role"}
        </span>
        <span className="block truncate text-xs text-muted-foreground">{app.jobCompany || "Company not set"}</span>
      </span>
      {app.matchGrade && (
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{app.matchGrade}</span>
      )}
    </button>
  );
}

function SelectionSkeleton() {
  return (
    <div className="dashboard-card rounded-lg dashboard-card-pad">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="tool-skeleton h-3.5 w-32 rounded-sm" />
          <div className="tool-skeleton h-3 w-20 rounded-sm" />
        </div>
        <div className="tool-skeleton h-9 w-32 rounded-md" />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="tool-skeleton h-14 rounded-md" />
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch");
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
      if (!res.ok) throw new Error("Failed to compare");
      return res.json();
    },
    onSuccess: (result) => {
      if (result.data) setComparisonResult(result.data);
      trackEvent("offers_compared", { offer_count: selectedIds.length });
      toast.success("Comparison ready");
    },
    onError: () => toast.error("Couldn't compare these offers. Try again."),
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <DashboardPageShell width="wide">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <SelectionSkeleton />
      </DashboardPageShell>
    );
  }

  const apps = applications || [];
  const selectedCount = selectedIds.length;
  const canCompare = selectedCount >= MIN_SELECTED && !compareMutation.isPending;
  const comparisons = comparisonResult?.comparisons ?? [];

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      {apps.length === 0 ? (
        <DashboardEmptyState
          icon={ScalesIcon}
          title="Your applications will appear here"
          description="Add applications to your pipeline first, then pick 2 to 4 to compare."
          actionLabel="Open applications"
          actionHref="/dashboard/applications"
        />
      ) : (
        <DashboardPanel delay={0.05}>
          <DashboardPanelHeader
            title="Select applications"
            description={`${selectedCount} of ${MAX_SELECTED} selected`}
            action={
              <button
                type="button"
                onClick={() => compareMutation.mutate()}
                disabled={!canCompare}
                className="dashboard-primary-btn dashboard-primary-btn-sm shrink-0"
              >
                {compareMutation.isPending ? (
                  <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <SparkleIcon size={16} aria-hidden="true" />
                )}
                {compareMutation.isPending ? "Comparing" : "Compare selected"}
              </button>
            }
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
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
          </div>
        </DashboardPanel>
      )}

      {comparisonResult && (
        <div className="flex flex-col gap-4">
          <DashboardPanel pad={false} delay={0.05}>
            <div className="border-b border-[var(--landing-line)] px-4 py-4 sm:px-5">
              <DashboardPanelHeader
                title="Comparison matrix"
                description="Each dimension scored out of 10"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--landing-line)]">
                    <th
                      scope="col"
                      className="sticky left-0 z-10 w-40 bg-[var(--landing-surface)] px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-5"
                    >
                      Dimension
                    </th>
                    {comparisons.map((c) => (
                      <th
                        key={c.id || c.company}
                        scope="col"
                        className="min-w-40 px-4 py-2.5 text-right align-bottom"
                      >
                        <span className="block truncate text-xs font-semibold text-foreground">
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
                  {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
                    <tr key={key} className="transition-colors hover:bg-[var(--landing-paper-soft)]">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-[var(--landing-surface)] px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:px-5"
                      >
                        {label}
                      </th>
                      {comparisons.map((c) => (
                        <td key={c.id || c.company} className="px-4 py-3 text-right align-top">
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
                            <span className="text-xs text-muted-foreground">n/a</span>
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
                      className="sticky left-0 z-10 bg-[var(--landing-paper-soft)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground sm:px-5"
                    >
                      Total
                    </th>
                    {comparisons.map((c) => (
                      <td key={c.id || c.company} className="px-4 py-3 text-right">
                        <span className="font-outfit text-lg font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground">
                          {typeof c.totalScore === "number" ? c.totalScore.toFixed(1) : "n/a"}
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
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-success-soft)] text-[var(--landing-success)]">
                    <LightbulbIcon size={16} weight="fill" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-outfit text-sm font-semibold text-foreground">Recommendation</h2>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {comparisonResult.recommendation}
                    </p>
                  </div>
                </div>
              </DashboardPanel>
            )}

            {comparisonResult.tradeoffs?.length > 0 && (
              <DashboardPanel delay={0.15}>
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
                    <ArrowsLeftRightIcon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-outfit text-sm font-semibold text-foreground">Key tradeoffs</h2>
                    <ul className="mt-1.5 flex flex-col gap-2">
                      {comparisonResult.tradeoffs.map((t, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-accent)]"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">{t}</span>
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
