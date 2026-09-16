"use client";

import { Suspense, useCallback, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  MagnifyingGlassIcon,
  SpinnerGapIcon,
  LinkIcon,
  TextAlignLeftIcon,
  FileTextIcon,
  EnvelopeSimpleIcon,
  DownloadSimpleIcon,
  ChartBarIcon,
  BinocularsIcon,
  ChatTeardropDotsIcon,
  LinkedinLogoIcon,
  CrownIcon,
  PencilSimpleIcon,
  EyeIcon,
  SparkleIcon,
  ChatCenteredTextIcon,
  CheckIcon,
  BriefcaseIcon,
  ClockCounterClockwiseIcon,
  ListChecksIcon,
  CaretDownIcon,
  CaretUpIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { DownloadButton } from "@/components/ui/download-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import JobRequirementsCard from "@/components/JobRequirementsCard";
import JobMatchScoreCard from "@/components/JobMatchScoreCard";
import { ResumeTemplate } from "@/components/ResumePreview";
import ResumeForm from "@/components/ResumeForm";
import CoverLetterCard from "@/components/CoverLetterCard";
import TemplatePicker from "@/components/TemplatePicker";
import ATSScoreCard from "@/components/ATSScoreCard";
import CompanyResearchCard from "@/components/CompanyResearchCard";
import InterviewPrepCard from "@/components/InterviewPrepCard";
import WhyThisRoleCard from "@/components/WhyThisRoleCard";
import LinkedInOutreachModal from "@/components/LinkedInOutreachModal";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { ScaledDocument } from "@/components/cv/ScaledDocument";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE, getTemplateDefaultStyle } from "@/utils/cv-templates/metadata";
import { getTemplateFontOption, normalizeTemplateStyle } from "@/utils/cv-templates/style";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
  DashboardTabBar,
  DashboardFilterPills,
} from "@/components/dashboard";
import { GradeBadge, AtsScoreChip } from "@/components/GradeBadge";
import { getRecentJobUrls, rememberJobUrl } from "@/lib/recent-job-urls";
import Loader from "@/components/Loader";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Matches the extract route's minimum, so the button never sends a paste it would refuse.
const MIN_JOB_TEXT_CHARS = 150;

const STEPS = [
  { title: "Add the job", body: "Paste a link or the description." },
  { title: "Review the match", body: "See the requirements and your match score." },
  { title: "Tailor and download", body: "Edit the CV, check the ATS score, download." },
];

const JOB_INPUT_TABS = [
  { key: "link", label: "Job link" },
  { key: "text", label: "Paste description" },
];

const MOBILE_TABS = [
  { id: "edit", label: "Edit", icon: <PencilSimpleIcon size={14} aria-hidden="true" /> },
  { id: "preview", label: "Preview", icon: <EyeIcon size={14} aria-hidden="true" /> },
];

const RESULT_TABS = [
  { id: "cv", label: "Tailored CV", icon: <FileTextIcon size={14} aria-hidden="true" /> },
  { id: "letter", label: "Cover letter", icon: <EnvelopeSimpleIcon size={14} aria-hidden="true" /> },
  { id: "ats", label: "ATS score", icon: <ChartBarIcon size={14} aria-hidden="true" /> },
  { id: "why", label: "Why this role", icon: <ChatCenteredTextIcon size={14} aria-hidden="true" /> },
  { id: "research", label: "Research", icon: <BinocularsIcon size={14} aria-hidden="true" /> },
  { id: "interview", label: "Interview", icon: <ChatTeardropDotsIcon size={14} aria-hidden="true" /> },
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

/** Three cells, one per step. Done steps tick, the current one is inked. */
function StepRail({ current }) {
  return (
    <DashboardPanel pad={false} delay={0.05}>
      <ol className="grid grid-cols-1 divide-y divide-[var(--landing-line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const state = number < current ? "done" : number === current ? "current" : "next";
          return (
            <li
              key={step.title}
              aria-current={state === "current" ? "step" : undefined}
              className="flex items-center gap-3 px-4 py-3 sm:px-5"
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-outfit text-sm font-semibold tabular-nums",
                  state === "done" && "bg-[var(--landing-success-soft)] text-[var(--landing-success)]",
                  state === "current" && "bg-[var(--landing-ink)] text-white",
                  state === "next" && "landing-inset-edge bg-[var(--landing-paper-soft)] text-muted-foreground",
                )}
              >
                {state === "done" ? <CheckIcon size={16} weight="bold" aria-hidden="true" /> : number}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-sm font-semibold",
                    state === "next" ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {step.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{step.body}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </DashboardPanel>
  );
}

function Tailor() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  // Prefilled when arriving from /jobs. That pool already holds the URL, so
  // the user never retypes it. Lazy initializer: read once, then it is theirs.
  const [url, setUrl] = useState(() => searchParams.get("url") ?? "");
  // Some boards block scraping, so a pasted description is the fallback.
  const [jobInputMode, setJobInputMode] = useState("link");
  const [jobText, setJobText] = useState("");
  const [jobData, setJobData] = useState(null);
  // The job form folds into a summary bar once a job is in. `editingJob`
  // reopens it to swap the posting without leaving the page.
  const [editingJob, setEditingJob] = useState(false);
  // Requirements and match fold away once the CV is tailored so the result
  // has the page. This brings them back.
  const [showJobDetails, setShowJobDetails] = useState(true);
  const [tailorResult, setTailorResult] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [mobileTab, setMobileTab] = useState("preview");
  const [liveValues, setLiveValues] = useState(null);
  const [activeTab, setActiveTab] = useState("cv");
  const [templateOverride, setTemplateOverride] = useState(null);
  const [templateStyleOverride, setTemplateStyleOverride] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [preAtsScore, setPreAtsScore] = useState(null);
  const [companyBrief, setCompanyBrief] = useState(null);
  const [companyBriefLoading, setCompanyBriefLoading] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [matchScoreLoading, setMatchScoreLoading] = useState(false);
  const [cachedReferenceCV, setCachedReferenceCV] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [interviewPrepLoading, setInterviewPrepLoading] = useState(false);
  const [linkedInModalOpen, setLinkedInModalOpen] = useState(false);
  const [whyThisRole, setWhyThisRole] = useState(null);
  const [whyLoading, setWhyLoading] = useState(false);
  const [applyingFix, setApplyingFix] = useState(null);
  const [appliedFixes, setAppliedFixes] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalContext, setUpgradeModalContext] = useState("default");
  const [recentUrls, setRecentUrls] = useState(() => getRecentJobUrls());
  const tailorRef = useRef(null);

  const { data: referenceCVRecord } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch resume");
      const json = await res.json();
      return json.data;
    },
  });

  const selectedTemplate = templateOverride ?? referenceCVRecord?.template ?? DEFAULT_TEMPLATE;
  const selectedTemplateStyle = normalizeTemplateStyle(
    templateStyleOverride ??
      referenceCVRecord?.templateStyle ??
      getTemplateDefaultStyle(selectedTemplate),
  );

  const templateMutation = useMutation({
    mutationFn: async ({ template, templateStyle }) => {
      const res = await fetch("/api/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, templateStyle }),
      });
      if (!res.ok) throw new Error("Failed to save template");
      return res.json();
    },
    onSuccess: (json) => {
      if (json.data) queryClient.setQueryData(["resume"], json.data);
    },
  });

  // Switching template adopts that layout's own look. Carrying the previous
  // style across instead would mean picking "Technical" and not getting the
  // monospace face that is the reason to pick it. The toolbar is right there
  // to re-adjust afterwards.
  const handleTemplateChange = (template) => {
    setTemplateOverride(template);
    const nextStyle = getTemplateDefaultStyle(template);
    setTemplateStyleOverride(nextStyle);
    templateMutation.mutate({ template, templateStyle: nextStyle });
  };

  const handleTemplateStyleChange = (nextStyle) => {
    const normalized = normalizeTemplateStyle(nextStyle);
    setTemplateStyleOverride(normalized);
    templateMutation.mutate({ template: selectedTemplate, templateStyle: normalized });
  };

  const extractMutation = useMutation({
    // input is { url } or { text }
    mutationFn: async (input) => {
      const res = await fetch("/api/job/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to extract job requirements");
      }

      return res.json();
    },
    onSuccess: (result) => {
      setJobData(result.data);
      setEditingJob(false);
      setShowJobDetails(true);
      setTailorResult(null);
      setSavedId(null);
      setLiveValues(null);
      setMobileTab("preview");
      setAtsScore(null);
      setCompanyBrief(null);
      setMatchScore(null);
      setPreAtsScore(null);
      setWhyThisRole(null);
      setAppliedFixes([]);
      trackEvent("job_requirements_extracted", {
        has_company: Boolean(result.data?.company),
        has_job_title: Boolean(result.data?.title),
      });

      // Auto-trigger job match scoring + pre-ATS score in background
      setMatchScoreLoading(true);
      fetch("/api/resume")
        .then((res) => res.json())
        .then((cvData) => {
          if (!cvData.data) {
            setMatchScoreLoading(false);
            return;
          }
          const referenceCV = {
            basics: cvData.data.basics,
            work: cvData.data.work,
            education: cvData.data.education,
            skills: cvData.data.skills,
          };
          setCachedReferenceCV(referenceCV);

          // Fire match score and pre-ATS score in parallel
          const scorePromise = fetch("/api/job/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referenceCV, jobData: result.data }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res?.data) setMatchScore(res.data);
            });

          const preAtsPromise = fetch("/api/ats-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tailoredCV: referenceCV, jobData: result.data }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res?.data) setPreAtsScore(res.data);
            });

          return Promise.all([scorePromise, preAtsPromise]);
        })
        .catch(() => {})
        .finally(() => setMatchScoreLoading(false));

      // Auto-trigger company research in background
      if (result.data?.company && result.data.company.length > 2) {
        setCompanyBriefLoading(true);
        fetch("/api/company-research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName: result.data.company,
            jobTitle: result.data.title || "",
            jobUrl: jobInputMode === "link" ? url.trim() : "",
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.data) setCompanyBrief(res.data);
          })
          .catch(() => {})
          .finally(() => setCompanyBriefLoading(false));
      }

      if (jobInputMode === "link") {
        rememberJobUrl(url.trim(), result.data?.title || "");
        setRecentUrls(getRecentJobUrls());
      }
      toast.success("Job requirements extracted");
      setTimeout(() => {
        tailorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    },
    onError: (error, input) => {
      // A blocked link is a dead end unless the paste box is one click away.
      toast.error(error.message, {
        action: input?.url
          ? { label: "Paste description", onClick: () => setJobInputMode("text") }
          : undefined,
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/tailored-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save tailored CV");
      }

      return res.json();
    },
    onSuccess: (result) => {
      setSavedId(result?.data?._id ?? null);
      queryClient.invalidateQueries({ queryKey: ["tailored-cvs"] });
    },
  });

  const tailorMutation = useMutation({
    mutationFn: async () => {
      // Fetch reference CV first
      const cvRes = await fetch("/api/resume");
      const cvData = await cvRes.json();

      if (!cvData.data) {
        throw new Error("Please upload your CV first");
      }

      const referenceCV = {
        basics: cvData.data.basics,
        work: cvData.data.work,
        education: cvData.data.education,
        skills: cvData.data.skills,
      };

      // Call tailor API
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCV, jobData }),
      });

      if (!res.ok) {
        const err = await res.json();
        const error = new Error(err.error || "Failed to tailor CV");
        error.code = err.code;
        throw error;
      }

      return res.json();
    },
    onSuccess: (result) => {
      setTailorResult(result.data);
      setSavedId(null);
      setLiveValues(null);
      setMobileTab("preview");
      setShowJobDetails(false);
      setActiveTab("cv");
      setWhyThisRole(null);
      setAppliedFixes([]);
      trackEvent("cv_tailored", {
        is_premium: Boolean(session?.user?.isPremium),
        has_cover_letter: Boolean(result.data?.coverLetter),
      });
      toast.success("CV tailored");

      // Trigger ATS analysis automatically
      setAtsLoading(true);
      fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tailoredCV: result.data.tailoredCV,
          jobData,
        }),
      })
        .then((res) => res.json())
        .then((ats) => {
          if (ats.data) setAtsScore(ats.data);
        })
        .catch(() => {})
        .finally(() => setAtsLoading(false));

      // Auto-save to database (includes auto-creating application)
      saveMutation.mutate({
        jobTitle: jobData?.title || "",
        jobCompany: jobData?.company || "",
        jobUrl: jobInputMode === "link" ? url : "",
        jobData,
        basics: result.data.tailoredCV.basics,
        work: result.data.tailoredCV.work,
        education: result.data.tailoredCV.education,
        skills: result.data.tailoredCV.skills,
        coverLetter: result.data.coverLetter,
        matchScore: matchScore?.globalScore,
        matchGrade: matchScore?.globalGrade,
      });
    },
    onError: (error) => {
      if (error.code === "PREMIUM_REQUIRED") {
        setUpgradeModalContext("default");
        setShowUpgradeModal(true);
        return;
      }
      toast.error(error.message);
    },
  });

  const handleValuesChange = useCallback((values) => {
    setLiveValues(values);
  }, []);

  // The preview follows the editor as you type, the same as My CV, and the
  // PDF is the preview.
  const previewData = tailorResult
    ? liveValues
      ? buildResumeData(liveValues)
      : buildResumeData(tailorResult.tailoredCV)
    : null;

  const handleDownload = (tab) => {
    if (!tailorResult) return false;
    const documentType = tab === "cv" ? "cv" : "cover_letter";
    const isPremium = !!session?.user?.isPremium;
    if (!isPremium) {
      trackEvent("download_blocked", {
        document_type: documentType,
        template: selectedTemplate,
      });
      setUpgradeModalContext("default");
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
        content: tailorResult.coverLetter || "",
        template: selectedTemplate,
        style: selectedTemplateStyle,
        meta: {
          name: tailorResult.tailoredCV.basics?.name,
          jobTitle: jobData?.title,
          jobCompany: jobData?.company,
        },
        filename: buildPdfFilename(tailorResult.tailoredCV.basics?.name, "cover-letter"),
      });
    }
    trackEvent("pdf_downloaded", {
      document_type: documentType,
      template: selectedTemplate,
    });
  };

  const persistTailoredCV = (patch) => {
    if (!savedId) return;
    fetch(`/api/tailored-cv/${savedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
      .then(() => queryClient.invalidateQueries({ queryKey: ["tailored-cv", savedId] }))
      .catch(() => {});
  };

  const runAtsScore = (cv) => {
    setAtsLoading(true);
    fetch("/api/ats-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tailoredCV: cv, jobData }),
    })
      .then((res) => res.json())
      .then((ats) => {
        if (ats.data) setAtsScore(ats.data);
      })
      .catch(() => {})
      .finally(() => setAtsLoading(false));
  };

  const generateWhyThisRole = async (question) => {
    if (!tailorResult) return;
    setWhyLoading(true);
    try {
      const res = await fetch("/api/why-this-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tailoredCV: tailorResult.tailoredCV,
          jobData,
          companyBrief: companyBrief || null,
          question,
        }),
      });
      const json = await res.json();
      if (json.code === "PREMIUM_REQUIRED") {
        setShowUpgradeModal(true);
        return;
      }
      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to write an answer");
      }
      setWhyThisRole(json.data);
      persistTailoredCV({ whyThisRole: json.data.answer });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setWhyLoading(false);
    }
  };

  const handleApplyFix = async (fix) => {
    if (!tailorResult) return;
    setApplyingFix(fix);
    try {
      const res = await fetch("/api/ats-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tailoredCV: tailorResult.tailoredCV,
          jobData,
          recommendation: fix,
        }),
      });
      const json = await res.json();
      if (json.code === "PREMIUM_REQUIRED") {
        setShowUpgradeModal(true);
        return;
      }
      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to apply the fix");
      }
      const updated = json.data.tailoredCV;
      setTailorResult((r) => ({ ...r, tailoredCV: updated }));
      setLiveValues(null);
      setAppliedFixes((list) => [...list, fix]);
      trackEvent("ats_fix_applied");
      toast.success(json.data.changes?.[0] || "Applied to your CV");
      persistTailoredCV({
        basics: updated.basics,
        work: updated.work,
        education: updated.education,
        skills: updated.skills,
      });
      runAtsScore(updated);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setApplyingFix(null);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (
      tabId === "interview" &&
      !interviewPrep &&
      !interviewPrepLoading &&
      tailorResult
    ) {
      setInterviewPrepLoading(true);
      fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tailoredCV: tailorResult.tailoredCV,
          jobData,
          companyBrief: companyBrief || null,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data) setInterviewPrep(res.data);
        })
        .catch(() => {})
        .finally(() => setInterviewPrepLoading(false));
    }
    if (tabId === "why" && !whyThisRole && !whyLoading && tailorResult) {
      generateWhyThisRole();
    }
  };

  const handleExtract = (e) => {
    e.preventDefault();
    if (jobInputMode === "text") {
      if (jobText.trim().length < MIN_JOB_TEXT_CHARS) {
        toast.error("Paste the full job description, not just a few lines.");
        return;
      }
      extractMutation.mutate({ text: jobText.trim() });
      return;
    }
    if (!url.trim()) {
      toast.error("Enter a job URL first.");
      return;
    }
    extractMutation.mutate({ url: url.trim() });
  };

  const handleTailor = () => {
    trackEvent("tailor_started", {
      is_premium: Boolean(session?.user?.isPremium),
      has_match_score: Boolean(matchScore),
    });

    tailorMutation.mutate();
  };

  const isPremium = Boolean(session?.user?.isPremium);
  const currentStep = tailorResult ? 3 : jobData ? 2 : 1;
  const showJobForm = !jobData || editingJob;
  const extractDisabled =
    extractMutation.isPending ||
    (jobInputMode === "link" ? !url.trim() : jobText.trim().length < MIN_JOB_TEXT_CHARS);
  const jobDetailSummary = jobData
    ? [
        jobData.requirements?.length
          ? `${jobData.requirements.length} requirements`
          : null,
        jobData.keywords?.length ? `${jobData.keywords.length} key terms` : null,
        matchScore?.globalGrade ? `match grade ${matchScore.globalGrade}` : null,
      ]
        .filter(Boolean)
        .join(", ")
    : "";
  const downloadIcon = isPremium ? (
    <DownloadSimpleIcon size={16} aria-hidden="true" />
  ) : (
    <CrownIcon size={16} aria-hidden="true" />
  );

  return (
    <DashboardPageShell width="full">
      <DashboardPageHeader
        title="Tailor CV"
        description="Paste a job link or the job description. We pull out the requirements and rewrite your CV to match."
      />

      <StepRail current={currentStep} />

      {/* Step 1: the job, as a form or as a summary bar once it is in. */}
      {showJobForm ? (
        <DashboardPanel delay={0.1}>
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
              {jobInputMode === "link" ? (
                <LinkIcon size={17} aria-hidden="true" />
              ) : (
                <TextAlignLeftIcon size={17} aria-hidden="true" />
              )}
            </span>
            <DashboardPanelHeader
              className="min-w-0 flex-1"
              title={jobInputMode === "link" ? "Job link" : "Job description"}
              description={
                jobInputMode === "link"
                  ? "Paste the URL of the listing. If the board blocks it, paste the description instead."
                  : "Paste the whole posting, including requirements and responsibilities."
              }
            />
          </div>
          <DashboardFilterPills
            className="mt-4"
            tabs={JOB_INPUT_TABS}
            activeKey={jobInputMode}
            onChange={setJobInputMode}
          />
          <form onSubmit={handleExtract} className="mt-3 flex flex-col gap-3">
            {jobInputMode === "link" ? (
              <>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="url"
                    placeholder="https://www.linkedin.com/jobs/view/…"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    aria-label="Job listing URL"
                    autoComplete="url"
                    spellCheck={false}
                    className="min-w-0 flex-1 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={extractDisabled}
                    aria-busy={extractMutation.isPending}
                    className="dashboard-primary-btn w-full sm:w-auto"
                  >
                    {extractMutation.isPending ? (
                      <>
                        <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                        Extracting…
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon size={16} aria-hidden="true" />
                        Extract requirements
                      </>
                    )}
                  </button>
                </div>
                {recentUrls.length > 0 && !jobData && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ClockCounterClockwiseIcon size={12} aria-hidden="true" />
                      Recent
                    </span>
                    {recentUrls.map((item) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => setUrl(item.url)}
                        title={item.url}
                        className="inline-flex h-8 max-w-full items-center rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-[var(--landing-paper-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-ink)]"
                      >
                        <span className="truncate">{item.title || item.url}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <Textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  aria-label="Job description"
                  placeholder="Paste the full posting, including the requirements and responsibilities"
                  rows={8}
                  maxLength={15000}
                  className="min-h-40 text-sm"
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {jobText.trim().length < MIN_JOB_TEXT_CHARS
                      ? `Paste at least ${MIN_JOB_TEXT_CHARS} characters so there is enough to work from.`
                      : `${jobText.trim().length} characters`}
                  </p>
                  <button
                    type="submit"
                    disabled={extractDisabled}
                    aria-busy={extractMutation.isPending}
                    className="dashboard-primary-btn w-full sm:w-auto"
                  >
                    {extractMutation.isPending ? (
                      <>
                        <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                        Extracting…
                      </>
                    ) : (
                      <>
                        <MagnifyingGlassIcon size={16} aria-hidden="true" />
                        Extract requirements
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            {jobData && (
              <button
                type="button"
                onClick={() => setEditingJob(false)}
                className="dashboard-secondary-btn dashboard-secondary-btn-sm self-start"
              >
                Keep the current job
              </button>
            )}
          </form>
        </DashboardPanel>
      ) : (
        /* Rides along while you scroll so the job, its grade and the primary
           action stay in view under a long requirements list. */
        <div className="sticky top-14 z-10 -mx-3 border-b border-[var(--landing-line)] bg-[var(--landing-bg)]/95 px-3 py-2 backdrop-blur-md sm:top-16 sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground sm:flex">
              <BriefcaseIcon size={17} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {jobData.title || "Job listing"}
              </p>
              <p className="truncate text-xs leading-5 text-muted-foreground">
                {jobData.company ||
                  (jobInputMode === "link" ? url.trim() : "Pasted description")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {matchScoreLoading ? (
                <span className="text-xs font-medium text-muted-foreground">Scoring…</span>
              ) : (
                <GradeBadge grade={matchScore?.globalGrade} />
              )}
              {tailorResult && (
                <AtsScoreChip
                  score={atsScore?.score}
                  loading={atsLoading}
                  onClick={() => handleTabChange("ats")}
                />
              )}
              <button
                type="button"
                onClick={() => setEditingJob(true)}
                className="dashboard-secondary-btn dashboard-secondary-btn-sm"
                aria-label="Change job"
              >
                <PencilSimpleIcon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Change job</span>
              </button>
              {/* On lg the call to action sits in the sticky right column, so
                  the bar only carries it where that column stacks below. */}
              {!tailorResult && (
                <button
                  type="button"
                  onClick={handleTailor}
                  disabled={tailorMutation.isPending}
                  aria-busy={tailorMutation.isPending}
                  className="dashboard-primary-btn dashboard-primary-btn-sm lg:hidden"
                >
                  {tailorMutation.isPending ? (
                    <>
                      <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />
                      Tailoring…
                    </>
                  ) : (
                    <>
                      <SparkleIcon size={14} aria-hidden="true" />
                      Tailor CV
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: requirements on the left, match and the call to action on the right. */}
      {jobData && (
        <div ref={tailorRef} className="flex flex-col gap-4">
          {tailorResult && (
            <DashboardPanel pad={false}>
              <div className="dashboard-row-pad flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
                  <ListChecksIcon size={17} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Job requirements and match
                  </p>
                  <p className="truncate text-xs tabular-nums text-muted-foreground">
                    {jobDetailSummary || "From the posting you added"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJobDetails((open) => !open)}
                  aria-expanded={showJobDetails}
                  className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
                >
                  {showJobDetails ? "Hide details" : "Show details"}
                  {showJobDetails ? (
                    <CaretUpIcon size={14} aria-hidden="true" />
                  ) : (
                    <CaretDownIcon size={14} aria-hidden="true" />
                  )}
                </button>
              </div>
            </DashboardPanel>
          )}

          {(!tailorResult || showJobDetails) && (
            <div className="grid items-start gap-4 lg:grid-cols-12">
              <Rise className="min-w-0 lg:col-span-7">
                <JobRequirementsCard
                  data={jobData}
                  referenceCV={cachedReferenceCV}
                  matchGrade={matchScore?.globalGrade}
                  matchLoading={matchScoreLoading}
                />
              </Rise>
              <div className="flex min-w-0 flex-col gap-4 lg:col-span-5 lg:sticky lg:top-32">
                {!tailorResult && (
                  <DashboardPanel delay={0.05}>
                    <DashboardPanelHeader
                      title="Tailor your CV for this role"
                      description="We rewrite your CV around these requirements and write a cover letter to go with it."
                    />
                    <button
                      type="button"
                      onClick={handleTailor}
                      disabled={tailorMutation.isPending}
                      aria-busy={tailorMutation.isPending}
                      className="dashboard-primary-btn mt-4 w-full"
                    >
                      {tailorMutation.isPending ? (
                        <>
                          <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                          Tailoring…
                        </>
                      ) : (
                        <>
                          <SparkleIcon size={16} aria-hidden="true" />
                          Tailor CV
                        </>
                      )}
                    </button>
                  </DashboardPanel>
                )}
                {(matchScoreLoading || matchScore) && (
                  <Rise delay={0.1}>
                    <JobMatchScoreCard scoreData={matchScore} isLoading={matchScoreLoading} />
                  </Rise>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: the result. Editor left, preview right, the same as My CV. */}
      {tailorResult && (
        <Rise className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <DashboardTabBar
                tabs={RESULT_TABS}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                ariaLabel="Resume output sections"
              />
              {activeTab === "cv" && (
                <AtsScoreChip
                  score={atsScore?.score}
                  loading={atsLoading}
                  onClick={() => handleTabChange("ats")}
                />
              )}
            </div>
            {(activeTab === "cv" || activeTab === "letter") && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setLinkedInModalOpen(true)}
                  className="dashboard-secondary-btn dashboard-secondary-btn-sm"
                >
                  <LinkedinLogoIcon size={16} aria-hidden="true" />
                  LinkedIn message
                </button>
                <DownloadButton
                  className="h-9 w-full sm:w-auto"
                  label={activeTab === "cv" ? "Download PDF" : "Download cover letter"}
                  idleIcon={downloadIcon}
                  onDownload={() => handleDownload(activeTab)}
                />
              </div>
            )}
          </div>

          {activeTab === "cv" && (
            <>
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
                  {savedId ? (
                    <ResumeForm
                      key={savedId}
                      initialData={tailorResult.tailoredCV}
                      saveEndpoint={`/api/tailored-cv/${savedId}`}
                      saveMethod="PUT"
                      queryKey={["tailored-cv", savedId]}
                      saveButtonLabel="Save tailored CV"
                      onValuesChange={handleValuesChange}
                      onSaved={(data) => {
                        setTailorResult((r) => ({ ...r, tailoredCV: data }));
                        setLiveValues(null);
                      }}
                    />
                  ) : saveMutation.isError ? (
                    <DashboardPanel>
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]">
                          <WarningCircleIcon size={17} aria-hidden="true" />
                        </span>
                        <DashboardPanelHeader
                          title="Couldn't save this CV"
                          description="Editing needs a saved copy. You can still preview and download it."
                        />
                      </div>
                    </DashboardPanel>
                  ) : (
                    <DashboardPanel aria-busy="true">
                      <DashboardPanelHeader
                        title="Saving your tailored CV"
                        description="Editing opens as soon as it is saved."
                      />
                      <div className="mt-4 space-y-2">
                        <div className="tool-skeleton h-10 w-full rounded-md" />
                        <div className="tool-skeleton h-10 w-full rounded-md" />
                        <div className="tool-skeleton h-24 w-full rounded-md" />
                      </div>
                    </DashboardPanel>
                  )}
                </div>

                <div
                  className={cn(
                    "min-w-0 lg:col-span-5",
                    mobileTab === "edit" && "hidden lg:block",
                  )}
                >
                  <aside className="dashboard-card overflow-hidden rounded-lg lg:sticky lg:top-32">
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--landing-line)] px-3 py-3">
                      <div className="w-48 min-w-0 shrink-0 sm:w-56">
                        <TemplatePicker
                          value={selectedTemplate}
                          onChange={handleTemplateChange}
                          style={selectedTemplateStyle}
                          onStyleChange={handleTemplateStyleChange}
                          data={previewData}
                        />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {savedId ? "Updates as you type" : "Preview"}
                      </p>
                    </div>
                    <div className="bg-white">
                      <ScaledDocument>
                        <ResumeTemplate
                          data={previewData}
                          template={selectedTemplate}
                          style={selectedTemplateStyle}
                        />
                      </ScaledDocument>
                    </div>
                    {tailorResult.keywordsInjected?.length > 0 && (
                      <div className="border-t border-[var(--landing-line)] px-4 py-3">
                        <p className="text-xs font-medium text-muted-foreground">
                          Keywords added from the posting
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {tailorResult.keywordsInjected.map((k, i) => (
                            <li
                              key={`${k.keyword}-${i}`}
                              title={k.location}
                              className="inline-flex cursor-help items-center rounded-md border border-[#c8e6d4] bg-[var(--landing-success-soft)] px-2 py-0.5 text-xs font-medium text-[var(--landing-success)]"
                            >
                              {k.keyword}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </aside>
                </div>
              </div>
            </>
          )}
          {activeTab === "letter" && (
            <CoverLetterCard
              content={tailorResult.coverLetter}
              fontStack={getTemplateFontOption(selectedTemplateStyle.font).stack}
            />
          )}
          {activeTab === "ats" && (
            <ATSScoreCard
              atsData={atsScore}
              isLoading={atsLoading}
              cv={tailorResult.tailoredCV}
              jobData={jobData}
              preScore={preAtsScore?.score}
              onApplyFix={handleApplyFix}
              applyingFix={applyingFix}
              appliedFixes={appliedFixes}
            />
          )}
          {activeTab === "why" && (
            <WhyThisRoleCard
              answer={whyThisRole?.answer ?? ""}
              question={whyThisRole?.question}
              isLoading={whyLoading}
              onGenerate={generateWhyThisRole}
              onSave={
                savedId
                  ? (text) => {
                      // Held in state too, so leaving the tab does not throw
                      // away what the user edited.
                      setWhyThisRole((w) => ({ ...w, answer: text }));
                      persistTailoredCV({ whyThisRole: text });
                      toast.success("Answer saved");
                    }
                  : undefined
              }
            />
          )}
          {activeTab === "research" && (
            <CompanyResearchCard brief={companyBrief} isLoading={companyBriefLoading} />
          )}
          {activeTab === "interview" && (
            <InterviewPrepCard
              prepData={interviewPrep}
              isLoading={interviewPrepLoading}
              jobTitle={jobData?.title}
              jobCompany={jobData?.company}
            />
          )}
        </Rise>
      )}

      <LinkedInOutreachModal
        open={linkedInModalOpen}
        onClose={() => setLinkedInModalOpen(false)}
        tailoredCV={tailorResult?.tailoredCV}
        jobData={jobData}
        companyBrief={companyBrief}
      />
      <UpgradePromptModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        context={upgradeModalContext}
      />
    </DashboardPageShell>
  );
}

export default function TailorPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Tailor />
    </Suspense>
  );
}
