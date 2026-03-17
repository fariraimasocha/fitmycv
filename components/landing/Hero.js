"use client";

import { ArrowRightIcon, CheckCircleIcon, LightningIcon } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24">
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-8 w-full max-w-[560px]">
          <h1 className="font-outfit font-extrabold text-foreground leading-[1.1] text-[36px] sm:text-[44px] lg:text-[56px] tracking-tight break-words">
            Land more interviews
            <br />
            with a CV that fits.
          </h1>

          <p className="font-sans text-muted-foreground text-[17px] leading-[1.7]">
            FitMyCV uses AI to tailor your resume and cover letter to every job
            description so you stand out where it matters.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/auth"
              className="group inline-flex items-center justify-center gap-2 font-outfit font-semibold text-base bg-foreground text-background rounded-xl px-7 py-3.5 transition duration-200 hover:opacity-85 hover:scale-[1.02] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              Get Started
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center font-outfit font-semibold text-base text-muted-foreground border border-border rounded-xl px-7 py-3.5 transition duration-200 hover:bg-muted hover:text-foreground active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right column — hidden on small screens */}
        <div className="hidden md:flex flex-1 relative h-[480px]">
          {/* Hero image */}
          <Image
            src="/hero-img.png"
            alt="FitMyCV dashboard showing a tailored resume"
            width={520}
            height={440}
            sizes="(max-width: 768px) 0px, (max-width: 1280px) 50vw, 520px"
            className="absolute left-5 top-5 rounded-2xl object-cover border border-border shadow-[0_24px_64px_-12px_rgba(15,23,42,0.10)] bg-muted outline outline-1 outline-black/5"
            priority
          />

          {/* ATS Score Card */}
          <div
            role="img"
            aria-label="ATS Score: 94% — Excellent match"
            className="absolute flex items-center gap-2.5 bg-background border border-border rounded-xl px-4 py-3 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.10)]"
            style={{ left: -20, top: 120 }}
          >
            <div className="flex items-center justify-center shrink-0 bg-foreground w-9 h-9 rounded-lg">
              <CheckCircleIcon size={18} className="text-background" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-sans text-[11px] text-muted-foreground truncate">ATS Score</span>
              <span className="font-outfit text-sm font-bold text-foreground leading-tight truncate">94% — Excellent match</span>
            </div>
          </div>

          {/* Speed Card */}
          <div
            role="img"
            aria-label="Cover Letter: Ready in 8 seconds"
            className="absolute flex items-center gap-2.5 bg-background border border-border rounded-xl px-4 py-3 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.10)]"
            style={{ right: -16, bottom: 120 }}
          >
            <div className="flex items-center justify-center shrink-0 bg-foreground w-9 h-9 rounded-lg">
              <LightningIcon size={18} className="text-background" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-sans text-[11px] text-muted-foreground truncate">Cover Letter</span>
              <span className="font-outfit text-sm font-bold text-foreground leading-tight truncate">Ready in 8 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
