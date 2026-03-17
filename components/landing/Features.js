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
    <div className="flex-1 flex flex-col gap-4 bg-muted rounded-xl p-8 border border-border">
      <div className="flex items-center justify-center bg-background w-11 h-11 rounded-[10px] shrink-0 border border-border">
        <feature.icon size={22} className="text-foreground" aria-hidden="true" />
      </div>
      <h3 className="font-outfit font-bold text-foreground text-lg">{feature.title}</h3>
      <p className="font-sans text-muted-foreground text-[15px] leading-relaxed">{feature.description}</p>
    </div>
  );
}

export default function Features() {
  const [activeTheme, setActiveTheme] = useState("Minimal");

  return (
    <section
      id="features"
      className="bg-background flex flex-col items-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24 gap-12"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="font-outfit font-bold text-foreground text-center text-[32px] sm:text-[40px] tracking-tight leading-[1.15]">
          Everything you need to
          <br />
          stand out
        </h2>
        <p className="font-sans text-muted-foreground text-center text-[17px]">
          Powerful features designed to give you an unfair advantage in the job market.
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col w-full gap-5">
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
        <div className="w-full flex flex-col gap-5 bg-muted rounded-xl p-8 border border-border">
          <div className="flex items-center justify-center bg-background w-11 h-11 rounded-[10px] shrink-0 border border-border">
            <PaletteIcon size={22} className="text-foreground" aria-hidden="true" />
          </div>
          <h3 className="font-outfit font-bold text-foreground text-lg">Multiple Themes</h3>
          <p className="font-sans text-muted-foreground text-[15px] leading-relaxed max-w-[600px]">
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
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
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
