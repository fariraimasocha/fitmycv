"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ResumeUpload from "@/components/ResumeUpload";
import ResumeForm from "@/components/ResumeForm";
import Loader from "@/components/Loader";

export default function MyResumePage() {
  const [parsedData, setParsedData] = useState(null);

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
  };

  const handleReUpload = () => {
    setParsedData(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  // Show form with parsed data (just uploaded)
  if (parsedData) {
    return (
      <motion.div
        className="mx-auto max-w-3xl space-y-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Review Your Resume</h1>
            <p className="text-sm text-gray-500">
              Review and edit the parsed information, then save.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="rounded-full" onClick={handleReUpload}>
              <ArrowCounterClockwiseIcon size={16} />
              Re-upload
            </Button>
          </motion.div>
        </div>
        <ResumeForm
          initialData={{
            basics: parsedData.basics,
            work: parsedData.work,
            education: parsedData.education,
            skills: parsedData.skills,
          }}
          rawText={parsedData.rawText}
        />
      </motion.div>
    );
  }

  // Show form with saved data
  if (savedCV) {
    return (
      <motion.div
        className="mx-auto max-w-3xl space-y-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Resume</h1>
            <p className="text-sm text-gray-500">
              Edit your resume information or upload a new one.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="rounded-full" onClick={handleReUpload}>
              <ArrowCounterClockwiseIcon size={16} />
              Upload New
            </Button>
          </motion.div>
        </div>
        <ResumeForm
          initialData={{
            basics: savedCV.basics,
            work: savedCV.work,
            education: savedCV.education,
            skills: savedCV.skills,
          }}
          rawText={savedCV.rawText}
        />
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
        <h1 className="text-xl font-semibold text-gray-900">Upload Your Resume</h1>
        <p className="mt-2 text-sm text-gray-500">
          Upload a PDF of your resume. We&apos;ll extract and structure the
          information so you can review and edit it.
        </p>
      </div>
      <ResumeUpload onParsed={handleParsed} />
    </motion.div>
  );
}
