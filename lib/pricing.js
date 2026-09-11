export const PRICING = {
  month: {
    id: "month",
    label: "Monthly",
    price: "9.99",
    suffix: "/month",
    subline: "Cancel anytime. No contracts.",
    cta: "Subscribe",
  },
  lifetime: {
    id: "lifetime",
    label: "Lifetime",
    price: "29.99",
    suffix: " once",
    subline: "Pay once, keep it forever.",
    cta: "Get Lifetime",
    badge: "Best value",
    highlight: true,
  },
};

export const LIFETIME_SAVINGS_COPY =
  "About three months of monthly, and yours for every search after.";

export function getPolarProductId(plan) {
  if (plan === "lifetime") {
    return process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_LIFE;
  }
  return process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_MONTH;
}
