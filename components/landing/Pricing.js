import PricingCards from "@/components/pricing/PricingCards";
import { getLifetimeSavingsCopy } from "@/lib/pricing";
import { getServerPricing } from "@/lib/server-pricing";

export default async function Pricing() {
  const { pricing, tier } = await getServerPricing();

  return (
    <section
      id="pricing"
      className="landing-section landing-muted-band flex flex-col items-center gap-10"
    >
      <div className="landing-container flex flex-col items-center gap-5">
        <span className="landing-eyebrow">Pricing</span>
        <h2 className="landing-section-title text-center text-3xl sm:text-4xl lg:text-5xl">
          Less than an hour of a freelancer.
          <br />
          <span className="landing-accent-tail">Yours for good.</span>
        </h2>
        <p className="landing-copy text-center text-lg">
          One payment for lifetime access, or go monthly, cancel anytime.
        </p>
      </div>

      <div className="landing-container w-full">
        <PricingCards pricing={pricing} tier={tier} />
        <p className="mx-auto mt-8 max-w-lg text-center text-xs text-[var(--landing-ink-soft)]">
          {getLifetimeSavingsCopy(tier)} Secure checkout via Polar.
        </p>
        {tier === "standard" ? (
          <p className="mx-auto mt-2 max-w-lg text-center text-xs text-[var(--landing-ink-soft)]">
            Lower regional pricing is available in select countries.
          </p>
        ) : null}
      </div>
    </section>
  );
}
