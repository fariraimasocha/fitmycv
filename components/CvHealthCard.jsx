"use client";

import { useTranslations } from "next-intl";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { FindingRow, SEVERITY_ORDER } from "@/components/ATSScoreCard";
import { DashboardPanel, DashboardPanelHeader } from "@/components/dashboard";

const SHOWN = 3;

/**
 * The uploaded CV's own problems, before tailoring. Same rule findings as the
 * ATS tab (lib/ats/rules.js via /api/ats-score), so the two never disagree.
 * Only the top few, worst first: the full list waits in the ATS tab.
 */
export default function CvHealthCard({ report, delay = 0 }) {
  const t = useTranslations("tailor.health");
  if (!report?.findings) return null;

  // One row per problem, not per place it happens.
  const seen = new Set();
  const issues = report.findings
    .filter((f) => !seen.has(f.code) && seen.add(f.code))
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
  const more = issues.length - SHOWN;

  return (
    <DashboardPanel delay={delay}>
      <DashboardPanelHeader
        title={t("title")}
        description={issues.length ? t("description", { count: issues.length }) : t("clean")}
      />
      {issues.length > 0 ? (
        <>
          <ul className="mt-4 space-y-2">
            {issues.slice(0, SHOWN).map((finding) => (
              <FindingRow key={finding.code} finding={finding} />
            ))}
          </ul>
          {more > 0 && <p className="mt-3 text-xs text-muted-foreground">{t("more", { count: more })}</p>}
        </>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-sm text-foreground">
          <CheckCircleIcon size={18} weight="fill" className="text-[var(--landing-success)]" aria-hidden="true" />
          {t("cleanShort")}
        </p>
      )}
    </DashboardPanel>
  );
}
