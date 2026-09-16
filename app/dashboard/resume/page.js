"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  ArrowCounterClockwiseIcon,
  DownloadSimpleIcon,
  EyeIcon,
  PencilSimpleIcon,
  FileTextIcon,
  ListChecksIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  TagIcon,
  ClockIcon,
  UploadSimpleIcon,
  SparkleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import ResumeUpload from "@/components/ResumeUpload";
import ResumeForm from "@/components/ResumeForm";
import { ResumeTemplate } from "@/components/ResumePreview";
import TemplatePicker from "@/components/TemplatePicker";
import Loader from "@/components/Loader";
import { ScaledDocument } from "@/components/cv/ScaledDocument";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatStrip,
  DashboardTabBar,
} from "@/components/dashboard";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import {
  DEFAULT_TEMPLATE,
  TEMPLATE_METADATA,
  getTemplateDefaultStyle,
} from "@/utils/cv-templates/metadata";
import { normalizeTemplateStyle } from "@/utils/cv-templates/style";
import { cn } from "@/lib/utils";

function buildResumeData(source) {
  return {
    basics: source?.basics ?? {},
    work: source?.work ?? [],
    education: source?.education ?? [],
    skills: source?.skills ?? [],
  };
}

function formatSavedAt(value, now) {
  if (!value) return null;
  const date = new Date(value);
  const diffMs = now - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const MOBILE_TABS = [
  {
    id: "edit",
    label: "Edit",
    icon: <PencilSimpleIcon size={14} aria-hidden="true" />,
  },
  {
    id: "preview",
    label: "Preview",
    icon: <EyeIcon size={14} aria-hidden="true" />,
  },
];

const UPLOAD_STEPS = [
  {
    icon: UploadSimpleIcon,
    title: "Upload a PDF",
    body: "One file, up to 8MB.",
  },
  {
    icon: SparkleIcon,
    title: "We extract the details",
    body: "Experience, education, skills and contact details, in editable fields.",
  },
  {
    icon: CheckCircleIcon,
    title: "You review and save",
    body: "Fix anything that looks off. Nothing is stored until you save.",
  },
];

function UploadPanel({ onParsed, replacing }) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-12">
      <DashboardPanel delay={0.05} className="lg:col-span-5">
        <h2 className="font-outfit text-sm font-semibold text-foreground">
          How it works
        </h2>
        <ol className="mt-4 flex flex-col gap-4">
          {UPLOAD_STEPS.map((step) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
                <step.icon size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>
                <p className="mt-0.5 text-sm leading-6 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {replacing && (
          <p className="mt-5 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-2.5 text-xs leading-5 text-[var(--landing-ink-soft)]">
            Your current CV stays until you save the new one. Its template and
            style carry over.
          </p>
        )}
      </DashboardPanel>
      <DashboardPanel delay={0.1} className="lg:col-span-7">
        <ResumeUpload onParsed={onParsed} />
      </DashboardPanel>
    </div>
  );
}

export default function MyResumePage() {
  const queryClient = useQueryClient();
  const [parsedData, setParsedData] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [mobileTab, setMobileTab] = useState("edit");
  const [templateOverride, setTemplateOverride] = useState(null);
  const [styleOverride, setStyleOverride] = useState(null);
  const [liveValues, setLiveValues] = useState(null);
  const [liveReport, setLiveReport] = useState(null);
  const [now] = useState(() => Date.now());

  const { data: savedCV, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch resume");
      const json = await res.json();
      return json.data;
    },
  });

  const selectedTemplate =
    templateOverride ?? savedCV?.template ?? DEFAULT_TEMPLATE;
  // An unsaved local change wins over the stored value, which wins over the
  // template's own look. Without the last step a CV saved before styles
  // existed would render with the global default instead of its layout's.
  const selectedStyle = normalizeTemplateStyle(
    styleOverride ??
      savedCV?.templateStyle ??
      getTemplateDefaultStyle(selectedTemplate),
  );
  const templateName =
    TEMPLATE_METADATA.find((t) => t.id === selectedTemplate)?.name ??
    selectedTemplate;

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
        description:
          "Your change is still on screen. Check your connection and try again.",
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
    templateMutation.mutate({
      template: selectedTemplate,
      templateStyle: nextStyle,
    });
  };

  const handleParsed = (data) => {
    setParsedData(data);
    setLiveValues(null);
    setLiveReport(null);
    setShowUploadForm(false);
    setMobileTab("edit");
  };

  const handleReUpload = () => {
    setShowUploadForm(true);
  };

  const handleValuesChange = useCallback((values, report) => {
    setLiveValues(values);
    setLiveReport(report);
  }, []);

  const source = parsedData ?? savedCV;
  const storedData = useMemo(() => buildResumeData(source), [source]);
  const previewData = liveValues ? buildResumeData(liveValues) : storedData;

  const handleDownload = () => {
    printDocument({
      kind: "cv",
      data: previewData,
      template: selectedTemplate,
      style: selectedStyle,
      filename: buildPdfFilename(previewData.basics?.name, "cv"),
    });
  };

  if (isLoading) return <Loader />;

  // Upload flows: first CV, or replacing the saved one.
  if (showUploadForm || (!savedCV && !parsedData)) {
    const replacing = Boolean(savedCV);
    return (
      <DashboardPageShell width="full">
        {replacing && (
          <button
            type="button"
            onClick={() => setShowUploadForm(false)}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon size={16} aria-hidden="true" />
            Back to my CV
          </button>
        )}
        <DashboardPageHeader
          title={replacing ? "Replace your CV" : "Upload your CV"}
          description={
            replacing
              ? "Upload a new PDF. You will review the extracted details before anything changes."
              : "Upload your CV as a PDF. Every tailored application starts from it."
          }
        />
        <UploadPanel onParsed={handleParsed} replacing={replacing} />
      </DashboardPageShell>
    );
  }

  const isDraft = Boolean(parsedData);
  const savedAt = formatSavedAt(savedCV?.updatedAt, now);

  return (
    <DashboardPageShell width="full">
      <DashboardPageHeader
        title={isDraft ? "Review your CV" : "My CV"}
        description={
          isDraft
            ? "We extracted this from your PDF. Fix anything that looks off, then save."
            : "Your reference CV. Every tailored CV and cover letter starts from here."
        }
        actions={
          <>
            {isDraft && savedCV && (
              <button
                type="button"
                onClick={() => {
                  setParsedData(null);
                  setLiveValues(null);
                  setLiveReport(null);
                }}
                className="dashboard-secondary-btn"
              >
                <ArrowLeftIcon size={16} aria-hidden="true" />
                Discard and keep saved CV
              </button>
            )}
            <button
              type="button"
              onClick={handleReUpload}
              className="dashboard-secondary-btn"
            >
              <ArrowCounterClockwiseIcon size={16} aria-hidden="true" />
              {isDraft ? "Upload a different PDF" : "Replace CV"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="dashboard-primary-btn"
            >
              <DownloadSimpleIcon size={16} aria-hidden="true" />
              Download PDF
            </button>
          </>
        }
      />

      <DashboardStatStrip
        columns={5}
        items={[
          {
            icon: ListChecksIcon,
            label: "CV checks",
            value: liveReport
              ? `${liveReport.passedChecks} of ${liveReport.totalChecks} passed`
              : "Checking",
            tone: "accent",
          },
          {
            icon: BriefcaseIcon,
            label: "Positions",
            value: previewData.work?.length ?? 0,
          },
          {
            icon: GraduationCapIcon,
            label: "Education",
            value: previewData.education?.length ?? 0,
          },
          {
            icon: TagIcon,
            label: "Skill groups",
            value: previewData.skills?.length ?? 0,
          },
          isDraft
            ? { icon: FileTextIcon, label: "Template", value: templateName }
            : {
                icon: ClockIcon,
                label: "Last saved",
                value: savedAt ?? "Not yet",
              },
        ]}
      />

      <DashboardTabBar
        ariaLabel="Edit or preview"
        tabs={MOBILE_TABS}
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        className="lg:hidden"
      />

      <div className="grid items-start gap-4 lg:grid-cols-12">
        <div
          className={cn(
            "min-w-0 lg:col-span-7",
            mobileTab === "preview" && "hidden lg:block",
          )}
        >
          <ResumeForm
            key={isDraft ? "draft" : (savedCV?._id ?? "saved")}
            initialData={storedData}
            rawText={source?.rawText}
            isDraft={isDraft}
            onValuesChange={handleValuesChange}
            onSaved={() => {
              setParsedData(null);
              setMobileTab("edit");
            }}
          />
        </div>

        <div
          className={cn(
            "min-w-0 lg:col-span-5",
            mobileTab === "edit" && "hidden lg:block",
          )}
        >
          <aside className="dashboard-card overflow-hidden rounded-lg lg:sticky lg:top-20">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--landing-line)] px-3 py-3">
              <div className="w-48 min-w-0 shrink-0 sm:w-56">
                <TemplatePicker
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  data={previewData}
                  style={selectedStyle}
                  onStyleChange={handleStyleChange}
                />
              </div>
              <p className="truncate text-xs text-muted-foreground">
                Updates as you type
              </p>
            </div>
            <div className="bg-white">
              <ScaledDocument>
                <ResumeTemplate
                  data={previewData}
                  template={selectedTemplate}
                  style={selectedStyle}
                />
              </ScaledDocument>
            </div>
          </aside>
        </div>
      </div>
    </DashboardPageShell>
  );
}
