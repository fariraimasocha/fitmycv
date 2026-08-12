"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
} from "@/components/dashboard";
import PricingCards from "@/components/pricing/PricingCards";
import { PRO_FEATURES } from "@/lib/pro-features";
import { CheckIcon } from "@phosphor-icons/react";

const PREMIUM_STATUS_ENDPOINT = "/api/user/premium-status";

export default function UpgradePage() {
  const { update } = useSession();
  const router = useRouter();
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
        title="Upgrade to Premium"
        description="Unlock PDF downloads, interview prep, and the full job search toolkit."
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="space-y-6"
      >
        <PricingCards />

        <div className="dashboard-card rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-outfit text-sm font-extrabold text-foreground">
            Everything included
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PRO_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckIcon
                  size={14}
                  weight="bold"
                  className="mt-0.5 shrink-0 text-[var(--landing-success)]"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-2 size-4" />
            Go back
          </Link>
        </Button>
      </motion.div>
    </DashboardPageShell>
  );
}
