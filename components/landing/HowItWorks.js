"use client";

import {
  CheckCircleIcon,
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

function StepNumber({ number, label }) {
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="flex items-center justify-center bg-[var(--landing-primary-dark)] w-14 h-14 rounded-2xl shrink-0 shadow-[0_12px_22px_oklch(0.31_0.09_178_/_0.2)]">
        <span className="font-outfit font-extrabold text-xl text-[oklch(0.99_0.006_84)]">
          {number}
        </span>
      </div>
      <span className="rounded-full bg-[var(--landing-primary-soft)] px-4 py-2 font-sans text-xs font-extrabold tracking-[0.16em] text-[var(--landing-primary-dark)] shadow-[inset_0_0_0_1px_oklch(0.47_0.125_177_/_0.14)]">
        {label}
      </span>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex flex-row items-center gap-2.5">
      <CheckCircleIcon
        size={18}
        className="text-[var(--landing-primary-dark)] shrink-0"
        aria-hidden="true"
      />
      <span className="font-sans font-semibold text-[var(--landing-ink-soft)] text-sm">
        {text}
      </span>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex h-16 w-full items-center justify-center" aria-hidden="true">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.47_0.125_177_/_0.28)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.47_0.125_177_/_0.45)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.47_0.125_177_/_0.28)]" />
      </div>
    </div>
  );
}

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
        <h2 className="landing-heading font-outfit font-extrabold text-center text-3xl sm:text-4xl">
          How It Works
        </h2>
        <p className="landing-copy font-sans text-center text-base">
          From job listing to tailored application in under a minute.
        </p>
      </div>

      {/* Steps */}
      <div className="landing-container flex flex-col w-full">
        {/* Step 1 — content left, visual right */}
        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-0">
          {/* Content */}
          <div className="flex-1 flex flex-col gap-5 lg:py-10 lg:pr-12">
            <StepNumber number="01" label="PASTE" />
            <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-2xl">
              Paste the Job Listing
            </h3>
            <p className="landing-copy font-sans text-base">
              Copy any job description from LinkedIn, Indeed, or anywhere else
              and paste it in. Our system instantly parses the requirements,
              skills, and keywords.
            </p>
            <div className="flex flex-col gap-3">
              <FeatureItem text="Works with LinkedIn, Indeed, Glassdoor & more" />
              <FeatureItem text="Paste URL or copy-paste the full description" />
              <FeatureItem text="Auto-detects key requirements & skills" />
            </div>
          </div>

          {/* Visual */}
          <div className="landing-card flex-1 flex flex-col justify-center rounded-2xl gap-4 min-h-[280px] p-8">
            <span className="font-sans font-bold text-xs text-[var(--landing-ink-soft)]">
              Job listing URL
            </span>
            {/* Input row */}
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
            {/* Source chips */}
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

        <Connector />

        {/* Step 2 — visual left, content right */}
        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-0">
          {/* Visual — shown second on mobile, first on lg */}
          <div className="landing-card flex-1 flex flex-col justify-center order-2 lg:order-1 rounded-2xl gap-4 min-h-[280px] p-8">
            {/* Mock CV preview */}
            <div className="flex flex-col gap-2 bg-[var(--landing-paper-strong)] rounded-xl p-4 border border-[var(--landing-line)] shadow-sm">
              <div className="bg-[var(--landing-primary-dark)] rounded h-2 w-full" />
              <div className="bg-[var(--landing-line)] rounded h-1.5 w-full" />
              <div className="bg-[var(--landing-line)] rounded h-1.5 w-[70%]" />
              <div className="bg-[oklch(0.885_0.025_83_/_0.6)] rounded h-1.5 w-full" />
              <div className="bg-[oklch(0.885_0.025_83_/_0.6)] rounded h-1.5 w-[55%]" />
            </div>
            {/* Tailor button */}
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

          {/* Content — shown first on mobile, second on lg */}
          <div className="flex-1 flex flex-col gap-5 order-1 lg:order-2 lg:py-10 lg:pl-12">
            <StepNumber number="02" label="TAILOR" />
            <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-2xl">
              AI Tailors Your CV
            </h3>
            <p className="landing-copy font-sans text-base">
              Our AI restructures your resume, rewrites bullet points, and
              optimizes for ATS keywords. Every detail is aligned to make you
              the perfect candidate.
            </p>
            <div className="flex flex-col gap-3">
              <FeatureItem text="Rewrites bullet points with impact verbs" />
              <FeatureItem text="Optimizes keywords to pass ATS filters" />
              <FeatureItem text="Restructures layout for maximum readability" />
            </div>
          </div>
        </div>

        <Connector />

        {/* Step 3 — content left, visual right */}
        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-0">
          {/* Content */}
          <div className="flex-1 flex flex-col gap-5 lg:py-10 lg:pr-12">
            <StepNumber number="03" label="APPLY" />
            <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-2xl">
              Download &amp; Apply
            </h3>
            <p className="landing-copy font-sans text-base">
              Get your polished CV and a custom cover letter. Export as PDF and
              apply with confidence. Stand out from the crowd.
            </p>
            <div className="flex flex-col gap-3">
              <FeatureItem text="One-click PDF export, beautifully formatted" />
              <FeatureItem text="Includes matching cover letter automatically" />
              <FeatureItem text="Apply confidently with a tailored application" />
            </div>
          </div>

          {/* Visual */}
          <div className="landing-card flex-1 flex flex-col items-center justify-center rounded-2xl gap-4 min-h-[280px] p-8">
            {/* Export Mock */}
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
            {/* Export buttons (decorative) */}
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
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col items-center gap-5 pt-12">
        <div className="inline-flex flex-row items-center gap-2.5 bg-[var(--landing-paper-soft)] border border-[var(--landing-line)] rounded-2xl px-6 py-3 shadow-sm">
          <TimerIcon size={20} className="text-[var(--landing-primary-dark)]" aria-hidden="true" />
          <span className="font-sans font-bold text-sm text-[var(--landing-ink)]">
            Average time: 47 seconds from paste to polished CV
          </span>
        </div>
        <Link
          href="/auth"
          className="landing-primary-btn font-sans text-base"
        >
          Try It Free Now
          <ArrowRightIcon size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
