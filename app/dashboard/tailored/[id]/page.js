"use client";

import { useState } from "react";
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
import TemplateSelect from "@/components/TemplateSelect";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";

export default function TailoredCVDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("cv");
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data: cv, isLoading } = useQuery({
    queryKey: ["tailored-cv", id],
    queryFn: async () => {
      const res = await fetch(`/api/tailored-cv/${id}`);
      if (!res.ok) throw new Error("Failed to fetch tailored CV");
      const json = await res.json();
      return json.data;
    },
  });

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
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Tailored CV not found.</p>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => router.push("/dashboard/tailored")}
        >
          <ArrowLeftIcon size={16} />
          Back to list
        </Button>
      </div>
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
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => router.push("/dashboard/tailored")}
        >
          <ArrowLeftIcon size={16} />
          Back to Tailored CVs
        </Button>

        <div>
          <h1 className="text-2xl font-bold">
            {cv.jobTitle || "Untitled Position"}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {cv.jobCompany && (
              <span className="flex items-center gap-1">
                <BuildingsIcon size={14} />
                {cv.jobCompany}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarIcon size={14} />
              <FormattedDate date={cv.createdAt} />
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-4"
      >
        <div className="flex flex-col gap-3">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,transparent_0,black_8px,black_calc(100%-8px),transparent_100%)]">
            <Button
              variant={activeTab === "cv" ? "default" : "outline"}
              onClick={() => setActiveTab("cv")}
              className="gap-2 shrink-0"
            >
              <FileTextIcon size={16} />
              Tailored CV
            </Button>
            <Button
              variant={activeTab === "letter" ? "default" : "outline"}
              onClick={() => setActiveTab("letter")}
              className="gap-2 shrink-0"
            >
              <EnvelopeSimpleIcon size={16} />
              Cover Letter
            </Button>
          </div>

          {/* Actions row */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === "cv" && (
              <>
                <Button
                  variant="outline"
                  className="rounded-full"
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
                <TemplateSelect
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                />
              </>
            )}
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => handleDownload(activeTab)}
            >
              {session?.user?.isPremium ? (
                <DownloadSimpleIcon size={16} />
              ) : (
                <CrownIcon size={16} className="text-amber-500" />
              )}
              Download PDF
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
            onSave={(content) => coverLetterMutation.mutate(content)}
            isSaving={coverLetterMutation.isPending}
          />
        )}
      </motion.div>

      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
