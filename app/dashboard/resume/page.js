"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ResumeUpload from "@/components/ResumeUpload";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import TemplatePicker from "@/components/TemplatePicker";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
  CvEditorToolbar,
  CvPreviewActions,
} from "@/components/dashboard";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE, getTemplateDefaultStyle } from "@/utils/cv-templates/metadata";
import { normalizeTemplateStyle } from "@/utils/cv-templates/style";

function buildResumeData(source) {
  return {
    basics: source.basics,
    work: source.work,
    education: source.education,
    skills: source.skills,
  };
}

export default function MyResumePage() {
  const queryClient = useQueryClient();
  const [parsedData, setParsedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [templateOverride, setTemplateOverride] = useState(null);
  const [styleOverride, setStyleOverride] = useState(null);

  const { data: savedCV, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch resume");
      const json = await res.json();
      return json.data;
    },
  });

  const selectedTemplate = templateOverride ?? savedCV?.template ?? DEFAULT_TEMPLATE;
  // An unsaved local change wins over the stored value, which wins over the
  // template's own look. Without the last step a CV saved before styles
  // existed would render with the global default instead of its layout's.
  const selectedStyle = normalizeTemplateStyle(
    styleOverride ?? savedCV?.templateStyle ?? getTemplateDefaultStyle(selectedTemplate),
  );

  const templateMutation = useMutation({
    mutationFn: async (patch) => {
      const res = await fetch("/api/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Failed to save template");
      return res.json();
    },
    onSuccess: (json) => {
      if (json.data) queryClient.setQueryData(["resume"], json.data);
    },
    onError: () => {
      toast.error("Could not save your template", {
        description: "Your change is still on screen. Check your connection and try again.",
      });
    },
  });

  // Switching template adopts that layout's own look, the same as the tailor
  // page. The style toolbar is in the same dialog to re-adjust from there.
  const handleTemplateChange = (template) => {
    setTemplateOverride(template);
    const nextStyle = getTemplateDefaultStyle(template);
    setStyleOverride(nextStyle);
    templateMutation.mutate({ template, templateStyle: nextStyle });
  };

  const handleStyleChange = (nextStyle) => {
    setStyleOverride(nextStyle);
    templateMutation.mutate({ template: selectedTemplate, templateStyle: nextStyle });
  };

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
      style: selectedStyle,
      filename: buildPdfFilename(resumeData.basics?.name, null, "cv"),
    });
  };

  const renderEditor = (resumeData, rawText, saveProps = {}) => (
    <>
      {showPreview ? (
        <div className="space-y-3">
          <CvPreviewActions
            templateSelect={
              <TemplatePicker
                value={selectedTemplate}
                onChange={handleTemplateChange}
                data={resumeData}
                style={selectedStyle}
                onStyleChange={handleStyleChange}
              />
            }
            onDownload={() => handleDownload(resumeData)}
          />
          <ResumePreview data={resumeData} template={selectedTemplate} style={selectedStyle} />
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
