"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { DashboardPanel, DashboardPanelHeader } from "@/components/dashboard";
import { computeInsights, computeTimeline } from "@/lib/applications";

// Ported from Reactive Resume's insights-view.tsx: a pipeline flow snapshot
// you can export as a PNG, weekly velocity and sources. Plain SVG and CSS
// bars, no chart library. The headline numbers live in the stat strip on the
// page, so this view does not repeat them.

// The flow chart draws with literal colors so the exported PNG matches the
// screen. FitMyCV's ink and accent ramp stand in for Reactive Resume's palette.
const FLOW_BG = "#1a1a1a";
const FLOW_COLORS = ["#d6cfc4", "#e0b9a8", "#d98b6e", "#c05a3f", "#7cc49a"];
const FLOW_REJECTED = "#e8836f";
const FLOW_TEXT = "#faf8f5";
const FLOW_MUTED = "#a39e94";

function PipelineFlow({ insights, delay }) {
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
    <DashboardPanel delay={delay}>
      <DashboardPanelHeader
        title="Where your applications went"
        description="How many reached each stage"
        action={
          <button
            type="button"
            onClick={exportPng}
            className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
          >
            <DownloadSimpleIcon size={16} aria-hidden="true" />
            Export PNG
          </button>
        }
      />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full rounded-md"
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
        <rect x={0} y={0} width={W} height={H} rx={8} fill={FLOW_BG} />
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
    </DashboardPanel>
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
      <DashboardPanel>
        <p className="py-10 text-center text-sm text-muted-foreground">
          Your funnel and reply rates appear here once you add applications.
        </p>
      </DashboardPanel>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PipelineFlow insights={insights} delay={0.05} />

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <DashboardPanel delay={0.1}>
          <DashboardPanelHeader
            title="Applications over time"
            description="Sent per week, last 8 weeks"
          />
          <div className="mt-4 flex items-end gap-2">
            {timeline.map((bucket) => (
              <div key={bucket.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-28 w-full flex-col justify-end">
                  <span className="mb-1 text-center text-[10px] tabular-nums text-muted-foreground">
                    {bucket.count || ""}
                  </span>
                  <div
                    className="w-full rounded-t-sm bg-[var(--landing-accent)]/60"
                    style={{ height: `${bucket.count ? Math.max((bucket.count / maxWeek) * 100, 8) : 0}%` }}
                  />
                </div>
                <span className="text-[10px] tabular-nums text-muted-foreground">{bucket.label}</span>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel delay={0.15}>
          <DashboardPanelHeader title="Where applications come from" description="Count by source" />
          <div className="mt-4 flex flex-col gap-3">
            {sources.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add a source to an application to see it counted here.
              </p>
            ) : (
              sources.map((row) => (
                <div key={row.source} className="flex items-center gap-3 text-xs">
                  <span className="w-28 shrink-0 truncate font-medium text-foreground">{row.source}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--landing-paper-strong)]">
                    <div
                      className="h-full rounded-full bg-foreground/70"
                      style={{ width: `${Math.max((row.count / maxSource) * 100, 3)}%` }}
                    />
                  </div>
                  <span className="w-6 text-right tabular-nums text-muted-foreground">{row.count}</span>
                </div>
              ))
            )}
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
}
