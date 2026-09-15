"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  if (score >= 75) return { color: "var(--landing-success)", label: "Strong overlap" };
  if (score >= 50) return { color: "#b7791f", label: "Some overlap" };
  return { color: "var(--landing-accent)", label: "Low overlap" };
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
    "group/row flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[var(--landing-accent-soft)]",
    (disabled || pending) && "pointer-events-none opacity-45"
  );
  const body = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]">
        {pending ? <SpinnerGapIcon className="animate-spin" /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{description}</span>
      </span>
      <CaretRightIcon className="shrink-0 text-muted-foreground/50 transition-transform group-hover/row:translate-x-0.5" />
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
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy. Select the text and copy it yourself.");
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--landing-accent-line)]/50 bg-[var(--landing-accent-soft)]/40">
      <header className="flex items-center gap-2 px-3.5 pt-3">
        <span className="flex size-5 items-center justify-center rounded-md bg-[var(--landing-accent)] text-white">
          <SparkleIcon weight="fill" className="size-3" />
        </span>
        <span className="text-sm font-medium">Application Copilot</span>
      </header>

      <div className="px-3.5 py-3">
        {!canScore ? (
          <p className="rounded-lg bg-[var(--landing-paper-soft)] p-2.5 text-xs text-muted-foreground">
            Paste the job description or link a tailored CV (Edit) to score your fit.
          </p>
        ) : score == null ? (
          <button
            type="button"
            disabled={run.isPending}
            onClick={() => run.mutate("match")}
            className="flex w-full items-center gap-3 rounded-lg border border-dashed border-[var(--landing-accent-line)] p-2.5 text-left transition-colors hover:bg-[var(--landing-accent-soft)] disabled:opacity-60"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]">
              {pendingKind === "match" ? <SpinnerGapIcon className="size-5 animate-spin" /> : <SparkleIcon className="size-5" />}
            </span>
            <span>
              <span className="block text-sm font-medium">{pendingKind === "match" ? "Scoring your fit…" : "Score my fit"}</span>
              <span className="block text-xs text-muted-foreground">See how much of the posting your CV covers</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center">
              <FitRing score={score} />
              <span className="absolute text-base font-semibold tabular-nums">{score}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: band(score).color }}>
                  {band(score).label}
                </span>
                <button
                  type="button"
                  disabled={run.isPending}
                  onClick={() => run.mutate("match")}
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
                  title="Score again"
                  aria-label="Score again"
                >
                  <ArrowsClockwiseIcon className={cn("size-3.5", pendingKind === "match" && "animate-spin")} />
                </button>
              </div>
              {gaps.length > 0 && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">Gaps: {gaps.slice(0, 3).join(" · ")}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--landing-accent-line)]/40 px-2 py-2">
        <ActionRow
          icon={<MagicWandIcon />}
          title="Tailor my CV"
          description={application.jobUrl ? "Make a copy tuned to this job" : "Add the job posting link first"}
          disabled={!application.jobUrl}
          href={application.jobUrl ? `/dashboard/tailor?url=${encodeURIComponent(application.jobUrl)}` : undefined}
        />
        <ActionRow
          icon={<EnvelopeSimpleIcon />}
          title="Draft a cover letter"
          description="From your CV and the posting"
          disabled={run.isPending}
          pending={pendingKind === "cover-letter"}
          onClick={() => run.mutate("cover-letter")}
        />
        <ActionRow
          icon={<PaperPlaneTiltIcon />}
          title="Draft a follow-up"
          description="A short check-in for the recruiter"
          disabled={run.isPending}
          pending={pendingKind === "follow-up"}
          onClick={() => run.mutate("follow-up")}
        />
      </div>

      {draft && (
        <div className="border-t border-[var(--landing-accent-line)]/40 bg-[var(--landing-surface)]/60 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium">
              {draft.kind === "cover-letter" ? "Cover letter draft" : "Follow-up draft"}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => void copyDraft()}
              >
                <CopyIcon className="size-3.5" /> Copy
              </button>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setDraft(null)}
              >
                Dismiss
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
