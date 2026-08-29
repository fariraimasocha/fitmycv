"use client";

import { EyeIcon, PencilSimpleIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CvEditorToolbar({
  showPreview,
  onTogglePreview,
  onUploadNew,
  uploadLabel = "Upload New",
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-55 sm:min-w-55">
      <div
        className="grid w-full grid-cols-2 rounded-full border border-border bg-card p-1"
        role="tablist"
        aria-label="CV view mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!showPreview}
          onClick={() => showPreview && onTogglePreview()}
          className={cn(
            "flex !w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4",
            !showPreview
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <PencilSimpleIcon size={14} aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={showPreview}
          onClick={() => !showPreview && onTogglePreview()}
          className={cn(
            "flex !w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4",
            showPreview
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <EyeIcon size={14} aria-hidden="true" />
          Preview
        </button>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-md border-border"
        onClick={onUploadNew}
      >
        <ArrowCounterClockwiseIcon size={16} aria-hidden="true" />
        {uploadLabel}
      </Button>
    </div>
  );
}
