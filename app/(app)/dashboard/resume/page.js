"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
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
import { dateLocale } from "@/i18n/routing";

function buildResumeData(source) {
  return {
    basics: source?.basics ?? {},
    work: source?.work ?? [],
    education: source?.education ?? [],
    skills: source?.skills ?? [],
  };
}

function formatSavedAt(value, now, t, locale) {
  if (!value) return null;
  const date = new Date(value);
  const diffMs = now - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t("hoursAgo", { count: hours });
  const days = Math.round(hours / 24);
  if (days === 1) return t("yesterday");
  if (days < 7) return t("daysAgo", { count: days });
  return date.toLocaleDateString(dateLocale(locale), {
    day: "numeric",
    month: "short",
  });
}

const MOBILE_TABS = [
  {
    id: "edit",
    icon: <PencilSimpleIcon size={14} aria-hidden="true" />,
  },
  {
    id: "preview",
    icon: <EyeIcon size={14} aria-hidden="true" />,
  },
];

const UPLOAD_STEPS = [
  { key: "upload", icon: UploadSimpleIcon },
  { key: "read", icon: SparkleIcon },
  { key: "review", icon: CheckCircleIcon },
];

function UploadPanel({ onParsed, replacing }) {
  const t = useTranslations("tailor.resume.uploadPanel");
  return (
    <div className="grid items-start gap-4 lg:grid-cols-12">
      <DashboardPanel delay={0.05} className="lg:col-span-5">
        <h2 className="font-outfit text-sm font-semibold text-foreground">
          {t("title")}
        </h2>
        <ol className="mt-4 flex flex-col gap-4">
          {UPLOAD_STEPS.map((step) => (
            <li key={step.key} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
                <step.icon size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t(`steps.${step.key}.title`)}
                </p>
                <p className="mt-0.5 text-sm leading-6 text-muted-foreground">
                  {t(`steps.${step.key}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {replacing && (
          <p className="mt-5 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-2.5 text-xs leading-5 text-[var(--landing-ink-soft)]">
            {t("replacingNote")}
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
  const t = useTranslations("tailor.resume");
  const locale = useLocale();
  const mobileTabs = MOBILE_TABS.map((tab) => ({
    ...tab,
    label: t(`tabs.${tab.id}`),
  }));

  const { data: savedCV, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Couldn't load your CV. Refresh the page.");
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
      if (!res.ok) throw new Error("Couldn't save your template. Try again.");
      return res.json();
    },
    onSuccess: (json) => {
      if (json.data) queryClient.setQueryData(["resume"], json.data);
    },
    onError: () => {
      toast.error(t("templateSaveError.title"), {
        description: t("templateSaveError.description"),
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
            {t("backToCv")}
          </button>
        )}
        <DashboardPageHeader
          title={replacing ? t("replace.title") : t("upload.title")}
          description={
            replacing ? t("replace.description") : t("upload.description")
          }
        />
        <UploadPanel onParsed={handleParsed} replacing={replacing} />
      </DashboardPageShell>
    );
  }

  const isDraft = Boolean(parsedData);
  const savedAt = formatSavedAt(
    savedCV?.updatedAt,
    now,
    (key, values) => t(`savedAt.${key}`, values),
    locale,
  );

  return (
    <DashboardPageShell width="full">
      <DashboardPageHeader
        title={isDraft ? t("review.title") : t("saved.title")}
        description={
          isDraft ? t("review.description") : t("saved.description")
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
                {t("discard")}
              </button>
            )}
            <button
              type="button"
              onClick={handleReUpload}
              className="dashboard-secondary-btn"
            >
              <ArrowCounterClockwiseIcon size={16} aria-hidden="true" />
              {isDraft ? t("uploadDifferent") : t("replaceCv")}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="dashboard-primary-btn"
            >
              <DownloadSimpleIcon size={16} aria-hidden="true" />
              {t("downloadPdf")}
            </button>
          </>
        }
      />

      <DashboardStatStrip
        columns={5}
        items={[
          {
            icon: ListChecksIcon,
            label: t("stats.checks"),
            value: liveReport
              ? t("stats.checksPassed", {
                  passed: liveReport.passedChecks,
                  total: liveReport.totalChecks,
                })
              : t("stats.checking"),
            tone: "accent",
          },
          {
            icon: BriefcaseIcon,
            label: t("stats.positions"),
            value: previewData.work?.length ?? 0,
          },
          {
            icon: GraduationCapIcon,
            label: t("stats.education"),
            value: previewData.education?.length ?? 0,
          },
          {
            icon: TagIcon,
            label: t("stats.skillGroups"),
            value: previewData.skills?.length ?? 0,
          },
          isDraft
            ? { icon: FileTextIcon, label: t("stats.template"), value: templateName }
            : {
                icon: ClockIcon,
                label: t("stats.lastSaved"),
                value: savedAt ?? t("stats.notYet"),
              },
        ]}
      />

      <DashboardTabBar
        ariaLabel={t("tabs.ariaLabel")}
        tabs={mobileTabs}
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
                {t("liveUpdates")}
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
