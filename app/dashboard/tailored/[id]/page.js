"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ResumePreview from "@/components/ResumePreview";
import ResumeForm from "@/components/ResumeForm";
import CoverLetterCard from "@/components/CoverLetterCard";
import TemplateSelect from "@/components/TemplateSelect";
import Loader from "@/components/Loader";

export default function TailoredCVDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("cv");
  const [showPreview, setShowPreview] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

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
      <div className="flex flex-col items-center justify-center min-h-screen">
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

  const handleDownload = async (tab) => {
    const { generateCVPdf, generateCoverLetterPdf, buildPdfFilename } =
      await import("@/utils/pdf-generator");
    if (tab === "cv") {
      const doc = generateCVPdf(resumeData, selectedTemplate);
      doc.save(buildPdfFilename(cv.basics?.name, cv.jobTitle, "cv"));
    } else {
      const doc = generateCoverLetterPdf(cv.coverLetter || "", {
        name: cv.basics?.name,
        jobTitle: cv.jobTitle,
        jobCompany: cv.jobCompany,
      });
      doc.save(
        buildPdfFilename(cv.basics?.name, cv.jobTitle, "cover-letter")
      );
    }
    toast.success("PDF downloaded!");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
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
              {new Date(cv.createdAt).toLocaleDateString()}
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
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "cv" ? "default" : "outline"}
              onClick={() => setActiveTab("cv")}
              className="gap-2"
            >
              <FileTextIcon size={16} />
              Tailored CV
            </Button>
            <Button
              variant={activeTab === "letter" ? "default" : "outline"}
              onClick={() => setActiveTab("letter")}
              className="gap-2"
            >
              <EnvelopeSimpleIcon size={16} />
              Cover Letter
            </Button>
          </div>

          <div className="flex items-center gap-2">
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
              <DownloadSimpleIcon size={16} />
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
    </div>
  );
}
