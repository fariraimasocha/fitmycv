"use client";

import { useState } from "react";
import Link from "next/link";

import { HOME_STEPS as STEPS } from "@/content/pages/home";
import {
  ArrowUpRightIcon,
  ClipboardTextIcon,
  LinkIcon,
  SparkleIcon,
  DownloadSimpleIcon,
  FileTextIcon,
} from "@phosphor-icons/react";

/**
 * The panel that sits beside the step list. One per step, showing the part of
 * the product that step is about. These are built from the same tokens as the
 * real UI rather than being screenshots, so they never drift out of date.
 */
function StepVisual({ step }) {
  if (step === 1) {
    return (
      <div className="overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
        <div className="border-b border-[var(--landing-line)] px-4 py-3 text-xs font-medium text-[var(--landing-ink-soft)]">
          Job listing
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--landing-line)] bg-white px-3 py-3">
            <LinkIcon size={16} className="shrink-0 text-[var(--landing-ink-soft)]" />
            <span className="truncate text-sm text-[var(--landing-ink-soft)]">
              linkedin.com/jobs/view/…
            </span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--landing-primary)] px-3 py-1.5 text-xs font-semibold text-white">
              <ClipboardTextIcon size={11} />
              Paste
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["LinkedIn", "Indeed", "Glassdoor", "Greenhouse", "Lever"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-[var(--landing-line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--landing-ink-soft)]"
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
      <div className="overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
        <div className="border-b border-[var(--landing-line)] px-4 py-3 text-xs font-medium text-[var(--landing-ink-soft)]">
          CV preview
        </div>
        <div className="space-y-4 p-5">
          <div className="space-y-2.5 rounded-lg border border-[var(--landing-line)] bg-white p-4">
            <div className="h-2.5 w-3/4 rounded bg-[var(--landing-ink)]" />
            <div className="h-2 w-full rounded bg-[var(--landing-line)]" />
            <div className="h-2 w-5/6 rounded bg-[var(--landing-line)]" />
            {/* The rewritten line, marked the way the editor marks a change */}
            <div className="h-2 w-4/6 rounded bg-[var(--landing-accent-line)]" />
            <div className="h-2 w-full rounded bg-[var(--landing-paper-strong)]" />
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-[var(--landing-primary)] py-3 text-sm font-semibold text-white">
            <SparkleIcon size={15} />
            Tailor my CV
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
      <div className="border-b border-[var(--landing-line)] px-4 py-3 text-xs font-medium text-[var(--landing-ink-soft)]">
        Export
      </div>
      <div className="flex flex-col items-center gap-3 p-8">
        <FileTextIcon size={40} className="text-[var(--landing-ink)]" />
        <span className="text-sm font-semibold text-[var(--landing-ink)]">
          resume_tailored.pdf
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--landing-primary)] px-5 py-2.5 text-sm font-semibold text-white">
          <DownloadSimpleIcon size={13} />
          Download PDF
        </span>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="landing-dark-band landing-section">
      <div className="landing-container">
        <span className="landing-dark-eyebrow">FitMyCV in action</span>

        <h2
          className="font-outfit mt-6 max-w-2xl font-medium text-white"
          style={{
            fontSize: "clamp(2rem, 3.6vw, 3.4rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          One paste. No rewrites. No guesswork.
        </h2>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* The step list. Opening one swaps the panel beside it. */}
          <ul className="lg:col-span-5">
            {STEPS.map((step, index) => {
              const open = active === index;
              return (
                <li key={step.num} data-open={open} className="landing-dark-step">
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-expanded={open}
                    className="flex w-full cursor-pointer items-baseline gap-4 py-6 text-left"
                  >
                    <span className="font-outfit text-sm font-semibold text-[var(--landing-ink-inverse-soft)]">
                      {step.num}
                    </span>
                    <span className="font-outfit text-2xl font-medium text-white sm:text-3xl">
                      {step.title}
                    </span>
                  </button>

                  <div data-open={open} className="landing-dark-collapse">
                    <div>
                      <p className="max-w-md pb-6 text-base leading-relaxed text-[var(--landing-ink-inverse-soft)]">
                        {step.copy}
                      </p>

                      {/* The panel rides inside the open row on narrow screens,
                          where there is no second column to put it in. */}
                      <div className="pb-8 lg:hidden">
                        <StepVisual step={index + 1} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:col-span-7 lg:block">
            <div className="rounded-2xl border border-[oklch(1_0_0_/_0.12)] bg-white p-4 shadow-[0_30px_60px_oklch(0_0_0_/_0.35)]">
              <StepVisual step={active + 1} />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/auth"
            className="landing-dark-pill font-outfit"
          >
            Tailor my CV
            <ArrowUpRightIcon size={16} aria-hidden="true" />
          </Link>
          <p className="text-sm text-[var(--landing-ink-inverse-soft)]">
            Free to build and tailor. The PDF download is the paid part.
          </p>
        </div>
      </div>
    </section>
  );
}
