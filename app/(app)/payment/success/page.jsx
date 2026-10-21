"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { openSupport } from "@/lib/open-support";

const PREMIUM_STATUS_ENDPOINT = "/api/user/premium-status";

export default function PaymentSuccessPage() {
  const { update } = useSession();
  const router = useRouter();
  const redirected = useRef(false);
  const redirectTimer = useRef(null);
  useEffect(() => () => clearTimeout(redirectTimer.current), []);
  const reduceMotion = useReducedMotion();

  const { data, isError, isFetching, dataUpdateCount, refetch } = useQuery({
    queryKey: ["premium-status"],
    queryFn: async () => {
      const res = await fetch(PREMIUM_STATUS_ENDPOINT, {
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Couldn't check your Pro status.");
      return res.json();
    },
    refetchInterval: (query) => {
      if (query.state.data?.isPremium) return false;
      if ((query.state.dataUpdateCount ?? 0) >= 10) return false;
      return 2000;
    },
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  const isPremiumConfirmed = !!data?.isPremium;
  // Polling stops after 10 checks (about 20 seconds). Past that, say so and
  // hand the user a way forward instead of "Activating Pro…" forever.
  const gaveUp = !isPremiumConfirmed && (isError || dataUpdateCount >= 10);
  const [sessionUpdating, setSessionUpdating] = useState(false);

  useEffect(() => {
    if (!isPremiumConfirmed || redirected.current) return;

    redirected.current = true;
    setSessionUpdating(true);
    // Hold "Pro is on" on screen for a beat. It is the moment they paid
    // for, so it should be seen, not flashed past on the way to a redirect.
    update().then(() => {
      redirectTimer.current = setTimeout(() => router.push("/dashboard"), 1200);
    });
  }, [isPremiumConfirmed, update, router]);

  return (
    <div dir="ltr" className="min-h-screen flex items-center justify-center bg-[var(--landing-bg)] px-4">
      <div className="max-w-md w-full bg-[var(--landing-surface)] rounded-lg shadow-sm border border-[var(--landing-line)] p-5 sm:p-8 text-center">
        <div className="w-16 h-16 bg-[var(--landing-success-soft)] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[var(--landing-success)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[var(--landing-ink)] mb-2">
          Payment successful
        </h1>

        <p className="text-lg font-medium text-[var(--landing-ink)] mb-4">
          Thanks for upgrading to Pro
        </p>

        <p className="text-[var(--landing-ink-soft)] mb-6">
          Pro unlocks PDF downloads, job match scores, company research,
          interview prep and more.
        </p>

        {isPremiumConfirmed ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            role="status"
            className="rounded-lg bg-[var(--landing-success-soft)] px-4 py-3"
          >
            <p className="font-semibold text-[var(--landing-success)]">Pro is on</p>
            <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
              {sessionUpdating ? "Taking you to your dashboard…" : "Loading your account…"}
            </p>
          </motion.div>
        ) : gaveUp ? (
          <div role="alert">
            <p className="text-sm text-[var(--landing-ink-soft)] mb-4">
              Your payment went through. Pro is taking longer than usual to
              switch on. Check again in a minute, or message us and we will
              sort it out.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="dashboard-primary-btn"
              >
                {isFetching ? "Checking…" : "Check again"}
              </button>
              <button type="button" onClick={openSupport} className="dashboard-secondary-btn">
                Contact support
              </button>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="dashboard-secondary-btn mt-4"
            >
              Go to dashboard
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-[var(--landing-ink-soft)] mb-4">
              Activating Pro…
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              type="button"
              className="dashboard-secondary-btn"
            >
              Skip to dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
