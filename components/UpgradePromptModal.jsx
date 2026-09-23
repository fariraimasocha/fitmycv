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
    description: (pricing) =>
      `You already tailored this one. Start a month for $${pricing.month.price} to download PDFs and tailor as many as you need, plus the job board and apply tools.`,
  },
  download: {
    title: "Download your tailored CV",
    description: (pricing) =>
      `Your rewrite is ready. Start a month for $${pricing.month.price} to download the PDF and keep tailoring this month.`,
  },
  pre_tailor: {
    title: "Unlock your tailored documents",
    description: (pricing) =>
      `Start a month for $${pricing.month.price} to generate your complete tailored CV and cover letter.`,
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
      trackEvent("paywall_view", { context, primary_plan: "month" });
    }
  }, [open, context]);

  const copy = COPY[context] ?? COPY.default;
  const description =
    typeof copy.description === "function"
      ? copy.description(pricing)
      : copy.description;

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
      router.push("/auth");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="rounded-md border-[var(--landing-line)] bg-[var(--landing-surface)] sm:max-w-lg">
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
            Start a month for ${pricing.month.price}
          </button>
          <button
            type="button"
            onClick={() => startCheckout("lifetime", "paywall_secondary")}
            className="dashboard-secondary-btn w-full"
          >
            Get lifetime for ${pricing.lifetime.price}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="dashboard-secondary-btn w-full"
          >
            Maybe later
          </button>
          <Button
            variant="link"
            onClick={() => {
              onClose();
              router.push("/dashboard/upgrade");
            }}
            className="w-full text-[var(--landing-ink-soft)]"
          >
            See everything in Pro
            <ArrowRightIcon className="ml-1 size-4" aria-hidden="true" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
