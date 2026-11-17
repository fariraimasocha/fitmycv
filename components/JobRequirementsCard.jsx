"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  CircleHalfIcon,
  CircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { GradeBadge } from "@/components/GradeBadge";
import { detectAts } from "@/lib/ats-detect";

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
export default function JobRequirementsCard({
  data,
  jobUrl,
  referenceCV,
  matchGrade,
  matchLoading,
  evidence,
  evidenceLoading,
}) {
  const t = useTranslations("tailor.jobRequirements");
  // Host match only: LinkedIn and Indeed links show nothing, which is honest.
  const ats = detectAts(jobUrl);
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
            {data.title || t("fallbackTitle")}
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
          {ats && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("atsVendor", { name: ats.name })}{" "}
              <a
                href={ats.guide}
                target="_blank"
                rel="noopener"
                className="font-medium text-foreground underline underline-offset-2"
              >
                {t("atsGuide", { name: ats.name })}
              </a>
            </p>
          )}
        </div>
        {matchLoading ? (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">{t("scoring")}</span>
        ) : (
          <GradeBadge grade={matchGrade} className="shrink-0" />
        )}
      </div>
      <div className="divide-y divide-[var(--landing-line)] border-t border-[var(--landing-line)]">
        {data.requirements?.length > 0 && (
          <Section
            icon={ListChecksIcon}
            title={t("requirements")}
            items={data.requirements}
            checks={evidence?.requirements}
            checking={evidenceLoading}
          />
        )}
        {data.responsibilities?.length > 0 && (
          <Section
            icon={ClipboardTextIcon}
            title={t("responsibilities")}
            items={data.responsibilities}
          />
        )}
        {data.qualifications?.length > 0 && (
          <Section
            icon={GraduationCapIcon}
            title={t("qualifications")}
            items={data.qualifications}
            checks={evidence?.qualifications}
            checking={evidenceLoading}
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

// met: in the CV, partial: something close, missing: not shown yet.
const CHECK = {
  met: { Icon: CheckCircleIcon, weight: "fill", tone: "text-[var(--landing-success)]" },
  partial: { Icon: CircleHalfIcon, weight: "fill", tone: "text-[var(--dash-accent)]" },
  missing: { Icon: CircleIcon, weight: "regular", tone: "text-[var(--dash-muted)]" },
};

function Section({ icon, title, items, checks, checking }) {
  const t = useTranslations("tailor.jobRequirements");
  // Only a full answer turns the list into a checklist. Anything partial
  // would put ticks against the wrong lines.
  const checked = checks?.length === items.length ? checks : null;
  const met = checked?.filter((c) => c.status === "met").length ?? 0;
  const trailing = checked ? (
    <span className="ms-auto text-xs tabular-nums text-muted-foreground">
      {t("shownInCv", { met, total: items.length })}
    </span>
  ) : checking ? (
    <span className="ms-auto text-xs text-muted-foreground" aria-live="polite">
      {t("checking")}
    </span>
  ) : null;

  return (
    <div className="dashboard-card-pad">
      <SectionTitle icon={icon} trailing={trailing}>
        {title}
      </SectionTitle>
      {checked ? (
        <ul className="mt-3 space-y-3">
          {items.map((item, i) => {
            const { status, quote } = checked[i];
            const { Icon, weight, tone } = CHECK[status];
            return (
              <li key={i} className="flex gap-2">
                <Icon size={20} weight={weight} className={`mt-0.5 shrink-0 ${tone}`} aria-hidden="true" />
                <div className="min-w-0 text-sm leading-6">
                  <span className="sr-only">{t(`status.${status}`)}: </span>
                  <span className={status === "missing" ? "text-[var(--landing-ink-soft)]" : "text-foreground"}>
                    {item}
                  </span>
                  {quote && (
                    <q className="mt-0.5 block text-xs leading-5 text-muted-foreground italic">{quote}</q>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="mt-3 list-disc space-y-1 ps-4 text-sm leading-6 text-[var(--landing-ink-soft)]">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KeywordsSection({ keywords, referenceCV }) {
  const [expanded, setExpanded] = useState(true);
  const t = useTranslations("tailor.jobRequirements");

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
        className="-mx-2 flex items-center gap-2 rounded-md px-2 py-1 text-start transition-colors hover:bg-[var(--landing-paper-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-ink)]"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
          <TagIcon size={14} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-foreground">{t("keyTerms")}</span>
        <span className="ms-auto text-xs tabular-nums text-muted-foreground">
          {hasCV ? t("inYourCv", { matched: matched.length, total: keywords.length }) : `${keywords.length}`}
        </span>
        {expanded ? (
          <CaretUpIcon size={14} className="text-muted-foreground" aria-hidden="true" />
        ) : (
          <CaretDownIcon size={14} className="text-muted-foreground" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {hasCV ? (
            <>
              {matched.map((kw) => (
                <li
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--dash-line)] bg-[var(--landing-success-soft)] px-2 py-1 text-xs font-medium text-[var(--landing-success)]"
                >
                  <CheckCircleIcon size={12} weight="fill" aria-hidden="true" />
                  {kw}
                </li>
              ))}
              {missing.map((kw) => (
                <li
                  key={kw}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] px-2 py-1 text-xs font-medium text-[var(--landing-accent-dark)]"
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
                className="inline-flex items-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2 py-1 text-xs font-medium text-muted-foreground"
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
