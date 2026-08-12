"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  SpinnerGapIcon,
  LinkIcon,
  SparkleIcon,
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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobRequirementsCard from "@/components/JobRequirementsCard";
import JobMatchScoreCard from "@/components/JobMatchScoreCard";
import ResumePreview from "@/components/ResumePreview";
import ResumeForm from "@/components/ResumeForm";
import CoverLetterCard from "@/components/CoverLetterCard";
import TemplateSelect from "@/components/TemplateSelect";
import ATSScoreCard from "@/components/ATSScoreCard";
import CompanyResearchCard from "@/components/CompanyResearchCard";
import InterviewPrepCard from "@/components/InterviewPrepCard";
import LinkedInOutreachModal from "@/components/LinkedInOutreachModal";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardTabBar,
} from "@/components/dashboard";

export default function TailorPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [jobData, setJobData] = useState(null);
  const [tailorResult, setTailorResult] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState("cv");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
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
  const tailorRef = useRef(null);

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
    if (!tailorResult) return;
    const documentType = tab === "cv" ? "cv" : "cover_letter";
    const isPremium = !!session?.user?.isPremium;
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
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
          <CardHeader className="border-b border-border/60 px-4 py-4 sm:px-6 sm:py-5">
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
          <CardContent className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
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
              <Button
                type="submit"
                disabled={extractMutation.isPending || !url.trim()}
                aria-busy={extractMutation.isPending}
                className="h-11 w-full rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90 sm:w-auto sm:self-start"
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
              className="dashboard-list-row rounded-2xl px-4 py-4"
            >
              <span className="font-serif-display text-2xl text-[var(--landing-accent)]">
                {item.step}
              </span>
              <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </motion.div>
      )}

      {jobData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <JobRequirementsCard data={jobData} referenceCV={cachedReferenceCV} />
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

      {jobData && !tailorResult && (
        <motion.div
          ref={tailorRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="dashboard-card rounded-2xl px-4 py-5 text-center sm:px-6">
            <p className="text-sm text-muted-foreground">
              Requirements extracted — ready to rewrite your CV for this role.
            </p>
            <Button
              onClick={() => tailorMutation.mutate()}
              disabled={tailorMutation.isPending}
              aria-busy={tailorMutation.isPending}
              className="mt-4 h-12 w-full rounded-[10px] bg-foreground px-8 font-outfit text-base font-semibold text-background shadow-[var(--landing-shadow-sm)] hover:opacity-90 sm:mx-auto sm:w-auto"
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
          </Button>
          </div>
        </motion.div>
      )}

      {tailorResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-3">
            <DashboardTabBar
              tabs={tailorTabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              ariaLabel="Resume output sections"
            />
            {/* Actions row — only shown for downloadable tabs */}
            {activeTab !== "ats" && activeTab !== "research" && activeTab !== "interview" && (
              <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
                {activeTab === "cv" && savedId && (
                  <Button
                    variant="outline"
                    className="w-full rounded-[10px] border-border sm:w-auto"
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
                  <div className="w-full sm:w-auto">
                    <TemplateSelect
                      value={selectedTemplate}
                      onChange={setSelectedTemplate}
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full rounded-[10px] border-border sm:w-auto"
                  onClick={() => handleDownload(activeTab)}
                >
                  {session?.user?.isPremium ? (
                    <DownloadSimpleIcon size={16} />
                  ) : (
                    <CrownIcon size={16} className="text-amber-500" />
                  )}
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-[10px] border-border sm:w-auto"
                  onClick={() => setLinkedInModalOpen(true)}
                >
                  <LinkedinLogoIcon size={16} />
                  LinkedIn Message
                </Button>
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
              <div className="dashboard-card overflow-hidden rounded-2xl border-border">
                <ResumePreview data={tailorResult.tailoredCV} template={selectedTemplate} />
              </div>
              {tailorResult.keywordsInjected?.length > 0 && (
                <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
                  <CardContent className="px-4 py-4 sm:px-6">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Keywords injected ({tailorResult.keywordsInjected.length})
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
            <CoverLetterCard content={tailorResult.coverLetter} />
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
