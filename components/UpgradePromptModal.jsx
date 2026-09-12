"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CrownIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
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

const COPY = {
  default: {
    title: "Unlock your tailored CV",
    description:
      "Your documents are ready. Upgrade to download PDFs and unlock the full toolkit.",
  },
  post_tailor: {
    title: "Your CV is ready",
    description: (price) =>
      `Download your tailored CV and cover letter as PDF for $${price} once.`,
  },
};

export default function UpgradePromptModal({
  open,
  onClose,
  context = "default",
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);
  const pricing = useClientPricing();

  useEffect(() => {
    if (open) {
      trackEvent("paywall_view", { context });
    }
  }, [open, context]);

  const copy = COPY[context] ?? COPY.default;
  const description =
    typeof copy.description === "function"
      ? copy.description(pricing.lifetime.price)
      : copy.description;

  const handleLifetime = () => {
    trackEvent("checkout_start", { tier: pricing.tier, plan: "lifetime" });
    if (session?.user) {
      router.push("/api/polar/checkout?plan=lifetime");
    } else {
      setPendingCheckout(true, "lifetime");
      router.push("/auth");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-[var(--landing-line)] bg-[var(--landing-surface)] sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <CrownIcon className="size-5 text-[var(--landing-accent)]" />
            <DialogTitle className="text-[var(--landing-ink)]">
              {copy.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[var(--landing-ink-soft)]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <PricingCards compact pricing={pricing} tier={pricing.tier} />

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleLifetime}
            className="w-full rounded-md bg-foreground font-outfit font-semibold text-background hover:opacity-90"
          >
            Get Lifetime · ${pricing.lifetime.price}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
          >
            Maybe later
          </Button>
          <Button
            variant="link"
            onClick={() => {
              onClose();
              router.push("/dashboard/upgrade");
            }}
            className="w-full text-[var(--landing-ink-soft)]"
          >
            View all features
            <ArrowRightIcon className="ml-1 size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
