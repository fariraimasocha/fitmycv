"use client";

import { useEffect, useState } from "react";
import { useRouter as useLocaleRouter } from "@/i18n/navigation";
import { CrownIcon, CheckCircleIcon } from "@phosphor-icons/react";
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
import { useClientPricing } from "@/components/pricing/PricingCards";
import { trackEvent } from "@/lib/analytics";
import { SHOW_MONTHLY } from "@/lib/pricing";

// Keys in messages/<locale>/pages.json under upgradeModal.
const COPY_KEYS = {
  default: "default",
  download: "download",
  // Opened when a free user's tailor finishes. Same copy as download.
  tailored: "download",
  pre_tailor: "preTailor",
};

export default function UpgradePromptModal({
  open,
  onClose,
  context = "default",
  job = null,
  // What this tailor actually did, from the tailor page. Shown so the ask
  // comes after the proof. Both optional.
  stats = null,
  // The saved CV behind this paywall. With it, the modal also sells that one
  // CV on its own. Without it (the agent draft, signed-out visitors) there is
  // nothing to unlock, so only the plans show.
  cvId = null,
}) {
  const t = useTranslations("pages.upgradeModal");
  // Adds /fr etc. to /auth. Checkout and dashboard URLs have no locale prefix.
  const localeRouter = useLocaleRouter();
  const { data: session } = useSession();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);
  const pricing = useClientPricing();
  const offerSingle = Boolean(cvId && session?.user && pricing.single);
  const primaryPlan = SHOW_MONTHLY ? "month" : offerSingle ? "single" : "lifetime";

  useEffect(() => {
    if (open) {
      trackEvent("paywall_view", {
        context,
        primary_plan: primaryPlan,
        has_job: Boolean(job?.title),
        has_stats: Boolean(stats?.keywordsAdded || stats?.grade),
        offers_single: offerSingle,
      });
    }
  }, [open, context, job?.title, stats?.keywordsAdded, stats?.grade, offerSingle, primaryPlan]);

  const copyKey = COPY_KEYS[context] ?? COPY_KEYS.default;
  const title = job?.title
    ? job.company
      ? t("forJob.titleWithCompany", { title: job.title, company: job.company })
      : t("forJob.title", { title: job.title })
    : t(`${copyKey}.title`);
  const description = t(`${copyKey}.description`, {
    price: pricing.lifetime.price,
  });

  // Full page load so a second click can't restart a slow redirect. See
  // PricingCards for the same fix.
  const [pendingPlan, setPendingPlan] = useState(null);

  useEffect(() => {
    const reset = (e) => e.persisted && setPendingPlan(null);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const startCheckout = (plan, source) => {
    if (pendingPlan) return;
    trackEvent("checkout_start", {
      tier: pricing.tier,
      plan,
      source,
    });
    if (session?.user) {
      setPendingPlan(plan);
      const query = new URLSearchParams({ plan });
      if (plan === "single") query.set("cv", cvId);
      window.location.assign(`/api/polar/checkout?${query}`);
    } else {
      setPendingCheckout(true, plan);
      localeRouter.push("/auth");
    }
  };

  const proof = [
    stats?.keywordsAdded ? t("stats.keywords", { count: stats.keywordsAdded }) : null,
    stats?.grade ? t("stats.grade", { grade: stats.grade }) : null,
  ].filter(Boolean);

  // Monthly leads: in October every purchase was monthly and lifetime sold
  // none. This one CV sits second, for the visitor who needs one application
  // today and would otherwise close the modal. Lifetime stays a text link.
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="rounded-md border-[var(--landing-line)] bg-[var(--landing-surface)] sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <CrownIcon className="size-5 shrink-0 text-[var(--landing-accent)]" aria-hidden="true" />
            <DialogTitle className="text-[var(--landing-ink)]">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[var(--landing-ink-soft)]">
            {description}
          </DialogDescription>
        </DialogHeader>

        {proof.length > 0 && (
          <ul className="flex flex-col gap-2 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-3">
            {proof.map((line) => (
              <li key={line} className="flex items-center gap-2 text-sm font-medium text-[var(--landing-ink)]">
                <CheckCircleIcon
                  size={16}
                  weight="fill"
                  aria-hidden="true"
                  className="shrink-0 text-[var(--landing-success)]"
                />
                {line}
              </li>
            ))}
          </ul>
        )}

        {!SHOW_MONTHLY ? (
          <div className="flex flex-col items-center gap-2 pt-1">
            {offerSingle && (
              <>
                <button
                  type="button"
                  onClick={() => startCheckout("single", "paywall_primary")}
                  disabled={Boolean(pendingPlan)}
                  aria-busy={pendingPlan === "single"}
                  className="dashboard-primary-btn w-full disabled:cursor-wait disabled:opacity-60"
                >
                  {t("getSingle", { price: pricing.single.price })}
                </button>
                <p className="text-xs text-[var(--landing-ink-soft)]">{t("singleNote")}</p>
              </>
            )}
            <button
              type="button"
              onClick={() => startCheckout("lifetime", offerSingle ? "paywall_secondary" : "paywall_primary")}
              disabled={Boolean(pendingPlan)}
              aria-busy={pendingPlan === "lifetime"}
              className={`${offerSingle ? "dashboard-secondary-btn mt-2" : "dashboard-primary-btn"} w-full disabled:cursor-wait disabled:opacity-60`}
            >
              {t("getLifetime", { price: pricing.lifetime.price })}
            </button>
            <p className="text-xs text-[var(--landing-ink-soft)]">{t("lifetimeNote")}</p>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
            >
              {t("maybeLater")}
            </button>
          </div>
        ) : (
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => startCheckout("month", "paywall_primary")}
            disabled={Boolean(pendingPlan)}
            aria-busy={pendingPlan === "month"}
            className="dashboard-primary-btn w-full disabled:cursor-wait disabled:opacity-60"
          >
            {t("getMonth", { price: pricing.month.price })}
          </button>
          <p className="text-xs text-[var(--landing-ink-soft)]">{t("monthNote")}</p>
          {offerSingle && (
            <>
              <button
                type="button"
                onClick={() => startCheckout("single", "paywall_single")}
                disabled={Boolean(pendingPlan)}
                aria-busy={pendingPlan === "single"}
                className="dashboard-secondary-btn mt-2 w-full disabled:cursor-wait disabled:opacity-60"
              >
                {t("getSingle", { price: pricing.single.price })}
              </button>
              <p className="text-xs text-[var(--landing-ink-soft)]">{t("singleNote")}</p>
            </>
          )}
          <button
            type="button"
            onClick={() => startCheckout("lifetime", "paywall_secondary")}
            disabled={Boolean(pendingPlan)}
            aria-busy={pendingPlan === "lifetime"}
            className="mt-2 text-sm font-medium text-[var(--landing-ink)] underline underline-offset-4 hover:text-[var(--landing-accent)] disabled:cursor-wait disabled:opacity-60"
          >
            {t("orLifetime", { price: pricing.lifetime.price })}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
          >
            {t("maybeLater")}
          </button>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
