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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

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
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : score >= 6
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
        : score >= 4
          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

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
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold font-outfit">Compare Offers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select 2-4 applications to compare side by side.
        </p>
      </motion.div>

      {/* Selection */}
      <Card className="rounded-2xl border shadow-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ScalesIcon size={16} />
            Select Applications ({selectedIds.length}/4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
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
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-blue-300 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10"
                      : "hover:bg-muted/30"
                  } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {isSelected ? (
                    <CheckSquareIcon size={18} className="text-blue-600 shrink-0" weight="fill" />
                  ) : (
                    <SquareIcon size={18} className="text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium line-clamp-1">{app.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{app.jobCompany}</p>
                  </div>
                  {app.matchGrade && (
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      {app.matchGrade}
                    </span>
                  )}
                </button>
              );
            })
          )}
          <Button
            onClick={() => compareMutation.mutate()}
            disabled={selectedIds.length < 2 || compareMutation.isPending}
            className="mt-3 w-full rounded-full"
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
        </CardContent>
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
          <Card className="rounded-2xl border shadow-lg overflow-hidden">
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
            <Card className="rounded-2xl border shadow-lg border-green-200 dark:border-green-900/50">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
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
            <Card className="rounded-2xl border shadow-lg">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <ArrowsLeftRightIcon size={16} />
                  Key Tradeoffs
                </h3>
                <ul className="space-y-1.5">
                  {comparisonResult.tradeoffs.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 shrink-0 text-amber-500">*</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
