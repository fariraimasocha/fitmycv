"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  UploadSimpleIcon,
  FileTextIcon,
  XIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import UploadProgress from "@/components/UploadProgress";
import { uploadResumeWithProgress } from "@/utils/upload-resume";
import { trackEvent } from "@/lib/analytics";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** "Or paste your CV text": a link until opened, then a textarea. */
function PasteFallback({ open, value, onChange, onOpen }) {
  const t = useTranslations("tailor.upload");
  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="text-xs font-medium text-[var(--landing-ink-soft)] underline underline-offset-4 hover:text-[var(--landing-ink)]"
      >
        {t("pasteToggle")}
      </button>
    );
  }
  return (
    <div className="space-y-1.5">
      <label htmlFor="resume-paste" className="text-sm font-medium text-[var(--landing-ink)]">
        {t("pasteLabel")}
      </label>
      <textarea
        id="resume-paste"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder={t("pastePlaceholder")}
        className="w-full rounded-lg border border-[var(--landing-line)] bg-white p-3 text-sm text-[var(--landing-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </div>
  );
}

export default function ResumeUpload({ onParsed }) {
  const t = useTranslations("tailor.upload");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");
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
      toast.error(t("pdfOnlyError"));
    }
  }, [isUploading, t]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setIsComplete(false);
    }
  };

  const pasting = pasteOpen && pastedText.trim().length > 0;

  const handleUpload = async () => {
    if ((!file && !pasting) || isUploading) return;

    setIsUploading(true);
    setIsComplete(false);
    setProgressState({
      progress: 0,
      stage: "preparing",
      label: "Preparing your file",
    });

    try {
      const result = await uploadResumeWithProgress(
        pasting ? { text: pastedText } : { file },
        setProgressState
      );
      setIsComplete(true);
      trackEvent("resume_uploaded", pasting
        ? { source: "paste", chars: pastedText.length }
        : { source: "pdf", file_size_bytes: file.size });
      onParsed({ ...result.data, rawText: result.rawText });
    } catch (error) {
      toast.error(error.message || t("uploadError"));
      // A scanned or odd PDF fails the same way every time, so offer paste.
      setPasteOpen(true);
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
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors sm:p-10 ${
            dragActive
              ? "border-[var(--landing-accent)] bg-[var(--landing-primary-soft)]"
              : "border-[var(--landing-line)] hover:border-[#ccc5bb] hover:bg-[var(--landing-paper-soft)]"
          }`}
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]">
            <UploadSimpleIcon
              size={20}
              aria-hidden="true"
            />
          </span>
          <p className="text-sm font-medium text-[var(--landing-ink)]">
            {t("dropHere")}
          </p>
          <p className="mt-1 text-xs text-[var(--landing-ink-soft)]">{t("or")}</p>
          <span className="mt-3 text-sm font-medium text-[var(--landing-ink)] underline-offset-2 hover:underline">
            {t("browse")}
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
            {t("hint")}
          </p>
        </div>
      )}

      {file && !isUploading && !isComplete && (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
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
            aria-label={t("removeFile")}
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {!isUploading && !isComplete && (
        <PasteFallback
          open={pasteOpen}
          value={pastedText}
          onChange={setPastedText}
          onOpen={() => setPasteOpen(true)}
        />
      )}

      {isUploading && (
        <UploadProgress
          progress={progressState.progress}
          stage={progressState.stage}
        />
      )}

      {isComplete && (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-success-soft)] p-4 text-[var(--landing-success)]">
          <CheckCircleIcon size={22} weight="fill" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">{t("doneTitle")}</p>
            <p className="text-xs opacity-80">{t("doneBody")}</p>
          </div>
        </div>
      )}

      {!isUploading && !isComplete && (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file && !pasting}
            className="dashboard-primary-btn w-full"
          >
            <UploadSimpleIcon size={16} aria-hidden="true" />
            {t("submit")}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
