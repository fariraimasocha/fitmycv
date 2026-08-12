export const PRICING = {
  month: {
    id: "month",
    label: "Monthly",
    price: "6.99",
    suffix: "/month",
    subline: "Cancel anytime. No contracts.",
    cta: "Subscribe",
  },
  lifetime: {
    id: "lifetime",
    label: "Lifetime",
    price: "14.99",
    suffix: " once",
    subline: "Pay once, keep it forever.",
    cta: "Get Lifetime",
    badge: "Best value",
    highlight: true,
  },
};

export const LIFETIME_SAVINGS_COPY =
  "Less than 3 months of monthly — yours for the full job search.";

export function getPolarProductId(plan) {
  if (plan === "lifetime") {
    return process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_LIFE;
  }
  if (plan === "year") {
    return process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_YEAR;
  }
  return process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID_MONTH;
}
