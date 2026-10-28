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
  // One CV and its cover letter, bought from the paywall on that CV. Not sold
  // on /pricing: it only makes sense with a CV in hand.
  single: {
    id: "single",
    label: "This CV",
    suffix: " once",
    subline: "This CV and cover letter only.",
    cta: "Unlock this CV",
  },
};

const TIER_AMOUNTS = {
  [PRICING_TIERS.standard]: { month: "9.99", lifetime: "29.99", single: "4.99" },
  [PRICING_TIERS.africa]: { month: "6.99", lifetime: "16.99", single: "2.99" },
};

function buildPricing(tier) {
  const amounts = TIER_AMOUNTS[tier] ?? TIER_AMOUNTS[PRICING_TIERS.standard];
  return {
    tier,
    month: { ...PLAN_META.month, price: amounts.month },
    lifetime: { ...PLAN_META.lifetime, price: amounts.lifetime },
    single: { ...PLAN_META.single, price: amounts.single },
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

// Week of Oct 27 2026: monthly is hidden so the paywall tests one-time
// payments only (this CV, or lifetime). Checkout still accepts "month" for
// links already sent. Flip back to true to show it again.
// ponytail: a constant, not a feature flag. Move to a PostHog flag for the
// A/B test.
export const SHOW_MONTHLY = false;

// Lifetime spots sold at the current price, counted by /api/lifetime-spots.
// When the line reaches 0 it hides: raise the Polar lifetime prices, then
// move LIFETIME_SPOTS_SINCE to that day to start a new batch.
export const LIFETIME_SPOTS = 20;
// Every lifetime sale so far counts: 6 sold by Oct 28, 2026.
export const LIFETIME_SPOTS_SINCE = new Date("2026-01-01T00:00:00Z");

export const CHECKOUT_PLANS =["month", "lifetime", "single"];

export function getPolarProductId(tier, plan) {
  const africa = (tier ?? PRICING_TIERS.standard) === PRICING_TIERS.africa;
  const ids = {
    month: africa ? process.env.POLAR_PRODUCT_ID_MONTH_AFRICA : process.env.POLAR_PRODUCT_ID_MONTH,
    lifetime: africa ? process.env.POLAR_PRODUCT_ID_LIFE_AFRICA : process.env.POLAR_PRODUCT_ID_LIFE,
    single: africa ? process.env.POLAR_PRODUCT_ID_SINGLE_AFRICA : process.env.POLAR_PRODUCT_ID_SINGLE,
  };
  return ids[plan] ?? ids.lifetime;
}
