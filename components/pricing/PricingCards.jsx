"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter as useLocaleRouter } from "@/i18n/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";
import { PRO_FEATURES } from "@/lib/pro-features";
import { PRICING } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";

export default function PricingCards({
  defaultPlan = "lifetime",
  compact = false,
  onSkip,
  skipLabel,
  pricing: pricingProp,
  tier: tierProp,
  primaryPlan,
}) {
  const t = useTranslations("pages.pricingCards");
  const { data: session } = useSession();
  // Adds /fr etc. to /auth. Checkout and dashboard URLs have no locale prefix.
  const localeRouter = useLocaleRouter();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);
  const gate = useWebviewGate();
  // Server-rendered pages pass the regional pricing in. Without it, fetch it.
  const [fetched, setFetched] = useState(null);
  const pricing = pricingProp ?? fetched?.pricing ?? PRICING;
  const tier = tierProp ?? pricingProp?.tier ?? fetched?.tier ?? "standard";

  useEffect(() => {
    if (pricingProp) {
      trackEvent("pricing_tier_viewed", {
        tier: tierProp ?? pricingProp.tier,
      });
      return;
    }

    fetch("/api/pricing-tier")
      .then((res) => res.json())
      .then((data) => {
        if (data?.pricing) {
          setFetched({ pricing: data.pricing, tier: data.tier ?? "standard" });
          trackEvent("pricing_tier_viewed", {
            tier: data.tier,
            country: data.country,
          });
        }
      })
      .catch(() => {});
  }, [pricingProp, tierProp]);

  // A full page load, not router.push. The route redirects to Polar after a
  // slow API call, and router.push gave no feedback, so people clicked again
  // and restarted it. The button stays disabled until the page unloads.
  const [pendingPlan, setPendingPlan] = useState(null);

  useEffect(() => {
    // Back from Polar restores this page from bfcache with the button disabled.
    const reset = (e) => e.persisted && setPendingPlan(null);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const handleCheckout = (plan) => {
    if (pendingPlan) return;
    trackEvent("checkout_start", { tier, plan, source: "pricing_cards" });
    if (session?.user) {
      setPendingPlan(plan);
      window.location.assign(`/api/polar/checkout?plan=${plan}`);
    } else {
      setPendingCheckout(true, plan);
      if (gate?.interceptAuth(null, "/auth")) return;
      localeRouter.push("/auth");
    }
  };

  // Callers can pick which plan leads. Lifetime is the default everywhere.
  const highlightId = primaryPlan ?? defaultPlan;
  const ordered =
    highlightId === "month"
      ? [pricing.month, pricing.lifetime]
      : [pricing.lifetime, pricing.month];
  const plans = ordered.map((plan) => ({
    ...plan,
    label: t(`plans.${plan.id}.label`),
    subline: t(`plans.${plan.id}.subline`),
    suffix: t(`plans.${plan.id}.suffix`),
    cta: t(`plans.${plan.id}.cta`),
    highlight: plan.id === highlightId,
    badge:
      plan.id === highlightId
        ? plan.id === "month"
          ? t("badges.startHere")
          : t("badges.bestValue")
        : null,
  }));

  // PRO_FEATURES stays the source of truth. Fall back to it if the translated
  // list ever gets out of step with it.
  const translatedFeatures = t.raw("features");
  const features =
    Array.isArray(translatedFeatures) &&
    translatedFeatures.length === PRO_FEATURES.length
      ? translatedFeatures
      : PRO_FEATURES;

  return (
    <div className="flex w-full flex-col gap-6">
      {pricing.regionalNote ? (
        <p className="text-xs font-semibold text-[var(--landing-ink-soft)]">
          {t("regionalNote")}
        </p>
      ) : null}

      <div
        className={`grid w-full gap-4 ${
          compact
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {plans.map((plan) => {
          const highlighted = plan.highlight;
          return (
            <div
              key={plan.id}
              className={`bezel flex flex-col ${highlighted ? "bezel-accent" : ""}`}
            >
              <div className="bezel-inner flex flex-1 flex-col gap-8 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-outfit text-base font-semibold text-[var(--landing-ink)]">
                      {plan.label}
                    </span>
                    <span className="text-sm text-[var(--landing-ink-soft)]">
                      {plan.subline}
                    </span>
                  </div>
                  {plan.badge ? <span className="tag-accent shrink-0">{plan.badge}</span> : null}
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="font-outfit text-5xl font-semibold leading-none tracking-tight tabular-nums text-[var(--landing-ink)]">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-[var(--landing-ink-soft)]">
                    {plan.suffix}
                  </span>
                </div>
              </div>

              <div className="p-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={Boolean(pendingPlan)}
                  aria-busy={pendingPlan === plan.id}
                  className={`w-full cursor-pointer rounded-xl font-outfit text-sm disabled:cursor-wait disabled:opacity-60 ${
                    highlighted ? "landing-primary-btn" : "landing-secondary-btn"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="bezel w-full">
          <h3 className="flex items-center gap-1.5 px-4 pb-3 pt-2.5 font-outfit text-sm font-semibold text-[var(--landing-ink)]">
            {t("includesTitle")}
            <span className="text-[var(--landing-accent)]">[{features.length}]</span>
          </h3>
          <ul className="bezel-inner grid gap-x-8 gap-y-3 p-6 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-[var(--landing-ink-soft)]"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--landing-accent-soft)]">
                  <CheckIcon
                    size={10}
                    weight="bold"
                    className="text-[var(--landing-accent)]"
                    aria-hidden="true"
                  />
                </span>
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
          {skipLabel ?? t("continueFree")}
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
