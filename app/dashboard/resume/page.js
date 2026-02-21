"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowCounterClockwiseIcon,
  EyeIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ResumeUpload from "@/components/ResumeUpload";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import Loader from "@/components/Loader";

export default function MyResumePage() {
  const [parsedData, setParsedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const {
    data: savedCV,
    isLoading,
  } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch resume");
      const json = await res.json();
      return json.data;
    },
  });

  const handleParsed = (data) => {
    setParsedData(data);
    setShowPreview(false);
  };

  const handleReUpload = () => {
    setParsedData(null);
    setShowPreview(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  // Show form/preview with parsed data (just uploaded)
  if (parsedData) {
    const resumeData = {
      basics: parsedData.basics,
      work: parsedData.work,
      education: parsedData.education,
      skills: parsedData.skills,
    };

    return (
      <motion.div
        className="mx-auto max-w-3xl space-y-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold font-outfit text-foreground">Review Your Resume</h1>
            <p className="text-sm text-gray-500">
              Review and edit the parsed information, then save.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="rounded-full"
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
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="rounded-full" onClick={handleReUpload}>
                <ArrowCounterClockwiseIcon size={16} />
                Re-upload
              </Button>
            </motion.div>
          </div>
        </div>
        {showPreview ? (
          <ResumePreview data={resumeData} />
        ) : (
          <ResumeForm
            initialData={resumeData}
            rawText={parsedData.rawText}
          />
        )}
      </motion.div>
    );
  }

  // Show form/preview with saved data
  if (savedCV) {
    const resumeData = {
      basics: savedCV.basics,
      work: savedCV.work,
      education: savedCV.education,
      skills: savedCV.skills,
    };

    return (
      <motion.div
        className="mx-auto max-w-3xl space-y-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold font-outfit text-foreground">My Resume</h1>
            <p className="text-sm text-gray-500">
              Edit your resume information or upload a new one.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="rounded-full"
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
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="rounded-full" onClick={handleReUpload}>
                <ArrowCounterClockwiseIcon size={16} />
                Upload New
              </Button>
            </motion.div>
          </div>
        </div>
        {showPreview ? (
          <ResumePreview data={resumeData} />
        ) : (
          <ResumeForm
            initialData={resumeData}
            rawText={savedCV.rawText}
          />
        )}
      </motion.div>
    );
  }

  // No CV — show upload
  return (
    <motion.div
      className="mx-auto max-w-lg space-y-6 py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <h1 className="text-xl font-semibold font-outfit text-foreground">Upload Your Resume</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload a PDF of your resume. We&apos;ll extract and structure the
          information so you can review and edit it.
        </p>
      </div>
      <ResumeUpload onParsed={handleParsed} />
    </motion.div>
  );
}
