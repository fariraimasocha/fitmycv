"use client";

import {
  CircleCheck,
  ClipboardPaste,
  ChevronDown,
  Timer,
  ArrowRight,
  Check,
  Sparkles,
  Target,
  Download,
  FilePlus,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

function StepNumber({ number, label }) {
  return (
    <div className="flex flex-row items-center" style={{ gap: 16 }}>
      <div
        className="flex items-center justify-center"
        style={{
          background: "#111827",
          width: 56,
          height: 56,
          borderRadius: 16,
          flexShrink: 0,
        }}
      >
        <span
          className="text-white"
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          {number}
        </span>
      </div>
      <div
        style={{
          background: "#111827",
          height: 2,
          width: 40,
          borderRadius: 1,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-sn-pro)",
          fontWeight: 600,
          fontSize: 12,
          color: "#111827",
          letterSpacing: "2px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex flex-row items-center" style={{ gap: 10 }}>
      <CircleCheck size={18} color="#111827" style={{ flexShrink: 0 }} />
      <span
        className="text-[#64748B]"
        style={{
          fontFamily: "var(--font-sn-pro)",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function Connector() {
  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      style={{ height: 64 }}
    >
      <div
        style={{ background: "#E2E8F0", height: 32, width: 2 }}
      />
      <ChevronDown size={20} color="#94A3B8" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#F8FAFC] flex flex-col gap-10 md:gap-12 lg:gap-16 px-5 sm:px-8 md:px-16 lg:px-[100px] py-16 md:py-20 lg:py-[100px]"
    >
      {/* Header */}
      <div className="flex flex-col items-center" style={{ gap: 16 }}>
        {/* Badge */}
        <div
          className="inline-flex flex-row items-center"
          style={{
            background: "#F3F4F6",
            borderRadius: 9999,
            gap: 8,
            padding: "6px 16px",
            border: "1px solid #D1D5DB",
          }}
        >
          <div
            style={{
              background: "#111827",
              width: 8,
              height: 8,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontWeight: 500,
              fontSize: 13,
              color: "#111827",
            }}
          >
            Simple 3-Step Process
          </span>
        </div>
        <h2
          className="text-[#0F172A] text-center text-[28px] md:text-[34px] lg:text-[40px]"
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 700,
            letterSpacing: "-1.6px",
          }}
        >
          How It Works
        </h2>
        <p
          className="text-[#64748B] text-center text-[15px] md:text-[17px]"
          style={{
            fontFamily: "var(--font-sn-pro)",
            fontWeight: 400,
          }}
        >
          From job listing to tailored application in under a minute.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col w-full">
        {/* Step 1 — content left, visual right */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Content */}
          <div
            className="flex-1 flex flex-col pb-6 md:pb-0 md:pr-8 lg:pr-12"
            style={{ gap: 20 }}
          >
            <StepNumber number="01" label="PASTE" />
            <h3
              className="text-[#0F172A] text-xl md:text-2xl lg:text-[28px]"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Paste the Job Listing
            </h3>
            <p
              className="text-[#64748B]"
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Copy any job description from LinkedIn, Indeed, or anywhere else
              and paste it in. Our system instantly parses the requirements,
              skills, and keywords.
            </p>
            <div className="flex flex-col" style={{ gap: 12 }}>
              <FeatureItem text="Works with LinkedIn, Indeed, Glassdoor & more" />
              <FeatureItem text="Paste URL or copy-paste the full description" />
              <FeatureItem text="Auto-detects key requirements & skills" />
            </div>
          </div>

          {/* Visual */}
          <div
            className="flex-1 flex flex-col justify-center min-h-[240px] md:min-h-[280px] lg:min-h-[320px]"
            style={{
              background: "#F3F4F6",
              borderRadius: 20,
              gap: 16,
              padding: 32,
              border: "1px solid #D1D5DB",
            }}
          >
            {/* Label */}
            <span
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 12,
                fontWeight: 500,
                color: "#94A3B8",
              }}
            >
              Job listing URL
            </span>
            {/* Input row */}
            <div
              className="flex flex-row items-center"
              style={{
                background: "white",
                border: "1px solid #D1D5DB",
                borderRadius: 10,
                padding: "12px 14px",
                gap: 10,
              }}
            >
              <LinkIcon size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
              <input
                readOnly
                value=""
                placeholder="https://linkedin.com/jobs/view/..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 13,
                  color: "#0F172A",
                }}
              />
              <div
                className="inline-flex flex-row items-center"
                style={{
                  background: "#111827",
                  borderRadius: 9999,
                  gap: 6,
                  padding: "5px 10px",
                  flexShrink: 0,
                }}
              >
                <ClipboardPaste size={12} color="white" />
                <span
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                >
                  Paste
                </span>
              </div>
            </div>
            {/* Source chips */}
            <div className="flex flex-row" style={{ gap: 8 }}>
              {[
                { label: "LinkedIn", dot: "#0A66C2" },
                { label: "Indeed", dot: "#2164F3" },
                { label: "Glassdoor", dot: "#0CAA41" },
              ].map(({ label, dot }) => (
                <div
                  key={label}
                  className="inline-flex flex-row items-center"
                  style={{
                    background: "#F3F4F6",
                    borderRadius: 9999,
                    gap: 6,
                    padding: "5px 12px",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: dot,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sn-pro)",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#64748B",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Connector />

        {/* Step 2 — visual left, content right */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Visual */}
          <div
            className="flex-1 flex flex-col justify-center order-2 md:order-1 min-h-[240px] md:min-h-[280px] lg:min-h-[320px]"
            style={{
              background: "#F3F4F6",
              borderRadius: 20,
              gap: 16,
              padding: 32,
              border: "1px solid #D1D5DB",
            }}
          >
            {/* Mock CV preview */}
            <div
              className="flex flex-col"
              style={{
                background: "white",
                borderRadius: 12,
                gap: 8,
                padding: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #E2E8F0",
              }}
            >
              <div style={{ background: "#111827", borderRadius: 4, height: 8, width: "100%" }} />
              <div style={{ background: "#D1D5DB", borderRadius: 3, height: 6, width: "100%" }} />
              <div style={{ background: "#D1D5DB", borderRadius: 3, height: 6, width: "70%" }} />
              <div style={{ background: "#E2E8F0", borderRadius: 3, height: 6, width: "100%" }} />
              <div style={{ background: "#E2E8F0", borderRadius: 3, height: 6, width: "55%" }} />
            </div>
            {/* Tailor button */}
            <button
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#111827",
                border: "none",
                borderRadius: 12,
                height: 44,
                width: "100%",
                cursor: "pointer",
              }}
            >
              <Sparkles size={15} color="white" />
              <span
                className="text-white"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Tailor My CV
              </span>
            </button>
            {/* Timing hint */}
            <span
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 12,
                fontWeight: 400,
                color: "#94A3B8",
                textAlign: "center",
              }}
            >
              Generates in ~30 seconds
            </span>
          </div>

          {/* Content */}
          <div
            className="flex-1 flex flex-col order-1 md:order-2 pb-6 md:pb-0 md:pl-8 lg:pl-12"
            style={{ gap: 20 }}
          >
            <StepNumber number="02" label="TAILOR" />
            <h3
              className="text-[#0F172A] text-xl md:text-2xl lg:text-[28px]"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              AI Tailors Your CV
            </h3>
            <p
              className="text-[#64748B]"
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Our AI restructures your resume, rewrites bullet points, and
              optimizes for ATS keywords. Every detail is aligned to make you
              the perfect candidate.
            </p>
            <div className="flex flex-col" style={{ gap: 12 }}>
              <FeatureItem text="Rewrites bullet points with impact verbs" />
              <FeatureItem text="Optimizes keywords to pass ATS filters" />
              <FeatureItem text="Restructures layout for maximum readability" />
            </div>
          </div>
        </div>

        <Connector />

        {/* Step 3 — content left, visual right */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Content */}
          <div
            className="flex-1 flex flex-col pb-6 md:pb-0 md:pr-8 lg:pr-12"
            style={{ gap: 20 }}
          >
            <StepNumber number="03" label="APPLY" />
            <h3
              className="text-[#0F172A] text-xl md:text-2xl lg:text-[28px]"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Download &amp; Apply
            </h3>
            <p
              className="text-[#64748B]"
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              Get your polished CV and a custom cover letter. Export as PDF and
              apply with confidence. Stand out from the crowd.
            </p>
            <div className="flex flex-col" style={{ gap: 12 }}>
              <FeatureItem text="One-click PDF export, beautifully formatted" />
              <FeatureItem text="Includes matching cover letter automatically" />
              <FeatureItem text="Apply confidently with a tailored application" />
            </div>
          </div>

          {/* Visual */}
          <div
            className="flex-1 flex flex-col items-center justify-center min-h-[240px] md:min-h-[280px] lg:min-h-[320px]"
            style={{
              background: "#F3F4F6",
              borderRadius: 20,
              gap: 16,
              padding: 32,
              border: "1px solid #D1D5DB",
            }}
          >
            {/* Export Mock */}
            <div
              className="flex flex-col items-center justify-center"
              style={{
                background: "white",
                borderRadius: 16,
                gap: 12,
                height: 140,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #E2E8F0",
                width: 220,
              }}
            >
              <FileText size={36} color="#111827" />
              <span
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                resume_tailored.pdf
              </span>
              <span
                className="text-[#94A3B8]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 11,
                  fontWeight: 400,
                }}
              >
                Ready to download
              </span>
            </div>
            {/* Export buttons */}
            <div className="flex flex-row" style={{ gap: 10 }}>
              <div
                className="inline-flex flex-row items-center"
                style={{
                  background: "#111827",
                  borderRadius: 9999,
                  gap: 8,
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                <Download size={14} color="white" />
                <span
                  className="text-white"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Download PDF
                </span>
              </div>
              <div
                className="inline-flex flex-row items-center"
                style={{
                  background: "white",
                  borderRadius: 9999,
                  gap: 8,
                  padding: "10px 20px",
                  border: "1px solid #D1D5DB",
                  cursor: "pointer",
                }}
              >
                <FilePlus size={14} color="#64748B" />
                <span
                  className="text-[#64748B]"
                  style={{
                    fontFamily: "var(--font-sn-pro)",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Cover Letter
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA — stacked vertically */}
      <div
        className="flex flex-col items-center"
        style={{ gap: 20, paddingTop: 48 }}
      >
        {/* Time badge */}
        <div
          className="inline-flex flex-row items-center"
          style={{
            background: "white",
            borderRadius: 16,
            gap: 10,
            padding: "12px 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid #E2E8F0",
          }}
        >
          <Timer size={20} color="#111827" />
          <span
            className="text-[#0F172A]"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Average time: 47 seconds from paste to polished CV
          </span>
        </div>
        {/* CTA Button */}
        <Link
          href="/auth"
          className="inline-flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "#111827",
            borderRadius: 12,
            gap: 8,
            padding: "16px 32px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontFamily: "var(--font-sn-pro)",
            fontWeight: 600,
            fontSize: 16,
            color: "white",
          }}
        >
          Try It Free Now
          <ArrowRight size={18} color="white" />
        </Link>
      </div>
    </section>
  );
}
