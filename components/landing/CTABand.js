"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTABand() {
  return (
    <section
      className="border-t border-b border-[#E2E8F0] px-5 py-16 sm:px-10 lg:px-[140px] lg:py-20"
      style={{
        background: "linear-gradient(135deg, #F0FDF7 0%, #FFFFFF 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-8">
        <h2
          className="text-[#0F172A] text-center text-[28px] sm:text-[40px]"
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 700,
            letterSpacing: "-1.6px",
          }}
        >
          Ready to stop being ignored?
        </h2>
        <p
          className="text-[#64748B] text-center"
          style={{
            fontFamily: "var(--font-sn-pro)",
            fontSize: 17,
            fontWeight: 400,
            maxWidth: 560,
          }}
        >
          Join thousands of job seekers who are landing interviews faster with
          AI-tailored applications.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
            href="#pricing"
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
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
