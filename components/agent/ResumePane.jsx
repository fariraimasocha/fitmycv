"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowSquareOutIcon,
  ArrowsOutLineHorizontalIcon,
  FilePdfIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResumeTemplate } from "@/components/ResumePreview";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";

// Ported from Reactive Resume's agent resume-pane.tsx. The draft renders at A4
// size (96 dpi) and CSS zoom scales it, so text stays crisp at every zoom.

const ZOOM_STORAGE_KEY = "fitmycv:agent-preview-zoom";
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;
const ZOOM_STEP = 0.05;
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_GUTTER = 32;

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
        <Button size="icon-sm" variant="ghost" aria-label={label} {...props}>
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
  const [fitZoom, setFitZoom] = useState(0.5);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setFitZoom(clampZoom((entry.contentRect.width - PAGE_GUTTER) / PAGE_WIDTH));
    });
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

  const zoom = userZoom ?? fitZoom;
  const zoomPercent = Math.round(zoom * 100);

  return (
    <section className="flex h-full min-h-0 flex-col bg-[var(--landing-paper-soft)]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--landing-line)] px-4">
        <div className="min-w-0">
          <div className="font-semibold">Draft CV</div>
          <div className="truncate text-xs text-muted-foreground">
            {draft ? draft.basics?.name || "Untitled draft" : "Missing draft"}
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
        <div className="sticky top-0 z-10 flex h-10 items-center justify-between border-b border-[var(--landing-line)] bg-[var(--landing-bg)]/90 px-2 backdrop-blur">
          <div className="flex items-center gap-1">
            <ToolbarButton label="Decrease zoom" disabled={!draft} onClick={() => setUserZoom(clampZoom(zoom - ZOOM_STEP))}>
              <MinusIcon />
            </ToolbarButton>
            <input
              type="text"
              inputMode="numeric"
              value={`${zoomPercent}%`}
              disabled={!draft}
              aria-label="Zoom level"
              className="h-8 w-14 rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] px-1 text-center text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
              onChange={(event) => {
                const next = Number(event.target.value.replace(/[^0-9.]/g, ""));
                if (Number.isFinite(next) && next > 0) setUserZoom(clampZoom(next / 100));
              }}
            />
            <ToolbarButton label="Increase zoom" disabled={!draft} onClick={() => setUserZoom(clampZoom(zoom + ZOOM_STEP))}>
              <PlusIcon />
            </ToolbarButton>
            <ToolbarButton label="Fit to width" disabled={!draft || userZoom === null} onClick={() => setUserZoom(null)}>
              <ArrowsOutLineHorizontalIcon />
            </ToolbarButton>
          </div>
          <div className="flex items-center gap-1">
            {draft && (
              <ToolbarButton label="Open in editor" asChild>
                <Link href={`/dashboard/tailored/${draft._id}`}>
                  <ArrowSquareOutIcon />
                </Link>
              </ToolbarButton>
            )}
            <ToolbarButton
              label="Download PDF"
              disabled={!draft}
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
              <FilePdfIcon />
            </ToolbarButton>
          </div>
        </div>
        <div className="p-4">
          {draft ? (
            <div className="mx-auto w-fit shadow-lg" style={{ zoom }}>
              <div className="bg-white" style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT }}>
                <ResumeTemplate data={draft} template={template} style={style} />
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-[var(--landing-line)] p-6 text-center text-muted-foreground">
              The draft CV was deleted, so this thread can&apos;t make changes.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
