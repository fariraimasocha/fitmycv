"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  BriefcaseIcon,
  BuildingsIcon,
  CalendarIcon,
  FileTextIcon,
  TrashIcon,
  ArrowRightIcon,
  PlusIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
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

  if (isLoading) return <Loader />;

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="Tailored CVs"
        description="View all your previously tailored resumes and cover letters."
        action={
          cvs?.length > 0 ? (
            <Button
              asChild
              className="rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90"
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
          {cvs.map((cv, index) => (
            <motion.div
              key={cv._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Link href={`/dashboard/tailored/${cv._id}`}>
                <Card className="dashboard-list-row group cursor-pointer rounded-2xl border-border py-0 gap-0">
                  <CardContent className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                      <FileTextIcon size={18} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:underline">
                        {cv.jobTitle || "Untitled Position"}
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
                          <FormattedDate date={cv.createdAt} />
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleDownloadClick(e, cv)}
                      aria-label={`Download ${cv.jobTitle || "CV"}`}
                    >
                      <DownloadSimpleIcon size={16} aria-hidden="true" />
                    </Button>
                    <Button
                      variant={confirmDeleteId === cv._id ? "destructive" : "ghost"}
                      size="icon-sm"
                      className="shrink-0 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                      disabled={deleteMutation.isPending}
                      onClick={(e) => handleTrashClick(e, cv._id)}
                      aria-label={
                        confirmDeleteId === cv._id
                          ? `Confirm delete ${cv.jobTitle || "CV"}`
                          : `Delete ${cv.jobTitle || "CV"}`
                      }
                    >
                      {confirmDeleteId === cv._id ? (
                        "?"
                      ) : (
                        <TrashIcon size={16} aria-hidden="true" />
                      )}
                    </Button>
                    <ArrowRightIcon
                      size={14}
                      className="hidden shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground sm:block"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </DashboardPageShell>
  );
}
