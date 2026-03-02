"use client";

import { ArrowRight, CircleCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 px-5 py-16 sm:px-10 md:px-16 lg:px-[140px] lg:py-[100px]">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-8 w-full" style={{ maxWidth: 560 }}>
          <h1
            className="text-[#0F172A] leading-[1.1] text-[36px] sm:text-[44px] lg:text-[56px]"
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              letterSpacing: "-2.24px",
            }}
          >
            Land more interviews
            <br />
            with a CV that fits.
          </h1>

          <p
            className="text-[#64748B]"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            FitMyCv uses AI to tailor your resume and cover letter to every job
            description so you stand out where it matters.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "#111827",
                borderRadius: 10,
                padding: "13px 28px",
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
                fontSize: 16,
                color: "#ffffff",
              }}
            >
              Get Started
              <ArrowRight size={16} color="#ffffff" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center transition-all hover:bg-[#F8FAFC]"
              style={{
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                padding: "13px 28px",
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
                fontSize: 16,
                color: "#64748B",
                background: "transparent",
              }}
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right column — hidden on small screens */}
        <div className="hidden md:flex flex-1 relative" style={{ height: 480 }}>
          {/* Hero image */}
          <Image
            src="/hero-img.png"
            alt="FitMyCV dashboard"
            width={520}
            height={440}
            className="rounded-2xl object-cover"
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              width: 520,
              height: 440,
              border: "1px solid #E2E8F0",
              boxShadow: "0 20px 60px -10px rgba(15,23,42,0.08)",
            }}
            priority
          />

          {/* ATS Score Card */}
          <div
            className="absolute flex items-center gap-2.5 bg-white"
            style={{
              left: -20,
              top: 120,
              borderRadius: 12,
              padding: "12px 16px",
              boxShadow: "0 8px 24px -4px rgba(15,23,42,0.094)",
            }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                background: "#F3F4F6",
                width: 36,
                height: 36,
                borderRadius: 8,
              }}
            >
              <CircleCheck size={18} color="#111827" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[#94A3B8]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 11,
                  fontWeight: 400,
                }}
              >
                ATS Score
              </span>
              <span
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                94% — Excellent match
              </span>
            </div>
          </div>

          {/* Speed Card */}
          <div
            className="absolute flex items-center gap-2.5 bg-white"
            style={{
              right: -16,
              bottom: 120,
              borderRadius: 12,
              padding: "12px 16px",
              boxShadow: "0 8px 24px -4px rgba(15,23,42,0.094)",
            }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                background: "#F3F4F6",
                width: 36,
                height: 36,
                borderRadius: 8,
              }}
            >
              <Zap size={18} color="#111827" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[#94A3B8]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 11,
                  fontWeight: 400,
                }}
              >
                Cover Letter
              </span>
              <span
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Ready in 8 seconds
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
