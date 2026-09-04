"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  BuildingsIcon,
  CalendarIcon,
  CheckIcon,
  FileTextIcon,
  TrashIcon,
  ArrowRightIcon,
  PlusIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
} from "@/components/dashboard";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE } from "@/utils/cv-templates/metadata";
import { cn } from "@/lib/utils";

const PAGE_TITLE = "Tailored CVs";
const PAGE_DESCRIPTION = "View all your previously tailored resumes and cover letters.";
const DATE_FORMAT = { month: "short", day: "numeric", year: "numeric" };

/**
 * Row action button. Hidden until the row is hovered on pointer devices —
 * touch has no hover, so below `sm` they stay visible. `force` keeps a button
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
            "relative z-10 shrink-0 text-[var(--landing-ink-soft)] transition-opacity",
            "hover:bg-[var(--landing-primary-soft)] hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring/40",
            force
              ? "opacity-100"
              : "max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
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

export default function TailoredCVsPage() {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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
        filename: buildPdfFilename(data.basics?.name, data.jobTitle, "cv"),
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
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        action={
          cvs?.length > 0 ? (
            <Button
              asChild
              className="rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90"
            >
              <Link href="/dashboard/tailor">
                <PlusIcon size={16} />
                Tailor new
              </Link>
            </Button>
          ) : null
        }
      />

      {!cvs || cvs.length === 0 ? (
        <DashboardEmptyState
          icon={FileTextIcon}
          title="No tailored CVs yet"
          description={
            hasReferenceCV
              ? "Paste a job listing URL and we'll tailor your CV to match the role."
              : "Upload your base CV first, then paste any job URL to generate a tailored version."
          }
          actionLabel={hasReferenceCV ? "Tailor your first resume" : "Upload your CV"}
          actionHref={hasReferenceCV ? "/dashboard/tailor" : "/dashboard/resume"}
        />
      ) : (
        <div className="space-y-2">
          <p className="text-right text-xs text-muted-foreground">
            {cvs.length} tailored {cvs.length === 1 ? "CV" : "CVs"}
          </p>
          {cvs.map((cv, index) => {
            const title = cv.jobTitle || "Untitled Position";
            const confirming = confirmDeleteId === cv._id;

            return (
              <motion.div
                key={cv._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card className="dashboard-list-row group relative rounded-2xl border-border py-0 gap-0">
                  <CardContent className="dashboard-row-pad flex items-center gap-3">
                    {/* Stretched link: the whole row navigates, but the action
                        buttons stay siblings rather than children of an anchor. */}
                    <Link
                      href={`/dashboard/tailored/${cv._id}`}
                      aria-label={title}
                      className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] font-outfit text-sm font-semibold text-[var(--landing-primary-dark)]">
                      {(cv.jobCompany?.[0] ?? cv.jobTitle?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="relative z-10 min-w-0 flex-1 pointer-events-none">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:underline">
                        {title}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        {cv.jobCompany && (
                          <span className="inline-flex items-center gap-1">
                            <BuildingsIcon size={12} aria-hidden="true" />
                            {cv.jobCompany}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon size={12} aria-hidden="true" />
                          <FormattedDate date={cv.createdAt} options={DATE_FORMAT} />
                        </span>
                      </div>
                    </div>

                    <RowAction
                      label={`Download ${title}`}
                      onClick={(e) => handleDownloadClick(e, cv)}
                    >
                      <DownloadSimpleIcon size={16} aria-hidden="true" />
                    </RowAction>

                    <RowAction
                      label={confirming ? "Click again to delete" : `Delete ${title}`}
                      force={confirming}
                      disabled={deleteMutation.isPending}
                      onClick={(e) => handleTrashClick(e, cv._id)}
                      className={cn(
                        "hover:bg-red-50 hover:text-red-600",
                        confirming && "bg-red-50 text-red-600"
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
                      className="shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </DashboardPageShell>
  );
}
