"use client";

import { CrownIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

/**
 * Free users can confirm a tailor worked. Full document value (readable
 * preview + PDF) stays behind unlock. CSS blur alone is not a hard gate;
 * download and print are still blocked in the handlers.
 */
export default function PreviewUnlockGate({ locked, onUnlock, children }) {
  const t = useTranslations("pages.unlockGate");
  if (!locked) return children;

  return (
    <div className="relative">
      <div className="max-h-90 overflow-hidden" aria-hidden="true">
        <div className="pointer-events-none select-none blur-[2.5px]">
          {children}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-20 flex flex-col items-center justify-end bg-linear-to-t from-white via-white/95 to-transparent px-4 pb-6 pt-20">
        <button
          type="button"
          onClick={onUnlock}
          className="dashboard-primary-btn inline-flex items-center gap-2"
        >
          <CrownIcon size={16} aria-hidden="true" />
          {t("button")}
        </button>
        <p className="mt-2 max-w-xs text-center text-sm text-muted-foreground">
          {t("body")}
        </p>
      </div>
    </div>
  );
}
