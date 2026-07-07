"use client";

import {
  CheckIcon,
  ClipboardTextIcon,
  TimerIcon,
  ArrowRightIcon,
  SparkleIcon,
  DownloadSimpleIcon,
  FilePlusIcon,
  FileTextIcon,
  LinkIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

function FeatureChip({ text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-1.5 font-sans text-xs font-semibold text-[var(--landing-ink-soft)]">
      <CheckIcon
        size={12}
        weight="bold"
        className="text-[var(--landing-primary)]"
        aria-hidden="true"
      />
      {text}
    </span>
  );
}

function VisualHeader({ label }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--landing-line)] bg-[var(--landing-paper-strong)] px-4 py-2.5">
      <span className="h-2 w-2 rounded-full bg-[var(--landing-coral)]" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-[var(--landing-accent)]" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-[var(--landing-success)]" aria-hidden="true" />
      <span className="ml-2 font-sans text-xs font-semibold text-[var(--landing-ink-soft)]">
        {label}
      </span>
    </div>
  );
}

function Step1Visual() {
  return (
    <div className="landing-card flex flex-col overflow-hidden rounded-2xl min-h-[260px]">
      <VisualHeader label="Job listing" />
      <div className="flex flex-1 flex-col justify-center gap-4 p-7">
      <div className="flex flex-row items-center gap-2.5 bg-[var(--landing-paper-strong)] border border-[var(--landing-line)] rounded-[10px] px-3.5 py-3 shadow-[inset_0_1px_2px_oklch(0.205_0.035_244_/_0.05)]">
        <LinkIcon
          size={16}
          className="text-[var(--landing-ink-soft)] shrink-0"
          aria-hidden="true"
        />
        <input
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          value=""
          placeholder="https://linkedin.com/jobs/view/..."
          className="flex-1 bg-transparent border-none outline-none font-sans text-sm text-[var(--landing-ink)] placeholder:text-[var(--landing-ink-soft)] min-w-0"
        />
        <div className="inline-flex flex-row items-center gap-1.5 bg-[var(--landing-primary-dark)] rounded-full px-2.5 py-1 shrink-0">
          <ClipboardTextIcon
            size={12}
            className="text-[oklch(0.99_0.006_84)]"
            aria-hidden="true"
          />
          <span className="font-sans font-bold text-xs text-[oklch(0.99_0.006_84)]">
            Paste
          </span>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        {[
          { label: "LinkedIn", dot: "bg-blue-600" },
          { label: "Indeed", dot: "bg-blue-500" },
          { label: "Glassdoor", dot: "bg-green-500" },
        ].map(({ label, dot }) => (
          <div
            key={label}
            className="inline-flex flex-row items-center gap-1.5 bg-[var(--landing-paper-strong)] border border-[var(--landing-line)] rounded-full px-3 py-1"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}
              aria-hidden="true"
            />
            <span className="font-sans font-semibold text-xs text-[var(--landing-ink-soft)]">
              {label}
            </span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

function Step2Visual() {
  return (
    <div className="landing-card flex flex-col overflow-hidden rounded-2xl min-h-[260px]">
      <VisualHeader label="CV preview" />
      <div className="flex flex-1 flex-col justify-center gap-4 p-7">
      <div className="flex flex-col gap-2 bg-[var(--landing-paper-strong)] rounded-xl p-4 border border-[var(--landing-line)] shadow-sm">
        <div className="bg-[var(--landing-primary-dark)] rounded h-2 w-full" />
        <div className="bg-[var(--landing-line)] rounded h-1.5 w-full" />
        <div className="bg-[var(--landing-line)] rounded h-1.5 w-[70%]" />
        <div className="bg-[oklch(0.885_0.025_83_/_0.6)] rounded h-1.5 w-full" />
        <div className="bg-[oklch(0.885_0.025_83_/_0.6)] rounded h-1.5 w-[55%]" />
      </div>
      <div
        className="flex flex-row items-center justify-center gap-2 bg-[var(--landing-primary-dark)] rounded-xl h-11 w-full shadow-[0_10px_20px_oklch(0.31_0.09_178_/_0.16)]"
        aria-hidden="true"
      >
        <SparkleIcon size={15} className="text-[oklch(0.99_0.006_84)]" />
        <span className="font-sans font-bold text-sm text-[oklch(0.99_0.006_84)]">
          Tailor My CV
        </span>
      </div>
      <span className="font-sans text-xs font-semibold text-[var(--landing-ink-soft)] text-center">
        Generates in ~30 seconds
      </span>
      </div>
    </div>
  );
}

function Step3Visual() {
  return (
    <div className="landing-card flex flex-col overflow-hidden rounded-2xl min-h-[260px]">
      <VisualHeader label="Export" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-7">
      <div
        className="flex flex-col items-center justify-center bg-[var(--landing-paper-strong)] rounded-2xl gap-3 p-5 border border-[var(--landing-line)] shadow-sm w-[220px] h-[140px]"
        aria-hidden="true"
      >
        <FileTextIcon size={36} className="text-[var(--landing-primary-dark)]" />
        <span className="font-sans font-bold text-sm text-[var(--landing-ink)]">
          resume_tailored.pdf
        </span>
        <span className="font-sans text-xs text-[var(--landing-ink-soft)]">
          Ready to download
        </span>
      </div>
      <div
        className="flex flex-row flex-wrap justify-center gap-2.5"
        aria-hidden="true"
      >
        <div className="inline-flex flex-row items-center gap-2 bg-[var(--landing-primary-dark)] rounded-full px-5 py-2.5">
          <DownloadSimpleIcon size={14} className="text-[oklch(0.99_0.006_84)]" />
          <span className="font-sans font-bold text-xs text-[oklch(0.99_0.006_84)]">
            Download PDF
          </span>
        </div>
        <div className="inline-flex flex-row items-center gap-2 bg-[var(--landing-paper-soft)] border border-[var(--landing-line)] rounded-full px-5 py-2.5">
          <FilePlusIcon size={14} className="text-[var(--landing-ink-soft)]" />
          <span className="font-sans font-bold text-xs text-[var(--landing-ink-soft)]">
            Cover Letter
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}

const steps = [
  {
    n: "1",
    title: "Paste the job listing",
    copy: "Drop in a job link from LinkedIn, Indeed, or anywhere else. We instantly parse the requirements, skills, and keywords.",
    chips: ["LinkedIn & Indeed", "Any job board", "Auto-detect skills"],
    Visual: Step1Visual,
  },
  {
    n: "2",
    title: "AI tailors your CV",
    copy: "We restructure your CV, rewrite bullet points with impact, and optimize for ATS keywords — aligned to the role.",
    chips: ["Impact verbs", "ATS keywords", "Clean layout"],
    Visual: Step2Visual,
  },
  {
    n: "3",
    title: "Download & apply",
    copy: "Get a polished CV and a matching cover letter. Export as PDF and apply with confidence.",
    chips: ["1-click PDF", "Cover letter", "Ready to send"],
    Visual: Step3Visual,
  },
];

// glowing nodes sit on the serpentine path (positions match the SVG bezier midpoints)
const nodes = [
  { left: 65, top: 15.75 },
  { left: 35, top: 47.6 },
  { left: 65, top: 83 },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="landing-section landing-muted-band flex flex-col gap-16"
    >
      {/* Header */}
      <div className="landing-container flex flex-col items-center gap-4">
        <div className="landing-eyebrow">
          <div className="bg-[var(--landing-primary)] w-2 h-2 rounded-full shrink-0" />
          Simple 3-step process
        </div>
        <h2 className="landing-heading font-outfit font-extrabold text-center text-3xl sm:text-4xl lg:text-5xl">
          From job link to hire-ready{" "}
          <span className="landing-accent-tail">in minutes</span>
        </h2>
        <p className="landing-copy font-sans text-center text-base">
          Three steps. One dashboard. The full loop from job listing to a
          polished application.
        </p>
      </div>

      {/* Serpentine timeline */}
      <div className="landing-container relative">
        {/* flowing curve + glowing nodes (desktop only, decorative) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="hiwLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--landing-primary)" stopOpacity="0.1" />
                <stop offset="0.15" stopColor="var(--landing-primary)" stopOpacity="0.85" />
                <stop offset="0.85" stopColor="var(--landing-primary)" stopOpacity="0.85" />
                <stop offset="1" stopColor="var(--landing-primary)" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <path
              d="M50 0 C70 110 70 210 50 300 C30 390 30 560 50 660 C70 760 70 900 50 1000"
              stroke="url(#hiwLine)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {nodes.map((node, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.left}%`, top: `${node.top}%` }}
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[radial-gradient(circle,oklch(0.47_0.125_177_/_0.28),transparent_70%)]" />
              <span className="relative block h-3.5 w-3.5 rounded-full bg-[var(--landing-primary)] shadow-[0_0_0_5px_oklch(0.47_0.125_177_/_0.14),0_0_20px_oklch(0.47_0.125_177_/_0.6)]" />
            </span>
          ))}
        </div>

        {/* alternating step blocks */}
        {steps.map((step, i) => {
          const isRight = i % 2 === 1;
          return (
            <div
              key={step.n}
              className={`relative z-10 flex pb-16 last:pb-0 lg:pb-28 ${
                isRight ? "lg:justify-end" : "lg:justify-start"
              }`}
            >
              <div className="flex w-full flex-col gap-4 lg:w-[44%]">
                <span
                  aria-hidden="true"
                  className="font-outfit font-black leading-none text-[var(--landing-primary-soft)] text-[clamp(64px,7vw,120px)]"
                >
                  {step.n}
                </span>
                <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-2xl sm:text-3xl">
                  {step.title}
                </h3>
                <p className="landing-copy font-sans text-base">{step.copy}</p>
                <div className="mt-2">
                  <step.Visual />
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {step.chips.map((text) => (
                    <FeatureChip key={text} text={text} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col items-center gap-5 pt-4">
        <div className="inline-flex flex-row items-center gap-2.5 bg-[var(--landing-paper-soft)] border border-[var(--landing-line)] rounded-2xl px-6 py-3 shadow-sm">
          <TimerIcon
            size={20}
            className="text-[var(--landing-primary-dark)]"
            aria-hidden="true"
          />
          <span className="font-sans font-bold text-sm text-[var(--landing-ink)]">
            Average time: 47 seconds from paste to polished CV
          </span>
        </div>
        <Link href="/auth" className="landing-primary-btn font-sans text-base">
          Start Tailoring Today
          <ArrowRightIcon size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
