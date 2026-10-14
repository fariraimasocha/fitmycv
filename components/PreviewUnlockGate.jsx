"use client";

import { CrownIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

/**
 * Free users can confirm a tailor worked. The blur is only the visual: the
 * API already sends free users a trimmed preview (lib/tailored-preview.js).
 */
export default function PreviewUnlockGate({ locked, onUnlock, children }) {
  const t = useTranslations("pages.unlockGate");
  if (!locked) return children;

  return (
    <div className="relative">
      <div className="max-h-120 overflow-hidden" aria-hidden="true">
        <div className="pointer-events-none select-none">{children}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-1/2 flex flex-col items-center justify-end bg-linear-to-t from-white via-white/95 to-transparent px-4 pb-6 pt-20 backdrop-blur-[2.5px]">
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
