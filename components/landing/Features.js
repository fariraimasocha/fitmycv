"use client";

import { useState } from "react";
import {
  FileMagnifyingGlassIcon,
  PencilLineIcon,
  GaugeIcon,
  DownloadSimpleIcon,
  PaletteIcon,
  CheckIcon,
  FileTextIcon,
  FilePlusIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

/* ---------- shared bits ---------- */

function FeaturePill({ icon: Icon, label }) {
  return (
    <span className="landing-eyebrow">
      <Icon size={14} weight="bold" aria-hidden="true" />
      {label}
    </span>
  );
}

function Bar({ label, pct }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-20 shrink-0 font-sans text-[11px] font-semibold text-[var(--landing-ink-soft)]">
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--landing-line)]">
        <div
          className="h-full rounded-full bg-[var(--landing-primary-dark)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right font-sans text-[11px] font-extrabold text-[var(--landing-primary-dark)]">
        {pct}%
      </span>
    </div>
  );
}

function Donut({ value }) {
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="var(--landing-line)"
          strokeWidth="3.2"
        />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="var(--landing-primary)"
          strokeWidth="3.2"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${value} 100`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
          {value}%
        </span>
        <span className="-mt-0.5 font-sans text-[9px] font-semibold uppercase tracking-wide text-[var(--landing-ink-soft)]">
          match
        </span>
      </div>
    </div>
  );
}

/* ---------- mini visuals ---------- */

function ScoreVisual() {
  return (
    <div className="flex items-center gap-5 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-strong)] p-4">
      <Donut value={92} />
      <div className="flex flex-1 flex-col gap-2.5">
        <Bar label="Skills" pct={95} />
        <Bar label="Experience" pct={88} />
        <Bar label="Keywords" pct={92} />
      </div>
    </div>
  );
}

function KeywordVisual() {
  const keywords = [
    { label: "React", ok: true },
    { label: "TypeScript", ok: true },
    { label: "AWS", ok: true },
    { label: "CI/CD", ok: true },
    { label: "GraphQL", ok: false },
    { label: "Docker", ok: true },
  ];
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-strong)] p-4">
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-bold text-[var(--landing-ink-soft)]">
          Keywords matched
        </span>
        <span className="font-sans text-xs font-extrabold text-[var(--landing-primary-dark)]">
          18 / 20
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map(({ label, ok }) => (
          <span
            key={label}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-xs font-semibold ${
              ok
                ? "bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]"
                : "border border-dashed border-[var(--landing-line)] text-[var(--landing-ink-soft)]"
            }`}
          >
            {ok ? (
              <CheckIcon size={11} weight="bold" aria-hidden="true" />
            ) : (
              <SparkleIcon size={11} weight="fill" aria-hidden="true" />
            )}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CoverLetterVisual() {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-strong)] p-4">
      <div className="flex items-center gap-2">
        <PencilLineIcon
          size={14}
          className="text-[var(--landing-primary-dark)]"
          aria-hidden="true"
        />
        <span className="font-sans text-xs font-bold text-[var(--landing-ink-soft)]">
          cover_letter.pdf
        </span>
      </div>
      <div className="h-2 w-2/5 rounded bg-[var(--landing-primary-dark)]" />
      <div className="h-1.5 w-full rounded bg-[var(--landing-line)]" />
      <div className="h-1.5 w-full rounded bg-[var(--landing-line)]" />
      <div className="h-1.5 w-3/4 rounded bg-[var(--landing-line)]" />
      <div className="h-1.5 w-[88%] rounded bg-[oklch(0.885_0.025_83_/_0.6)]" />
      <div className="mt-1 h-2 w-1/4 rounded bg-[var(--landing-primary-soft)]" />
    </div>
  );
}

function ExportVisual() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-strong)] p-4">
      <div className="flex w-full items-center gap-3 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-3">
        <FileTextIcon
          size={26}
          className="text-[var(--landing-primary-dark)] shrink-0"
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col">
          <span className="font-sans text-sm font-bold text-[var(--landing-ink)]">
            resume_tailored.pdf
          </span>
          <span className="font-sans text-xs text-[var(--landing-ink-soft)]">
            Ready to download
          </span>
        </div>
      </div>
      <div className="flex w-full gap-2.5">
        <div className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--landing-primary-dark)] px-4 py-2">
          <DownloadSimpleIcon
            size={13}
            className="text-[oklch(0.99_0.006_84)]"
            aria-hidden="true"
          />
          <span className="font-sans text-xs font-bold text-[oklch(0.99_0.006_84)]">
            PDF
          </span>
        </div>
        <div className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-4 py-2">
          <FilePlusIcon
            size={13}
            className="text-[var(--landing-ink-soft)]"
            aria-hidden="true"
          />
          <span className="font-sans text-xs font-bold text-[var(--landing-ink-soft)]">
            Cover letter
          </span>
        </div>
      </div>
    </div>
  );
}

function ThemeThumb({ accent }) {
  return (
    <div className="flex aspect-[3/4] flex-col gap-1.5 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-2.5 shadow-sm">
      <div className={`h-2 w-2/3 rounded ${accent}`} />
      <div className="h-1 w-full rounded bg-[var(--landing-line)]" />
      <div className="h-1 w-full rounded bg-[var(--landing-line)]" />
      <div className="h-1 w-4/5 rounded bg-[var(--landing-line)]" />
      <div className="mt-auto h-1 w-1/2 rounded bg-[var(--landing-primary-soft)]" />
    </div>
  );
}

const themes = ["Minimal", "Executive", "Creative", "Tech", "Classic", "Bold"];

function ThemesVisual() {
  const [activeTheme, setActiveTheme] = useState("Minimal");
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2.5">
        <ThemeThumb accent="bg-[var(--landing-primary-dark)]" />
        <ThemeThumb accent="bg-[var(--landing-accent)]" />
        <ThemeThumb accent="bg-[var(--landing-coral)]" />
        <ThemeThumb accent="bg-[var(--landing-success)]" />
      </div>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => setActiveTheme(theme)}
            className={`cursor-pointer rounded-full border px-4 py-2 font-sans text-sm font-medium transition active:scale-[0.96] ${
              activeTheme === theme
                ? "border-[var(--landing-primary-dark)] bg-[var(--landing-primary-dark)] text-[oklch(0.99_0.006_84)] shadow-[0_8px_16px_oklch(0.31_0.09_178_/_0.16)]"
                : "border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)] hover:border-[oklch(0.47_0.125_177_/_0.35)] hover:text-[var(--landing-ink)]"
            }`}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- card shell ---------- */

function FeatureCard({ pill, icon, title, copy, children, className = "" }) {
  return (
    <div
      className={`landing-card flex flex-col gap-3.5 overflow-hidden rounded-2xl p-5 ${className}`}
    >
      <FeaturePill icon={icon} label={pill} />
      <div className="flex flex-col gap-1.5">
        <h3 className="font-outfit text-lg font-extrabold leading-snug text-[var(--landing-ink)]">
          {title}
        </h3>
        <p className="font-sans text-sm leading-relaxed text-[var(--landing-ink-soft)]">
          {copy}
        </p>
      </div>
      <div className="mt-auto pt-1">{children}</div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="landing-section flex flex-col items-center gap-12"
    >
      {/* Header */}
      <div className="landing-container flex flex-col items-center gap-4">
        <span className="landing-eyebrow">Application advantage</span>
        <h2 className="landing-section-title text-center text-3xl sm:text-4xl">
          Everything you need to
          <br />
          <span className="landing-accent-tail">stand out</span>
        </h2>
        <p className="landing-copy font-sans text-center text-base">
          Powerful features designed to give you an unfair advantage in the job
          market.
        </p>
      </div>

      {/* Bento grid */}
      <div className="landing-container grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          pill="Match insights"
          icon={GaugeIcon}
          title="Know your odds before you hit apply"
          copy="See exactly how well your CV fits: score, gaps, and what to fix, at a glance."
          className="sm:col-span-2"
        >
          <ScoreVisual />
        </FeatureCard>

        <FeatureCard
          pill="Beat the ATS"
          icon={FileMagnifyingGlassIcon}
          title="Get past the résumé robots, every time"
          copy="We pull keywords straight from the job post and weave them into your CV naturally."
        >
          <KeywordVisual />
        </FeatureCard>

        <FeatureCard
          pill="Cover letters"
          icon={PencilLineIcon}
          title="A tailored cover letter in seconds"
          copy="Role-specific, on-brand, and ready to send. No more staring at a blank page."
        >
          <CoverLetterVisual />
        </FeatureCard>

        <FeatureCard
          pill="Instant export"
          icon={DownloadSimpleIcon}
          title="Export recruiter-ready PDFs"
          copy="Beautifully formatted CV and cover letter, one click away from the send button."
        >
          <ExportVisual />
        </FeatureCard>

        <FeatureCard
          pill="16 themes"
          icon={PaletteIcon}
          title="A look for every industry and vibe"
          copy="Pick from 16 professionally designed CV themes that fit your field and personality."
        >
          <ThemesVisual />
        </FeatureCard>
      </div>
    </section>
  );
}
