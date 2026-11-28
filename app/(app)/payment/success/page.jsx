"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircleIcon,
  CheckIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import BrandLogo from "@/components/BrandLogo";
import { openSupport } from "@/lib/open-support";

const PREMIUM_STATUS_ENDPOINT = "/api/user/premium-status";

// Honest unlocks only. Each line maps to a paywalled route in lib/pro-features.js.
const JUST_UNLOCKED = [
  "PDF downloads for tailored CVs and cover letters",
  "Job match scores on every job you add",
  "Company research briefs before you apply",
  "Interview prep questions for the role",
];

export default function PaymentSuccessPage() {
  const { update, status } = useSession();
  // A guest paid before signing up. The webhook made their account from the
  // email they paid with, so they sign in with that email to use Pro.
  const isGuest = status === "unauthenticated";
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
    enabled: status === "authenticated",
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

  const enter = reduceMotion
    ? false
    : { opacity: 0, y: 12 };
  const settle = { opacity: 1, y: 0 };
  const spring = { type: "spring", stiffness: 280, damping: 22 };

  return (
    <div
      dir="ltr"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--landing-bg)] px-4 py-10"
    >
      {/* Atmosphere only. Soft paper wash so the page is not a flat grey slab. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in oklch, var(--landing-success-soft) 85%, transparent), transparent 70%), radial-gradient(ellipse 55% 45% at 80% 100%, color-mix(in oklch, var(--landing-accent-soft) 70%, transparent), transparent 65%)",
        }}
      />

      <motion.div
        initial={enter}
        animate={settle}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.35, ease: [0.165, 0.84, 0.44, 1] }
        }
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-6 shadow-[var(--landing-shadow)] sm:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="sm" showWordmark={false} className="mb-5" alt="" />

          <motion.div
            initial={reduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduceMotion ? { duration: 0 } : spring}
            className="relative mb-5 flex size-18 items-center justify-center"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[var(--landing-success-soft)]"
            />
            {!reduceMotion && isPremiumConfirmed ? (
              <motion.span
                aria-hidden="true"
                className="absolute -inset-1 rounded-full border border-[var(--landing-success)]/25"
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1.15, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ) : null}
            <CheckCircleIcon
              weight="fill"
              className="relative size-11 text-[var(--landing-success)]"
              aria-hidden="true"
            />
          </motion.div>

          <h1 className="font-outfit text-2xl font-semibold leading-tight tracking-tight text-[var(--landing-ink)] sm:text-3xl">
            Payment successful
          </h1>

          <p className="mt-2 font-outfit text-lg font-medium text-[var(--landing-ink)]">
            You are on Pro
          </p>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--landing-ink-soft)]">
            These are unlocked on your account now.
          </p>

          <ul className="mt-5 w-full space-y-2.5 text-start">
            {JUST_UNLOCKED.map((line, i) => (
              <motion.li
                key={line}
                initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { delay: 0.08 + i * 0.05, duration: 0.28, ease: [0.165, 0.84, 0.44, 1] }
                }
                className="flex items-start gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-bg)] px-3.5 py-2.5"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--landing-success-soft)] text-[var(--landing-success)]">
                  <CheckIcon size={12} weight="bold" aria-hidden="true" />
                </span>
                <span className="text-sm leading-5 text-[var(--landing-ink)]">
                  {line}
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-6 w-full">
            {isGuest ? (
              <div
                role="status"
                className="rounded-xl bg-[var(--landing-ink)] px-4 py-4 text-[var(--landing-on-primary)]"
              >
                <p className="font-outfit text-base font-semibold tracking-tight">
                  Sign in to start using Pro
                </p>
                <p className="mt-1 text-sm text-[var(--landing-ink-inverse-soft)]">
                  Use the email you paid with. Your account is ready under that email with Pro on.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/auth")}
                  className="dashboard-secondary-btn mt-4 w-full"
                >
                  Sign in
                </button>
              </div>
            ) : isPremiumConfirmed ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : spring}
                role="status"
                className="rounded-xl bg-[var(--landing-ink)] px-4 py-4 text-[var(--landing-on-primary)]"
              >
                <p className="font-outfit text-base font-semibold tracking-tight">
                  Pro is on
                </p>
                <p className="mt-1 text-sm text-[var(--landing-ink-inverse-soft)]">
                  {sessionUpdating
                    ? "Taking you to your dashboard…"
                    : "Loading your account…"}
                </p>
              </motion.div>
            ) : gaveUp ? (
              <div
                role="alert"
                className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-bg)] px-4 py-4 text-start"
              >
                <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                  Your payment went through. Pro is taking longer than usual to
                  switch on. Check again in a minute, or message us and we will
                  sort it out.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="dashboard-primary-btn"
                  >
                    {isFetching ? "Checking…" : "Check again"}
                  </button>
                  <button
                    type="button"
                    onClick={openSupport}
                    className="dashboard-secondary-btn"
                  >
                    Contact support
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="dashboard-secondary-btn mt-2 w-full sm:w-auto"
                >
                  Go to dashboard
                </button>
              </div>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-bg)] px-4 py-4"
              >
                <div className="flex items-center justify-center gap-2.5">
                  <SpinnerGapIcon
                    size={18}
                    className="animate-spin text-[var(--landing-accent)]"
                    aria-hidden="true"
                  />
                  <p className="font-outfit text-sm font-semibold text-[var(--landing-ink)]">
                    Switching Pro on…
                  </p>
                </div>
                <p className="mt-1.5 text-sm text-[var(--landing-ink-soft)]">
                  This usually takes a few seconds.
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  type="button"
                  className="dashboard-secondary-btn mt-4 w-full"
                >
                  Skip to dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
