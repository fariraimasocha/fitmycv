"use client";

import { EyeIcon, PencilSimpleIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CvEditorToolbar({
  showPreview,
  onTogglePreview,
  onUploadNew,
  uploadLabel,
}) {
  const t = useTranslations("tailor.editorToolbar");
  return (
    <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-55 sm:min-w-55">
      <div
        className="grid w-full grid-cols-2 rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] p-1"
        role="tablist"
        aria-label={t("viewMode")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={!showPreview}
          onClick={() => showPreview && onTogglePreview()}
          className={cn(
            "flex !w-full items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors sm:px-4",
            !showPreview
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <PencilSimpleIcon size={14} aria-hidden="true" />
          {t("edit")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={showPreview}
          onClick={() => !showPreview && onTogglePreview()}
          className={cn(
            "flex !w-full items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors sm:px-4",
            showPreview
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <EyeIcon size={14} aria-hidden="true" />
          {t("preview")}
        </button>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-md border-[var(--landing-line)]"
        onClick={onUploadNew}
      >
        <ArrowCounterClockwiseIcon size={16} aria-hidden="true" />
        {uploadLabel ?? t("replace")}
      </Button>
    </div>
  );
}
