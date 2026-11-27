"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter as useLocaleRouter } from "@/i18n/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";
import { PRO_FEATURES } from "@/lib/pro-features";
import { PRICING, SHOW_MONTHLY } from "@/lib/pricing";
import LifetimeSpots from "@/components/pricing/LifetimeSpots";
import EcocashCheckout from "@/components/pricing/EcocashCheckout";
import { trackEvent } from "@/lib/analytics";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";

export default function PricingCards({
  defaultPlan = "lifetime",
  compact = false,
  onSkip,
  skipLabel,
  pricing: pricingProp,
  tier: tierProp,
  country: countryProp,
  primaryPlan,
  showMonthly = SHOW_MONTHLY,
}) {
  const t = useTranslations("pages.pricingCards");
  const tModal = useTranslations("pages.upgradeModal");
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
    if (pricingProp) return;
    fetch("/api/pricing-tier")
      .then((res) => res.json())
      .then((data) => {
        if (data?.pricing) {
          setFetched({ pricing: data.pricing, tier: data.tier ?? "standard", country: data.country });
        }
      })
      .catch(() => {});
  }, [pricingProp]);

  // Sent once the cards are on screen, not on mount. The home page mounts
  // them below the fold, so a mount event fired on every visit and said
  // nothing about who looked at the prices.
  const rootRef = useRef(null);
  const tierReady = Boolean(pricingProp || fetched);
  const country = countryProp ?? fetched?.country;
  // Zimbabwe pays with EcoCash first. The card link brings Polar back.
  const [cardInstead, setCardInstead] = useState(false);
  const ecocash = country === "zw" && !cardInstead;
  useEffect(() => {
    const el = rootRef.current;
    if (!tierReady || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        trackEvent("pricing_tier_viewed", { tier, ...(country ? { country } : {}) });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [tierReady, tier, country]);

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
      window.location.assign(`/api/polar/checkout?plan=${plan}&source=pricing_cards`);
    } else {
      setPendingCheckout(true, plan);
      if (gate?.interceptAuth(null, "/auth")) return;
      localeRouter.push("/auth");
    }
  };

  // Callers can pick which plan leads. Lifetime is the default everywhere.
  const highlightId = primaryPlan ?? defaultPlan;
  // With lifetime leading, Monthly is a line in the Lifetime card, not a
  // second card of equal weight.
  const monthlyAsLine = showMonthly && highlightId === "lifetime";
  const ordered = !showMonthly || monthlyAsLine
    ? [pricing.lifetime]
    : highlightId === "month"
      ? [pricing.month, pricing.lifetime]
      : [pricing.lifetime, pricing.month];
  const plans = ordered.map((plan) => ({
    ...plan,
    label: t(`plans.${plan.id}.label`),
    subline: t(`plans.${plan.id}.subline`),
    suffix: t(`plans.${plan.id}.suffix`),
    cta: t(`plans.${plan.id}.cta`),
    highlight: plan.id === highlightId,
    // A badge only means something next to another plan.
    badge:
      ordered.length > 1 && plan.id === highlightId
        ? plan.id === "month"
          ? t("badges.startHere")
          : t("badges.bestValue")
        : null,
  }));

  const secondary = monthlyAsLine
    ? {
        ...pricing.month,
        label: t("plans.month.label"),
        subline: t("plans.month.subline"),
        suffix: t("plans.month.suffix"),
        cta: t("plans.month.cta"),
      }
    : null;

  // PRO_FEATURES stays the source of truth. Fall back to it if the translated
  // list ever gets out of step with it.
  const translatedFeatures = t.raw("features");
  const features =
    Array.isArray(translatedFeatures) &&
    translatedFeatures.length === PRO_FEATURES.length
      ? translatedFeatures
      : PRO_FEATURES;

  const checkIcon = (
    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--landing-accent-soft)]">
      <CheckIcon size={10} weight="bold" className="text-[var(--landing-accent)]" aria-hidden="true" />
    </span>
  );

  // Lifetime leads and Monthly sits one line under its button: the plan
  // shown first is the one most people take. Features sit beside the card on
  // desktop so the card stays short, and below it on a phone.
  if (plans.length === 1 && !compact) {
    const plan = plans[0];
    return (
      <div ref={rootRef} className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="grid w-full items-start gap-6 md:grid-cols-2">
          <div className="bezel bezel-accent w-full">
            <div className="bezel-inner flex flex-col gap-6 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-outfit text-base font-semibold text-[var(--landing-ink)]">{plan.label}</span>
                  <span className="text-sm text-[var(--landing-ink-soft)]">{plan.subline}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="font-outfit text-5xl font-semibold leading-none tracking-tight tabular-nums text-[var(--landing-ink)]">
                  ${plan.price}
                </span>
                {secondary ? null : <span className="text-sm text-[var(--landing-ink-soft)]">{plan.suffix}</span>}
                <ListPrice plan={plan} />
              </div>
              {secondary ? (
                <p className="-mt-3 text-sm text-[var(--landing-ink-soft)]">
                  {t("lifetimeVsMonthly", {
                    months: Math.round(Number(plan.price) / Number(secondary.price)),
                  })}
                </p>
              ) : null}
              {plan.id === "lifetime" ? <LifetimeSpots /> : null}
              {ecocash ? (
                <EcocashPay plan={plan} t={t} onCard={() => setCardInstead(true)} />
              ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={Boolean(pendingPlan)}
                  aria-busy={pendingPlan === plan.id}
                  className="landing-primary-btn w-full cursor-pointer rounded-xl font-outfit text-sm disabled:cursor-wait disabled:opacity-60"
                >
                  {pendingPlan === plan.id ? tModal("opening") : plan.cta}
                </button>
                <p className="text-center text-xs text-[var(--landing-ink-soft)]">{t("secureCheckout")}</p>
              </div>
              )}
              {secondary ? (
                <MonthlyLine
                  plan={secondary}
                  onClick={() => handleCheckout(secondary.id)}
                  pending={pendingPlan === secondary.id}
                  disabled={Boolean(pendingPlan)}
                  openingLabel={tModal("opening")}
                  className="pt-5"
                />
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-4 px-2 pt-2 md:pt-6">
            <h3 className="flex items-center gap-1.5 font-outfit text-sm font-semibold text-[var(--landing-ink)]">
              {secondary ? t("includesTitle") : t("includesTitleOne")}
              <span className="text-[var(--landing-accent)]">[{features.length}]</span>
            </h3>
            <ul className="flex flex-col gap-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-[var(--landing-ink-soft)]">
                  {checkIcon}
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="mx-auto text-sm font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
          >
            {skipLabel ?? t("continueFree")}
          </button>
        )}
      </div>
    );
  }

  // One plan inside a page that lists the features itself (/dashboard/upgrade).
  if (plans.length === 1) {
    return (
      <OnePlanRow
        plan={plans[0]}
        secondary={secondary}
        compareLabel={secondary ? t("lifetimeVsMonthly", { months: Math.round(Number(plans[0].price) / Number(secondary.price)) }) : null}
        openingLabel={tModal("opening")}
        rootRef={rootRef}
        pendingPlan={pendingPlan}
        onCheckout={handleCheckout}
        secureLabel={t("secureCheckout")}
        ecocash={ecocash ? <EcocashPay plan={plans[0]} t={t} onCard={() => setCardInstead(true)} /> : null}
      />
    );
  }

  return (
    <div ref={rootRef} className={`flex w-full flex-col gap-6 ${compact ? "" : "mx-auto max-w-3xl"}`}>
      <div
        className={`grid w-full gap-4 ${
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-2"
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

                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="font-outfit text-5xl font-semibold leading-none tracking-tight tabular-nums text-[var(--landing-ink)]">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-[var(--landing-ink-soft)]">
                    {plan.suffix}
                  </span>
                  <ListPrice plan={plan} />
                </div>
                {plan.id === "lifetime" ? <LifetimeSpots className="mt-2" /> : null}
              </div>

              <div className="p-1.5 pt-2">
                {ecocash && plan.id === "lifetime" ? (
                  <EcocashPay plan={plan} t={t} onCard={() => setCardInstead(true)} />
                ) : (
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
                )}
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
                {checkIcon}
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

// The standard price struck through next to a regional price, with the real
// saving. Renders nothing on the standard tier.
function ListPrice({ plan }) {
  const t = useTranslations("pages.pricingCards");
  if (!plan.listPrice) return null;
  return (
    <span className="ml-1 flex items-baseline gap-2 self-center">
      <s className="text-lg tabular-nums text-[var(--landing-ink-soft)]">
        <span className="sr-only">{t("standardPrice")} </span>${plan.listPrice}
      </s>
      <span className="tag-accent">{t("regionalOff", { percent: plan.percentOff })}</span>
    </span>
  );
}

// One full-width card: price on the left, button on the right, so it lines up
// with the page header and the panel below. Stacks on a phone.
function OnePlanRow({ plan, secondary, compareLabel, openingLabel, rootRef, pendingPlan, onCheckout, secureLabel, ecocash }) {
  return (
    <div ref={rootRef} className="bezel bezel-accent w-full">
      <div className="bezel-inner flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-outfit text-base font-semibold text-[var(--landing-ink)]">{plan.label}</span>
            <span className="text-sm text-[var(--landing-ink-soft)]">{plan.subline}</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="font-outfit text-5xl font-semibold leading-none tracking-tight tabular-nums text-[var(--landing-ink)]">
              ${plan.price}
            </span>
            {secondary ? null : <span className="text-sm text-[var(--landing-ink-soft)]">{plan.suffix}</span>}
            <ListPrice plan={plan} />
          </div>
          {compareLabel ? <p className="-mt-2 text-sm text-[var(--landing-ink-soft)]">{compareLabel}</p> : null}
          {plan.id === "lifetime" ? <LifetimeSpots /> : null}
        </div>
        <div className="flex flex-col gap-4 sm:w-72 sm:shrink-0">
        {ecocash ? ecocash : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onCheckout(plan.id)}
            disabled={Boolean(pendingPlan)}
            aria-busy={pendingPlan === plan.id}
            className="landing-primary-btn w-full cursor-pointer rounded-xl font-outfit text-sm disabled:cursor-wait disabled:opacity-60"
          >
            {pendingPlan === plan.id ? openingLabel : plan.cta}
          </button>
          <p className="text-center text-xs text-[var(--landing-ink-soft)]">{secureLabel}</p>
        </div>
        )}
        {secondary ? (
          <MonthlyLine
            plan={secondary}
            onClick={() => onCheckout(secondary.id)}
            pending={pendingPlan === secondary.id}
            disabled={Boolean(pendingPlan)}
            openingLabel={openingLabel}
            className="pt-4"
          />
        ) : null}
        </div>
      </div>
    </div>
  );
}

// Monthly as one quiet line under the Lifetime button: price, "cancel
// anytime", and a small Subscribe. Shared by /pricing, /dashboard/upgrade
// and the paywall modal so every screen makes the same offer.
export function MonthlyLine({ plan, onClick, pending, disabled, openingLabel, className = "", buttonClassName = "landing-secondary-btn" }) {
  return (
    <div className={`flex items-center justify-between gap-4 border-t border-[var(--landing-line)] ${className}`}>
      <div className="flex flex-col gap-0.5 text-left">
        <span className="text-sm font-semibold text-[var(--landing-ink)]">
          <span className="tabular-nums">${plan.price}</span>
          <span className="font-normal text-[var(--landing-ink-soft)]">{plan.suffix}</span>
        </span>
        <span className="text-xs text-[var(--landing-ink-soft)]">{plan.subline}</span>
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-busy={pending}
        className={`${buttonClassName} shrink-0 cursor-pointer rounded-xl px-4 font-outfit text-sm disabled:cursor-wait disabled:opacity-60`}
      >
        {pending ? openingLabel : plan.cta}
      </button>
    </div>
  );
}

// The lifetime card for Zimbabwe: EcoCash first, card one tap away.
function EcocashPay({ plan, t, onCard }) {
  return (
    <div className="flex flex-col gap-2">
      <EcocashCheckout
        options={[{ plan: plan.id, price: plan.price, label: t("ecocash.pay", { price: plan.price }) }]}
        source="pricing_cards"
      />
      <button
        type="button"
        onClick={onCard}
        className="mx-auto text-xs font-medium text-[var(--landing-ink-soft)] underline underline-offset-4 hover:text-[var(--landing-ink)]"
      >
        {t("ecocash.cardInstead")}
      </button>
    </div>
  );
}

export function useClientPricing(initialPricing) {
  return useClientPricingWithCountry(initialPricing).pricing;
}

// Same fetch, plus the visitor's country ("zw" turns on EcoCash).
export function useClientPricingWithCountry(initialPricing) {
  const [state, setState] = useState({ pricing: initialPricing ?? PRICING, country: null });

  useEffect(() => {
    fetch("/api/pricing-tier")
      .then((res) => res.json())
      .then((data) => {
        if (data?.pricing) {
          setState({ pricing: initialPricing ?? data.pricing, country: data.country ?? null });
        }
      })
      .catch(() => {});
  }, [initialPricing]);

  return state;
}
