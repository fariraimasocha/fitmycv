"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CopyIcon, XIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter as useLocaleRouter } from "@/i18n/navigation";
import BrandLogo from "@/components/BrandLogo";
import { useClientPricingWithCountry } from "@/components/pricing/PricingCards";
import { useBlackFridayStore } from "@/stores/black-friday-store";
import { trackEvent } from "@/lib/analytics";
import { copyText } from "@/lib/webview";
import {
  applyPercentOff,
  BLACK_FRIDAY_CODE,
  BLACK_FRIDAY_PERCENT,
  blackFridayCountdownParts,
  isBlackFridayActive,
  msUntilBlackFridayEnds,
} from "@/lib/black-friday";

function pad(n) {
  return String(n).padStart(2, "0");
}

function Countdown() {
  const [ms, setMs] = useState(() => msUntilBlackFridayEnds());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isBlackFridayActive()) return undefined;
    const tick = () => setMs(msUntilBlackFridayEnds());
    tick();
    const id = setInterval(tick, reduceMotion ? 1000 : 250);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const { days, hours, minutes, seconds, ended } = blackFridayCountdownParts(ms);
  if (ended) return null;

  const cells = [
    { label: "Days", value: pad(days) },
    { label: "Hrs", value: pad(hours) },
    { label: "Min", value: pad(minutes) },
    { label: "Sec", value: pad(seconds) },
  ];

  return (
    <div className="grid grid-cols-4 gap-2" aria-live="polite" aria-atomic="true">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="rounded-lg border border-white/20 px-1 py-2 text-center"
        >
          <div className="font-outfit text-xl font-bold tabular-nums text-white sm:text-2xl">
            {cell.value}
          </div>
          <div className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--landing-accent)]">
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlackFridayPopup() {
  const open = useBlackFridayStore((s) => s.popupOpen);
  const closePopup = useBlackFridayStore((s) => s.closePopup);
  const localeRouter = useLocaleRouter();
  const { pricing } = useClientPricingWithCountry();
  const listPrice = pricing?.lifetime?.price;
  const salePrice = listPrice ? applyPercentOff(listPrice) : null;

  useEffect(() => {
    if (!open) return;
    trackEvent("black_friday_popup_view", { code: BLACK_FRIDAY_CODE });
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    trackEvent("black_friday_popup_dismiss", { code: BLACK_FRIDAY_CODE });
    closePopup();
  };

  const handleCopy = async () => {
    try {
      await copyText(BLACK_FRIDAY_CODE);
      toast.success("Discount code copied. Paste it at checkout.");
      trackEvent("black_friday_code_copied", { code: BLACK_FRIDAY_CODE });
    } catch {
      toast.error("Could not copy. Type FRIDAY40 at checkout.");
    }
  };

  const handleClaim = async () => {
    await handleCopy();
    closePopup();
    localeRouter.push("/pricing");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="black-friday-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#1a1a1a] p-6 text-white shadow-[var(--landing-shadow)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute end-3 top-3 rounded-md p-1.5 text-white/70 transition-opacity hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Close"
        >
          <XIcon className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <BrandLogo
            size="sm"
            showWordmark={false}
            className="mb-4"
            alt=""
          />

          <p
            id="black-friday-title"
            className="font-[family-name:var(--font-serif)] text-4xl leading-none tracking-tight sm:text-5xl"
          >
            <span className="block text-white">BLACK</span>
            <span className="mt-1 block text-[var(--landing-accent)]">FRIDAY</span>
          </p>

          <p className="mt-3 font-[family-name:var(--font-serif)] text-lg text-[var(--landing-accent)] sm:text-xl">
            Land your next job faster
          </p>

          <div
            className="absolute -end-2 top-10 flex size-16 items-center justify-center rounded-full border border-dashed border-[var(--landing-accent)] bg-[#1a1a1a] text-center text-[0.7rem] font-bold leading-tight text-[var(--landing-accent)] sm:end-4 sm:top-12 sm:size-20 sm:text-xs"
            aria-hidden="true"
          >
            {BLACK_FRIDAY_PERCENT}%
            <br />
            OFF
          </div>

          {listPrice && salePrice ? (
            <p className="mt-5 font-outfit text-lg text-white/90">
              Lifetime for just{" "}
              <span className="text-white/50 line-through">${listPrice}</span>{" "}
              <span className="font-bold text-white">${salePrice}</span>
              <span className="text-white/70"> once</span>
            </p>
          ) : (
            <p className="mt-5 font-outfit text-lg text-white/90">
              {BLACK_FRIDAY_PERCENT}% off Lifetime
            </p>
          )}

          <div className="mt-5 w-full">
            <Countdown />
          </div>

          <p className="mt-5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 font-mono text-sm tracking-widest text-white">
            {BLACK_FRIDAY_CODE}
          </p>
          <p className="mt-2 text-xs text-white/55">
            Copy this code and paste it at Polar checkout.
          </p>

          <button
            type="button"
            onClick={handleClaim}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--landing-accent)] px-4 py-3.5 font-outfit text-base font-bold text-white transition-colors hover:bg-[var(--landing-accent-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-accent)]"
          >
            <CopyIcon className="size-5" />
            Copy code and claim {BLACK_FRIDAY_PERCENT}% off
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="mt-3 text-sm text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
