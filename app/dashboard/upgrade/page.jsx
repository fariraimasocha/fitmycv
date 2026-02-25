"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CrownIcon, CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PRO_FEATURES = [
  "Unlimited CV tailoring",
  "AI cover letter generation",
  "Job requirements extraction",
  "Access to all tailored CVs",
  "Priority support",
];

export default function UpgradePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
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
