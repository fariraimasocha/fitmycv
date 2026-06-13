"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { CrownIcon, CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { PRO_FEATURES } from "@/lib/pro-features";

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
          // DB says premium but JWT was stale — refresh session and redirect
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
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Upgrade to Pro</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Unlock all features to tailor your CV and generate cover letters.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="rounded-xl border-border">
          <CardHeader className="flex flex-row items-center gap-2 pb-3">
            <CrownIcon className="size-5 text-amber-500" />
            <CardTitle className="text-base">Pro Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Get full access to FitMyCV and start landing more interviews with tailored applications.
            </p>

            <ul className="space-y-2">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircleIcon className="size-4 text-green-600 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="/api/polar/checkout">
                  Upgrade to Pro
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  <ArrowLeftIcon className="mr-2 size-4" />
                  Go back
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
