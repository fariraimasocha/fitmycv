"use client";

import { useState } from "react";
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
} from "@phosphor-icons/react";
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

/**
 * The scraped posting as a flat card: title and meta up top, then one
 * hairline-divided section per list. The tailor action lives on the page.
 */
export default function JobRequirementsCard({ data, referenceCV, matchGrade, matchLoading }) {
  const meta = [
    data.company && { icon: BuildingsIcon, text: data.company },
    data.location && { icon: MapPinIcon, text: data.location },
    data.type && { icon: BriefcaseIcon, text: data.type },
    data.salary && { icon: CurrencyDollarIcon, text: data.salary },
  ].filter(Boolean);

  return (
    <section className="dashboard-card flex flex-col overflow-hidden rounded-lg">
      <div className="dashboard-card-pad flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-outfit text-base font-semibold tracking-[-0.01em] text-foreground">
            {data.title || "Job listing"}
          </h2>
          {meta.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {meta.map((item) => (
                <span key={item.text} className="inline-flex min-w-0 items-center gap-1">
                  <item.icon size={12} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.text}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        {matchLoading ? (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Scoring…</span>
        ) : (
          <GradeBadge grade={matchGrade} className="shrink-0" />
        )}
      </div>
      <div className="divide-y divide-[var(--landing-line)] border-t border-[var(--landing-line)]">
        {data.requirements?.length > 0 && (
          <Section icon={ListChecksIcon} title="Requirements" items={data.requirements} />
        )}
        {data.responsibilities?.length > 0 && (
          <Section
            icon={ClipboardTextIcon}
            title="Responsibilities"
            items={data.responsibilities}
          />
        )}
        {data.qualifications?.length > 0 && (
          <Section
            icon={GraduationCapIcon}
            title="Qualifications"
            items={data.qualifications}
          />
        )}
        {data.keywords?.length > 0 && (
          <KeywordsSection keywords={data.keywords} referenceCV={referenceCV} />
        )}
      </div>
    </section>
  );
}

function SectionTitle({ icon: Icon, children, trailing }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
        <Icon size={14} aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold text-foreground">{children}</span>
      {trailing}
    </div>
  );
}

function Section({ icon, title, items }) {
  return (
    <div className="dashboard-card-pad">
      <SectionTitle icon={icon}>{title}</SectionTitle>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--landing-ink-soft)]">
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
    <div className="dashboard-card-pad">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="-mx-2 flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-[var(--landing-paper-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-ink)]"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
          <TagIcon size={14} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-foreground">Key terms</span>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {hasCV ? `${matched.length} of ${keywords.length} in your CV` : `${keywords.length}`}
        </span>
        {expanded ? (
          <CaretUpIcon size={14} className="text-muted-foreground" aria-hidden="true" />
        ) : (
          <CaretDownIcon size={14} className="text-muted-foreground" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {hasCV ? (
            <>
              {matched.map((kw) => (
                <li
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-md border border-[#c8e6d4] bg-[var(--landing-success-soft)] px-2 py-0.5 text-xs font-medium text-[var(--landing-success)]"
                >
                  <CheckCircleIcon size={12} weight="fill" aria-hidden="true" />
                  {kw}
                </li>
              ))}
              {missing.map((kw) => (
                <li
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--landing-accent-dark)]"
                >
                  <XCircleIcon size={12} weight="fill" aria-hidden="true" />
                  {kw}
                </li>
              ))}
            </>
          ) : (
            keywords.map((kw) => (
              <li
                key={kw}
                className="inline-flex items-center rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {kw}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
