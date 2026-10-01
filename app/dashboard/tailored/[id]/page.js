"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
  ChatCenteredTextIcon,
  BriefcaseIcon,
  TagIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { DownloadButton } from "@/components/ui/download-button";
import { ResumeTemplate } from "@/components/ResumePreview";
import ResumeForm from "@/components/ResumeForm";
import CoverLetterCard from "@/components/CoverLetterCard";
import WhyThisRoleCard from "@/components/WhyThisRoleCard";
import TemplatePicker from "@/components/TemplatePicker";
import FormattedDate from "@/components/FormattedDate";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import PreviewUnlockGate from "@/components/PreviewUnlockGate";
import { ScaledDocument } from "@/components/cv/ScaledDocument";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE, getTemplateDefaultStyle } from "@/utils/cv-templates/metadata";
import { getTemplateFontOption, normalizeTemplateStyle } from "@/utils/cv-templates/style";
import { trackEvent } from "@/lib/analytics";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
  DashboardStatStrip,
  DashboardTabBar,
} from "@/components/dashboard";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";
import { cn } from "@/lib/utils";

const DATE_FORMAT = { month: "short", day: "numeric", year: "numeric" };

// Tab labels live in messages under tailor.tailoredDetail.
const DOCUMENT_TABS = [
  { id: "cv", icon: <FileTextIcon size={14} aria-hidden="true" /> },
  { id: "letter", icon: <EnvelopeSimpleIcon size={14} aria-hidden="true" /> },
  { id: "why", icon: <ChatCenteredTextIcon size={14} aria-hidden="true" /> },
];

const MOBILE_TABS = [
  { id: "edit", icon: <PencilSimpleIcon size={14} aria-hidden="true" /> },
  { id: "preview", icon: <EyeIcon size={14} aria-hidden="true" /> },
];

function buildResumeData(source) {
  return {
    basics: source?.basics ?? {},
    work: source?.work ?? [],
    education: source?.education ?? [],
    skills: source?.skills ?? [],
  };
}

function Rise({ children, delay = 0, className }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BackLink() {
  const t = useTranslations("tailor.tailoredDetail");
  return (
    <Link
      href="/dashboard/tailored"
      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon size={16} aria-hidden="true" />
      {t("back")}
    </Link>
  );
}

function DetailSkeleton() {
  return (
    <DashboardPageShell width="full">
      <BackLink />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" aria-busy="true">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="tool-skeleton h-8 w-2/3 max-w-sm rounded-md" />
          <div className="tool-skeleton h-4 w-1/2 max-w-xs rounded-sm" />
        </div>
        <div className="tool-skeleton h-10 w-full rounded-md sm:w-36" />
      </div>
      <div className="tool-skeleton h-16 w-full rounded-lg" />
      <div className="tool-skeleton h-9 w-72 rounded-md" />
      <div className="grid items-start gap-4 lg:grid-cols-12">
        <div className="tool-skeleton h-96 rounded-lg lg:col-span-7" />
        <div className="tool-skeleton h-96 rounded-lg lg:col-span-5" />
      </div>
    </DashboardPageShell>
  );
}

export default function TailoredCVDetailPage() {
  const { id } = useParams();
  const t = useTranslations("tailor.tailoredDetail");
  const documentTabs = DOCUMENT_TABS.map((tab) => ({ ...tab, label: t(`documentTabs.${tab.id}`) }));
  const mobileTabs = MOBILE_TABS.map((tab) => ({ ...tab, label: t(`mobileTabs.${tab.id}`) }));
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("cv");
  const [mobileTab, setMobileTab] = useState("edit");
  const [templateOverride, setTemplateOverride] = useState(null);
  const [styleOverride, setStyleOverride] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalContext, setUpgradeModalContext] = useState("default");
  const [whyAnswer, setWhyAnswer] = useState(null);
  const [whyLoading, setWhyLoading] = useState(false);
  const [liveValues, setLiveValues] = useState(null);
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);

  const { data: cv, isLoading } = useQuery({
    queryKey: ["tailored-cv", id],
    queryFn: async () => {
      const res = await fetch(`/api/tailored-cv/${id}`);
      if (!res.ok) throw new Error("Couldn't load this CV. Refresh the page.");
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
      if (!res.ok) throw new Error("Couldn't load your CV. Refresh the page.");
      const json = await res.json();
      return json.data;
    },
  });

  const selectedTemplate = templateOverride ?? referenceCV?.template ?? DEFAULT_TEMPLATE;
  // Unsaved local change, then the stored value, then the layout's own look.
  const selectedTemplateStyle = normalizeTemplateStyle(
    styleOverride ?? referenceCV?.templateStyle ?? getTemplateDefaultStyle(selectedTemplate),
  );

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
  });

  // Switching template adopts that layout's own look; the style toolbar in the
  // picker is there to adjust from it.
  const handleTemplateChange = (template) => {
    setTemplateOverride(template);
    const nextStyle = getTemplateDefaultStyle(template);
    setStyleOverride(nextStyle);
    templateMutation.mutate({ template, templateStyle: nextStyle });
  };

  const handleTemplateStyleChange = (nextStyle) => {
    const normalized = normalizeTemplateStyle(nextStyle);
    setStyleOverride(normalized);
    templateMutation.mutate({ template: selectedTemplate, templateStyle: normalized });
  };

  const whyThisRoleMutation = useMutation({
    mutationFn: async (whyThisRole) => {
      const res = await fetch(`/api/tailored-cv/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whyThisRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("saveError"));
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(t("answerSaved"));
      queryClient.invalidateQueries({ queryKey: ["tailored-cv", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const generateWhyThisRole = async (question) => {
    if (!cv) return;
    setWhyLoading(true);
    try {
      const res = await fetch("/api/why-this-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tailoredCV: { basics: cv.basics, work: cv.work, skills: cv.skills },
          jobData: cv.jobData || { title: cv.jobTitle, company: cv.jobCompany },
          question,
        }),
      });
      const json = await res.json();
      if (json.code === "PREMIUM_REQUIRED") {
        setShowUpgradeModal(true);
        return;
      }
      if (!res.ok || !json.data) {
        throw new Error(json.error || t("whyError"));
      }
      setWhyAnswer(json.data);
      whyThisRoleMutation.mutate(json.data.answer);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setWhyLoading(false);
    }
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
        throw new Error(err.error || t("saveError"));
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success(t("letterSaved"));
      queryClient.invalidateQueries({ queryKey: ["tailored-cv", id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleValuesChange = useCallback((values) => {
    setLiveValues(values);
  }, []);

  const resumeData = useMemo(() => buildResumeData(cv), [cv]);
  // The preview follows the form as you type and the PDF is the preview, the
  // same as My CV, so what you download is what you see.
  const previewData = liveValues ? buildResumeData(liveValues) : resumeData;

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!cv) {
    return (
      <DashboardPageShell width="full">
        <BackLink />
        <DashboardEmptyState
          icon={WarningCircleIcon}
          title={t("notFound.title")}
          description={t("notFound.description")}
          actionLabel={t("back")}
          actionHref="/dashboard/tailored"
        />
      </DashboardPageShell>
    );
  }

  const isPremium = Boolean(session?.user?.isPremium);
  const hasCoverLetter = Boolean(cv.coverLetter && String(cv.coverLetter).trim());
  const hasWhyAnswer = Boolean(whyAnswer?.answer || cv.whyThisRole);

  const handleDownload = (tab) => {
    const documentType = tab === "cv" ? "cv" : "cover_letter";
    if (!isPremium) {
      trackEvent("download_blocked", {
        document_type: documentType,
        template: selectedTemplate,
      });
      setUpgradeModalContext("download");
      setShowUpgradeModal(true);
      return false;
    }
    if (tab === "cv") {
      printDocument({
        kind: "cv",
        data: previewData,
        template: selectedTemplate,
        style: selectedTemplateStyle,
        filename: buildPdfFilename(previewData.basics?.name, "cv"),
      });
    } else {
      printDocument({
        kind: "cover-letter",
        content: cv.coverLetter || "",
        template: selectedTemplate,
        style: selectedTemplateStyle,
        meta: {
          name: cv.basics?.name,
          jobTitle: cv.jobTitle,
          jobCompany: cv.jobCompany,
        },
        filename: buildPdfFilename(cv.basics?.name, "cover-letter"),
      });
    }
    trackEvent("pdf_downloaded", {
      document_type: documentType,
      template: selectedTemplate,
    });
  };

  const openDownloadPaywall = () => {
    setUpgradeModalContext("download");
    setShowUpgradeModal(true);
  };

  const downloadTab = activeTab === "letter" ? "letter" : "cv";
  const downloadLabel = activeTab === "letter" ? t("downloadLetter") : t("downloadPdf");

  return (
    <DashboardPageShell width="full">
      <BackLink />

      <DashboardPageHeader
        title={cv.jobTitle || t("untitled")}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {cv.jobCompany && (
              <span className="inline-flex items-center gap-1.5">
                <BuildingsIcon size={14} aria-hidden="true" />
                {cv.jobCompany}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <CalendarIcon size={14} aria-hidden="true" />
              <FormattedDate date={cv.createdAt} options={DATE_FORMAT} />
            </span>
          </span>
        }
        actions={
          <DownloadButton
            className="h-10 px-4 font-medium"
            label={downloadLabel}
            idleIcon={
              isPremium ? (
                <DownloadSimpleIcon size={16} aria-hidden="true" />
              ) : (
                <CrownIcon size={16} aria-hidden="true" />
              )
            }
            onDownload={() => handleDownload(downloadTab)}
          />
        }
      />

      <DashboardStatStrip
        columns={5}
        items={[
          {
            icon: CalendarIcon,
            label: t("stats.tailored"),
            value: <FormattedDate date={cv.createdAt} options={DATE_FORMAT} />,
          },
          { icon: BriefcaseIcon, label: t("stats.positions"), value: resumeData.work.length },
          { icon: TagIcon, label: t("stats.skillGroups"), value: resumeData.skills.length },
          {
            icon: EnvelopeSimpleIcon,
            label: t("stats.coverLetter"),
            value: hasCoverLetter ? t("stats.written") : t("stats.notYet"),
            tone: hasCoverLetter ? "success" : undefined,
          },
          {
            icon: ChatCenteredTextIcon,
            label: t("stats.whyThisRole"),
            value: hasWhyAnswer ? t("stats.answered") : t("stats.notYet"),
            tone: hasWhyAnswer ? "success" : undefined,
          },
        ]}
      />

      <Rise delay={0.1} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <DashboardTabBar
            tabs={documentTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ariaLabel={t("sectionsAria")}
          />
          {activeTab === "cv" && (
            <DashboardTabBar
              ariaLabel={t("mobileTabs.ariaLabel")}
              tabs={mobileTabs}
              activeTab={mobileTab}
              onTabChange={setMobileTab}
              className="lg:hidden"
            />
          )}
        </div>

        {activeTab === "cv" && (
          <div className="grid items-start gap-4 lg:grid-cols-12">
            <div
              className={cn(
                "min-w-0 lg:col-span-7",
                mobileTab === "preview" && "hidden lg:block",
              )}
            >
              <ResumeForm
                key={cv._id}
                initialData={resumeData}
                saveEndpoint={`/api/tailored-cv/${id}`}
                saveMethod="PUT"
                queryKey={["tailored-cv", id]}
                saveButtonLabel={t("saveTailored")}
                onValuesChange={handleValuesChange}
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
                      style={selectedTemplateStyle}
                      onStyleChange={handleTemplateStyleChange}
                    />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {t("liveUpdates")}
                  </p>
                </div>
                <div className="bg-white">
                  <PreviewUnlockGate
                    locked={!isPremium}
                    onUnlock={openDownloadPaywall}
                  >
                    <ScaledDocument>
                      <ResumeTemplate
                        data={previewData}
                        template={selectedTemplate}
                        style={selectedTemplateStyle}
                      />
                    </ScaledDocument>
                  </PreviewUnlockGate>
                </div>
              </aside>
            </div>
          </div>
        )}

        {activeTab === "letter" && (
          <PreviewUnlockGate
            locked={!isPremium}
            onUnlock={openDownloadPaywall}
          >
            <CoverLetterCard
              content={cv.coverLetter || ""}
              editable={isPremium}
              fontStack={getTemplateFontOption(selectedTemplateStyle.font).stack}
              onSave={(content) => coverLetterMutation.mutate(content)}
              isSaving={coverLetterMutation.isPending}
            />
          </PreviewUnlockGate>
        )}

        {activeTab === "why" && (
          <WhyThisRoleCard
            answer={whyAnswer?.answer ?? cv.whyThisRole ?? ""}
            question={whyAnswer?.question}
            isLoading={whyLoading}
            onGenerate={generateWhyThisRole}
            onSave={(text) => whyThisRoleMutation.mutate(text)}
            isSaving={whyThisRoleMutation.isPending}
          />
        )}
      </Rise>

      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        context={upgradeModalContext}
      />
    </DashboardPageShell>
  );
}
