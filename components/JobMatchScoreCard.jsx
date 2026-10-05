"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GradeBadge, gradeChipClass } from "@/components/GradeBadge";
import { DashboardPanelHeader } from "@/components/dashboard";
import {
  TargetIcon,
  CurrencyDollarIcon,
  UsersThreeIcon,
  WarningCircleIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@phosphor-icons/react";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
import { ArcGauge } from "@/components/charts/ArcGauge";
import { PillTrack } from "@/components/charts/PillTrack";

const GRADE_PERCENT = {
  "A+": 100,
  A: 92,
  "B+": 84,
  B: 76,
  "C+": 68,
  C: 58,
  D: 42,
  F: 20,
};

const globalScoreColor = (score) => {
  if (score >= 4) return "var(--landing-success)";
  if (score >= 3) return "var(--landing-ink)";
  if (score >= 2) return "var(--landing-ink-soft)";
  return "var(--landing-accent)";
};

// Returns a message key under tailor.jobMatch.levels.
const globalScoreLabel = (score) => {
  if (score >= 4.5) return "excellent";
  if (score >= 4) return "strong";
  if (score >= 3) return "good";
  if (score >= 2) return "fair";
  return "weak";
};

// Labels live in messages under tailor.jobMatch.dimensions.<key>.
const dimensionMeta = {
  cvMatch: { icon: TargetIcon },
  compensation: { icon: CurrencyDollarIcon },
  cultureSignals: { icon: UsersThreeIcon },
  redFlags: { icon: WarningCircleIcon },
};

function gradeToPercent(grade) {
  if (!grade || grade === "N/A") return null;
  return GRADE_PERCENT[grade] ?? GRADE_PERCENT[grade.charAt(0)] ?? null;
}

function DimensionRow({ dimKey, dimension }) {
  const t = useTranslations("tailor.jobMatch");
  const meta = dimensionMeta[dimKey];
  if (!meta) return null;
  const Icon = meta.icon;
  const percent = gradeToPercent(dimension.grade);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Icon size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">{t(`dimensions.${dimKey}`)}</span>
        <span
          className={`ms-auto inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold tabular-nums ${gradeChipClass(dimension.grade)}`}
        >
          {dimension.grade}
        </span>
      </div>
      {percent !== null && (
        <PillTrack value={percent} color={globalScoreColor(percent / 20)} />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="flex items-center gap-4">
        <div className="tool-skeleton h-20 w-20 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="tool-skeleton h-4 w-2/3 rounded-sm" />
          <div className="tool-skeleton h-3 w-full rounded-sm" />
          <div className="tool-skeleton h-3 w-4/5 rounded-sm" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="tool-skeleton h-8 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

export default function JobMatchScoreCard({ scoreData, isLoading }) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("tailor.jobMatch");

  if (isLoading) {
    return (
      <section className="dashboard-card dashboard-card-pad rounded-lg">
        <DashboardPanelHeader
          title={t("title")}
          description={t("scoring")}
        />
        <div className="mt-4">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (!scoreData) return null;

  const { globalScore, globalGrade, recommendation, dimensions = {} } = scoreData;
  const color = globalScoreColor(globalScore);
  const label = t(`levels.${globalScoreLabel(globalScore)}`);

  return (
    <section className="dashboard-card dashboard-card-pad rounded-lg">
      <DashboardPanelHeader
        title={t("title")}
        description={t("description")}
        action={<GradeBadge grade={globalGrade} size="md" className="shrink-0" />}
      />
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-4">
          <ArcGauge
            value={globalScore}
            max={5}
            size={80}
            strokeWidth={6}
            color={color}
            label={t("gaugeLabel", { score: globalScore })}
          >
            <AnimatedNumber
              value={globalScore}
              decimals={1}
              className="text-center font-outfit text-xl font-semibold leading-none tabular-nums tracking-[-0.02em] text-foreground"
            />
            <span className="text-xs text-muted-foreground">/5</span>
          </ArcGauge>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-semibold" style={{ color }}>
              {label}
            </p>
            <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
              {recommendation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          {Object.entries(dimensions).map(([key, dim]) => (
            <DimensionRow key={key} dimKey={key} dimension={dim} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="-mx-2 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-ink)]"
        >
          <span className="relative inline-grid">
            <span className="invisible col-start-1 row-start-1">{t("showDetails")}</span>
            <span className="col-start-1 row-start-1">
              {expanded ? t("hideDetails") : t("showDetails")}
            </span>
          </span>
          {expanded ? (
            <CaretUpIcon size={12} aria-hidden="true" />
          ) : (
            <CaretDownIcon size={12} aria-hidden="true" />
          )}
        </button>

        {expanded && (
          <div className="space-y-3 border-t border-[var(--landing-line)] pt-4">
            {Object.entries(dimensions).map(([key, dim]) => {
              const meta = dimensionMeta[key];
              if (!meta) return null;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{t(`dimensions.${key}`)}</span>
                    <span
                      className={`rounded-sm px-1.5 py-0.5 text-xs font-semibold tabular-nums ${gradeChipClass(dim.grade)}`}
                    >
                      {dim.grade}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {dim.reasoning}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
