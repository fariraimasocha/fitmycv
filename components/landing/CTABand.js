"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

import AuthLink from "@/components/landing/AuthLink";
import { PRICING } from "@/lib/pricing";

export default function CTABand({ lifetimePrice = PRICING.lifetime.price }) {
  return (
    <section className="landing-dark-band landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container flex flex-col items-center gap-8 py-10">
        <h2 className="landing-section-title text-center text-3xl text-white sm:text-4xl lg:text-5xl">
          Ready to stop being ignored?
        </h2>
        <p className="max-w-xl text-center text-base leading-relaxed text-[var(--landing-ink-inverse-soft)]">
          Join job seekers landing interviews faster with AI-tailored
          applications. Lifetime access for {`$${lifetimePrice}`}.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <AuthLink
            href="/auth"
            className="landing-pill-btn landing-pill-solid font-outfit px-6 py-3 text-sm"
          >
            Try for free
            <ArrowUpRightIcon size={16} aria-hidden="true" />
          </AuthLink>
          <Link
            href="#pricing"
            className="landing-pill-btn landing-pill-ghost font-outfit px-6 py-3 text-sm"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
