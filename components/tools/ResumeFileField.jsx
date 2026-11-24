"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  CircleNotchIcon,
  FilePdfIcon,
  UploadSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { extractResumeText, validateResumeFile } from "@/utils/extract-resume-client";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Codes from utils/extract-resume-client.js, mapped to pages.tools.resumeFile.
const ERROR_KEYS = {
  word: "errorWord",
  type: "errorType",
  size: "errorSize",
  empty: "errorEmpty",
};

const textareaClassName =
  "min-w-0 w-full max-w-full resize-y rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] p-4 font-sans text-sm leading-6 text-[var(--landing-ink)] outline-none transition-colors placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-accent)]";

export default function ResumeFileField({
  id,
  label,
  value,
  onChange,
  onBusyChange,
  rows = 10,
  // "hero" is the Jobscan-style full-width dropzone used in stepped tools.
  // "default" keeps the compact field for side-by-side layouts.
  variant = "default",
  // Hide the field label when the stepper already names the step.
  hideLabel = false,
  // Fired once a file (or pasted text) is ready, so a stepped tool can advance.
  onReady,
}) {
  const t = useTranslations("pages.tools.resumeFile");
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

  const hero = variant === "hero";

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
        setError(t(ERROR_KEYS[invalid]));
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
        toast.success(t("ready"));
        onReady?.(text);
      } catch (caught) {
        // An error with no code is the PDF library's own wording (a locked or
        // broken file), so it gets the general message instead.
        setError(t(ERROR_KEYS[caught?.code] ?? "readFailed"));
        // Both messages end in "paste the text", so the box is open and focused.
        setPasteOpen(true);
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onChange, onReady, setBusy, t]
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
    const before = { fileName, fileSize, text: value };
    setFileName("");
    setFileSize(0);
    setError("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
    // The text may hold hand edits, so removing it can be taken back.
    toast(t("removed"), {
      action: {
        label: t("undo"),
        onClick: () => {
          setFileName(before.fileName);
          setFileSize(before.fileSize);
          onChange(before.text);
        },
      },
    });
  };

  const hasFile = Boolean(fileName);
  const showTextarea = hasFile || pasteOpen || value.trim().length > 0;

  return (
    <div className={`flex min-w-0 flex-col ${hero ? "gap-4" : "gap-2"}`}>
      {!hideLabel ? (
        <label
          htmlFor={showTextarea ? fieldId : fileInputId}
          className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]"
        >
          {label ?? t("label")}
        </label>
      ) : null}

      {hasFile ? (
        <div className="landing-rise flex items-center gap-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper)] px-4 py-3">
          <FilePdfIcon
            size={20}
            weight="duotone"
            aria-hidden="true"
            className="shrink-0 text-[var(--landing-accent)]"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--landing-ink)]">
              {fileName}
            </p>
            <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
              {formatFileSize(fileSize)}
              {value.trim()
                ? t("charsReady", { count: value.trim().length })
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="rounded-lg p-1.5 text-[var(--landing-ink-soft)] transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-[var(--landing-ink)]"
            aria-label={t("remove")}
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
          className={`flex cursor-pointer flex-col items-center justify-center border border-dashed text-center transition-colors ${
            hero
              ? "min-h-70 rounded-3xl px-6 py-12 sm:min-h-80 sm:px-10"
              : "min-h-62 rounded-2xl px-4 py-8"
          } ${
            dragActive
              ? "border-[var(--landing-accent)] bg-[var(--landing-accent-soft)]"
              : "border-[var(--landing-line)] bg-[var(--landing-paper)] hover:border-[var(--landing-accent)]"
          } ${reading ? "pointer-events-none opacity-70" : ""}`}
        >
          {hero ? (
            <span className="relative mb-5 flex h-16 w-14 items-center justify-center">
              <FilePdfIcon
                size={52}
                weight="duotone"
                aria-hidden="true"
                className="text-[var(--landing-accent)]"
              />
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--landing-ink)] text-[var(--landing-on-primary)] shadow-sm">
                {reading ? (
                  <CircleNotchIcon size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <UploadSimpleIcon size={14} weight="bold" aria-hidden="true" />
                )}
              </span>
            </span>
          ) : (
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-accent-soft)] text-[var(--landing-ink)]">
              {reading ? (
                <CircleNotchIcon size={20} className="animate-spin" aria-hidden="true" />
              ) : (
                <UploadSimpleIcon size={20} aria-hidden="true" />
              )}
            </span>
          )}

          {reading ? (
            <>
              <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)] sm:text-base">
                {t("reading")}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--landing-ink-soft)] sm:text-sm">
                {t("readingHint")}
              </p>
              <span
                role="status"
                aria-live="polite"
                aria-label={t("reading")}
                className="tool-progress-track mt-4 h-1 w-40 max-w-full"
              >
                <span />
              </span>
            </>
          ) : hero ? (
            <>
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)] sm:text-lg">
                {t("dropHero")}{" "}
                <span className="text-[var(--landing-accent)] underline underline-offset-4">
                  {t("chooseHero")}
                </span>{" "}
                {t("dropHeroEnd")}
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--landing-ink-soft)]">
                {t("fileHintHero")}
              </p>
            </>
          ) : (
            <>
              <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
                {t("drop")}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--landing-ink-soft)]">
                {t("choose")}
              </p>
            </>
          )}
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
        aria-label={hasFile ? t("replaceAria") : t("uploadAria")}
        aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
      />

      {hasFile ? (
        <div className={`flex flex-wrap items-center gap-3 ${hero ? "justify-center" : ""}`}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={reading}
            className="font-outfit text-xs font-extrabold text-[var(--landing-accent)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2 disabled:opacity-45"
          >
            {t("replace")}
          </button>
          <p id={hintId} className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            {t("reviewHint")}
          </p>
        </div>
      ) : !hero ? (
        <p id={hintId} className="text-xs font-semibold text-[var(--landing-ink-soft)]">
          {t("fileHint")}
        </p>
      ) : (
        <p id={hintId} className="sr-only">
          {t("fileHint")}
        </p>
      )}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className={`text-sm font-semibold text-[var(--landing-coral)] ${hero ? "text-center" : ""}`}
        >
          {error}
        </p>
      ) : null}

      {showTextarea ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={hero ? Math.max(rows, 8) : rows}
          autoFocus={pasteOpen}
          placeholder={t("textPlaceholder")}
          className={textareaClassName}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPasteOpen(true)}
          className={`font-outfit text-sm font-extrabold text-[var(--landing-accent)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2 ${
            hero ? "self-center" : "self-start"
          }`}
        >
          {t("paste")}
        </button>
      )}
    </div>
  );
}
