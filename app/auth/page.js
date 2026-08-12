"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import { GoogleLogoIcon, WarningIcon, CopyIcon } from "@phosphor-icons/react";
import { useCheckoutStore } from "@/stores/checkout-store";
import toast from "react-hot-toast";

function isWebView() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Twitter|LinkedInApp|GSA|wv/.test(ua);
}

export default function AuthPage() {
  const getPendingCheckout = useCheckoutStore((s) => s.getPendingCheckout);
  const getPendingCheckoutPlan = useCheckoutStore((s) => s.getPendingCheckoutPlan);
  const [inWebView, setInWebView] = useState(false);

  useEffect(() => {
    setInWebView(isWebView());
  }, []);

  const handleSignIn = () => {
    const hasPending = getPendingCheckout();
    const pendingPlan = getPendingCheckoutPlan() ?? "lifetime";
    const callbackUrl = hasPending
      ? `/dashboard?checkout=pending&plan=${pendingPlan}`
      : "/dashboard";
    signIn("google", { callbackUrl });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied! Paste it in Chrome or Safari.");
  };

  return (
    <div className="landing-root flex min-h-screen items-center justify-center px-4">
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-[var(--landing-line)] bg-white p-5 shadow-[var(--landing-shadow-sm)] sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/" className="font-serif-display text-xl text-[var(--landing-ink)]">
          FitMyCV
        </Link>

        <div className="text-center">
          <h1 className="text-xl font-semibold text-[var(--landing-ink)]">Welcome</h1>
          <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
            Sign in to tailor your CV
          </p>
        </div>

        {inWebView && (
          <div
            role="alert"
            aria-live="polite"
            className="flex w-full flex-col gap-3 rounded-xl border border-[var(--landing-coral)]/30 bg-[#fdf3ef] p-4"
          >
            <div className="flex items-start gap-2">
              <WarningIcon size={18} className="mt-0.5 shrink-0 text-[var(--landing-coral)]" weight="fill" />
              <p className="text-sm text-[var(--landing-ink-soft)]">
                Google sign-in doesn&apos;t work in in-app browsers. Open this page in Chrome or Safari.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--landing-paper-soft)] px-4 py-2 text-sm font-medium text-[var(--landing-ink)]"
            >
              <CopyIcon size={16} />
              Copy link to open in browser
            </button>
          </div>
        )}

        <motion.button
          type="button"
          onClick={handleSignIn}
          disabled={inWebView}
          className="landing-primary-btn w-full text-sm disabled:cursor-not-allowed disabled:opacity-40"
          whileHover={inWebView ? {} : { scale: 1.02 }}
          whileTap={inWebView ? {} : { scale: 0.98 }}
        >
          <GoogleLogoIcon size={20} weight="bold" />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}
