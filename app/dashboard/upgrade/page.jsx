"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeftIcon, CheckIcon } from "@phosphor-icons/react";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard";
import PricingCards from "@/components/pricing/PricingCards";
import { PRO_FEATURES } from "@/lib/pro-features";

const PREMIUM_STATUS_ENDPOINT = "/api/user/premium-status";

export default function UpgradePage() {
  const { update } = useSession();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [checking, setChecking] = useState(true);

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
        title="Upgrade to Pro"
        description="Download your tailored CVs and cover letters as PDF, research companies and get daily job matches."
        actions={
          <Link href="/dashboard" className="dashboard-secondary-btn">
            <ArrowLeftIcon size={16} aria-hidden="true" />
            Back to home
          </Link>
        }
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {/* compact: the "Everything in Pro" list below already covers PRO_FEATURES */}
        <PricingCards compact />
      </motion.div>

      <DashboardPanel delay={0.1}>
        <DashboardPanelHeader
          title="Everything in Pro"
          description="Every line is a feature you unlock today."
        />
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {PRO_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm leading-5 text-muted-foreground"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[var(--landing-success-soft)] text-[var(--landing-success)]">
                <CheckIcon size={10} weight="bold" aria-hidden="true" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </DashboardPanel>
    </DashboardPageShell>
  );
}
