"use client";

import Link from "next/link";
import { FileTextIcon } from "@phosphor-icons/react";

// Root-relative hrefs throughout — the footer renders on every page, so bare
// "#features" anchors would dead-end everywhere except the homepage.
const productLinks = [
  { label: "Tailor CV from a job link", href: "/tailor-cv-from-job-link" },
  { label: "ATS resume checker", href: "/ats-resume-checker" },
  { label: "ATS keyword checker", href: "/free-ats-keyword-checker" },
  { label: "Resume optimizer", href: "/resume-optimizer" },
  { label: "AI cover letter generator", href: "/ai-cover-letter-generator" },
  { label: "Cover letter builder", href: "/cover-letter-builder" },
  { label: "Pricing", href: "/pricing" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "ATS resume guide", href: "/blog/ats-resume-guide" },
  { label: "How to write a resume", href: "/how-to-write-a-resume" },
  { label: "Resume tips", href: "/resume-tips" },
  { label: "Resume examples", href: "/resume-examples" },
  { label: "CV examples", href: "/cv-examples" },
  { label: "CV templates", href: "/cv-templates" },
];

const companyLinks = [
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

const otherApps = [
  { label: "LinkGenie", href: "https://linkgenie.one" },
  { label: "WaitFast", href: "https://waitfast.one" },
  { label: "LaunchMe", href: "https://launchme.site" },
  { label: "LearnHowToPrompt", href: "https://learnhowtoprompt.one" },
];

export default function Footer() {
  return (
    <footer className="landing-muted-band px-5 py-12 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container flex flex-col gap-12">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-10">
          {/* Brand col */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            <div className="flex flex-row items-center gap-2.5">
              <div className="flex items-center justify-center bg-[var(--landing-primary-dark)] w-6 h-6 rounded-[5px] shrink-0">
                <FileTextIcon size={12} className="text-[oklch(0.99_0.006_84)]" aria-hidden="true" />
              </div>
              <span className="font-outfit font-extrabold text-lg text-[var(--landing-ink)]">FitMyCv</span>
            </div>
            <p className="font-sans text-sm text-[var(--landing-ink-soft)] leading-relaxed max-w-[260px]">
              AI-powered CV tailoring. Land more interviews with less effort.
            </p>
          </div>

          {/* Links + Other Apps */}
          <div className="flex flex-col flex-wrap gap-8 sm:flex-row sm:gap-12 lg:gap-14">
            {/* Product col */}
            <div className="flex flex-col gap-4">
              <h4 className="font-outfit font-bold text-sm text-[var(--landing-ink)]">Product</h4>
              <ul className="flex flex-col gap-3">
                {productLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources col */}
            <div className="flex flex-col gap-4">
              <h4 className="font-outfit font-bold text-sm text-[var(--landing-ink)]">Resources</h4>
              <ul className="flex flex-col gap-3">
                {resourceLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company col */}
            <div className="flex flex-col gap-4">
              <h4 className="font-outfit font-bold text-sm text-[var(--landing-ink)]">Company</h4>
              <ul className="flex flex-col gap-3">
                {companyLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Apps col */}
            <div className="flex flex-col gap-4">
              <h4 className="font-outfit font-bold text-sm text-[var(--landing-ink)]">Other Apps</h4>
              <ul className="flex flex-col gap-3">
                {otherApps.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full border-t border-[var(--landing-line)] gap-4 pt-6">
          <p className="font-sans text-sm text-[var(--landing-ink-soft)]">
            2026 FitMyCv. All rights reserved.
          </p>
          <div className="flex flex-row flex-wrap gap-4">
            {otherApps.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)] transition-colors"
              >
                {href.replace("https://", "")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
