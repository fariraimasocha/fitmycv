"use client";

import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function CvPreviewActions({ templateSelect, onDownload }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {templateSelect && <div className="w-full sm:w-45">{templateSelect}</div>}
      {onDownload && (
        <Button
          type="button"
          variant="outline"
          className="w-full shrink-0 rounded-[10px] border-border sm:w-auto"
          onClick={onDownload}
        >
          <DownloadSimpleIcon size={16} aria-hidden="true" />
          Download PDF
        </Button>
      )}
    </div>
  );
}
