"use client";

import { useRouter } from "next/navigation";
import { CrownIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { PRICING } from "@/lib/pricing";
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

export default function UpgradePromptModal({ open, onClose }) {
  const router = useRouter();
  const { data: session } = useSession();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);

  const handleLifetime = () => {
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
              Unlock your tailored CV
            </DialogTitle>
          </div>
          <DialogDescription className="text-[var(--landing-ink-soft)]">
            Your documents are ready. Upgrade to download PDFs and unlock the
            full toolkit.
          </DialogDescription>
        </DialogHeader>

        <PricingCards compact />

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleLifetime}
            className="w-full rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90"
          >
            Get Lifetime · ${PRICING.lifetime.price}
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
