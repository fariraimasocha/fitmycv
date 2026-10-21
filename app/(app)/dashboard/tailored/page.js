"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  BuildingsIcon,
  CalendarIcon,
  CheckIcon,
  CheckCircleIcon,
  FileTextIcon,
  TrashIcon,
  ArrowRightIcon,
  PlusIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
  DashboardLoadError,
  DashboardFilterPills,
} from "@/components/dashboard";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE } from "@/utils/cv-templates/metadata";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { requestJson } from "@/lib/request-json";

const DATE_FORMAT = { month: "short", day: "numeric", year: "numeric" };

/**
 * Row action button. Hidden until the row is hovered on pointer devices.
 * Touch has no hover, so below `sm` they stay visible. `force` keeps a button
 * on screen regardless (used by the delete-confirm state).
 */
function RowAction({ label, onClick, disabled, force, className, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={onClick}
          aria-label={label}
          className={cn(
            "relative z-10 shrink-0 rounded-md text-[var(--landing-ink-soft)] transition-opacity",
            "hover:bg-[var(--landing-primary-soft)] hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring/40",
            force
              ? "opacity-100"
              : "max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:focus-visible:opacity-100",
            className
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function RowSkeleton() {
  return (
    <div className="dashboard-list-row dashboard-row-pad flex items-center gap-3">
      <div className="tool-skeleton h-10 w-10 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="tool-skeleton h-3.5 w-1/2 rounded-sm" />
        <div className="tool-skeleton h-3 w-1/3 rounded-sm" />
      </div>
      <div className="tool-skeleton h-3.5 w-3.5 rounded-sm" />
    </div>
  );
}

function TailoredCVRow({ cv, index, onDownload, onDelete }) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("tailor.tailoredList");
  const title = cv.jobTitle || t("untitled");

  return (
    <m.li
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 6) * 0.03 }}
    >
      <div className="dashboard-list-row dashboard-row-pad group relative flex items-center gap-3 focus-within:border-[var(--landing-ink)]">
        {/* Stretched link: the whole row navigates, but the action buttons
            stay siblings rather than children of an anchor. */}
        <Link
          href={`/dashboard/tailored/${cv._id}`}
          aria-label={t("open", { title })}
          className="absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] font-outfit text-sm font-semibold text-foreground">
          {(cv.jobCompany?.[0] ?? cv.jobTitle?.[0] ?? "?").toUpperCase()}
        </span>
        <div className="pointer-events-none relative z-10 min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground group-hover:underline">
            {title}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {cv.jobCompany && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <BuildingsIcon size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{cv.jobCompany}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 tabular-nums">
              <CalendarIcon size={12} className="shrink-0" aria-hidden="true" />
              <FormattedDate date={cv.createdAt} options={DATE_FORMAT} />
            </span>
            {cv.hasCoverLetter && (
              <span className="inline-flex items-center gap-1 font-medium text-[var(--landing-success)]">
                <CheckCircleIcon size={12} weight="fill" aria-hidden="true" />
                {t("coverLetter")}
              </span>
            )}
          </div>
        </div>

        <RowAction label={t("download", { title })} onClick={onDownload}>
          <DownloadSimpleIcon size={16} aria-hidden="true" />
        </RowAction>

        <RowAction
          label={t("delete", { title })}
          onClick={onDelete}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <TrashIcon size={16} aria-hidden="true" />
        </RowAction>

        <ArrowRightIcon
          size={14}
          className="shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </m.li>
  );
}

export default function TailoredCVsPage() {
  // Rows deleted in this session but still inside their Undo window.
  const [hiddenIds, setHiddenIds] = useState([]);
  const t = useTranslations("tailor.tailoredList");
  const PAGE_TITLE = t("title");
  const PAGE_DESCRIPTION = t("description");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalContext, setUpgradeModalContext] = useState("default");
  const [paywallJob, setPaywallJob] = useState(null);
  const [filter, setFilter] = useState("all");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const cvsQuery = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: async () => {
      const res = await fetch("/api/tailored-cv");
      if (!res.ok) throw new Error("Couldn't load your tailored CVs. Refresh the page.");
      const json = await res.json();
      return json.data;
    },
  });
  const { data: cvs, isLoading } = cvsQuery;

  const { data: referenceCV } = useQuery({
    queryKey: ["resume"],
    // Same key and shape as the dashboard home. This used to call
    // /api/reference-cv, which does not exist, so the empty state always
    // said to upload a CV.
    queryFn: () => requestJson("/api/resume"),
  });

  const hasReferenceCV = !!referenceCV;

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/tailored-cv/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || t("deleteError"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tailored-cvs"] });
    },
    onError: (error, id) => {
      toast.error(error.message);
      setHiddenIds((ids) => ids.filter((hidden) => hidden !== id));
    },
  });

  const sorted = useMemo(() => {
    const hidden = new Set(hiddenIds);
    return (cvs ?? [])
      .filter((cv) => !hidden.has(cv._id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [cvs, hiddenIds]);
  const withLetter = useMemo(
    () => sorted.filter((cv) => cv.hasCoverLetter),
    [sorted],
  );
  const visible = filter === "letter" ? withLetter : sorted;

  const handleDownloadClick = async (e, cv) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user?.isPremium && !cv.unlocked) {
      trackEvent("download_blocked", {
        document_type: "cv",
        template: DEFAULT_TEMPLATE,
        source: "tailored_list",
      });
      setUpgradeModalContext("download");
      setPaywallJob({ title: cv.jobTitle, company: cv.jobCompany, cvId: cv._id });
      setShowUpgradeModal(true);
      return;
    }
    try {
      const res = await fetch(`/api/tailored-cv/${cv._id}`);
      if (!res.ok) throw new Error(t("loadError"));
      const json = await res.json();
      const data = json.data;
      printDocument({
        kind: "cv",
        data: {
          basics: data.basics,
          work: data.work,
          education: data.education,
          skills: data.skills,
        },
        template: DEFAULT_TEMPLATE,
        filename: buildPdfFilename(data.basics?.name, "cv", cv.jobTitle),
      });
      trackEvent("pdf_downloaded", {
        document_type: "cv",
        template: DEFAULT_TEMPLATE,
        source: "tailored_list",
      });
    } catch (error) {
      toast.error(error.message || t("downloadError"));
    }
  };

  const handleTrashClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    // Hide the row now and delete once the toast closes, so Undo is a
    // real undo. Closing the tab inside the window keeps the CV, the safe
    // way to fail.
    setHiddenIds((ids) => [...ids, id]);
    let settled = false;
    const commit = () => {
      if (settled) return;
      settled = true;
      deleteMutation.mutate(id);
    };
    toast(t("deleted"), {
      action: {
        label: t("undo"),
        onClick: () => {
          settled = true;
          setHiddenIds((ids) => ids.filter((hidden) => hidden !== id));
        },
      },
      onAutoClose: commit,
      onDismiss: commit,
    });
  };

  if (isLoading) {
    return (
      <DashboardPageShell width="wide">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <div className="flex flex-col gap-3">
          <div className="tool-skeleton h-9 w-56 rounded-md" />
          <ul className="flex flex-col gap-2" aria-busy="true" aria-label={t("loading")}>
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i}>
                <RowSkeleton />
              </li>
            ))}
          </ul>
        </div>
      </DashboardPageShell>
    );
  }

  const loadFailed = cvsQuery.isError && !cvs;
  const isEmpty = !loadFailed && sorted.length === 0;

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          !isEmpty ? (
            <Link href="/dashboard/tailor" className="dashboard-primary-btn">
              <PlusIcon size={16} weight="bold" aria-hidden="true" />
              {t("tailorCta")}
            </Link>
          ) : null
        }
      />

      {loadFailed ? (
        <DashboardLoadError query={cvsQuery} />
      ) : isEmpty ? (
        <DashboardEmptyState
          icon={FileTextIcon}
          title={t("empty.title")}
          description={
            hasReferenceCV ? t("empty.withCv") : t("empty.noCv")
          }
          actionLabel={hasReferenceCV ? t("tailorCta") : t("empty.upload")}
          actionHref={hasReferenceCV ? "/dashboard/tailor" : "/dashboard/resume"}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <DashboardFilterPills
            tabs={[
              { key: "all", label: t("filters.all"), count: sorted.length },
              { key: "letter", label: t("filters.letter"), count: withLetter.length },
            ]}
            activeKey={filter}
            onChange={setFilter}
          />
          {visible.length === 0 ? (
            <DashboardEmptyState
              compact
              icon={CheckCircleIcon}
              title={t("noLetters.title")}
              description={t("noLetters.description")}
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {visible.map((cv, index) => (
                <TailoredCVRow
                  key={cv._id}
                  cv={cv}
                  index={index}
                  onDownload={(e) => handleDownloadClick(e, cv)}
                  onDelete={(e) => handleTrashClick(e, cv._id)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        context={upgradeModalContext}
        job={paywallJob}
        cvId={paywallJob?.cvId}
      />
    </DashboardPageShell>
  );
}
