"use client";

import Link from "next/link";
import { FileTextIcon } from "@phosphor-icons/react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
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
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            {/* Links col */}
            <div className="flex flex-col gap-4">
              <h4 className="font-outfit font-bold text-sm text-[var(--landing-ink)]">Links</h4>
              <ul className="flex flex-col gap-3">
                {footerLinks.map(({ label, href }) => (
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
            2025 FitMyCv. All rights reserved.
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
