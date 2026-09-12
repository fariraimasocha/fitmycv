"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";
import { PRO_FEATURES } from "@/lib/pro-features";
import { PRICING } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";

export default function PricingCards({
  defaultPlan = "lifetime",
  compact = false,
  onSkip,
  skipLabel = "Continue free",
  pricing: pricingProp,
  tier: tierProp,
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);
  const [pricing, setPricing] = useState(pricingProp ?? PRICING);
  const [tier, setTier] = useState(tierProp ?? pricingProp?.tier ?? "standard");

  useEffect(() => {
    if (pricingProp) {
      setPricing(pricingProp);
      setTier(tierProp ?? pricingProp.tier ?? "standard");
      trackEvent("pricing_tier_viewed", {
        tier: tierProp ?? pricingProp.tier,
      });
      return;
    }

    fetch("/api/pricing-tier")
      .then((res) => res.json())
      .then((data) => {
        if (data?.pricing) {
          setPricing(data.pricing);
          setTier(data.tier ?? "standard");
          trackEvent("pricing_tier_viewed", {
            tier: data.tier,
            country: data.country,
          });
        }
      })
      .catch(() => {});
  }, [pricingProp, tierProp]);

  const handleCheckout = (plan) => {
    trackEvent("checkout_start", { tier, plan });
    if (session?.user) {
      router.push(`/api/polar/checkout?plan=${plan}`);
    } else {
      setPendingCheckout(true, plan);
      router.push("/auth");
    }
  };

  const plans = [pricing.lifetime, pricing.month];

  return (
    <div className={`flex w-full flex-col gap-6 ${compact ? "" : "items-center"}`}>
      {pricing.regionalNote ? (
        <p className="text-center text-xs font-semibold text-[var(--landing-ink-soft)]">
          {pricing.regionalNote}
        </p>
      ) : null}

      <div
        className={`grid w-full gap-4 ${
          compact
            ? "grid-cols-1 sm:grid-cols-2"
            : "order-2 max-w-3xl grid-cols-1 md:order-1 md:grid-cols-2"
        }`}
      >
        {plans.map((plan) => {
          const highlighted = plan.highlight;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col gap-5 rounded-2xl border p-6 sm:p-7 ${
                highlighted
                  ? "border-[var(--landing-line)] bg-white shadow-[var(--landing-shadow-sm)]"
                  : "border-[var(--landing-line)] bg-[var(--landing-surface)]"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 py-1 text-xs font-semibold text-[var(--landing-ink)]">
                  {plan.badge}
                </span>
              )}

              <div className="flex flex-col gap-1">
                <span className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                  {plan.label}
                </span>
                <span className="text-sm text-[var(--landing-ink-soft)]">
                  {plan.subline}
                </span>
              </div>

              <div className="flex items-end gap-1">
                <span className="font-outfit text-4xl font-extrabold leading-none text-[var(--landing-ink)]">
                  ${plan.price}
                </span>
                <span className="pb-1 text-sm font-semibold text-[var(--landing-ink-soft)]">
                  {plan.suffix}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCheckout(plan.id)}
                className={
                  highlighted
                    ? "landing-primary-btn w-full cursor-pointer font-outfit text-sm"
                    : "landing-secondary-btn w-full cursor-pointer font-outfit text-sm"
                }
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="order-1 w-full max-w-3xl rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-6 sm:p-7 md:order-2">
          <h3 className="text-center font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            Both plans include everything
          </h3>
          <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {PRO_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-[var(--landing-ink-soft)]"
              >
                <CheckIcon
                  size={14}
                  weight="bold"
                  className="mt-0.5 shrink-0 text-[var(--landing-primary)]"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="order-3 mx-auto text-sm font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}

export function useClientPricing(initialPricing) {
  const [pricing, setPricing] = useState(initialPricing ?? PRICING);

  useEffect(() => {
    if (initialPricing) return;
    fetch("/api/pricing-tier")
      .then((res) => res.json())
      .then((data) => {
        if (data?.pricing) setPricing(data.pricing);
      })
      .catch(() => {});
  }, [initialPricing]);

  return pricing;
}
