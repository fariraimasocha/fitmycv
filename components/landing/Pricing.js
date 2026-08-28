"use client";

import PricingCards from "@/components/pricing/PricingCards";
import { LIFETIME_SAVINGS_COPY } from "@/lib/pricing";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="landing-section landing-muted-band flex flex-col items-center gap-10"
    >
      <div className="landing-container flex flex-col items-center gap-5">
        <span className="landing-eyebrow">Pricing</span>
        <h2 className="landing-heading font-serif-display text-center text-3xl font-normal sm:text-4xl lg:text-5xl">
          Less than an hour of a freelancer.
          <br />
          <span className="landing-accent-tail">Yours for good.</span>
        </h2>
        <p className="landing-copy text-center text-lg">
          One payment for lifetime access, or go monthly, cancel anytime.
        </p>
      </div>

      <div className="landing-container w-full">
        <PricingCards />
        <p className="mx-auto mt-8 max-w-lg text-center text-xs text-[var(--landing-ink-soft)]">
          {LIFETIME_SAVINGS_COPY} Secure checkout via Polar.
        </p>
      </div>
    </section>
  );
}
