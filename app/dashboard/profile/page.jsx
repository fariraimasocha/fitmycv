"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { UserIcon, CrownIcon, ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SubscriptionBadge({ isPremium, status }) {
  if (!isPremium) {
    return (
      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        Free
      </span>
    );
  }

  if (status === "canceled") {
    return (
      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
        PRO · Canceling
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
      PRO
    </span>
  );
}

const PRO_FEATURES = [
  "Unlimited CV tailoring",
  "AI cover letter generation",
  "Priority support",
];

export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  // Force-refresh JWT from DB on mount — fixes stale isPremium after Polar webhook
  useEffect(() => {
    update();
  }, []);

  if (status === "loading") return <Loader />;

  const user = session?.user ?? {};
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const isPremium = !!user.isPremium;
  const subscriptionStatus = user.subscriptionStatus ?? null;
  const periodEnd = user.subscriptionCurrentPeriodEnd
    ? formatDate(user.subscriptionCurrentPeriodEnd)
    : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and subscription
        </p>
      </div>

      {/* Account card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0 }}
      >
        <Card className="rounded-xl border-border overflow-hidden">
          {/* Banner strip */}
          <div className="bg-foreground/5 px-4 sm:px-6 py-5 flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-border">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0">
              <p className="text-lg font-semibold leading-tight truncate">
                {user.name ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground truncate">{user.email ?? "—"}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <UserIcon className="size-3" />
                Google
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Subscription card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      >
        <Card className="rounded-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2">
              <CrownIcon
                className={`size-4 ${isPremium ? "text-amber-500" : "text-muted-foreground"}`}
              />
              <CardTitle className="text-base">Subscription</CardTitle>
            </div>
            <SubscriptionBadge isPremium={isPremium} status={subscriptionStatus} />
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium ? (
              <>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize text-green-600">
                      {subscriptionStatus ?? "Active"}
                    </span>
                  </div>
                  {periodEnd && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {subscriptionStatus === "canceled" ? "Access until" : "Renews"}
                      </span>
                      <span className="font-medium">{periodEnd}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {PRO_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircleIcon className="size-4 text-green-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full sm:w-auto">
                  <Link href="/api/polar/portal">
                    Manage Billing
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <ul className="space-y-1.5">
                  {PRO_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircleIcon className="size-4 text-muted-foreground shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full sm:w-auto">
                  <Link href="/api/polar/checkout">
                    Upgrade to Pro
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
