"use client";

import { CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { copyText } from "@/lib/webview";
import { BLACK_FRIDAY_CODE, BLACK_FRIDAY_PERCENT } from "@/lib/black-friday";

export default function BlackFridayBanner() {
  const handleClaimClick = () => {
    trackEvent("black_friday_banner_click", { code: BLACK_FRIDAY_CODE });
  };

  const handleCopy = async () => {
    try {
      await copyText(BLACK_FRIDAY_CODE);
      toast.success("Discount code copied. Paste it at checkout.");
      trackEvent("black_friday_code_copied", {
        code: BLACK_FRIDAY_CODE,
        source: "banner",
      });
    } catch {
      toast.error("Could not copy. Type FRIDAY40 at checkout.");
    }
  };

  return (
    <div className="bg-black text-center text-white">
      <p className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-3 py-2 text-sm leading-snug sm:text-[0.9375rem]">
        <span>
          Black Friday: {BLACK_FRIDAY_PERCENT}% off Lifetime. Code
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-sm font-semibold tracking-wide underline decoration-white/40 underline-offset-2 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={`Copy discount code ${BLACK_FRIDAY_CODE}`}
        >
          {BLACK_FRIDAY_CODE}
          <CopyIcon className="size-3.5" aria-hidden="true" />
        </button>
        <span>.</span>
        <Link
          href="/pricing"
          onClick={handleClaimClick}
          className="font-semibold text-[var(--landing-accent)] underline underline-offset-2 hover:text-[var(--landing-accent-dark)]"
        >
          Claim the deal →
        </Link>
      </p>
    </div>
  );
}
