"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  UploadSimpleIcon,
  FileTextIcon,
  XIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import UploadProgress from "@/components/UploadProgress";
import { uploadResumeWithProgress } from "@/utils/upload-resume";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumeUpload({ onParsed }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progressState, setProgressState] = useState({
    progress: 0,
    stage: "preparing",
    label: "Preparing your file",
  });
  const inputRef = useRef(null);

  const openFilePicker = useCallback(() => {
    if (!isUploading) inputRef.current?.click();
  }, [isUploading]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [isUploading]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (isUploading) return;

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setIsComplete(false);
    } else {
      toast.error("Please drop a PDF file");
    }
  }, [isUploading]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setIsComplete(false);
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setIsComplete(false);
    setProgressState({
      progress: 0,
      stage: "preparing",
      label: "Preparing your file",
    });

    try {
      const result = await uploadResumeWithProgress(file, setProgressState);
      setIsComplete(true);
      toast.success("Resume parsed successfully!");
      onParsed({ ...result.data, rawText: result.rawText });
    } catch (error) {
      toast.error(error.message || "Upload failed");
      setProgressState({
        progress: 0,
        stage: "preparing",
        label: "Preparing your file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    if (isUploading) return;
    setFile(null);
    setIsComplete(false);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!isUploading && !isComplete && (
        <div
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFilePicker();
            }
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors sm:p-10 ${
            dragActive
              ? "border-[var(--landing-accent)] bg-[var(--landing-primary-soft)]"
              : "border-[var(--landing-line)] hover:border-[#ccc5bb] hover:bg-[var(--landing-paper-soft)]"
          }`}
        >
          <UploadSimpleIcon
            size={40}
            className="mb-3 text-[var(--landing-ink-soft)]"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-[var(--landing-ink)]">
            Drag and drop your CV PDF here
          </p>
          <p className="mt-1 text-xs text-[var(--landing-ink-soft)]">or</p>
          <span className="mt-3 text-sm font-medium text-[var(--landing-ink)] underline-offset-2 hover:underline">
            Browse files
          </span>
          <input
            ref={inputRef}
            id="resume-file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="sr-only"
            aria-describedby="resume-file-hint"
          />
          <p id="resume-file-hint" className="mt-3 text-xs text-[var(--landing-ink-soft)]">
            PDF only, max 8MB
          </p>
        </div>
      )}

      {file && !isUploading && !isComplete && (
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--landing-line)] bg-white p-4 shadow-[var(--landing-shadow-sm)]">
          <FileTextIcon size={24} className="shrink-0 text-[var(--landing-accent)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--landing-ink)]">
              {file.name}
            </p>
            <p className="text-xs text-[var(--landing-ink-soft)]">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="rounded-lg p-1.5 text-[var(--landing-ink-soft)] transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-[var(--landing-ink)]"
            aria-label="Remove file"
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {isUploading && (
        <UploadProgress
          progress={progressState.progress}
          stage={progressState.stage}
          label={progressState.label}
        />
      )}

      {isComplete && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#c8e6d0] bg-[#eef8f1] p-4 text-[#2d5a3d]">
          <CheckCircleIcon size={22} weight="fill" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">CV uploaded and parsed</p>
            <p className="text-xs opacity-80">Your reference CV is ready to use.</p>
          </div>
        </div>
      )}

      {!isUploading && !isComplete && (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file}
            className="landing-primary-btn w-full cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadSimpleIcon size={16} aria-hidden="true" />
            Upload &amp; Parse
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
