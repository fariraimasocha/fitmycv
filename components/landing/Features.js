"use client";

import { useState } from "react";
import {
  FileMagnifyingGlassIcon,
  PencilLineIcon,
  ChartBarIcon,
  DownloadSimpleIcon,
  PaletteIcon,
} from "@phosphor-icons/react";

const features = [
  {
    icon: FileMagnifyingGlassIcon,
    title: "ATS Keyword Optimization",
    description:
      "Automatically extracts keywords from the job description and weaves them into your CV naturally.",
  },
  {
    icon: PencilLineIcon,
    title: "AI Cover Letter Generator",
    description:
      "Generates a personalized, role-specific cover letter in seconds. No more staring at blank pages.",
  },
  {
    icon: ChartBarIcon,
    title: "Match Score Analysis",
    description:
      "See exactly how well your CV matches each job before you apply. Score, gaps, and suggestions at a glance.",
  },
  {
    icon: DownloadSimpleIcon,
    title: "One-Click PDF Export",
    description:
      "Export your tailored CV and cover letter as beautifully formatted PDFs, ready to attach and send.",
  },
];

const themes = ["Minimal", "Executive", "Creative", "Tech", "Classic", "Bold"];

function FeatureCard({ feature }) {
  return (
    <div className="landing-card flex-1 flex flex-col gap-4 overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-8">
      <div className="landing-icon flex items-center justify-center w-11 h-11 rounded-[10px] shrink-0">
        <feature.icon size={22} aria-hidden="true" />
      </div>
      <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-lg">{feature.title}</h3>
      <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}

export default function Features() {
  const [activeTheme, setActiveTheme] = useState("Minimal");

  return (
    <section
      id="features"
      className="landing-section flex flex-col items-center gap-12"
    >
      {/* Header */}
      <div className="landing-container flex flex-col items-center gap-4">
        <span className="landing-eyebrow">Application advantage</span>
        <h2 className="landing-heading font-outfit font-extrabold text-center text-3xl sm:text-4xl">
          Everything you need to
          <br />
          stand out
        </h2>
        <p className="landing-copy font-sans text-center text-base">
          Powerful features designed to give you an unfair advantage in the job market.
        </p>
      </div>

      {/* Grid */}
      <div className="landing-container flex flex-col w-full gap-5">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row w-full gap-5">
          {features.slice(0, 2).map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row w-full gap-5">
          {features.slice(2, 4).map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>

        {/* Wide card — Multiple Themes */}
        <div className="landing-card w-full flex flex-col gap-5 overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-8">
          <div className="landing-icon flex items-center justify-center w-11 h-11 rounded-[10px] shrink-0">
            <PaletteIcon size={22} aria-hidden="true" />
          </div>
          <h3 className="font-outfit font-extrabold text-[var(--landing-ink)] text-lg">Multiple Themes</h3>
          <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed max-w-[600px]">
            Choose from six professionally designed CV themes that suit your industry and personality.
          </p>
          {/* Theme chips */}
          <div className="flex flex-wrap gap-2.5">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setActiveTheme(theme)}
                className={`font-sans font-medium text-sm rounded-full px-4 py-2 border transition cursor-pointer active:scale-[0.96] ${
                  activeTheme === theme
                    ? "bg-[var(--landing-primary-dark)] text-[oklch(0.99_0.006_84)] border-[var(--landing-primary-dark)] shadow-[0_8px_16px_oklch(0.31_0.09_178_/_0.16)]"
                    : "bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)] border-[var(--landing-line)] hover:border-[oklch(0.47_0.125_177_/_0.35)] hover:text-[var(--landing-ink)]"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
