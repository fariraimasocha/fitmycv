"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRouter as useLocaleRouter } from "@/i18n/navigation";
import { CrownIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/stores/checkout-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PricingCards from "@/components/pricing/PricingCards";
import { useClientPricing } from "@/components/pricing/PricingCards";
import { trackEvent } from "@/lib/analytics";

// Keys in messages/<locale>/pages.json under upgradeModal.
const COPY_KEYS = {
  default: "default",
  download: "download",
  pre_tailor: "preTailor",
};

export default function UpgradePromptModal({
  open,
  onClose,
  context = "default",
}) {
  const t = useTranslations("pages.upgradeModal");
  const router = useRouter();
  // Adds /fr etc. to /auth. Checkout and dashboard URLs have no locale prefix.
  const localeRouter = useLocaleRouter();
  const { data: session } = useSession();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);
  const pricing = useClientPricing();

  useEffect(() => {
    if (open) {
      trackEvent("paywall_view", { context, primary_plan: "month" });
    }
  }, [open, context]);

  const copyKey = COPY_KEYS[context] ?? COPY_KEYS.default;
  const title = t(`${copyKey}.title`);
  const description = t(`${copyKey}.description`, {
    price: pricing.month.price,
  });

  const startCheckout = (plan, source) => {
    trackEvent("checkout_start", {
      tier: pricing.tier,
      plan,
      source,
    });
    if (session?.user) {
      router.push(`/api/polar/checkout?plan=${plan}`);
    } else {
      setPendingCheckout(true, plan);
      localeRouter.push("/auth");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="rounded-md border-[var(--landing-line)] bg-[var(--landing-surface)] sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <CrownIcon className="size-5 text-[var(--landing-accent)]" />
            <DialogTitle className="text-[var(--landing-ink)]">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[var(--landing-ink-soft)]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <PricingCards
          compact
          primaryPlan="month"
          pricing={pricing}
          tier={pricing.tier}
        />

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => startCheckout("month", "paywall_primary")}
            className="dashboard-primary-btn w-full"
          >
            {t("startMonth", { price: pricing.month.price })}
          </button>
          <button
            type="button"
            onClick={() => startCheckout("lifetime", "paywall_secondary")}
            className="dashboard-secondary-btn w-full"
          >
            {t("getLifetime", { price: pricing.lifetime.price })}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="dashboard-secondary-btn w-full"
          >
            {t("maybeLater")}
          </button>
          <Button
            variant="link"
            onClick={() => {
              onClose();
              router.push("/dashboard/upgrade");
            }}
            className="w-full text-[var(--landing-ink-soft)]"
          >
            {t("seeEverything")}
            <ArrowRightIcon className="ml-1 size-4" aria-hidden="true" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
