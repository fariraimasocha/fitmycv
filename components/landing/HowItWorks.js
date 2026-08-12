"use client";

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import {
  ClipboardTextIcon,
  LinkIcon,
  SparkleIcon,
  DownloadSimpleIcon,
  FileTextIcon,
} from "@phosphor-icons/react";

function StepVisual({ step }) {
  if (step === 1) {
    return (
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
        <div className="border-b border-[var(--landing-line)] px-4 py-2.5 text-xs font-medium text-[var(--landing-ink-soft)]">
          Job listing
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--landing-line)] bg-white px-3 py-2.5">
            <LinkIcon size={15} className="shrink-0 text-[var(--landing-ink-soft)]" />
            <span className="truncate text-xs text-[var(--landing-ink-soft)]">
              linkedin.com/jobs/view/…
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--landing-primary)] px-2.5 py-1 text-[10px] font-semibold text-white">
              <ClipboardTextIcon size={10} />
              Paste
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["LinkedIn", "Indeed", "Glassdoor"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-[var(--landing-line)] bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--landing-ink-soft)]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
        <div className="border-b border-[var(--landing-line)] px-4 py-2.5 text-xs font-medium text-[var(--landing-ink-soft)]">
          CV preview
        </div>
        <div className="space-y-3 p-4">
          <div className="space-y-2 rounded-lg border border-[var(--landing-line)] bg-white p-3">
            <div className="h-2 w-3/4 rounded bg-[var(--landing-ink)]" />
            <div className="h-1.5 w-full rounded bg-[var(--landing-line)]" />
            <div className="h-1.5 w-5/6 rounded bg-[var(--landing-line)]" />
            <div className="h-1.5 w-full rounded bg-[var(--landing-paper-strong)]" />
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-[var(--landing-primary)] py-2.5 text-xs font-semibold text-white">
            <SparkleIcon size={14} />
            Tailor my CV
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
      <div className="border-b border-[var(--landing-line)] px-4 py-2.5 text-xs font-medium text-[var(--landing-ink-soft)]">
        Export
      </div>
      <div className="flex flex-col items-center gap-3 p-5">
        <FileTextIcon size={32} className="text-[var(--landing-ink)]" />
        <span className="text-xs font-semibold text-[var(--landing-ink)]">
          resume_tailored.pdf
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--landing-primary)] px-4 py-2 text-[10px] font-semibold text-white">
          <DownloadSimpleIcon size={12} />
          Download PDF
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  {
    num: "01",
    title: "Paste the job listing",
    copy: "Drop a link from LinkedIn, Indeed, or any careers page. We parse requirements, skills, and keywords instantly.",
  },
  {
    num: "02",
    title: "AI tailors your CV",
    copy: "We rewrite bullet points with impact, mirror the role's keywords, and keep your voice — ATS-ready in ~30 seconds.",
  },
  {
    num: "03",
    title: "Download & apply",
    copy: "Export a polished CV and matching cover letter as PDF. One dashboard tracks every application.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-section landing-muted-band">
      <div className="landing-container flex flex-col items-center gap-14">
        <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="landing-eyebrow px-3 py-1.5">How it works</span>
          <h2 className="landing-section-title text-3xl sm:text-4xl lg:text-5xl">
            One paste. No rewrites.{" "}
            <em className="text-[var(--landing-accent)]">No guesswork</em>.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--landing-ink-soft)]">
            Live in under a minute — from job link to a hire-ready application.
          </p>
        </div>

        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((step, index) => (
            <div
              key={step.num}
              className="flex flex-col rounded-2xl border border-[var(--landing-line)] bg-white p-6 sm:p-7"
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-[var(--landing-ink-soft)]">
                {step.num}
              </span>
              <h3 className="mt-3 font-serif-display text-xl text-[var(--landing-ink)] sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
                {step.copy}
              </p>
              <StepVisual step={index + 1} />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <p className="landing-meta-line">
            [ Average time: 47 seconds from paste to polished CV ]
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/auth" className="landing-primary-btn text-sm">
              Get FitMyCV
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link href="#features" className="landing-secondary-btn text-sm">
              <Play size={15} aria-hidden="true" />
              See features
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
