"use client";

import { useMemo, useState } from "react";
import { Cabinet } from "@lucasmarkes/hairline/react";
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
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";

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

function CardSkeleton() {
  return (
    <div className="dashboard-card flex min-h-36 flex-col gap-3 rounded-lg p-5">
      <div className="tool-skeleton h-4 w-2/3 rounded-sm" />
      <div className="tool-skeleton h-3 w-1/3 rounded-sm" />
      <div className="mt-auto space-y-2">
        <div className="tool-skeleton h-3 w-1/2 rounded-sm" />
        <div className="tool-skeleton h-3 w-2/5 rounded-sm" />
      </div>
    </div>
  );
}

// Teal's resume card: title on top, quiet actions top right that appear on
// hover, meta lines at the bottom. The whole card opens the CV.
function TailoredCVCard({ cv, index, onDownload, onDelete }) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("tailor.tailoredList");
  const title = cv.jobTitle || t("untitled");

  return (
    <m.li
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 6) * 0.03 }}
      className="min-w-0"
    >
      <div className="dashboard-list-row group relative flex h-full min-h-36 flex-col gap-4 rounded-lg p-5 focus-within:border-[var(--landing-ink)]">
        {/* Stretched link: the whole card navigates, but the action buttons
            stay siblings rather than children of an anchor. */}
        <Link
          href={`/dashboard/tailored/${cv._id}`}
          aria-label={t("open", { title })}
          className="absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        <div className="flex items-start gap-2">
          <div className="pointer-events-none relative z-10 min-w-0 flex-1">
            <p className="line-clamp-2 font-outfit text-base font-semibold leading-6 text-foreground group-hover:underline">
              {title}
            </p>
            {cv.jobCompany && (
              <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                <BuildingsIcon size={14} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{cv.jobCompany}</span>
              </p>
            )}
          </div>
          <div className="-me-2 -mt-1 flex shrink-0 items-center">
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
          </div>
        </div>

        <div className="pointer-events-none relative z-10 mt-auto flex flex-col gap-1 text-xs text-muted-foreground">
          {cv.hasCoverLetter ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--landing-success)]">
              <CheckCircleIcon size={14} weight="fill" aria-hidden="true" />
              {t("coverLetter")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <EnvelopeSimpleIcon size={14} aria-hidden="true" />
              {t("noLetter")}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <CalendarIcon size={14} className="shrink-0" aria-hidden="true" />
            <FormattedDate date={cv.createdAt} options={DATE_FORMAT} />
          </span>
        </div>
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
  const [search, setSearch] = useState("");
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
  const query = search.trim().toLowerCase();
  const visible = useMemo(() => {
    const base = filter === "letter" ? withLetter : sorted;
    if (!query) return base;
    return base.filter((cv) =>
      `${cv.jobTitle ?? ""} ${cv.jobCompany ?? ""}`.toLowerCase().includes(query),
    );
  }, [filter, withLetter, sorted, query]);

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
      <DashboardPageShell>
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="tool-skeleton h-control w-56 rounded-md" />
            <div className="tool-skeleton h-control w-full rounded-md sm:w-64" />
          </div>
          <ul className={GRID} aria-busy="true" aria-label={t("loading")}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <CardSkeleton />
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
    <DashboardPageShell>
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
          figure={Cabinet}
          title={t("empty.title")}
          description={
            hasReferenceCV ? t("empty.withCv") : t("empty.noCv")
          }
          actionLabel={hasReferenceCV ? t("tailorCta") : t("empty.upload")}
          actionHref={hasReferenceCV ? "/dashboard/tailor" : "/dashboard/resume"}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DashboardFilterPills
              tabs={[
                { key: "all", label: t("filters.all"), count: sorted.length },
                { key: "letter", label: t("filters.letter"), count: withLetter.length },
              ]}
              activeKey={filter}
              onChange={setFilter}
            />
            <div className="relative w-full sm:w-64">
              <MagnifyingGlassIcon
                size={16}
                className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label={t("search")}
                placeholder={t("search")}
                className="h-control ps-9"
              />
            </div>
          </div>
          {visible.length === 0 ? (
            query ? (
              <DashboardEmptyState
                compact
                icon={MagnifyingGlassIcon}
                title={t("noMatches.title")}
                description={t("noMatches.description")}
              />
            ) : (
              <DashboardEmptyState
                compact
                icon={CheckCircleIcon}
                title={t("noLetters.title")}
                description={t("noLetters.description")}
              />
            )
          ) : (
            <ul className={GRID}>
              {visible.map((cv, index) => (
                <TailoredCVCard
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
