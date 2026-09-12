import { cookies, headers } from "next/headers";
import { getPricingForTier } from "@/lib/pricing";
import {
  getPricingTier,
  resolveCountryFromHeaders,
} from "@/lib/pricing-region";

export async function getServerPricing() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const countryFromHeader = resolveCountryFromHeaders(headerStore);
  const countryFromCookie = cookieStore.get("visitor_country")?.value?.toLowerCase();
  const country = countryFromHeader ?? countryFromCookie ?? null;
  const tierFromCookie = cookieStore.get("pricing_tier")?.value;
  const tier = country
    ? getPricingTier(country)
    : tierFromCookie || getPricingTier(null);

  const pricing = getPricingForTier(tier);
  return {
    tier: pricing.tier,
    country,
    pricing,
    month: pricing.month,
    lifetime: pricing.lifetime,
    regionalNote: pricing.regionalNote,
  };
}
