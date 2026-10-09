"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import AuthLink from "@/components/landing/AuthLink";
import RevealWords from "@/components/landing/RevealWords";

import { getHomeSteps } from "@/content/pages/home";
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
  const t = useTranslations("landing.howItWorks");

  if (step === 1) {
    return (
      <div className="overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
        <div className="border-b border-[var(--landing-line)] px-4 py-3 text-xs font-medium text-[var(--landing-ink-soft)]">
          {t("jobListing")}
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 py-3">
            <LinkIcon size={16} className="shrink-0 text-[var(--landing-ink-soft)]" />
            <span className="truncate text-sm text-[var(--landing-ink-soft)]">
              linkedin.com/jobs/view/…
            </span>
            <span className="ms-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--landing-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--landing-on-primary)]">
              <ClipboardTextIcon size={11} />
              {t("paste")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["LinkedIn", "Indeed", "Glassdoor", "Greenhouse", "Lever"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 py-1.5 text-xs font-medium text-[var(--landing-ink-soft)]"
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
          {t("cvPreview")}
        </div>
        <div className="space-y-4 p-5">
          <div className="space-y-2.5 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4">
            <div className="h-2.5 w-3/4 rounded bg-[var(--landing-ink)]" />
            <div className="h-2 w-full rounded bg-[var(--landing-line)]" />
            <div className="h-2 w-5/6 rounded bg-[var(--landing-line)]" />
            {/* The rewritten line, marked the way the editor marks a change */}
            <div className="h-2 w-4/6 rounded bg-[var(--landing-accent-line)]" />
            <div className="h-2 w-full rounded bg-[var(--landing-paper-strong)]" />
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-[var(--landing-primary)] py-3 text-sm font-semibold text-[var(--landing-on-primary)]">
            <SparkleIcon size={15} />
            {t("tailor")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]">
      <div className="border-b border-[var(--landing-line)] px-4 py-3 text-xs font-medium text-[var(--landing-ink-soft)]">
        {t("export")}
      </div>
      <div className="flex flex-col items-center gap-3 p-8">
        <FileTextIcon size={40} className="text-[var(--landing-ink)]" />
        <span className="text-sm font-semibold text-[var(--landing-ink)]">
          resume_tailored.pdf
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--landing-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--landing-on-primary)]">
          <DownloadSimpleIcon size={13} />
          {t("download")}
        </span>
      </div>
    </div>
  );
}

export default function HowItWorks({ lifetimePrice = "29.99" }) {
  const t = useTranslations("landing.howItWorks");
  const STEPS = getHomeSteps(useLocale());
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="landing-section">
      <div className="landing-container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-5">
          <span className="landing-eyebrow-plain">{t("eyebrow")}</span>
          <RevealWords
            text={t("title")}
            className="mt-4 font-outfit text-4xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-5xl"
          />

          {/* Numbered steps. The open one becomes a bezel card with its
              description; the rest are one quiet line each. */}
          <ul className="mt-10 flex flex-col gap-2">
            {STEPS.map((step, index) => {
              const open = active === index;
              return (
                <li key={step.num} className={open ? "bezel" : ""}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-expanded={open}
                    className={`flex w-full cursor-pointer items-start gap-4 rounded-[0.875rem] p-4 text-start transition-colors duration-300 ${
                      open
                        ? "bezel-inner"
                        : "text-[var(--landing-ink-soft)] hover:bg-[var(--landing-paper-soft)]"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border font-outfit text-xs font-semibold tabular-nums ${
                        open
                          ? "border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]"
                          : "border-[var(--landing-line)] text-[var(--landing-ink-faint)]"
                      }`}
                    >
                      {step.num}
                    </span>
                    <span className="min-w-0 pt-1">
                      <span
                        className={`block font-outfit text-lg font-semibold ${
                          open ? "text-[var(--landing-ink)]" : ""
                        }`}
                      >
                        {step.title}
                      </span>
                      {open ? (
                        <span className="mt-1.5 block text-sm leading-relaxed text-[var(--landing-ink-soft)]">
                          {step.copy}
                        </span>
                      ) : null}
                    </span>
                  </button>

                  {/* No second column on narrow screens, so the panel rides
                      under the open step. */}
                  {open ? (
                    <div className="p-1.5 pt-0 lg:hidden">
                      <div className="bezel-inner dot-grid p-5">
                        <StepVisual step={index + 1} />
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <AuthLink href="/auth" className="landing-primary-btn shrink-0 whitespace-nowrap rounded-xl px-6 py-3 font-outfit text-sm">
              {t("tailor")}
              <ArrowUpRightIcon size={16} aria-hidden="true" />
            </AuthLink>
            <p className="text-sm text-[var(--landing-ink-soft)]">
              {t("priceNote", { price: lifetimePrice })}
            </p>
          </div>
        </div>

        <div className="hidden lg:sticky lg:top-28 lg:col-span-7 lg:block">
          <div className="bezel">
            <div className="flex items-center justify-between px-3.5 pb-2.5 pt-2">
              <span className="font-outfit text-sm font-semibold text-[var(--landing-ink)]">
                {STEPS[active].title}
              </span>
              <span className="tag-accent tabular-nums">
                {active + 1} / {STEPS.length}
              </span>
            </div>
            <div className="bezel-inner dot-grid flex aspect-4/3 items-center justify-center p-10">
              <div key={active} className="landing-rise w-full max-w-md shadow-[var(--landing-shadow)]">
                <StepVisual step={active + 1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
