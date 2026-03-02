"use client";

import { useState } from "react";
import { FileSearch, PenLine, BarChart, Download, Palette } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "ATS Keyword Optimization",
    description:
      "Automatically extracts keywords from the job description and weaves them into your CV naturally.",
  },
  {
    icon: PenLine,
    title: "AI Cover Letter Generator",
    description:
      "Generates a personalized, role-specific cover letter in seconds. No more staring at blank pages.",
  },
  {
    icon: BarChart,
    title: "Match Score Analysis",
    description:
      "See exactly how well your CV matches each job before you apply. Score, gaps, and suggestions at a glance.",
  },
  {
    icon: Download,
    title: "One-Click PDF Export",
    description:
      "Export your tailored CV and cover letter as beautifully formatted PDFs, ready to attach and send.",
  },
];

const themes = ["Minimal", "Executive", "Creative", "Tech", "Classic", "Bold"];

export default function Features() {
  const [activeTheme, setActiveTheme] = useState("Minimal");

  return (
    <section
      className="bg-white flex flex-col items-center gap-8 md:gap-10 lg:gap-12 px-5 sm:px-8 md:px-16 lg:px-[100px] xl:px-[140px] py-16 md:py-20 lg:py-[100px]"
    >
      {/* Header */}
      <div className="flex flex-col items-center" style={{ gap: 16 }}>
        <h2
          className="text-[#0F172A] text-center text-[28px] md:text-[34px] lg:text-[40px]"
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 700,
            letterSpacing: "-1.6px",
            lineHeight: 1.15,
          }}
        >
          Everything you need to
          <br />
          stand out
        </h2>
        <p
          className="text-[#64748B] text-center text-[15px] md:text-[17px]"
          style={{
            fontFamily: "var(--font-sn-pro)",
            fontWeight: 400,
          }}
        >
          Powerful features designed to give you an unfair advantage in the job
          market.
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col w-full gap-4 md:gap-5">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row w-full gap-4 md:gap-5">
          {features.slice(0, 2).map((feature) => (
            <div
              key={feature.title}
              className="flex-1 flex flex-col"
              style={{
                background: "#F8FAFC",
                borderRadius: 12,
                gap: 16,
                padding: 32,
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  background: "#F3F4F6",
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              >
                <feature.icon size={22} color="#111827" />
              </div>
              <h3
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-[#64748B]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row w-full gap-4 md:gap-5">
          {features.slice(2, 4).map((feature) => (
            <div
              key={feature.title}
              className="flex-1 flex flex-col"
              style={{
                background: "#F8FAFC",
                borderRadius: 12,
                gap: 16,
                padding: 32,
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  background: "#F3F4F6",
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              >
                <feature.icon size={22} color="#111827" />
              </div>
              <h3
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {feature.title}
              </h3>
              <p
                className="text-[#64748B]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Wide card — Multiple Themes */}
        <div
          className="w-full flex flex-col"
          style={{
            background: "#F8FAFC",
            borderRadius: 12,
            gap: 20,
            padding: 32,
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              background: "#F3F4F6",
              width: 44,
              height: 44,
              borderRadius: 10,
              flexShrink: 0,
            }}
          >
            <Palette size={22} color="#111827" />
          </div>
          <h3
            className="text-[#0F172A]"
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Multiple Themes
          </h3>
          <p
            className="text-[#64748B]"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            Choose from six professionally designed CV themes that suit your
            industry and personality.
          </p>
          {/* Theme chips */}
          <div className="flex flex-wrap" style={{ gap: 10 }}>
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setActiveTheme(theme)}
                style={{
                  borderRadius: 9999,
                  padding: "8px 16px",
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: activeTheme === theme ? "#111827" : "transparent",
                  color: activeTheme === theme ? "white" : "#64748B",
                  border:
                    activeTheme === theme
                      ? "1px solid #111827"
                      : "1px solid #E2E8F0",
                }}
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
