"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
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
  DashboardFilterPills,
} from "@/components/dashboard";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE } from "@/utils/cv-templates/metadata";
import { cn } from "@/lib/utils";

const PAGE_TITLE = "Tailored CVs";
const PAGE_DESCRIPTION = "Every CV you tailor is saved here. Open one to edit, download or write a cover letter.";
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

function TailoredCVRow({ cv, index, confirming, deletePending, onDownload, onDelete }) {
  const reduceMotion = useReducedMotion();
  const title = cv.jobTitle || "Untitled position";

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 6) * 0.03 }}
    >
      <div className="dashboard-list-row dashboard-row-pad group relative flex items-center gap-3 focus-within:border-[var(--landing-ink)]">
        {/* Stretched link: the whole row navigates, but the action buttons
            stay siblings rather than children of an anchor. */}
        <Link
          href={`/dashboard/tailored/${cv._id}`}
          aria-label={`Open ${title}`}
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
                Cover letter
              </span>
            )}
          </div>
        </div>

        <RowAction label={`Download ${title}`} onClick={onDownload}>
          <DownloadSimpleIcon size={16} aria-hidden="true" />
        </RowAction>

        <RowAction
          label={confirming ? "Click again to delete" : `Delete ${title}`}
          force={confirming}
          disabled={deletePending}
          onClick={onDelete}
          className={cn(
            "hover:bg-destructive/10 hover:text-destructive",
            confirming && "bg-destructive/10 text-destructive"
          )}
        >
          {confirming ? (
            <CheckIcon size={16} weight="bold" aria-hidden="true" />
          ) : (
            <TrashIcon size={16} aria-hidden="true" />
          )}
        </RowAction>

        <ArrowRightIcon
          size={14}
          className="shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </motion.li>
  );
}

export default function TailoredCVsPage() {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: cvs, isLoading } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: async () => {
      const res = await fetch("/api/tailored-cv");
      if (!res.ok) throw new Error("Failed to fetch tailored CVs");
      const json = await res.json();
      return json.data;
    },
  });

  const { data: referenceCV } = useQuery({
    queryKey: ["reference-cv"],
    queryFn: () => fetch("/api/reference-cv").then((r) => r.json()),
  });

  const hasReferenceCV = !!referenceCV?.data;

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/tailored-cv/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete CV");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tailored-cvs"] });
      toast.success("CV deleted");
      setConfirmDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setConfirmDeleteId(null);
    },
  });

  const sorted = useMemo(
    () =>
      [...(cvs ?? [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    [cvs],
  );
  const withLetter = useMemo(
    () => sorted.filter((cv) => cv.hasCoverLetter),
    [sorted],
  );
  const visible = filter === "letter" ? withLetter : sorted;

  const handleDownloadClick = async (e, cv) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user?.isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    try {
      const res = await fetch(`/api/tailored-cv/${cv._id}`);
      if (!res.ok) throw new Error("Failed to load CV");
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
        filename: buildPdfFilename(data.basics?.name, "cv"),
      });
    } catch (error) {
      toast.error(error.message || "Could not download PDF");
    }
  };

  const handleTrashClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeleteId === id) {
      deleteMutation.mutate(id);
    } else {
      setConfirmDeleteId(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardPageShell width="wide">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <div className="flex flex-col gap-3">
          <div className="tool-skeleton h-9 w-56 rounded-md" />
          <ul className="flex flex-col gap-2" aria-busy="true" aria-label="Loading tailored CVs">
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

  const isEmpty = !cvs || cvs.length === 0;

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          !isEmpty ? (
            <Link href="/dashboard/tailor" className="dashboard-primary-btn">
              <PlusIcon size={16} weight="bold" aria-hidden="true" />
              Tailor a CV
            </Link>
          ) : null
        }
      />

      {isEmpty ? (
        <DashboardEmptyState
          icon={FileTextIcon}
          title="Your tailored CVs will appear here"
          description={
            hasReferenceCV
              ? "Paste a job link and we rewrite your CV for that role. Each one is saved here."
              : "Upload your CV first. Then paste a job link and we rewrite it for that role."
          }
          actionLabel={hasReferenceCV ? "Tailor a CV" : "Upload your CV"}
          actionHref={hasReferenceCV ? "/dashboard/tailor" : "/dashboard/resume"}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <DashboardFilterPills
            tabs={[
              { key: "all", label: "All", count: sorted.length },
              { key: "letter", label: "With cover letter", count: withLetter.length },
            ]}
            activeKey={filter}
            onChange={setFilter}
          />
          {visible.length === 0 ? (
            <DashboardEmptyState
              compact
              icon={CheckCircleIcon}
              title="No cover letters yet"
              description="Open a tailored CV and write one from the Cover letter tab."
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {visible.map((cv, index) => (
                <TailoredCVRow
                  key={cv._id}
                  cv={cv}
                  index={index}
                  confirming={confirmDeleteId === cv._id}
                  deletePending={deleteMutation.isPending}
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
      />
    </DashboardPageShell>
  );
}
