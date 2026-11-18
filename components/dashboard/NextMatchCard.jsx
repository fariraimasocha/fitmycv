"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ArrowRightIcon,
  ArrowSquareOutIcon,
  CheckCircleIcon,
  LinkIcon,
  LockSimpleIcon,
  MapPinIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const BTN = "dashboard-secondary-btn dashboard-secondary-btn-sm w-full sm:w-auto";

export const tailorNextHref = (applyUrl) =>
  `/dashboard/tailor?url=${encodeURIComponent(applyUrl)}&auto=1`;

/** The best pool job for the user's CV, minus the one they just tailored. */
export function useNextMatch(excludeUrl, enabled = true) {
  return useQuery({
    queryKey: ["matches", "next", excludeUrl ?? ""],
    queryFn: async () => {
      const params = new URLSearchParams({ n: "1" });
      if (excludeUrl) params.append("exclude", excludeUrl);
      const res = await fetch(`/api/matches?${params}`);
      if (!res.ok) throw new Error("Couldn't load matching jobs.");
      const json = await res.json();
      return json.data?.[0] ?? null;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Marks the application behind a tailored CV as applied. Shared by the tailor
 * result and the saved CV page so both show the same toast and state.
 */
export function useMarkApplied(tailoredCvId, source) {
  const t = useTranslations("tailor.whatNext");
  const format = useFormatter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/tailored-cv/${id}/applied`, { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.data) throw new Error(json?.error || t("markError"));
      return json.data;
    },
    onSuccess: (data) => {
      trackEvent("marked_applied", { source });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      const day = (value) => format.dateTime(new Date(value), { month: "long", day: "numeric" });
      const followUp = data.followUpDate ? t("followUp", { date: day(data.followUpDate) }) : undefined;
      // Marked before this click: say when, rather than claim it just happened.
      if (data.appliedAt && Date.now() - new Date(data.appliedAt).getTime() > 60_000) {
        toast.success(t("alreadyApplied", { date: day(data.appliedAt) }), { description: followUp });
        return;
      }
      toast.success(t("appliedToast"), { description: followUp });
    },
    onError: (error) => toast.error(error.message),
  });

  const applied =
    mutation.isSuccess && mutation.variables === tailoredCvId && mutation.data?.status !== "evaluated";

  // Opens the posting from the click itself, so pop-up blockers allow it.
  const markApplied = (jobUrl) => {
    if (jobUrl) window.open(jobUrl, "_blank", "noopener,noreferrer");
    if (!tailoredCvId || applied || mutation.isPending) return;
    mutation.mutate(tailoredCvId);
  };

  return {
    markApplied,
    applied,
    pending: mutation.isPending,
    followUpDate: applied ? mutation.data?.followUpDate ?? null : null,
  };
}

/** The apply step: opens the posting and moves the application to applied. */
export function MarkAppliedCard({ state, jobUrl, className }) {
  const t = useTranslations("tailor.whatNext");
  const format = useFormatter();
  const { markApplied, applied, pending, followUpDate } = state;

  return (
    <div className={cn("dashboard-card flex flex-col gap-3 rounded-lg p-4", className)}>
      <p className="text-sm leading-6 text-muted-foreground" aria-live="polite">
        {applied && followUpDate
          ? t("followUp", {
              date: format.dateTime(new Date(followUpDate), { month: "long", day: "numeric" }),
            })
          : t("applyHint")}
      </p>
      <button
        type="button"
        onClick={() => markApplied(jobUrl)}
        disabled={applied || pending}
        aria-busy={pending}
        className={cn(BTN, "mt-auto self-start")}
      >
        {applied ? (
          <>
            <CheckCircleIcon size={16} weight="fill" className="text-[var(--landing-success)]" aria-hidden="true" />
            {t("applied")}
          </>
        ) : pending ? (
          <>
            <SpinnerGapIcon size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            {t("marking")}
          </>
        ) : (
          <>
            {jobUrl ? t("openAndMark") : t("markApplied")}
            {jobUrl && <ArrowSquareOutIcon size={16} aria-hidden="true" />}
          </>
        )}
      </button>
    </div>
  );
}

/**
 * The next job to tailor for. Pro sees the employer and goes straight to the
 * tailor; free sees the role and fit, the same lock as the jobs board. With no
 * match it still offers a way on, unless `fallback` is off because the page
 * already shows that action.
 */
export default function NextMatchCard({ excludeUrl, fallback = true, onPasteAnother, className }) {
  const t = useTranslations("tailor.whatNext");
  const { data: job, isLoading } = useNextMatch(excludeUrl);

  if (isLoading) {
    return (
      <div
        className={cn("dashboard-card flex flex-col gap-2 rounded-lg p-4", className)}
        aria-busy="true"
        aria-label={t("loadingAria")}
      >
        <div className="tool-skeleton h-3 w-1/4 rounded-sm" />
        <div className="tool-skeleton h-4 w-2/3 rounded-sm" />
        <div className="tool-skeleton h-3 w-1/2 rounded-sm" />
      </div>
    );
  }

  const pasteLink = (
    <Link href="/dashboard/tailor" onClick={onPasteAnother} className={BTN}>
      <LinkIcon size={16} aria-hidden="true" />
      {t("pasteAnother")}
    </Link>
  );

  if (!job) {
    if (!fallback) return null;
    return (
      <div className={cn("dashboard-card flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center", className)}>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{t("noMatchTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("noMatchBody")}</p>
        </div>
        {pasteLink}
      </div>
    );
  }

  const hasMeta = job.locked || job.company || job.location;

  return (
    <div className={cn("dashboard-card flex flex-col gap-3 rounded-lg p-4", className)}>
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {t("nextTitle")}
        {job.isNew && (
          <span className="rounded-full bg-[var(--landing-success-soft)] px-2 py-0.5 text-[var(--landing-success)]">
            {t("isNew")}
          </span>
        )}
      </p>
      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{job.title}</p>
        {hasMeta && (
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {job.locked && (
              <span className="inline-flex items-center gap-1">
                <LockSimpleIcon size={12} aria-hidden="true" />
                {t("lockedCompany")}
              </span>
            )}
            {!job.locked && job.company && <span>{job.company}</span>}
            {job.location && (
              <span className="inline-flex items-center gap-1">
                <MapPinIcon size={12} aria-hidden="true" />
                {job.location}
              </span>
            )}
          </p>
        )}
        <p className="mt-1 text-xs tabular-nums text-muted-foreground">{t("fit", { count: job.fit })}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {job.locked ? (
          <>
            <Link
              href="/dashboard/upgrade"
              onClick={() => trackEvent("next_match_tailored", { locked: true })}
              className={BTN}
            >
              <LockSimpleIcon size={16} aria-hidden="true" />
              {t("unlock")}
            </Link>
            {pasteLink}
          </>
        ) : (
          <Link
            href={tailorNextHref(job.applyUrl)}
            onClick={() => trackEvent("next_match_tailored", { locked: false })}
            className={BTN}
          >
            {t("tailorNext")}
            <ArrowRightIcon size={16} className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
