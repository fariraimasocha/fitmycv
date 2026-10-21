"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon, CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard";
import PricingCards from "@/components/pricing/PricingCards";
import { openSupport } from "@/lib/open-support";
import { PRO_FEATURES } from "@/lib/pro-features";

const PREMIUM_STATUS_ENDPOINT = "/api/user/premium-status";

export default function UpgradePage() {
  const t = useTranslations("dashboard.upgrade");
  const { update } = useSession();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [checking, setChecking] = useState(true);
  // The checkout route sends people back here with ?error=checkout_failed
  // when Polar refuses to start a session. Read once; the page shows the
  // loader until the premium check finishes, so server and client match.
  const [checkoutFailed] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("error") === "checkout_failed",
  );

  useEffect(() => {
    async function checkPremiumStatus() {
      try {
        const res = await fetch(PREMIUM_STATUS_ENDPOINT, {
          credentials: "same-origin",
        });
        const data = await res.json();
        if (data.isPremium) {
          await update();
          router.replace("/dashboard");
          return;
        }
      } catch (_) {}
      setChecking(false);
    }
    checkPremiumStatus();
  }, [update, router]);

  if (checking) return <Loader />;

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/dashboard" className="dashboard-secondary-btn">
            <ArrowLeftIcon size={16} aria-hidden="true" />
            {t("backHome")}
          </Link>
        }
      />

      {checkoutFailed && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-4 sm:flex-row sm:items-center"
        >
          <WarningCircleIcon size={20} className="shrink-0 text-[var(--landing-accent-dark)]" aria-hidden="true" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-[var(--landing-ink)]">{t("checkoutFailedTitle")}</p>
            <p className="text-[var(--landing-ink-soft)]">{t("checkoutFailedDescription")}</p>
          </div>
          <button type="button" onClick={openSupport} className="dashboard-secondary-btn">
            {t("contactSupport")}
          </button>
        </div>
      )}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {/* compact: the "Everything in Pro" list below already covers PRO_FEATURES */}
        <PricingCards compact primaryPlan="month" />
      </motion.div>

      <DashboardPanel delay={0.1}>
        <DashboardPanelHeader
          title={t("everythingTitle")}
          description={t("everythingDescription")}
        />
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {/* features.fN follows the order of PRO_FEATURES. Lines without a
              translation fall back to the English text. */}
          {PRO_FEATURES.map((feature, i) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm leading-5 text-muted-foreground"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[var(--landing-success-soft)] text-[var(--landing-success)]">
                <CheckIcon size={10} weight="bold" aria-hidden="true" />
              </span>
              {t.has(`features.f${i + 1}`) ? t(`features.f${i + 1}`) : feature}
            </li>
          ))}
        </ul>
      </DashboardPanel>
    </DashboardPageShell>
  );
}
