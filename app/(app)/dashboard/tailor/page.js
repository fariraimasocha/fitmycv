"use client";

import { Suspense, useCallback, useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
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
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { AnimatedNumber } from "@/components/charts/AnimatedNumber";
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
import { useClientPricing } from "@/components/pricing/PricingCards";
import PreviewUnlockGate from "@/components/PreviewUnlockGate";
import { ScaledDocument } from "@/components/cv/ScaledDocument";
import { printDocument } from "@/utils/print-document";
import { openSupport } from "@/lib/open-support";
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
import {
  getRecentJobUrls,
  getServerRecentJobUrls,
  rememberJobUrl,
  subscribeRecentJobUrls,
} from "@/lib/recent-job-urls";
import { takeAtsHandoff } from "@/lib/ats-handoff";
import Loader from "@/components/Loader";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Matches the extract route's minimum, so the button never sends a paste it would refuse.
const MIN_JOB_TEXT_CHARS = 150;

// Labels for these lists live in messages under tailor.tailorPage.
const STEPS = ["job", "tailor", "review"];

const JOB_INPUT_TABS = ["link", "text"];

const MOBILE_TABS = [
  { id: "edit", icon: <PencilSimpleIcon size={14} aria-hidden="true" /> },
  { id: "preview", icon: <EyeIcon size={14} aria-hidden="true" /> },
];

const RESULT_TABS = [
  { id: "cv", icon: <FileTextIcon size={14} aria-hidden="true" /> },
  { id: "letter", icon: <EnvelopeSimpleIcon size={14} aria-hidden="true" /> },
  { id: "ats", icon: <ChartBarIcon size={14} aria-hidden="true" /> },
  { id: "why", icon: <ChatCenteredTextIcon size={14} aria-hidden="true" /> },
  { id: "research", icon: <BinocularsIcon size={14} aria-hidden="true" /> },
  { id: "interview", icon: <ChatTeardropDotsIcon size={14} aria-hidden="true" /> },
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
  const t = useTranslations("tailor.tailorPage.steps");
  return (
    <DashboardPanel pad={false} delay={0.05}>
      <ol className="grid grid-cols-1 divide-y divide-[var(--landing-line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const state = number < current ? "done" : number === current ? "current" : "next";
          return (
            <li
              key={step}
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
                  {t(`${step}.title`)}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{t(`${step}.body`)}</span>
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
  const t = useTranslations("tailor.tailorPage");
  const jobInputTabs = JOB_INPUT_TABS.map((key) => ({ key, label: t(`inputTabs.${key}`) }));
  const mobileTabs = MOBILE_TABS.map((tab) => ({ ...tab, label: t(`mobileTabs.${tab.id}`) }));
  const resultTabs = RESULT_TABS.map((tab) => ({ ...tab, label: t(`resultTabs.${tab.id}`) }));
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  // Prefilled when arriving from /jobs. That pool already holds the URL, so
  // the user never retypes it. Lazy initializer: read once, then it is theirs.
  const [urlParam] = useState(() => searchParams.get("url"));
  const [url, setUrl] = useState(urlParam ?? "");
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
  // Points the last applied ATS fix added, shown on the score card.
  const [fixGain, setFixGain] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalContext, setUpgradeModalContext] = useState("default");
  const pricing = useClientPricing();
  const recentUrls = useSyncExternalStore(
    subscribeRecentJobUrls,
    getRecentJobUrls,
    getServerRecentJobUrls,
  );
  const tailorRef = useRef(null);

  // ATS free tools stash the posting in sessionStorage. Read and clear it after
  // mount, so the server render and the first client render agree.
  useEffect(() => {
    const handoff = takeAtsHandoff();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time read of the sessionStorage handoff on mount; the effect is what keeps SSR/hydration in sync */
    if (handoff?.jobUrl) {
      setJobInputMode("link");
      setUrl(handoff.jobUrl);
      trackEvent("hero_link_consumed", { source: handoff.source ?? null });
      return;
    }
    // The link came in the URL only (a magic link opened in a new tab, or
    // /jobs). It is already prefilled, so this just counts it.
    if (!handoff && urlParam) {
      trackEvent("hero_link_consumed", { source: "url_param" });
      return;
    }
    if (!handoff?.jobText) return;
    setJobInputMode("text");
    setJobText(handoff.jobText);
    setEditingJob(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    trackEvent("ats_handoff_consumed", {
      score: handoff.score ?? null,
      source: handoff.source ?? null,
      chars: handoff.jobText.length,
    });
  }, [urlParam]);

  const { data: referenceCVRecord } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Couldn't load your CV. Refresh the page.");
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
      if (!res.ok) throw new Error("Couldn't save your template. Try again.");
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
        // Scrape plus parse finishes well inside this. Past it, show an error
        // rather than leave the user watching a spinner.
        signal: AbortSignal.timeout(90_000),
      });

      if (!res.ok) {
        const err = await res.json();
        throw Object.assign(new Error(err.error || t("errors.extract")), { stage: err.stage });
      }

      const result = await res.json();
      // A login wall or cookie banner parses into an empty job. Tailoring
      // against nothing wastes the user's time, so treat it as a failed read
      // and offer the paste box instead.
      const job = result.data ?? {};
      const found = [job.requirements, job.responsibilities, job.qualifications].some((list) => list?.length);
      if (!job.title && !found) {
        throw Object.assign(new Error(t("errors.shortText")), { stage: "empty" });
      }
      return result;
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

      // Auto-trigger job match scoring + pre-ATS score in background. The match
      // score is Pro only: free users get a 402, so they see a locked card instead.
      const canScoreMatch = Boolean(session?.user?.isPremium);
      setMatchScoreLoading(canScoreMatch);
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
          const scorePromise = canScoreMatch
            ? fetch("/api/job/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ referenceCV, jobData: result.data }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res?.data) setMatchScore(res.data);
                })
            : null;

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
      }
      // One click: tailoring starts as soon as the job is read. Requirements and
      // the match score fill in while the CV is being written.
      startTailor(result.data);
      setTimeout(() => {
        tailorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    },
    onError: (error, input) => {
      if (input?.url) {
        let host = null;
        try {
          host = new URL(input.url).hostname;
        } catch {}
        trackEvent("job_extract_failed", {
          host,
          stage: error.stage ?? (error.name === "TimeoutError" ? "timeout" : "request"),
        });
      }
      // A blocked link is a dead end unless the paste box is one click away.
      // Why a link failed is our problem, not the user's. One plain message.
      toast.error(input?.url || error.name === "TimeoutError" ? t("errors.extract") : error.message, {
        action: input?.url
          ? { label: t("inputTabs.text"), onClick: () => setJobInputMode("text") }
          : undefined,
      });
    },
  });

  // Takes the job as an argument: when chained from extract, `jobData` state
  // has not re-rendered yet.
  const tailorMutation = useMutation({
    mutationFn: async (job) => {
      // A dropped connection, a timeout or an HTML error page from the
      // worker all become the same plain message, never "Failed to fetch".
      const failed = () => Object.assign(new Error(t("errors.tailor")), { support: true });

      // Fetch reference CV first
      const cvRes = await fetch("/api/resume").catch(() => null);
      if (!cvRes) throw failed();
      const cvData = await cvRes.json().catch(() => ({}));

      if (!cvData.data) {
        throw Object.assign(new Error(t("errors.noCv")), { code: "NO_CV" });
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
        body: JSON.stringify({
          referenceCV,
          jobData: job,
          jobUrl: jobInputMode === "link" ? url : "",
          // ponytail: matchScore can still be loading if tailor finishes first;
          // then only the application's grade is missing.
          matchScore: matchScore?.globalScore,
          matchGrade: matchScore?.globalGrade,
        }),
        // ponytail: generous ceiling. The route allows Groq 60s plus a retry.
        signal: AbortSignal.timeout(150_000),
      }).catch(() => null);
      if (!res) throw failed();

      const body = await res.json().catch(() => null);
      if (!res.ok || !body) {
        const error = body?.error ? new Error(body.error) : failed();
        error.code = body?.code;
        error.support = true;
        throw error;
      }

      return body;
    },
    onSuccess: (result) => {
      setTailorResult(result.data);
      // The tailor route saves the CV (and its application) itself.
      setSavedId(result.data.savedId);
      setAtsScore(result.data.atsScore);
      queryClient.invalidateQueries({ queryKey: ["tailored-cvs"] });
      setLiveValues(null);
      setMobileTab("preview");
      setShowJobDetails(false);
      setActiveTab("cv");
      setWhyThisRole(null);
      setAppliedFixes([]);
      setFixGain(0);
      trackEvent("cv_tailored", {
        is_premium: Boolean(session?.user?.isPremium),
        has_cover_letter: Boolean(result.data?.coverLetter),
      });
      // The route files every tailored CV under Applications, a Pro page.
      if (session?.user?.isPremium) {
        toast.success(t("tailored"), {
          description: t("addedToApplications"),
          action: { label: t("openApplications"), onClick: () => router.push("/dashboard/applications") },
        });
      } else {
        toast.success(t("tailored"));
      }

      // No popup after tailoring. The result is the peak of this flow, and
      // on Oct 27 2026 the auto-opened paywall reached 7 people who tailored
      // a CV and none started checkout from it. The price sits under Download instead and
      // the modal opens when someone actually asks for the PDF.
    },
    onError: (error) => {
      if (error.code === "PREMIUM_REQUIRED") {
        setUpgradeModalContext("default");
        setShowUpgradeModal(true);
        return;
      }
      if (error.code === "NO_CV") {
        toast.error(error.message, {
          action: { label: t("uploadCv"), onClick: () => router.push("/dashboard/resume") },
        });
        return;
      }
      toast.error(error.message, {
        action: error.support ? { label: t("contactSupport"), onClick: openSupport } : undefined,
      });
    },
  });

  // Reading the job and tailoring are long AI calls with no real progress to
  // report, so count the seconds instead. A ticking number shows the page is
  // still working. Reading chains into tailoring, so one count spans both.
  const working = extractMutation.isPending || tailorMutation.isPending;
  const [tailorSeconds, setTailorSeconds] = useState(0);
  useEffect(() => {
    if (!working) return;
    const started = Date.now();
    const id = setInterval(() => setTailorSeconds(Math.round((Date.now() - started) / 1000)), 1000);
    return () => {
      clearInterval(id);
      setTailorSeconds(0);
    };
  }, [working]);
  const elapsedBadge =
    tailorSeconds > 0 ? <span className="tabular-nums opacity-70">{tailorSeconds}s</span> : null;

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
      setUpgradeModalContext("download");
      setShowUpgradeModal(true);
      return false;
    }
    let printed;
    if (tab === "cv") {
      printed = printDocument({
        kind: "cv",
        data: previewData,
        template: selectedTemplate,
        style: selectedTemplateStyle,
        filename: buildPdfFilename(previewData.basics?.name, "cv", jobData?.title),
      });
    } else {
      printed = printDocument({
        kind: "cover-letter",
        content: tailorResult.coverLetter || "",
        template: selectedTemplate,
        style: selectedTemplateStyle,
        meta: {
          name: tailorResult.tailoredCV.basics?.name,
          jobTitle: jobData?.title,
          jobCompany: jobData?.company,
        },
        filename: buildPdfFilename(tailorResult.tailoredCV.basics?.name, "cover-letter", jobData?.title),
      });
    }
    // A blocked pop-up or full storage: DownloadButton shows why.
    if (printed !== true) return printed;
    trackEvent("pdf_downloaded", {
      document_type: documentType,
      template: selectedTemplate,
    });
    // The end of this flow: point at the one thing left to do, a few
    // seconds after the print tab takes focus.
    if (tab === "cv" && tailorResult.coverLetter) {
      toast(t("result.nextLetter"), {
        duration: 8000,
        action: { label: t("result.viewLetter"), onClick: () => setActiveTab("letter") },
      });
    } else {
      toast(t("result.nextApplications"), {
        duration: 8000,
        action: { label: t("openApplications"), onClick: () => router.push("/dashboard/applications") },
      });
    }
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

  const runAtsScore = (cv, scoreBefore) => {
    setAtsLoading(true);
    fetch("/api/ats-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tailoredCV: cv, jobData }),
    })
      .then((res) => res.json())
      .then((ats) => {
        if (ats.data) {
          setAtsScore(ats.data);
          setFixGain(
            typeof scoreBefore === "number" && ats.data.score > scoreBefore
              ? ats.data.score - scoreBefore
              : 0,
          );
        }
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
        throw new Error(json.error || t("errors.why"));
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
        throw new Error(json.error || t("errors.fix"));
      }
      const updated = json.data.tailoredCV;
      setTailorResult((r) => ({ ...r, tailoredCV: updated }));
      setLiveValues(null);
      setAppliedFixes((list) => [...list, fix]);
      trackEvent("ats_fix_applied");
      toast.success(json.data.changes?.[0] || t("fixApplied"));
      persistTailoredCV({
        basics: updated.basics,
        work: updated.work,
        education: updated.education,
        skills: updated.skills,
      });
      runAtsScore(updated, atsScore?.score);
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
    // Free users get a 402 here, so opening the tab popped the paywall. They
    // see a locked Write button instead and choose to click it.
    if (tabId === "why" && session?.user?.isPremium && !whyThisRole && !whyLoading && tailorResult) {
      generateWhyThisRole();
    }
  };

  const handleExtract = (e) => {
    e.preventDefault();
    if (jobInputMode === "text") {
      if (jobText.trim().length < MIN_JOB_TEXT_CHARS) {
        toast.error(t("errors.shortText"));
        return;
      }
      extractMutation.mutate({ text: jobText.trim() });
      return;
    }
    if (!url.trim()) {
      toast.error(t("errors.noUrl"));
      return;
    }
    extractMutation.mutate({ url: url.trim() });
  };

  function startTailor(job = jobData) {
    trackEvent("tailor_started", {
      is_premium: Boolean(session?.user?.isPremium),
      has_match_score: Boolean(matchScore),
    });

    tailorMutation.mutate(job);
  }
  const handleTailor = () => startTailor();

  const isPremium = Boolean(session?.user?.isPremium);
  const currentStep = tailorResult
    ? 3
    : jobData || extractMutation.isPending || tailorMutation.isPending
      ? 2
      : 1;
  const showJobForm = !jobData || editingJob;
  const extractDisabled =
    extractMutation.isPending ||
    (jobInputMode === "link" ? !url.trim() : jobText.trim().length < MIN_JOB_TEXT_CHARS);
  const jobDetailSummary = jobData
    ? [
        jobData.requirements?.length
          ? t("summary.requirements", { count: jobData.requirements.length })
          : null,
        jobData.keywords?.length ? t("summary.keyTerms", { count: jobData.keywords.length }) : null,
        matchScore?.globalGrade ? t("summary.grade", { grade: matchScore.globalGrade }) : null,
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
        title={t("title")}
        description={t("description")}
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
              title={jobInputMode === "link" ? t("form.linkTitle") : t("form.textTitle")}
              description={
                jobInputMode === "link" ? t("form.linkDescription") : t("form.textDescription")
              }
            />
          </div>
          <DashboardFilterPills
            className="mt-4"
            tabs={jobInputTabs}
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
                    aria-label={t("form.urlAria")}
                    autoComplete="url"
                    spellCheck={false}
                    className="min-w-0 text-sm sm:flex-1"
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
                        {t("form.reading")}
                        {elapsedBadge}
                      </>
                    ) : (
                      <>
                        <SparkleIcon size={16} aria-hidden="true" />
                        {t("tailorCta")}
                      </>
                    )}
                  </button>
                </div>
                {recentUrls.length > 0 && !jobData && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ClockCounterClockwiseIcon size={12} aria-hidden="true" />
                      {t("form.recent")}
                    </span>
                    {recentUrls.map((item) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => setUrl(item.url)}
                        title={item.url}
                        className="inline-flex h-control-sm max-w-full items-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 text-xs font-medium text-foreground transition-colors hover:bg-[var(--landing-paper-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-ink)]"
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
                  aria-label={t("form.textTitle")}
                  placeholder={t("form.textPlaceholder")}
                  rows={8}
                  maxLength={15000}
                  className="min-h-40 text-sm"
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {jobText.trim().length < MIN_JOB_TEXT_CHARS
                      ? t("form.minChars", { min: MIN_JOB_TEXT_CHARS })
                      : t("form.chars", { count: jobText.trim().length })}
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
                        {t("form.reading")}
                        {elapsedBadge}
                      </>
                    ) : (
                      <>
                        <SparkleIcon size={16} aria-hidden="true" />
                        {t("tailorCta")}
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
                {t("form.keepJob")}
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
                {jobData.title || t("bar.fallbackTitle")}
              </p>
              <p className="truncate text-xs leading-5 text-muted-foreground">
                {jobData.company ||
                  (jobInputMode === "link" ? url.trim() : t("bar.pasted"))}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {matchScoreLoading ? (
                <span className="text-xs font-medium text-muted-foreground">{t("bar.scoring")}</span>
              ) : (
                <GradeBadge grade={matchScore?.globalGrade} />
              )}
              {tailorResult && (
                <AtsScoreChip
                  score={atsScore?.score}
                    preScore={preAtsScore?.score}
                  loading={atsLoading}
                  onClick={() => handleTabChange("ats")}
                />
              )}
              <button
                type="button"
                onClick={() => setEditingJob(true)}
                className="dashboard-secondary-btn dashboard-secondary-btn-sm"
                aria-label={t("bar.changeJob")}
              >
                <PencilSimpleIcon size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{t("bar.changeJob")}</span>
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
                      {t("tailoring")}
                      {elapsedBadge}
                    </>
                  ) : (
                    <>
                      <SparkleIcon size={14} aria-hidden="true" />
                      {t("tailorCta")}
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
                    {t("details.title")}
                  </p>
                  <p className="truncate text-xs tabular-nums text-muted-foreground">
                    {jobDetailSummary || t("details.fallback")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJobDetails((open) => !open)}
                  aria-expanded={showJobDetails}
                  className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
                >
                  {showJobDetails ? t("details.hide") : t("details.show")}
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
                  jobUrl={jobInputMode === "link" ? url : ""}
                  referenceCV={cachedReferenceCV}
                  matchGrade={matchScore?.globalGrade}
                  matchLoading={matchScoreLoading}
                />
              </Rise>
              <div className="flex min-w-0 flex-col gap-4 lg:col-span-5 lg:sticky lg:top-32">
                {!tailorResult && (
                  <DashboardPanel delay={0.05}>
                    <DashboardPanelHeader
                      title={t("cta.title")}
                      description={
                        tailorMutation.isPending
                          ? `${t("cta.pending")} ${t("cta.elapsed", { seconds: tailorSeconds })}`
                          : t("cta.description")
                      }
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
                          {t("tailoring")}
                        </>
                      ) : (
                        <>
                          <SparkleIcon size={16} aria-hidden="true" />
                          {t("tailorCta")}
                        </>
                      )}
                    </button>
                  </DashboardPanel>
                )}
                {(!isPremium || matchScoreLoading || matchScore) && (
                  <Rise delay={0.1}>
                    <JobMatchScoreCard
                      scoreData={matchScore}
                      isLoading={matchScoreLoading}
                      locked={!isPremium}
                    />
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
          {/* The peak of this flow: what tailoring actually changed, in real
              numbers from the tailor response and the two ATS runs. */}
          {(tailorResult.keywordsInjected?.length > 0 ||
            (typeof preAtsScore?.score === "number" && atsScore?.score > preAtsScore.score)) && (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-[var(--landing-ink)]">
              <CheckCircleIcon size={18} weight="fill" className="text-[var(--landing-success)]" aria-hidden="true" />
              {tailorResult.keywordsInjected?.length > 0 && (
                <span>{t("result.peakKeywords", { count: tailorResult.keywordsInjected.length })}</span>
              )}
              {typeof preAtsScore?.score === "number" && atsScore?.score > preAtsScore.score && (
                <span>
                  {t.rich("result.peakScore", {
                    preScore: preAtsScore.score,
                    score: () => <AnimatedNumber value={atsScore.score} className="font-bold text-[var(--landing-success)]" />,
                  })}
                </span>
              )}
            </p>
          )}
          {/* One row on desktop: the buttons stretch to the tab bar's height so
              all three share a top, bottom and centre line. */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:justify-between">
            <div className="flex min-w-0 items-center">
              <DashboardTabBar
                tabs={resultTabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                ariaLabel={t("result.sectionsAria")}
              />
            </div>
            {(activeTab === "cv" || activeTab === "letter") && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                {activeTab === "cv" && (
                  <AtsScoreChip
                    className="self-start sm:self-center"
                    score={atsScore?.score}
                    preScore={preAtsScore?.score}
                    loading={atsLoading}
                    onClick={() => handleTabChange("ats")}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setLinkedInModalOpen(true)}
                  className="dashboard-secondary-btn dashboard-secondary-btn-sm"
                >
                  <LinkedinLogoIcon size={16} aria-hidden="true" />
                  {t("result.linkedin")}
                </button>
                <DownloadButton
                  className="h-control-sm w-full sm:w-auto"
                  label={activeTab === "cv" ? t("result.downloadPdf") : t("result.downloadLetter")}
                  idleIcon={downloadIcon}
                  onDownload={() => handleDownload(activeTab)}
                />
                {!isPremium && pricing.single ? (
                  <span className="self-center text-xs text-muted-foreground">
                    {t("result.downloadFrom", { price: pricing.single.price })}
                  </span>
                ) : null}
              </div>
            )}
          </div>

          {activeTab === "cv" && (
            <>
              <DashboardTabBar
                ariaLabel={t("mobileTabs.ariaLabel")}
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
                  {savedId && (
                    <ResumeForm
                      // ResumeForm reads initialData once, so remount after an
                      // ATS fix or the form would save its stale values over it.
                      key={`${savedId}-${appliedFixes.length}`}
                      initialData={tailorResult.tailoredCV}
                      saveEndpoint={`/api/tailored-cv/${savedId}`}
                      saveMethod="PUT"
                      queryKey={["tailored-cv", savedId]}
                      saveButtonLabel={t("result.saveTailored")}
                      onValuesChange={handleValuesChange}
                      onSaved={(data) => {
                        setTailorResult((r) => ({ ...r, tailoredCV: data }));
                        setLiveValues(null);
                      }}
                    />
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
                        {savedId ? t("result.liveUpdates") : t("mobileTabs.preview")}
                      </p>
                    </div>
                    <div className="bg-white">
                      <PreviewUnlockGate
                        locked={!isPremium}
                        onUnlock={() => {
                          setUpgradeModalContext("download");
                          setShowUpgradeModal(true);
                        }}
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
                    {tailorResult.keywordsInjected?.length > 0 && (
                      <div className="border-t border-[var(--landing-line)] px-4 py-3">
                        <p className="text-xs font-medium text-muted-foreground">
                          {t("result.keywordsAdded")}
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
            <PreviewUnlockGate
              locked={!isPremium}
              onUnlock={() => {
                setUpgradeModalContext("download");
                setShowUpgradeModal(true);
              }}
            >
              <CoverLetterCard
                content={tailorResult.coverLetter}
                fontStack={getTemplateFontOption(selectedTemplateStyle.font).stack}
              />
            </PreviewUnlockGate>
          )}
          {activeTab === "ats" && (
            <ATSScoreCard
              atsData={atsScore}
              isLoading={atsLoading}
              cv={tailorResult.tailoredCV}
              jobData={jobData}
              preScore={preAtsScore?.score}
              onApplyFix={handleApplyFix}
              locked={!isPremium}
              applyingFix={applyingFix}
              appliedFixes={appliedFixes}
              fixGain={fixGain}
            />
          )}
          {activeTab === "why" && (
            <WhyThisRoleCard
              answer={whyThisRole?.answer ?? ""}
              question={whyThisRole?.question}
              isLoading={whyLoading}
              locked={!isPremium}
              onGenerate={generateWhyThisRole}
              onSave={
                savedId
                  ? (text) => {
                      // Held in state too, so leaving the tab does not throw
                      // away what the user edited.
                      setWhyThisRole((w) => ({ ...w, answer: text }));
                      persistTailoredCV({ whyThisRole: text });
                      toast.success(t("answerSaved"));
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
        job={jobData}
        cvId={savedId}
        stats={{
          keywordsAdded: tailorResult?.keywordsInjected?.length ?? 0,
          grade: matchScore?.globalGrade ?? null,
        }}
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
