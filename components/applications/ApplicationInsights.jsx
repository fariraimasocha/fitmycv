"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { computeInsights, computeTimeline } from "@/lib/applications";

// Ported from Reactive Resume's insights-view.tsx: stat tiles, a pipeline flow
// snapshot you can export as a PNG, weekly velocity and sources. Plain SVG and
// CSS bars, no chart library.

// The flow chart draws with literal colors so the exported PNG matches the
// screen. FitMyCV's ink and accent ramp stand in for Reactive Resume's palette.
const FLOW_BG = "#1a1a1a";
const FLOW_COLORS = ["#d6cfc4", "#e0b9a8", "#d98b6e", "#c05a3f", "#7cc49a"];
const FLOW_REJECTED = "#e8836f";
const FLOW_TEXT = "#faf8f5";
const FLOW_MUTED = "#a39e94";

function PipelineFlow({ insights }) {
  const svgRef = useRef(null);
  const W = 800;
  const H = 340;
  const padX = 40;
  const midY = 190;
  const maxBarH = 150;
  const barW = 34;
  const slotW = (W - padX * 2) / insights.funnel.length;
  const maxReached = Math.max(1, ...insights.funnel.map((f) => f.reached));
  const bars = insights.funnel.map((f, i) => {
    const h = Math.max((f.reached / maxReached) * maxBarH, 4);
    const x = padX + slotW * i + slotW / 2 - barW / 2;
    return { ...f, color: FLOW_COLORS[i], x, yTop: midY - h / 2, h, cx: x + barW / 2 };
  });

  const exportPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const bytes = new TextEncoder().encode(xml);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const image = new Image();
    image.onload = () => {
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = FLOW_BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = "pipeline-flow.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Exported pipeline-flow.png");
    };
    image.src = `data:image/svg+xml;base64,${btoa(binary)}`;
  };

  return (
    <div className="rounded-xl border border-[var(--landing-line)] p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold">Where your applications went</h3>
        <Button size="sm" variant="outline" onClick={exportPng}>
          <DownloadSimpleIcon />
          Export PNG
        </Button>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full rounded-xl"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
        role="img"
        aria-label="Pipeline flow"
      >
        <defs>
          {bars.slice(0, -1).map((bar, i) => (
            <linearGradient key={`grad-${bar.key}`} id={`flow-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={bar.color} />
              <stop offset="100%" stopColor={bars[i + 1].color} />
            </linearGradient>
          ))}
        </defs>
        <rect x={0} y={0} width={W} height={H} rx={16} fill={FLOW_BG} />
        <text x={padX} y={40} fontSize={17} fontWeight={700} fill={FLOW_TEXT}>
          Job search pipeline
        </text>
        <text x={padX} y={60} fontSize={12} fill={FLOW_MUTED}>
          {insights.total} {insights.total === 1 ? "application" : "applications"} tracked
        </text>
        {insights.rejected > 0 && (
          <g>
            <circle cx={W - padX - 96} cy={54} r={4} fill={FLOW_REJECTED} />
            <text x={W - padX - 86} y={58} fontSize={12} fill={FLOW_MUTED}>
              {insights.rejected} rejected
            </text>
          </g>
        )}
        {/* Bands run center to center behind the bars, so the flow has no seam at each stage. */}
        {bars.slice(0, -1).map((bar, i) => {
          const next = bars[i + 1];
          const mid = (bar.cx + next.cx) / 2;
          return (
            <path
              key={`band-${bar.key}`}
              d={`M${bar.cx},${bar.yTop} C${mid},${bar.yTop} ${mid},${next.yTop} ${next.cx},${next.yTop} L${next.cx},${next.yTop + next.h} C${mid},${next.yTop + next.h} ${mid},${bar.yTop + bar.h} ${bar.cx},${bar.yTop + bar.h} Z`}
              fill={`url(#flow-grad-${i})`}
              opacity={0.32}
            />
          );
        })}
        {bars.map((bar, i) => (
          <g key={`bar-${bar.key}`}>
            <rect x={bar.x} y={bar.yTop} width={barW} height={bar.h} rx={6} fill={bar.color} />
            <text x={bar.cx} y={bar.yTop - 10} textAnchor="middle" fontSize={15} fontWeight={700} fill={FLOW_TEXT}>
              {bar.reached}
            </text>
            <text x={bar.cx} y={H - 42} textAnchor="middle" fontSize={12} fontWeight={500} fill={FLOW_TEXT}>
              {bar.label}
            </text>
            {i > 0 && bar.conversion !== null && (
              <text x={bar.cx} y={H - 26} textAnchor="middle" fontSize={11} fill={bar.color}>
                {bar.conversion}%
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function ApplicationInsights({ applications }) {
  const [now] = useState(() => Date.now());
  const insights = useMemo(() => computeInsights(applications), [applications]);

  // Only applications that reached Applied have a sent date.
  const timeline = useMemo(
    () => computeTimeline(applications.filter((app) => app.appliedAt).map((app) => app.appliedAt), now),
    [applications, now]
  );
  const maxWeek = Math.max(1, ...timeline.map((bucket) => bucket.count));

  const sources = useMemo(() => {
    const counts = new Map();
    for (const app of applications) {
      const source = app.source?.trim();
      if (source) counts.set(source, (counts.get(source) || 0) + 1);
    }
    return [...counts].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
  }, [applications]);
  const maxSource = Math.max(1, ...sources.map((s) => s.count));

  if (insights.total === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No applications yet. Add a few to see your funnel and reply rates.
      </p>
    );
  }

  const tiles = [
    { label: "Total applications", value: insights.total, sub: "Not counting archived" },
    { label: "Applied", value: insights.applied, sub: "Past saved" },
    { label: "Response rate", value: `${insights.responseRate}%`, sub: "Reached screening" },
    { label: "Interviews", value: insights.interviews, sub: "Interview or beyond" },
    { label: "Offers", value: insights.offers, sub: insights.rejected > 0 ? `${insights.rejected} rejected` : "So far" },
  ];

  return (
    <div className="flex max-w-4xl flex-col gap-4 overflow-y-auto pb-6">
      <p className="text-xs text-muted-foreground">Pipeline health across all applications</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-[var(--landing-line)] p-4">
            <div className="text-xs text-muted-foreground">{tile.label}</div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{tile.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{tile.sub}</div>
          </div>
        ))}
      </div>

      <PipelineFlow insights={insights} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--landing-line)] p-5">
          <h3 className="text-sm font-semibold">Applications over time</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Applications sent per week, last 8 weeks</p>
          <div className="mt-4 flex items-end gap-2">
            {timeline.map((bucket) => (
              <div key={bucket.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-28 w-full flex-col justify-end">
                  <span className="mb-1 text-center text-[10px] text-muted-foreground tabular-nums">
                    {bucket.count || ""}
                  </span>
                  <div
                    className="w-full rounded-t bg-[var(--landing-accent)]/60"
                    style={{ height: `${bucket.count ? Math.max((bucket.count / maxWeek) * 100, 8) : 0}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">{bucket.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--landing-line)] p-5">
          <h3 className="text-sm font-semibold">Where applications come from</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Count by source</p>
          <div className="mt-4 flex flex-col gap-3">
            {sources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No source data yet.</p>
            ) : (
              sources.map((row) => (
                <div key={row.source} className="flex items-center gap-3 text-xs">
                  <span className="w-28 shrink-0 truncate font-medium">{row.source}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]">
                    <div
                      className="h-full rounded-full bg-foreground/70"
                      style={{ width: `${Math.max((row.count / maxSource) * 100, 3)}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{row.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
