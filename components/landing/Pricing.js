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
      className="bg-muted flex flex-col items-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24 gap-8"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-5">
        <span className="font-sans font-medium text-sm text-muted-foreground border border-border rounded-full px-5 py-2">
          Pricing
        </span>
        <h2 className="font-outfit font-extrabold text-foreground text-center text-3xl sm:text-4xl lg:text-5xl tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="font-sans text-muted-foreground text-center text-lg">
          Everything you need to land your next role.
        </p>
      </div>

      {/* Card */}
      <div className="flex flex-col bg-background w-full max-w-[480px] rounded-2xl border border-border shadow-md gap-7 p-6 sm:p-8 lg:p-10">
        {/* Card top */}
        <div className="flex flex-col gap-2">
          <span className="font-outfit font-bold text-foreground text-2xl">Premium</span>
          <span className="font-sans text-muted-foreground text-sm">Cancel anytime. No contracts.</span>
        </div>

        {/* Price row */}
        <div className="flex flex-row items-end gap-1">
          <span className="font-outfit font-extrabold text-foreground text-5xl leading-none tracking-tight">
            $4.99
          </span>
          <span className="font-sans text-muted-foreground text-base pb-1">/month</span>
        </div>

        {/* Features list */}
        <div className="flex flex-col gap-5">
          {features.map((feature) => (
            <div key={feature} className="flex flex-row items-center gap-3.5">
              <div className="flex items-center justify-center flex-shrink-0 bg-foreground w-6 h-6 rounded-full">
                <CheckIcon size={12} weight="bold" className="text-background" aria-hidden="true" />
              </div>
              <span className="font-sans font-medium text-foreground text-base">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="w-full bg-foreground text-background font-outfit font-semibold text-base rounded-xl py-4 transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
