"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  ScalesIcon,
  SparkleIcon,
  SpinnerGapIcon,
  CheckSquareIcon,
  SquareIcon,
  LightbulbIcon,
  ArrowsLeftRightIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
} from "@/components/dashboard";

const DIMENSION_LABELS = {
  roleFit: "Role Fit",
  compensation: "Compensation",
  growth: "Growth",
  culture: "Culture",
  techStack: "Tech Stack",
  workLifeBalance: "Work-Life Balance",
  companyStage: "Company Stage",
  brand: "Brand",
};

function ScoreCell({ score }) {
  const color =
    score >= 8
      ? "border border-[#c8e6d4] bg-[#eef8f1] text-[var(--landing-success)]"
      : score >= 6
        ? "border border-[var(--landing-line)] bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]"
        : score >= 4
          ? "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]"
          : "border border-[#f0d4cc] bg-[#fdf3ef] text-[var(--landing-accent)]";

  return (
    <span className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-bold tabular-nums ${color}`}>
      {score}/10
    </span>
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
      toast.success("Comparison ready!");
    },
    onError: () => toast.error("Failed to compare offers"),
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isLoading) return <Loader />;

  const apps = applications || [];

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title="Compare Offers"
        description="Select 2–4 applications to compare side by side."
      />

      <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
        <CardHeader className="border-b border-border/60 px-4 pb-3 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="flex items-center gap-2 text-base">
            <ScalesIcon size={16} aria-hidden="true" />
            Select Applications ({selectedIds.length}/4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4 py-4 sm:px-6">
          {apps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet. Tailor some resumes first.
            </p>
          ) : (
            apps.map((app) => {
              const isSelected = selectedIds.includes(app._id);
              const disabled = !isSelected && selectedIds.length >= 4;
              return (
                <button
                  key={app._id}
                  onClick={() => !disabled && toggleSelect(app._id)}
                  disabled={disabled}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-[var(--landing-ink)] bg-[var(--landing-primary-soft)]"
                      : "border-border/60 hover:bg-muted/30"
                  } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {isSelected ? (
                    <CheckSquareIcon size={18} className="shrink-0 text-[var(--landing-ink)]" weight="fill" />
                  ) : (
                    <SquareIcon size={18} className="shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{app.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{app.jobCompany}</p>
                  </div>
                  {app.matchGrade && (
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      {app.matchGrade}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </CardContent>
        <CardFooter className="flex w-full flex-col items-stretch border-t border-border/60 px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
          <Button
            onClick={() => compareMutation.mutate()}
            disabled={selectedIds.length < 2 || compareMutation.isPending}
            className="w-full rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90"
          >
            {compareMutation.isPending ? (
              <>
                <SpinnerGapIcon size={16} className="animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <SparkleIcon size={16} />
                Compare Selected ({selectedIds.length})
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Results */}
      {comparisonResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Comparison Table */}
          <Card className="dashboard-card overflow-hidden rounded-2xl border-border">
            <CardHeader>
              <CardTitle className="text-base">Comparison Matrix</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        Dimension
                      </th>
                      {comparisonResult.comparisons.map((c) => (
                        <th
                          key={c.id || c.company}
                          className="px-4 py-2 text-center text-xs font-medium"
                        >
                          <div>{c.company}</div>
                          <div className="text-muted-foreground font-normal">{c.jobTitle}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
                      <tr key={key} className="border-b last:border-0">
                        <td className="px-4 py-2 text-xs font-medium text-muted-foreground">
                          {label}
                        </td>
                        {comparisonResult.comparisons.map((c) => (
                          <td key={c.id || c.company} className="px-4 py-2 text-center">
                            {c.scores?.[key] ? (
                              <div className="space-y-0.5">
                                <ScoreCell score={c.scores[key].score} />
                                <p className="text-xs text-muted-foreground">
                                  {c.scores[key].note}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t-2 bg-muted/20">
                      <td className="px-4 py-2 text-xs font-bold">Total</td>
                      {comparisonResult.comparisons.map((c) => (
                        <td key={c.id || c.company} className="px-4 py-2 text-center">
                          <span className="text-lg font-bold tabular-nums">
                            {c.totalScore?.toFixed(1) || "—"}
                          </span>
                          <span className="text-xs text-muted-foreground">/10</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          {comparisonResult.recommendation && (
            <Card className="dashboard-card rounded-2xl border-[#c8e6d4]">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--landing-success)] mb-2">
                  <LightbulbIcon size={16} weight="fill" />
                  Recommendation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comparisonResult.recommendation}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tradeoffs */}
          {comparisonResult.tradeoffs?.length > 0 && (
            <Card className="dashboard-card rounded-2xl border-border">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <ArrowsLeftRightIcon size={16} />
                  Key Tradeoffs
                </h3>
                <ul className="space-y-1.5">
                  {comparisonResult.tradeoffs.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 shrink-0 text-[var(--landing-accent)]">*</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </DashboardPageShell>
  );
}
