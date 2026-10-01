"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  ArrowsClockwiseIcon,
  CaretRightIcon,
  CopyIcon,
  EnvelopeSimpleIcon,
  MagicWandIcon,
  PaperPlaneTiltIcon,
  SparkleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's application-ai-copilot.tsx. The ring shows
// keyword and skill overlap from lib/resume-job-match.js, so the bands name
// overlap rather than claim a verdict on fit.

function band(score) {
  if (score >= 75) return { color: "var(--landing-success)", labelKey: "strong" };
  if (score >= 50) return { color: "#b7791f", labelKey: "some" };
  return { color: "var(--landing-accent)", labelKey: "low" };
}

function FitRing({ score }) {
  const size = 60;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-[var(--landing-paper-strong)]"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (Math.max(0, Math.min(100, score)) / 100) * c}
        style={{ stroke: band(score).color }}
        className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
      />
    </svg>
  );
}

function ActionRow({ icon, title, description, disabled, pending, onClick, href }) {
  const className = cn(
    "group/row flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-[var(--landing-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
    (disabled || pending) && "pointer-events-none opacity-45"
  );
  const body = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]">
        {pending ? <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{description}</span>
      </span>
      <CaretRightIcon
        size={14}
        className="shrink-0 text-muted-foreground transition-transform group-hover/row:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" disabled={disabled || pending} onClick={onClick} className={className}>
      {body}
    </button>
  );
}

export function ApplicationCopilot({ application }) {
  const t = useTranslations("dashboard.appComponents.copilot");
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(null);
  const id = application._id;

  const run = useMutation({
    mutationFn: (kind) => requestJson(`/api/applications/${id}/copilot`, { method: "POST", body: { kind } }),
    onSuccess: (data, kind) => {
      if (kind === "match") queryClient.invalidateQueries({ queryKey: ["applications"] });
      else setDraft({ kind, text: data.text });
    },
    onError: (error) => toast.error(error.message),
  });

  const pendingKind = run.isPending ? run.variables : null;
  const canScore = Boolean(application.jobDescription || application.tailoredCVId);
  const score = application.fit?.score;
  const gaps = application.fit?.gaps ?? [];

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft?.text ?? "");
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyError"));
    }
  };

  return (
    <section className="overflow-hidden rounded-lg border border-[var(--landing-accent-line)]/50 bg-[var(--landing-accent-soft)]/40">
      <header className="flex items-center gap-2 px-3.5 pt-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[var(--landing-accent)] text-white">
          <SparkleIcon weight="fill" size={12} aria-hidden="true" />
        </span>
        <span className="font-outfit text-sm font-semibold text-foreground">{t("title")}</span>
      </header>

      <div className="px-3.5 py-3">
        {!canScore ? (
          <p className="rounded-md bg-[var(--landing-paper-soft)] p-2.5 text-xs leading-5 text-muted-foreground">
            {t("cannotScore")}
          </p>
        ) : score == null ? (
          <button
            type="button"
            disabled={run.isPending}
            onClick={() => run.mutate("match")}
            className="flex w-full items-center gap-3 rounded-md border border-dashed border-[var(--landing-accent-line)] p-2.5 text-left transition-colors hover:bg-[var(--landing-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]">
              {pendingKind === "match" ? (
                <SpinnerGapIcon size={20} className="animate-spin" aria-hidden="true" />
              ) : (
                <SparkleIcon size={20} aria-hidden="true" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                {pendingKind === "match" ? t("scoring") : t("scoreMyFit")}
              </span>
              <span className="block text-xs text-muted-foreground">{t("scoreHint")}</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center">
              <FitRing score={score} />
              <span className="absolute font-outfit text-base font-semibold tabular-nums tracking-[-0.02em]">{score}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: band(score).color }}>
                  {t(band(score).labelKey)}
                </span>
                <button
                  type="button"
                  disabled={run.isPending}
                  onClick={() => run.mutate("match")}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--landing-accent-soft)] hover:text-foreground disabled:opacity-50"
                  title={t("scoreAgain")}
                  aria-label={t("scoreAgain")}
                >
                  <ArrowsClockwiseIcon
                    size={14}
                    className={cn(pendingKind === "match" && "animate-spin")}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {gaps.length > 0 && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t("gaps", { gaps: gaps.slice(0, 3).join(", ") })}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--landing-accent-line)]/40 px-2 py-2">
        <ActionRow
          icon={<MagicWandIcon size={16} aria-hidden="true" />}
          title={t("tailorTitle")}
          description={application.jobUrl ? t("tailorDescription") : t("tailorNeedsLink")}
          disabled={!application.jobUrl}
          href={application.jobUrl ? `/dashboard/tailor?url=${encodeURIComponent(application.jobUrl)}` : undefined}
        />
        <ActionRow
          icon={<EnvelopeSimpleIcon size={16} aria-hidden="true" />}
          title={t("coverTitle")}
          description={t("coverDescription")}
          disabled={run.isPending}
          pending={pendingKind === "cover-letter"}
          onClick={() => run.mutate("cover-letter")}
        />
        <ActionRow
          icon={<PaperPlaneTiltIcon size={16} aria-hidden="true" />}
          title={t("followUpTitle")}
          description={t("followUpDescription")}
          disabled={run.isPending}
          pending={pendingKind === "follow-up"}
          onClick={() => run.mutate("follow-up")}
        />
      </div>

      {draft && (
        <div className="border-t border-[var(--landing-accent-line)]/40 bg-[var(--landing-surface)]/60 p-3">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-foreground">
              {draft.kind === "cover-letter" ? t("coverDraft") : t("followUpDraft")}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => void copyDraft()}
              >
                <CopyIcon size={14} aria-hidden="true" />
                {t("copyDraft")}
              </button>
              <button
                type="button"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setDraft(null)}
              >
                {t("dismiss")}
              </button>
            </div>
          </div>
          <p className="max-h-40 overflow-y-auto text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {draft.text}
          </p>
        </div>
      )}
    </section>
  );
}
