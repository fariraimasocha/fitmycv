"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function CTABand() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container landing-card-strong flex flex-col items-center gap-8 overflow-hidden rounded-3xl px-6 py-14 sm:px-10">
        <h2 className="font-outfit font-extrabold text-[oklch(0.985_0.012_84)] text-center text-2xl sm:text-3xl lg:text-4xl">
          Ready to stop being ignored?
        </h2>
        <p className="font-sans text-[oklch(0.88_0.04_84)] text-center text-base leading-relaxed max-w-[560px]">
          Join thousands of job seekers who are landing interviews faster with
          AI-tailored applications.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[oklch(0.985_0.012_84)] px-7 py-3.5 font-outfit text-base font-extrabold text-[var(--landing-primary-dark)] shadow-[0_12px_24px_oklch(0_0_0_/_0.18)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Get Started
            <ArrowRightIcon size={16} aria-hidden="true" />
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center rounded-[10px] border border-[oklch(0.985_0.012_84_/_0.2)] bg-transparent px-7 py-3.5 font-outfit text-base font-bold text-[oklch(0.92_0.035_84)] transition-all hover:bg-[oklch(0.985_0.012_84_/_0.1)]"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
