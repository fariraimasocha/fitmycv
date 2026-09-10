"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  CircleNotchIcon,
  FilePdfIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

import { extractResumeText, validateResumeFile } from "@/utils/extract-resume-client";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const textareaClassName =
  "w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-primary)]";

export default function ResumeFileField({
  id,
  label = "Your CV",
  value,
  onChange,
  onBusyChange,
  rows = 10,
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const fileInputId = `${fieldId}-file`;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const inputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [reading, setReading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);

  const setBusy = useCallback(
    (busy) => {
      setReading(busy);
      onBusyChange?.(busy);
    },
    [onBusyChange]
  );

  const readFile = useCallback(
    async (file) => {
      const invalid = validateResumeFile(file);
      if (invalid) {
        setError(invalid);
        toast.error(invalid);
        return;
      }

      setError("");
      setBusy(true);
      try {
        const text = await extractResumeText(file);
        setFileName(file.name);
        setFileSize(file.size);
        setPasteOpen(false);
        onChange(text);
        toast.success("CV text ready");
      } catch (caught) {
        const message =
          caught instanceof Error
            ? caught.message
            : "Could not read this PDF. Try another file, or paste the text.";
        setError(message);
        toast.error(message);
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onChange, setBusy]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (reading) return;
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) readFile(dropped);
  };

  const clearFile = () => {
    if (reading) return;
    setFileName("");
    setFileSize(0);
    setError("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasFile = Boolean(fileName);
  const showTextarea = hasFile || pasteOpen || value.trim().length > 0;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={showTextarea ? fieldId : fileInputId}
        className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
      >
        {label}
      </label>

      {hasFile ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3">
          <FilePdfIcon
            size={22}
            weight="duotone"
            aria-hidden="true"
            className="shrink-0 text-[var(--landing-primary-dark)]"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--landing-ink)]">
              {fileName}
            </p>
            <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
              {formatFileSize(fileSize)}
              {value.trim()
                ? `, ${value.trim().length.toLocaleString()} characters ready`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="rounded-lg p-1.5 text-[var(--landing-ink-soft)] transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-[var(--landing-ink)]"
            aria-label="Remove CV file"
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={fileInputId}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!reading) setDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!reading) setDragActive(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setDragActive(false);
            }
          }}
          onDrop={handleDrop}
          className={`flex min-h-62 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center transition-colors ${
            dragActive
              ? "border-[var(--landing-primary)] bg-[oklch(0.92_0.06_174_/_0.35)]"
              : "border-[var(--landing-line)] bg-[var(--landing-paper)] hover:border-[var(--landing-primary)]"
          } ${reading ? "pointer-events-none opacity-70" : ""}`}
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]">
            {reading ? (
              <CircleNotchIcon size={20} className="animate-spin" aria-hidden="true" />
            ) : (
              <UploadSimpleIcon size={20} aria-hidden="true" />
            )}
          </span>
          <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            {reading ? "Reading your CV" : "Drop your CV PDF here"}
          </p>
          <p className="mt-1 text-xs font-semibold text-[var(--landing-ink-soft)]">
            {reading ? "Pulling the text out of the file" : "or choose a file"}
          </p>
        </label>
      )}

      <input
        ref={inputRef}
        id={fileInputId}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        disabled={reading}
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) readFile(selected);
        }}
        className="sr-only"
        aria-label={hasFile ? "Replace CV file" : "Upload your CV"}
        aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
      />

      {hasFile ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={reading}
            className="font-outfit text-xs font-extrabold text-[var(--landing-primary-dark)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2 disabled:opacity-45"
          >
            Replace file
          </button>
          <p id={hintId} className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            Review the text below. That is what the checker will read.
          </p>
        </div>
      ) : (
        <p id={hintId} className="text-xs font-semibold text-[var(--landing-ink-soft)]">
          PDF, up to 8MB. Read in this tab, never stored.
        </p>
      )}

      {error ? (
        <p id={errorId} role="alert" className="text-sm font-semibold text-[var(--landing-coral)]">
          {error}
        </p>
      ) : null}

      {showTextarea ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder="The extracted text appears here. Edit it if a line looks wrong."
          className={textareaClassName}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPasteOpen(true)}
          className="self-start font-outfit text-xs font-extrabold text-[var(--landing-ink-soft)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
        >
          Or paste the text
        </button>
      )}
    </div>
  );
}
