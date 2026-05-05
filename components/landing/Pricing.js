"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";

const features = [
  "AI-powered CV tailoring",
  "Smart cover letter generation",
  "Job requirement analysis",
  "PDF export & download",
  "Unlimited generations",
];

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/api/polar/checkout");
    } else {
      setPendingCheckout(true);
      router.push("/auth");
    }
  };

  return (
    <section
      id="pricing"
      className="landing-section landing-muted-band flex flex-col items-center gap-8"
    >
      {/* Header */}
      <div className="landing-container flex flex-col items-center gap-5">
        <span className="landing-eyebrow">
          Pricing
        </span>
        <h2 className="landing-heading font-outfit font-extrabold text-center text-3xl sm:text-4xl lg:text-5xl">
          Simple, transparent pricing
        </h2>
        <p className="landing-copy font-sans text-center text-lg">
          Everything you need to land your next role.
        </p>
      </div>

      {/* Card */}
      <div className="landing-card flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl gap-7 p-6 sm:p-8 lg:p-10">
        {/* Card top */}
        <div className="flex flex-col gap-2">
          <span className="font-outfit font-extrabold text-[var(--landing-ink)] text-2xl">Premium</span>
          <span className="font-sans font-semibold text-[var(--landing-ink-soft)] text-sm">Cancel anytime. No contracts.</span>
        </div>

        {/* Price row */}
        <div className="flex flex-row items-end gap-1">
          <span className="font-outfit font-extrabold text-[var(--landing-primary-dark)] text-5xl leading-none">
            $4.99
          </span>
          <span className="font-sans font-semibold text-[var(--landing-ink-soft)] text-base pb-1">/month</span>
        </div>

        {/* Features list */}
        <div className="flex flex-col gap-5">
          {features.map((feature) => (
            <div key={feature} className="flex flex-row items-center gap-3.5">
              <div className="flex items-center justify-center flex-shrink-0 bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)] w-6 h-6 rounded-full">
                <CheckIcon size={12} weight="bold" aria-hidden="true" />
              </div>
              <span className="font-sans font-semibold text-[var(--landing-ink)] text-base">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="landing-primary-btn w-full cursor-pointer font-outfit text-base"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
