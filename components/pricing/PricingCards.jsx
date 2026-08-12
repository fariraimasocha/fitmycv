"use client";

import { CheckIcon, CrownIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";
import { PRO_FEATURES } from "@/lib/pro-features";
import { PRICING, LIFETIME_SAVINGS_COPY } from "@/lib/pricing";

export default function PricingCards({
  defaultPlan = "lifetime",
  compact = false,
  onSkip,
  skipLabel = "Continue free",
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);

  const handleCheckout = (plan) => {
    if (session?.user) {
      router.push(`/api/polar/checkout?plan=${plan}`);
    } else {
      setPendingCheckout(true, plan);
      router.push("/auth");
    }
  };

  const plans = [PRICING.lifetime, PRICING.month];

  return (
    <div className={`flex w-full flex-col gap-6 ${compact ? "" : "items-center"}`}>
      {!compact && (
        <p className="text-center text-sm text-[var(--landing-ink-soft)] max-w-md">
          {LIFETIME_SAVINGS_COPY}
        </p>
      )}

      <div
        className={`grid w-full gap-4 ${
          compact ? "grid-cols-1 sm:grid-cols-2" : "max-w-3xl grid-cols-1 md:grid-cols-2"
        }`}
      >
        {plans.map((plan) => {
          const highlighted = plan.highlight;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col gap-5 rounded-2xl border p-6 sm:p-7 ${
                highlighted
                  ? "border-[var(--landing-accent)] bg-white shadow-[0_0_0_1px_oklch(0.55_0.14_45_/_0.15),0_20px_40px_oklch(0.18_0.02_260_/_0.06)]"
                  : "border-[var(--landing-line)] bg-[var(--landing-surface)]"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[var(--landing-accent)] bg-[var(--landing-accent)] px-3 py-1 text-xs font-bold text-white">
                  <CrownIcon size={12} weight="fill" aria-hidden="true" />
                  {plan.badge}
                </span>
              )}

              <div className="flex flex-col gap-1">
                <span className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                  Premium {plan.label}
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

              {!compact && (
                <ul className="flex flex-col gap-2.5">
                  {PRO_FEATURES.slice(0, 4).map((feature) => (
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
              )}

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

      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="mx-auto text-sm font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
