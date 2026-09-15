"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DownloadSimpleIcon, FileDashedIcon, MinusIcon, PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResumeTemplate } from "@/components/ResumePreview";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";

// The draft renders at A4 size (96 dpi) and CSS zoom scales it, so text stays
// crisp at every zoom and the preview matches the downloaded PDF.

const ZOOM_STORAGE_KEY = "fitmycv:agent-preview-zoom";
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.1;
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));

// null means "fit the pane", which is the default until someone picks a zoom.
function storedZoom() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ZOOM_STORAGE_KEY);
    const stored = raw === null ? Number.NaN : Number(raw);
    return Number.isFinite(stored) ? clampZoom(stored) : null;
  } catch {
    return null;
  }
}

function ToolbarButton({ label, children, ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={label}
          className="size-7 text-muted-foreground hover:text-foreground"
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

export function ResumePane({ draft, template, style }) {
  const scrollRef = useRef(null);
  const [userZoom, setUserZoom] = useState(storedZoom);
  const [paneWidth, setPaneWidth] = useState(0);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return undefined;
    const observer = new ResizeObserver(([entry]) => setPaneWidth(entry.contentRect.width));
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      if (userZoom === null) window.localStorage.removeItem(ZOOM_STORAGE_KEY);
      else window.localStorage.setItem(ZOOM_STORAGE_KEY, String(userZoom));
    } catch {
      // Storage can be unavailable in private windows. Zoom still works for this visit.
    }
  }, [userZoom]);

  // Tighter margins on a phone so the page gets every pixel it can.
  const gutter = paneWidth < 480 ? 12 : 28;
  // Fit never enlarges past print size, where a CV starts to look oversized.
  const fitZoom = paneWidth ? Math.min(1, clampZoom((paneWidth - gutter * 2) / PAGE_WIDTH)) : 0.5;
  const zoom = userZoom ?? fitZoom;
  const zoomPercent = Math.round(zoom * 100);

  return (
    <section aria-label="Draft CV" className="flex h-full min-h-0 flex-col bg-[var(--landing-paper-strong)]">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--landing-line)] bg-[var(--landing-bg)] px-3">
        <div className="flex items-center rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] p-0.5">
          <ToolbarButton
            label="Zoom out"
            disabled={!draft || zoom <= MIN_ZOOM}
            onClick={() => setUserZoom(clampZoom(zoom - ZOOM_STEP))}
          >
            <MinusIcon />
          </ToolbarButton>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={!draft}
                onClick={() => setUserZoom(null)}
                aria-label={`Zoom ${zoomPercent}%. Fit to width`}
                className="h-7 min-w-12 rounded-md px-1 text-xs font-medium text-muted-foreground tabular-nums transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-foreground disabled:opacity-50"
              >
                {zoomPercent}%
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Fit to width</TooltipContent>
          </Tooltip>
          <ToolbarButton
            label="Zoom in"
            disabled={!draft || zoom >= MAX_ZOOM}
            onClick={() => setUserZoom(clampZoom(zoom + ZOOM_STEP))}
          >
            <PlusIcon />
          </ToolbarButton>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {draft && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-md border-[var(--landing-line)] bg-[var(--landing-surface)]"
            >
              <Link href={`/dashboard/tailored/${draft._id}`}>
                <PencilSimpleIcon aria-hidden="true" />
                Edit
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            disabled={!draft}
            className="rounded-md bg-foreground font-medium text-background hover:bg-black"
            onClick={() =>
              printDocument({
                kind: "cv",
                data: draft,
                template,
                style,
                filename: buildPdfFilename(draft.basics?.name, "cv"),
              })
            }
          >
            <DownloadSimpleIcon aria-hidden="true" />
            Download PDF
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
        {draft ? (
          <div style={{ padding: gutter }}>
            <div
              className="mx-auto w-fit bg-white shadow-[var(--landing-shadow)] ring-1 ring-black/5"
              style={{ zoom }}
            >
              <div style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT }}>
                <ResumeTemplate data={draft} template={template} style={style} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <div className="max-w-xs text-center">
              <FileDashedIcon className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-foreground">This draft was deleted</p>
              <p className="mt-1 text-sm text-muted-foreground">Start a new thread to keep editing your CV.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
