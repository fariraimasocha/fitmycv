"use client";

import { useState, useRef } from "react";
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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobRequirementsCard from "@/components/JobRequirementsCard";
import ResumePreview from "@/components/ResumePreview";
import CoverLetterCard from "@/components/CoverLetterCard";
import TemplateSelect from "@/components/TemplateSelect";
import ATSScoreCard from "@/components/ATSScoreCard";

export default function TailorPage() {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [jobData, setJobData] = useState(null);
  const [tailorResult, setTailorResult] = useState(null);
  const [activeTab, setActiveTab] = useState("cv");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [atsScore, setAtsScore] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
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
        throw new Error("Please upload your resume first");
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
        throw new Error(err.error || "Failed to tailor resume");
      }

      return res.json();
    },
    onSuccess: (result) => {
      setTailorResult(result.data);
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

      // Auto-save to database
      saveMutation.mutate({
        jobTitle: jobData?.title || "",
        jobCompany: jobData?.company || "",
        jobUrl: url,
        basics: result.data.tailoredCV.basics,
        work: result.data.tailoredCV.work,
        education: result.data.tailoredCV.education,
        skills: result.data.tailoredCV.skills,
        coverLetter: result.data.coverLetter,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDownload = async (tab) => {
    if (!tailorResult) return;
    const { generateCVPdf, generateCoverLetterPdf, buildPdfFilename } =
      await import("@/utils/pdf-generator");
    if (tab === "cv") {
      const doc = generateCVPdf(tailorResult.tailoredCV, selectedTemplate);
      doc.save(
        buildPdfFilename(
          tailorResult.tailoredCV.basics?.name,
          jobData?.title,
          "cv",
        ),
      );
    } else {
      const doc = generateCoverLetterPdf(tailorResult.coverLetter || "", {
        name: tailorResult.tailoredCV.basics?.name,
        jobTitle: jobData?.title,
        jobCompany: jobData?.company,
      });
      doc.save(
        buildPdfFilename(
          tailorResult.tailoredCV.basics?.name,
          jobData?.title,
          "cover-letter",
        ),
      );
    }
    toast.success("PDF downloaded!");
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
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold font-outfit">Tailor Resume</h1>
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
            <form onSubmit={handleExtract} className="flex gap-3">
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
                className="rounded-full bg-black px-6 text-white hover:bg-gray-800"
              >
                {extractMutation.isPending ? (
                  <>
                    <SpinnerGapIcon size={16} className="animate-spin" />
                    Extracting…
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon size={16} />
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
          <JobRequirementsCard data={jobData} />
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
            className="rounded-full bg-black px-8 text-white hover:bg-gray-800"
          >
            {tailorMutation.isPending ? (
              <>
                <SpinnerGapIcon size={16} className="animate-spin" />
                Tailoring…
              </>
            ) : (
              <>
                <SparkleIcon size={16} />
                Tailor Resume
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
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "cv" ? "default" : "outline"}
                onClick={() => setActiveTab("cv")}
                className="gap-2"
              >
                <FileTextIcon size={16} />
                Tailored CV
              </Button>
              <Button
                variant={activeTab === "letter" ? "default" : "outline"}
                onClick={() => setActiveTab("letter")}
                className="gap-2"
              >
                <EnvelopeSimpleIcon size={16} />
                Cover Letter
              </Button>
              <Button
                variant={activeTab === "ats" ? "default" : "outline"}
                onClick={() => setActiveTab("ats")}
                className="gap-2"
              >
                <ChartBarIcon size={16} />
                ATS Score
              </Button>
            </div>
            {activeTab === "cv" && (
              <TemplateSelect
                value={selectedTemplate}
                onChange={setSelectedTemplate}
              />
            )}
            {activeTab !== "ats" && (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => handleDownload(activeTab)}
              >
                <DownloadSimpleIcon size={16} />
                Download PDF
              </Button>
            )}
          </div>

          {activeTab === "cv" && (
            <ResumePreview data={tailorResult.tailoredCV} template={selectedTemplate} />
          )}
          {activeTab === "letter" && (
            <CoverLetterCard content={tailorResult.coverLetter} />
          )}
          {activeTab === "ats" && (
            <ATSScoreCard atsData={atsScore} isLoading={atsLoading} />
          )}
        </motion.div>
      )}
    </div>
  );
}
