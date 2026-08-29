"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  BriefcaseIcon,
  MapPinIcon,
  BuildingsIcon,
  CurrencyDollarIcon,
  ListChecksIcon,
  ClipboardTextIcon,
  GraduationCapIcon,
  TagIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparkleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradeBadge } from "@/components/GradeBadge";

function matchesKeyword(keyword, cvText) {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) return false;

  const normalizedCvText = ` ${normalizeSearchText(cvText)} `;
  return normalizedCvText.includes(` ${normalizedKeyword} `);
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export default function JobRequirementsCard({
  data,
  referenceCV,
  matchGrade,
  matchLoading,
  onTailor,
  tailorPending,
  showTailorAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
        <CardHeader className="dashboard-card-pad">
          <div className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="font-outfit text-xl font-semibold tracking-tight">
                {data.title || "Job Listing"}
              </CardTitle>
              {matchLoading ? (
                <span className="inline-flex items-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--landing-ink-soft)]">
                  Scoring…
                </span>
              ) : (
                <GradeBadge grade={matchGrade} />
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm leading-6 text-[var(--landing-ink-soft)]">
              {data.company && (
                <span className="flex items-center gap-1">
                  <BuildingsIcon size={14} aria-hidden="true" />
                  {data.company}
                </span>
              )}
              {data.location && (
                <span className="flex items-center gap-1">
                  <MapPinIcon size={14} aria-hidden="true" />
                  {data.location}
                </span>
              )}
              {data.type && (
                <span className="flex items-center gap-1">
                  <BriefcaseIcon size={14} aria-hidden="true" />
                  {data.type}
                </span>
              )}
              {data.salary && (
                <span className="flex items-center gap-1">
                  <CurrencyDollarIcon size={14} aria-hidden="true" />
                  {data.salary}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="dashboard-card-pad space-y-4 pt-0">
          {data.requirements?.length > 0 && (
            <Section
              icon={<ListChecksIcon size={16} aria-hidden="true" />}
              title="Requirements"
              items={data.requirements}
            />
          )}
          {data.responsibilities?.length > 0 && (
            <Section
              icon={<ClipboardTextIcon size={16} aria-hidden="true" />}
              title="Responsibilities"
              items={data.responsibilities}
            />
          )}
          {data.qualifications?.length > 0 && (
            <Section
              icon={<GraduationCapIcon size={16} aria-hidden="true" />}
              title="Qualifications"
              items={data.qualifications}
            />
          )}
          {data.keywords?.length > 0 && (
            <KeywordsSection keywords={data.keywords} referenceCV={referenceCV} />
          )}
          {showTailorAction && onTailor && (
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                Ready to rewrite your CV for this role.
              </p>
              <Button
                onClick={onTailor}
                disabled={tailorPending}
                aria-busy={tailorPending}
                className="h-11 w-full rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90 sm:w-auto"
              >
                {tailorPending ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                    Tailoring…
                  </>
                ) : (
                  <>
                    <SparkleIcon size={16} aria-hidden="true" />
                    Tailor CV
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Section({ icon, title, items }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </h3>
      <ul className="list-disc space-y-1 pl-6 text-sm leading-6 text-[var(--landing-ink-soft)]">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function KeywordsSection({ keywords, referenceCV }) {
  const [expanded, setExpanded] = useState(true);

  // Build a text blob from the CV to match keywords against
  let cvText = "";
  if (referenceCV) {
    const parts = [
      referenceCV.basics?.summary || "",
      referenceCV.basics?.label || "",
      ...(referenceCV.work || []).map((w) => `${w.position || ""} ${w.description || ""}`),
      ...(referenceCV.skills || []).map((s) => (s.skills || []).join(" ")),
      ...(referenceCV.education || []).map((e) => `${e.degree || ""} ${e.fieldOfStudy || ""}`),
    ];
    cvText = parts.join(" ");
  }

  const matched = referenceCV ? keywords.filter((kw) => matchesKeyword(kw, cvText)) : [];
  const missing = referenceCV ? keywords.filter((kw) => !matchesKeyword(kw, cvText)) : [];
  const hasCV = Boolean(referenceCV);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
      >
        <TagIcon size={16} aria-hidden="true" />
        Key terms
        {hasCV && (
          <span className="ml-auto text-xs font-normal text-[var(--landing-ink-soft)]">
            {matched.length} in your CV
          </span>
        )}
        {expanded ? <CaretUpIcon size={14} /> : <CaretDownIcon size={14} />}
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {hasCV ? (
            <>
              {matched.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-full border border-[#c8e6d4] bg-[#eef8f1] px-2.5 py-0.5 text-xs font-medium text-[var(--landing-success)]"
                >
                  <CheckCircleIcon size={12} weight="fill" />
                  {kw}
                </span>
              ))}
              {missing.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-full border border-[#f0d4cc] bg-[#fdf3ef] px-2.5 py-0.5 text-xs font-medium text-[var(--landing-accent)]"
                >
                  <XCircleIcon size={12} weight="fill" />
                  {kw}
                </span>
              ))}
            </>
          ) : (
            keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center rounded-full border border-border bg-[var(--landing-paper-soft)] px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {kw}
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
}
