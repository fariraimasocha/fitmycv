"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import posthog from "posthog-js";
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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobRequirementsCard from "@/components/JobRequirementsCard";
import JobMatchScoreCard from "@/components/JobMatchScoreCard";
import ResumePreview from "@/components/ResumePreview";
import CoverLetterCard from "@/components/CoverLetterCard";
import TemplateSelect from "@/components/TemplateSelect";
import ATSScoreCard from "@/components/ATSScoreCard";
import CompanyResearchCard from "@/components/CompanyResearchCard";
import InterviewPrepCard from "@/components/InterviewPrepCard";
import LinkedInOutreachModal from "@/components/LinkedInOutreachModal";
import UpgradePromptModal from "@/components/UpgradePromptModal";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";

export default function TailorPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [jobData, setJobData] = useState(null);
  const [tailorResult, setTailorResult] = useState(null);
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
    onSuccess: () => {
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
      setActiveTab("cv");
      toast.success("Resume tailored successfully!");

      posthog.capture("tailored_cv_generated", {
        job_title: jobData?.title || null,
        job_company: jobData?.company || null,
        keywords_injected: result.data.keywordsInjected?.length ?? 0,
        has_cover_letter: !!result.data.coverLetter,
        match_score: matchScore?.globalScore ?? null,
      });

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
    posthog.capture("pdf_download_initiated", {
      document_type: documentType,
      is_premium: isPremium,
      template: tab === "cv" ? selectedTemplate : null,
    });
    if (!isPremium) {
      posthog.capture("upgrade_prompt_shown", {
        document_type: documentType,
        trigger: "pdf_download",
      });
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

  const handleExtract = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a job URL");
      return;
    }
    extractMutation.mutate(url.trim());
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold font-outfit">Tailor CV</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a job listing URL to extract requirements and tailor your CV.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon size={18} aria-hidden="true" />
              Job Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExtract} className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="url"
                placeholder="https://example.com/jobs/…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                aria-label="Job listing URL"
                autoComplete="url"
                spellCheck={false}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={extractMutation.isPending}
                aria-busy={extractMutation.isPending}
                className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90 sm:w-auto w-full"
              >
                {extractMutation.isPending ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                    Extracting…
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon size={16} aria-hidden="true" />
                    Extract
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

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
          className="flex justify-center"
        >
          <Button
            onClick={() => tailorMutation.mutate()}
            disabled={tailorMutation.isPending}
            aria-busy={tailorMutation.isPending}
            className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
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
            {/* Tabs — horizontally scrollable on mobile */}
            <div
              role="tablist"
              aria-label="Resume output sections"
              className="relative flex gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,black_85%,transparent_100%)]"
            >
              <Button
                role="tab"
                aria-selected={activeTab === "cv"}
                variant={activeTab === "cv" ? "default" : "outline"}
                onClick={() => setActiveTab("cv")}
                className="gap-2 shrink-0"
              >
                <FileTextIcon size={16} aria-hidden="true" />
                Tailored CV
              </Button>
              <Button
                role="tab"
                aria-selected={activeTab === "letter"}
                variant={activeTab === "letter" ? "default" : "outline"}
                onClick={() => setActiveTab("letter")}
                className="gap-2 shrink-0"
              >
                <EnvelopeSimpleIcon size={16} aria-hidden="true" />
                Cover Letter
              </Button>
              <Button
                role="tab"
                aria-selected={activeTab === "ats"}
                variant={activeTab === "ats" ? "default" : "outline"}
                onClick={() => setActiveTab("ats")}
                className="gap-2 shrink-0"
              >
                <ChartBarIcon size={16} aria-hidden="true" />
                ATS Score
              </Button>
              <Button
                role="tab"
                aria-selected={activeTab === "research"}
                variant={activeTab === "research" ? "default" : "outline"}
                onClick={() => setActiveTab("research")}
                className="gap-2 shrink-0"
              >
                <BinocularsIcon size={16} aria-hidden="true" />
                Company Research
              </Button>
              <Button
                role="tab"
                aria-selected={activeTab === "interview"}
                variant={activeTab === "interview" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("interview");
                  if (!interviewPrep && !interviewPrepLoading && tailorResult) {
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
                }}
                className="gap-2 shrink-0 mr-8"
              >
                <ChatTeardropDotsIcon size={16} aria-hidden="true" />
                Interview Prep
              </Button>
            </div>
            {/* Actions row — only shown for downloadable tabs */}
            {activeTab !== "ats" && activeTab !== "research" && activeTab !== "interview" && (
              <div className="flex items-center gap-2 flex-wrap">
                {activeTab === "cv" && (
                  <TemplateSelect
                    value={selectedTemplate}
                    onChange={setSelectedTemplate}
                  />
                )}
                <Button
                  variant="outline"
                  className="rounded-full"
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
                  className="rounded-full"
                  onClick={() => setLinkedInModalOpen(true)}
                >
                  <LinkedinLogoIcon size={16} />
                  LinkedIn Message
                </Button>
              </div>
            )}
          </div>

          {activeTab === "cv" && (
            <>
              <ResumePreview data={tailorResult.tailoredCV} template={selectedTemplate} />
              {tailorResult.keywordsInjected?.length > 0 && (
                <Card className="rounded-2xl border shadow-sm">
                  <CardContent className="py-3 px-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Keywords injected ({tailorResult.keywordsInjected.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tailorResult.keywordsInjected.map((k, i) => (
                        <span
                          key={i}
                          title={k.location}
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-help"
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
    </div>
  );
}
