// Top African traffic countries from Umami (Sep 2026). Expand here only.
export const PPP_COUNTRY_CODES = new Set(["za", "zw", "ke", "ng", "ug"]);

export const PRICING_TIERS = {
  standard: "standard",
  africa: "africa",
};

const COUNTRY_LABELS = {
  za: "South Africa",
  zw: "Zimbabwe",
  ke: "Kenya",
  ng: "Nigeria",
  ug: "Uganda",
};

export function getCountryLabel(countryCode) {
  if (!countryCode) return null;
  return COUNTRY_LABELS[countryCode.toLowerCase()] ?? null;
}

export function countryCodeToFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return null;
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(
    ...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
  );
}

export function getPricingTier(countryCode) {
  const override = process.env.PRICING_TIER_OVERRIDE?.toLowerCase();
  if (override === PRICING_TIERS.africa || override === PRICING_TIERS.standard) {
    return override;
  }

  if (!countryCode) return PRICING_TIERS.standard;
  return PPP_COUNTRY_CODES.has(countryCode.toLowerCase())
    ? PRICING_TIERS.africa
    : PRICING_TIERS.standard;
}

export function resolveCountryFromHeaders(headers) {
  const fromVercel = headers.get("x-vercel-ip-country");
  if (fromVercel) return fromVercel.toLowerCase();

  const fromCloudflare = headers.get("cf-ipcountry");
  if (fromCloudflare && fromCloudflare !== "XX") {
    return fromCloudflare.toLowerCase();
  }

  // Local dev has no geo headers. Set DEV_VISITOR_COUNTRY=zw in .env
  // to mirror production regional pricing while testing from localhost.
  if (process.env.NODE_ENV === "development") {
    const devCountry = process.env.DEV_VISITOR_COUNTRY?.trim().toLowerCase();
    if (devCountry?.length === 2) return devCountry;
  }

  return null;
}

export function resolveCustomerIp(headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }
  return headers.get("x-real-ip") || null;
}
