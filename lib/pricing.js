import { PRICING_TIERS, getPricingTier } from "@/lib/pricing-region";

const PLAN_META = {
  month: {
    id: "month",
    label: "Monthly",
    suffix: "/month",
    subline: "Cancel anytime. No contracts.",
    cta: "Subscribe",
  },
  lifetime: {
    id: "lifetime",
    label: "Lifetime",
    suffix: " once",
    subline: "Pay once, keep it forever.",
    cta: "Get Lifetime",
    badge: "Best value",
    highlight: true,
  },
};

const TIER_AMOUNTS = {
  [PRICING_TIERS.standard]: { month: "9.99", lifetime: "29.99" },
  [PRICING_TIERS.africa]: { month: "6.99", lifetime: "16.99" },
};

function buildPricing(tier) {
  const amounts = TIER_AMOUNTS[tier] ?? TIER_AMOUNTS[PRICING_TIERS.standard];
  return {
    tier,
    month: { ...PLAN_META.month, price: amounts.month },
    lifetime: { ...PLAN_META.lifetime, price: amounts.lifetime },
    regionalNote:
      tier === PRICING_TIERS.africa ? "Pricing for your region" : null,
  };
}

/** Default export for legacy imports; standard tier. */
export const PRICING = buildPricing(PRICING_TIERS.standard);

export function getPricingForTier(tier = PRICING_TIERS.standard) {
  return buildPricing(tier);
}

export function getPricingForCountry(countryCode) {
  return getPricingForTier(getPricingTier(countryCode));
}

export function getLifetimeSavingsCopy(tier = PRICING_TIERS.standard) {
  return "About three months of monthly, and yours for every search after.";
}

/** @deprecated use getLifetimeSavingsCopy */
export const LIFETIME_SAVINGS_COPY = getLifetimeSavingsCopy();

export function getPolarProductId(tier, plan) {
  const resolvedTier = tier ?? PRICING_TIERS.standard;
  const isLifetime = plan === "lifetime";

  if (resolvedTier === PRICING_TIERS.africa) {
    return isLifetime
      ? process.env.POLAR_PRODUCT_ID_LIFE_AFRICA
      : process.env.POLAR_PRODUCT_ID_MONTH_AFRICA;
  }

  return isLifetime
    ? process.env.POLAR_PRODUCT_ID_LIFE
    : process.env.POLAR_PRODUCT_ID_MONTH;
}
