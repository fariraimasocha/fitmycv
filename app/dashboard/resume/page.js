"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ResumeUpload from "@/components/ResumeUpload";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import TemplateSelect from "@/components/TemplateSelect";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
  CvEditorToolbar,
  CvPreviewActions,
} from "@/components/dashboard";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";

function buildResumeData(source) {
  return {
    basics: source.basics,
    work: source.work,
    education: source.education,
    skills: source.skills,
  };
}

export default function MyResumePage() {
  const [parsedData, setParsedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  const { data: savedCV, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch resume");
      const json = await res.json();
      return json.data;
    },
  });

  const handleParsed = (data) => {
    setParsedData(data);
    setShowPreview(false);
    setShowUploadForm(false);
  };

  const handleReUpload = () => {
    setParsedData(null);
    setShowPreview(false);
    setShowUploadForm(true);
  };

  const handleDownload = (resumeData) => {
    printDocument({
      kind: "cv",
      data: resumeData,
      template: selectedTemplate,
      filename: buildPdfFilename(resumeData.basics?.name, null, "cv"),
    });
  };

  const renderEditor = (resumeData, rawText, saveProps = {}) => (
    <>
      {showPreview ? (
        <div className="space-y-3">
          <CvPreviewActions
            templateSelect={
              <TemplateSelect value={selectedTemplate} onChange={setSelectedTemplate} />
            }
            onDownload={() => handleDownload(resumeData)}
          />
          <div className="dashboard-card overflow-hidden rounded-2xl border-border">
            <ResumePreview data={resumeData} template={selectedTemplate} />
          </div>
        </div>
      ) : (
        <ResumeForm initialData={resumeData} rawText={rawText} {...saveProps} />
      )}
    </>
  );

  if (isLoading) return <Loader />;

  if (parsedData) {
    const resumeData = buildResumeData(parsedData);
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader
          eyebrow="CV Toolkit"
          title="Review your CV"
          description="Check the parsed details below, then save to your profile."
          action={
            <CvEditorToolbar
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview((v) => !v)}
              onUploadNew={handleReUpload}
              uploadLabel="Re-upload"
            />
          }
        />
        {renderEditor(resumeData, parsedData.rawText)}
      </DashboardPageShell>
    );
  }

  if (showUploadForm) {
    return (
      <DashboardPageShell width="narrow">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-1 w-fit rounded-full"
          onClick={() => setShowUploadForm(false)}
        >
          <ArrowLeftIcon size={16} aria-hidden="true" />
          Back
        </Button>
        <DashboardPageHeader
          eyebrow="CV Toolkit"
          title="Upload new CV"
          description="Replace your current CV with a new PDF. We'll extract and structure it automatically."
        />
        <ResumeUpload onParsed={handleParsed} />
      </DashboardPageShell>
    );
  }

  if (savedCV) {
    const resumeData = buildResumeData(savedCV);
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader
          eyebrow="CV Toolkit"
          title="My CV"
          description="Your reference CV powers every tailored application. Keep it up to date."
          action={
            <CvEditorToolbar
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview((v) => !v)}
              onUploadNew={handleReUpload}
            />
          }
        />
        {renderEditor(resumeData, savedCV.rawText)}
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        eyebrow="CV Toolkit"
        title="Upload your CV"
        description="Upload a PDF and we'll extract your experience, education, and skills into an editable profile."
      />
      <ResumeUpload onParsed={handleParsed} />
    </DashboardPageShell>
  );
}
