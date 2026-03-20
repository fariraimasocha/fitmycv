"use client";

import {
  CheckCircleIcon,
  ClipboardTextIcon,
  CaretDownIcon,
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
    <div className="flex flex-row items-center gap-4">
      <div className="flex items-center justify-center bg-foreground w-14 h-14 rounded-2xl shrink-0">
        <span className="font-outfit font-bold text-xl text-background">
          {number}
        </span>
      </div>
      <div className="bg-foreground h-0.5 w-10 rounded-sm" />
      <span className="font-sans font-semibold text-xs text-foreground tracking-[2px]">
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
        className="text-foreground shrink-0"
        aria-hidden="true"
      />
      <span className="font-sans font-medium text-muted-foreground text-sm">
        {text}
      </span>
    </div>
  );
}

function Connector() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-16">
      <div className="bg-border w-0.5 h-8" />
      <CaretDownIcon
        size={20}
        className="text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-muted flex flex-col px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24 gap-16"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex flex-row items-center gap-2 bg-background border border-border rounded-full px-4 py-1.5">
          <div className="bg-foreground w-2 h-2 rounded-full shrink-0" />
          <span className="font-sans font-medium text-[13px] text-foreground">
            Simple 3-Step Process
          </span>
        </div>
        <h2 className="font-outfit font-bold text-foreground text-center text-[32px] sm:text-[40px] tracking-tight">
          How It Works
        </h2>
        <p className="font-sans text-muted-foreground text-center text-[17px]">
          From job listing to tailored application in under a minute.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col w-full">
        {/* Step 1 — content left, visual right */}
        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-0">
          {/* Content */}
          <div className="flex-1 flex flex-col gap-5 lg:py-10 lg:pr-12">
            <StepNumber number="01" label="PASTE" />
            <h3 className="font-outfit font-bold text-foreground text-[28px] tracking-tight">
              Paste the Job Listing
            </h3>
            <p className="font-sans text-muted-foreground text-base leading-[1.7]">
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
          <div className="flex-1 flex flex-col justify-center bg-background rounded-4xl gap-4 min-h-70 p-8 border border-border">
            <span className="font-sans font-medium text-xs text-muted-foreground">
              Job listing URL
            </span>
            {/* Input row */}
            <div className="flex flex-row items-center gap-2.5 bg-muted border border-border rounded-[10px] px-3.5 py-3">
              <LinkIcon
                size={16}
                className="text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <input
                readOnly
                tabIndex={-1}
                aria-hidden="true"
                value=""
                placeholder="https://linkedin.com/jobs/view/..."
                className="flex-1 bg-transparent border-none outline-none font-sans text-[13px] text-foreground placeholder:text-muted-foreground min-w-0"
              />
              <div className="inline-flex flex-row items-center gap-1.5 bg-foreground rounded-full px-2.5 py-1 shrink-0">
                <ClipboardTextIcon
                  size={12}
                  className="text-background"
                  aria-hidden="true"
                />
                <span className="font-sans font-semibold text-[11px] text-background">
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
                  className="inline-flex flex-row items-center gap-1.5 bg-muted border border-border rounded-full px-3 py-1"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`}
                    aria-hidden="true"
                  />
                  <span className="font-sans font-medium text-[11px] text-muted-foreground">
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
          <div className="flex-1 flex flex-col justify-center order-2 lg:order-1 bg-background rounded-[20px] gap-4 min-h-[280px] p-8 border border-border">
            {/* Mock CV preview */}
            <div className="flex flex-col gap-2 bg-muted rounded-xl p-4 border border-border shadow-sm">
              <div className="bg-foreground rounded h-2 w-full" />
              <div className="bg-border rounded h-1.5 w-full" />
              <div className="bg-border rounded h-1.5 w-[70%]" />
              <div className="bg-border/60 rounded h-1.5 w-full" />
              <div className="bg-border/60 rounded h-1.5 w-[55%]" />
            </div>
            {/* Tailor button */}
            <div
              className="flex flex-row items-center justify-center gap-2 bg-foreground rounded-xl h-11 w-full"
              aria-hidden="true"
            >
              <SparkleIcon size={15} className="text-background" />
              <span className="font-sans font-semibold text-sm text-background">
                Tailor My CV
              </span>
            </div>
            <span className="font-sans text-xs text-muted-foreground text-center">
              Generates in ~30 seconds
            </span>
          </div>

          {/* Content — shown first on mobile, second on lg */}
          <div className="flex-1 flex flex-col gap-5 order-1 lg:order-2 lg:py-10 lg:pl-12">
            <StepNumber number="02" label="TAILOR" />
            <h3 className="font-outfit font-bold text-foreground text-[28px] tracking-tight">
              AI Tailors Your CV
            </h3>
            <p className="font-sans text-muted-foreground text-base leading-[1.7]">
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
            <h3 className="font-outfit font-bold text-foreground text-[28px] tracking-tight">
              Download &amp; Apply
            </h3>
            <p className="font-sans text-muted-foreground text-base leading-[1.7]">
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
          <div className="flex-1 flex flex-col items-center justify-center bg-background rounded-[20px] gap-4 min-h-[280px] p-8 border border-border">
            {/* Export Mock */}
            <div
              className="flex flex-col items-center justify-center bg-muted rounded-2xl gap-3 p-5 border border-border shadow-sm w-[220px] h-[140px]"
              aria-hidden="true"
            >
              <FileTextIcon size={36} className="text-foreground" />
              <span className="font-sans font-medium text-[13px] text-foreground">
                resume_tailored.pdf
              </span>
              <span className="font-sans text-[11px] text-muted-foreground">
                Ready to download
              </span>
            </div>
            {/* Export buttons (decorative) */}
            <div
              className="flex flex-row flex-wrap justify-center gap-2.5"
              aria-hidden="true"
            >
              <div className="inline-flex flex-row items-center gap-2 bg-foreground rounded-full px-5 py-2.5">
                <DownloadSimpleIcon size={14} className="text-background" />
                <span className="font-sans font-semibold text-xs text-background">
                  Download PDF
                </span>
              </div>
              <div className="inline-flex flex-row items-center gap-2 bg-background border border-border rounded-full px-5 py-2.5">
                <FilePlusIcon size={14} className="text-muted-foreground" />
                <span className="font-sans font-semibold text-xs text-muted-foreground">
                  Cover Letter
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col items-center gap-5 pt-12">
        <div className="inline-flex flex-row items-center gap-2.5 bg-background border border-border rounded-2xl px-6 py-3 shadow-sm">
          <TimerIcon size={20} className="text-foreground" aria-hidden="true" />
          <span className="font-sans font-semibold text-sm text-foreground">
            Average time: 47 seconds from paste to polished CV
          </span>
        </div>
        <Link
          href="/auth"
          className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-base bg-foreground text-background rounded-xl px-8 py-4 shadow-md transition hover:opacity-90 active:scale-[0.96]"
        >
          Try It Free Now
          <ArrowRightIcon size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
