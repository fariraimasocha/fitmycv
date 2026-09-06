"use client";

import { Suspense, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  SpinnerGapIcon,
  LinkIcon,
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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/ui/download-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobRequirementsCard from "@/components/JobRequirementsCard";
import JobMatchScoreCard from "@/components/JobMatchScoreCard";
import ResumePreview from "@/components/ResumePreview";
import ResumeForm from "@/components/ResumeForm";
import CoverLetterCard from "@/components/CoverLetterCard";
import TemplatePicker from "@/components/TemplatePicker";
import ATSScoreCard from "@/components/ATSScoreCard";
import CompanyResearchCard from "@/components/CompanyResearchCard";
import InterviewPrepCard from "@/components/InterviewPrepCard";
import LinkedInOutreachModal from "@/components/LinkedInOutreachModal";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE, getTemplateFontClass, getTemplateName } from "@/utils/cv-templates/metadata";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardTabBar,
} from "@/components/dashboard";
import { GradeBadge, AtsScoreChip } from "@/components/GradeBadge";
import { getRecentJobUrls, rememberJobUrl } from "@/lib/recent-job-urls";
import Loader from "@/components/Loader";

function Tailor() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  // Prefilled when arriving from /jobs — that pool already holds the URL, so
  // the user never retypes it. Lazy initializer: read once, then it is theirs.
  const [url, setUrl] = useState(() => searchParams.get("url") ?? "");
  const [jobData, setJobData] = useState(null);
  const [tailorResult, setTailorResult] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState("cv");
  const [templateOverride, setTemplateOverride] = useState(null);
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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

  const extractMutation = useMutation({
    mutationFn: async (jobUrl) => {
      const res = await fetch("/api/job/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to extract job requirements");
      }

      return res.json();
    },
    onSuccess: (result) => {
      setJobData(result.data);
      setTailorResult(null);
      setSavedId(null);
      setShowPreview(true);
      setAtsScore(null);
      setCompanyBrief(null);
      setMatchScore(null);
      setPreAtsScore(null);

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
            jobUrl: url.trim(),
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.data) setCompanyBrief(res.data);
          })
          .catch(() => {})
          .finally(() => setCompanyBriefLoading(false));
      }

      rememberJobUrl(url.trim(), result.data?.title || "");
      setRecentUrls(getRecentJobUrls());
      toast.success("Job requirements extracted!");
      setTimeout(() => {
        tailorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    },
    onError: (error) => {
      toast.error(error.message);
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
        throw new Error(err.error || "Failed to tailor CV");
      }

      return res.json();
    },
    onSuccess: (result) => {
      setTailorResult(result.data);
      setSavedId(null);
      setShowPreview(true);
      setActiveTab("cv");
      toast.success("Resume tailored successfully!");

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
        jobUrl: url,
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
      toast.error(error.message);
    },
  });

  const handleDownload = (tab) => {
    if (!tailorResult) return false;
    const documentType = tab === "cv" ? "cv" : "cover_letter";
    const isPremium = !!session?.user?.isPremium;
    if (!isPremium) {
      setShowUpgradeModal(true);
      return false;
    }
    if (tab === "cv") {
      printDocument({
        kind: "cv",
        data: tailorResult.tailoredCV,
        template: selectedTemplate,
        filename: buildPdfFilename(
          tailorResult.tailoredCV.basics?.name,
          jobData?.title,
          "cv",
        ),
      });
    } else {
      printDocument({
        kind: "cover-letter",
        content: tailorResult.coverLetter || "",
        template: selectedTemplate,
        meta: {
          name: tailorResult.tailoredCV.basics?.name,
          jobTitle: jobData?.title,
          jobCompany: jobData?.company,
        },
        filename: buildPdfFilename(
          tailorResult.tailoredCV.basics?.name,
          jobData?.title,
          "cover-letter",
        ),
      });
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
  };

  const tailorTabs = [
    {
      id: "cv",
      label: "Tailored CV",
      icon: <FileTextIcon size={14} aria-hidden="true" />,
    },
    {
      id: "letter",
      label: "Cover Letter",
      icon: <EnvelopeSimpleIcon size={14} aria-hidden="true" />,
    },
    {
      id: "ats",
      label: "ATS Score",
      icon: <ChartBarIcon size={14} aria-hidden="true" />,
    },
    {
      id: "research",
      label: "Research",
      icon: <BinocularsIcon size={14} aria-hidden="true" />,
    },
    {
      id: "interview",
      label: "Interview",
      icon: <ChatTeardropDotsIcon size={14} aria-hidden="true" />,
    },
  ];
  const handleExtract = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a job URL");
      return;
    }
    extractMutation.mutate(url.trim());
  };

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        eyebrow="CV Toolkit"
        title="Tailor CV"
        description="Paste a job listing URL — we'll extract requirements and rewrite your CV to match."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
          <CardHeader className="dashboard-card-pad">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                <LinkIcon size={18} aria-hidden="true" />
              </span>
              <div>
                <span className="block">Job listing URL</span>
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                  Works with LinkedIn, Indeed, Greenhouse, and most job boards
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="dashboard-card-pad space-y-4 pt-0">
            <form onSubmit={handleExtract} className="flex flex-col gap-3">
              <Input
                type="url"
                placeholder="https://www.linkedin.com/jobs/view/…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                aria-label="Job listing URL"
                autoComplete="url"
                spellCheck={false}
                className="h-11 rounded-xl border-border bg-[var(--landing-paper-soft)] text-base"
              />
              {recentUrls.length > 0 && !jobData && (
                <div className="flex flex-wrap gap-2">
                  {recentUrls.map((item) => (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => setUrl(item.url)}
                      className="max-w-full truncate rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-1 text-xs font-medium text-[var(--landing-ink)] transition-colors hover:border-[var(--landing-ink)]"
                    >
                      {item.title || item.url}
                    </button>
                  ))}
                </div>
              )}
              <Button
                type="submit"
                disabled={extractMutation.isPending || !url.trim()}
                aria-busy={extractMutation.isPending}
                className="h-11 w-full rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90 sm:w-auto sm:self-start"
              >
                {extractMutation.isPending ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                    Extracting requirements…
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon size={16} aria-hidden="true" />
                    Extract job requirements
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {!jobData && !extractMutation.isPending && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid gap-3 sm:grid-cols-3"
        >
          {[
            {
              step: "01",
              title: "Paste the job link",
              copy: "Drop any listing URL from LinkedIn, Indeed, or a company careers page.",
            },
            {
              step: "02",
              title: "Review requirements",
              copy: "We extract skills, qualifications, and keywords from the posting.",
            },
            {
              step: "03",
              title: "Tailor & apply",
              copy: "Get a matched CV, cover letter, and interview prep in one flow.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] px-4 py-4"
            >
              <span className="font-outfit text-2xl font-semibold text-[var(--landing-accent)]">
                {item.step}
              </span>
              <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </motion.div>
      )}

      {jobData && (
        <div className="sticky top-14 z-10 -mx-3 border-b border-[var(--landing-line)] bg-[var(--landing-bg)]/95 px-3 py-2 backdrop-blur-md sm:top-16 sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {jobData.title || "Job listing"}
              </p>
              {jobData.company && (
                <p className="truncate text-xs leading-5 text-[var(--landing-ink-soft)]">
                  {jobData.company}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {matchScoreLoading ? (
                <span className="text-xs font-semibold text-[var(--landing-ink-soft)]">
                  Scoring…
                </span>
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
              {/* A long listing pushes the Tailor CV button in the requirements
                  card well below the fold, so the primary action rides along
                  with the context until it has been used. */}
              {!tailorResult && (
                <Button
                  size="sm"
                  onClick={() => tailorMutation.mutate()}
                  disabled={tailorMutation.isPending}
                  aria-busy={tailorMutation.isPending}
                  className="rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90"
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
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {jobData && (
        <motion.div
          ref={tailorRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <JobRequirementsCard
            data={jobData}
            referenceCV={cachedReferenceCV}
            matchGrade={matchScore?.globalGrade}
            matchLoading={matchScoreLoading}
            onTailor={() => tailorMutation.mutate()}
            tailorPending={tailorMutation.isPending}
            showTailorAction={!tailorResult}
          />
        </motion.div>
      )}

      {jobData && (matchScoreLoading || matchScore) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <JobMatchScoreCard scoreData={matchScore} isLoading={matchScoreLoading} />
        </motion.div>
      )}

      {tailorResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 pb-24 md:pb-0"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <DashboardTabBar
                tabs={tailorTabs}
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
            {activeTab !== "ats" && activeTab !== "research" && activeTab !== "interview" && (
              <div className="hidden items-center gap-2 sm:flex sm:flex-wrap">
                {activeTab === "cv" && savedId && (
                  <Button
                    variant="outline"
                    className="rounded-md border-border"
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
                )}
                {activeTab === "cv" && (
                  <div className="w-56">
                    <TemplatePicker
                      value={selectedTemplate}
                      onChange={handleTemplateChange}
                      data={tailorResult.tailoredCV}
                    />
                  </div>
                )}
                <Button
                  variant="ghost"
                  className="rounded-md text-[var(--landing-ink-soft)] hover:text-foreground"
                  onClick={() => setLinkedInModalOpen(true)}
                >
                  <LinkedinLogoIcon size={16} />
                  LinkedIn Message
                </Button>
                <DownloadButton
                  className="sm:ml-auto"
                  label={`Download PDF · ${getTemplateName(selectedTemplate)}`}
                  idleIcon={session?.user?.isPremium ? <DownloadSimpleIcon size={16} /> : <CrownIcon size={16} />}
                  onDownload={() => handleDownload(activeTab)}
                />
              </div>
            )}
          </div>

          {activeTab === "cv" && savedId && !showPreview && (
            <ResumeForm
              initialData={tailorResult.tailoredCV}
              saveEndpoint={`/api/tailored-cv/${savedId}`}
              saveMethod="PUT"
              queryKey={["tailored-cv", savedId]}
              saveButtonLabel="Save Tailored CV"
              onSaved={(data) => {
                setTailorResult((r) => ({ ...r, tailoredCV: data }));
                setShowPreview(true);
              }}
            />
          )}
          {activeTab === "cv" && (!savedId || showPreview) && (
            <>
              <ResumePreview data={tailorResult.tailoredCV} template={selectedTemplate} />
              {tailorResult.keywordsInjected?.length > 0 && (
                <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
                  <CardContent className="dashboard-card-pad">
                    <p className="mb-2 text-xs font-medium text-[var(--landing-ink-soft)]">
                      Keywords injected
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tailorResult.keywordsInjected.map((k, i) => (
                        <span
                          key={i}
                          title={k.location}
                          className="inline-flex cursor-help items-center rounded-full border border-[#c8e6d4] bg-[#eef8f1] px-2 py-0.5 text-xs font-medium text-[var(--landing-success)]"
                        >
                          {k.keyword}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          {activeTab === "letter" && (
            <CoverLetterCard
              content={tailorResult.coverLetter}
              fontClass={getTemplateFontClass(selectedTemplate)}
            />
          )}
          {activeTab === "ats" && (
            <ATSScoreCard atsData={atsScore} isLoading={atsLoading} preScore={preAtsScore?.score} />
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
        </motion.div>
      )}

      {tailorResult && (activeTab === "cv" || activeTab === "letter") && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--landing-line)] bg-[var(--landing-bg)]/95 p-3 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            {activeTab === "cv" && (
              <div className="min-w-0 flex-1">
                <TemplatePicker
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  data={tailorResult.tailoredCV}
                />
              </div>
            )}
            <DownloadButton
              className="h-11"
              label={`Download PDF · ${getTemplateName(selectedTemplate)}`}
              idleIcon={session?.user?.isPremium ? <DownloadSimpleIcon size={16} /> : <CrownIcon size={16} />}
              onDownload={() => handleDownload(activeTab)}
            />
          </div>
        </div>
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
