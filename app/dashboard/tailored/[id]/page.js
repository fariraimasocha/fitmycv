"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  FileTextIcon,
  EnvelopeSimpleIcon,
  BuildingsIcon,
  CalendarIcon,
  EyeIcon,
  PencilSimpleIcon,
  DownloadSimpleIcon,
  CrownIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ResumePreview from "@/components/ResumePreview";
import ResumeForm from "@/components/ResumeForm";
import CoverLetterCard from "@/components/CoverLetterCard";
import TemplatePicker from "@/components/TemplatePicker";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE, getTemplateFontClass, getTemplateName } from "@/utils/cv-templates/metadata";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardTabBar,
} from "@/components/dashboard";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

export default function TailoredCVDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("cv");
  const [showPreview, setShowPreview] = useState(true);
  const [templateOverride, setTemplateOverride] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);

  const { data: cv, isLoading } = useQuery({
    queryKey: ["tailored-cv", id],
    queryFn: async () => {
      const res = await fetch(`/api/tailored-cv/${id}`);
      if (!res.ok) throw new Error("Failed to fetch tailored CV");
      const json = await res.json();
      return json.data;
    },
  });

  useEffect(() => {
    if (cv?.jobTitle) setDetailLabel(cv.jobTitle);
    return () => setDetailLabel(null);
  }, [cv?.jobTitle, setDetailLabel]);

  const { data: referenceCV } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch resume");
      const json = await res.json();
      return json.data;
    },
  });

  const selectedTemplate = templateOverride ?? referenceCV?.template ?? DEFAULT_TEMPLATE;

  const templateMutation = useMutation({
    mutationFn: async (template) => {
      const res = await fetch("/api/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template }),
      });
      if (!res.ok) throw new Error("Failed to save template");
      return res.json();
    },
    onSuccess: (json) => {
      if (json.data) queryClient.setQueryData(["resume"], json.data);
    },
  });

  const handleTemplateChange = (template) => {
    setTemplateOverride(template);
    templateMutation.mutate(template);
  };

  const coverLetterMutation = useMutation({
    mutationFn: async (coverLetter) => {
      const res = await fetch(`/api/tailored-cv/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Cover letter saved!");
      queryClient.invalidateQueries({ queryKey: ["tailored-cv", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!cv) {
    return (
      <DashboardPageShell width="narrow">
        <p className="text-center text-sm text-[var(--landing-ink-soft)]">Tailored CV not found.</p>
        <Button
          variant="outline"
          className="mx-auto mt-4 rounded-[10px]"
          onClick={() => router.push("/dashboard/tailored")}
        >
          <ArrowLeftIcon size={16} />
          Back to list
        </Button>
      </DashboardPageShell>
    );
  }

  const resumeData = {
    basics: cv.basics,
    work: cv.work,
    education: cv.education,
    skills: cv.skills,
  };

  const handleDownload = (tab) => {
    if (!session?.user?.isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    if (tab === "cv") {
      printDocument({
        kind: "cv",
        data: resumeData,
        template: selectedTemplate,
        filename: buildPdfFilename(cv.basics?.name, cv.jobTitle, "cv"),
      });
    } else {
      printDocument({
        kind: "cover-letter",
        content: cv.coverLetter || "",
        template: selectedTemplate,
        meta: {
          name: cv.basics?.name,
          jobTitle: cv.jobTitle,
          jobCompany: cv.jobCompany,
        },
        filename: buildPdfFilename(cv.basics?.name, cv.jobTitle, "cover-letter"),
      });
    }
  };

  return (
    <DashboardPageShell width="narrow" className="pb-24 md:pb-6">
      <button
        type="button"
        onClick={() => router.push("/dashboard/tailored")}
        className="flex items-center gap-1 text-sm text-[var(--landing-ink-soft)] transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon size={14} />
        Back to Tailored CVs
      </button>

      <DashboardPageHeader
        title={cv.jobTitle || "Untitled Position"}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-7 text-[var(--landing-ink-soft)]">
            {cv.jobCompany && (
              <span className="inline-flex items-center gap-1">
                <BuildingsIcon size={14} />
                {cv.jobCompany}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <CalendarIcon size={14} />
              <FormattedDate date={cv.createdAt} />
            </span>
          </span>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-4"
      >
        <div className="flex flex-col gap-3">
          <DashboardTabBar
            tabs={[
              { id: "cv", label: "Tailored CV", icon: <FileTextIcon size={14} aria-hidden="true" /> },
              { id: "letter", label: "Cover Letter", icon: <EnvelopeSimpleIcon size={14} aria-hidden="true" /> },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ariaLabel="Tailored document sections"
          />

          <div className="hidden items-center gap-2 sm:flex sm:flex-wrap">
            {activeTab === "cv" && (
              <>
                <Button
                  variant="outline"
                  className="rounded-[10px] border-border"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <>
                      <PencilSimpleIcon size={16} />
                      Edit
                    </>
                  ) : (
                    <>
                      <EyeIcon size={16} />
                      Preview
                    </>
                  )}
                </Button>
                <div className="w-56">
                  <TemplatePicker
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    data={resumeData}
                  />
                </div>
              </>
            )}
            <Button
              className="rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90"
              onClick={() => handleDownload(activeTab)}
            >
              {session?.user?.isPremium ? (
                <DownloadSimpleIcon size={16} />
              ) : (
                <CrownIcon size={16} />
              )}
              Download PDF · {getTemplateName(selectedTemplate)}
            </Button>
          </div>
        </div>

        {activeTab === "cv" && (
          showPreview ? (
            <ResumePreview data={resumeData} template={selectedTemplate} />
          ) : (
            <ResumeForm
              initialData={resumeData}
              saveEndpoint={`/api/tailored-cv/${id}`}
              saveMethod="PUT"
              queryKey={["tailored-cv", id]}
              saveButtonLabel="Save Tailored CV"
            />
          )
        )}

        {activeTab === "letter" && (
          <CoverLetterCard
            content={cv.coverLetter || ""}
            editable
            fontClass={getTemplateFontClass(selectedTemplate)}
            onSave={(content) => coverLetterMutation.mutate(content)}
            isSaving={coverLetterMutation.isPending}
          />
        )}
      </motion.div>

      {(activeTab === "cv" || activeTab === "letter") && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--landing-line)] bg-[var(--landing-bg)]/95 p-3 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            {activeTab === "cv" && (
              <div className="min-w-0 flex-1">
                <TemplatePicker
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  data={resumeData}
                />
              </div>
            )}
            <Button
              className="h-11 shrink-0 rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90"
              onClick={() => handleDownload(activeTab)}
            >
              Download PDF · {getTemplateName(selectedTemplate)}
            </Button>
          </div>
        </div>
      )}

      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </DashboardPageShell>
  );
}
