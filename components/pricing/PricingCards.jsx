"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const handleCheckout = (plan) => {
    trackEvent("checkout_start", { tier, plan, source: "pricing_cards" });
    if (session?.user) {
      router.push(`/api/polar/checkout?plan=${plan}`);
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
    <div className={`flex w-full flex-col gap-6 ${compact ? "" : "items-center"}`}>
      {pricing.regionalNote ? (
        <p className="text-center text-xs font-semibold text-[var(--landing-ink-soft)]">
          {t("regionalNote")}
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
            {t("includesTitle")}
          </h3>
          <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {features.map((feature) => (
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
