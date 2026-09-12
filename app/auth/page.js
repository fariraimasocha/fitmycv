"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { signIn } from "next-auth/react";
import {
  GoogleLogoIcon,
  WarningIcon,
  CopyIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
import { useCheckoutStore } from "@/stores/checkout-store";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import { isInAppWebView } from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";

export default function AuthPage() {
  const getPendingCheckout = useCheckoutStore((s) => s.getPendingCheckout);
  const getPendingCheckoutPlan = useCheckoutStore((s) => s.getPendingCheckoutPlan);
  const [inWebView, setInWebView] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setInWebView(isInAppWebView(navigator.userAgent));
  }, []);

  const callbackUrl = () => {
    const hasPending = getPendingCheckout();
    const pendingPlan = getPendingCheckoutPlan() ?? "lifetime";
    return hasPending
      ? `/dashboard?checkout=pending&plan=${pendingPlan}`
      : "/dashboard";
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: callbackUrl() });
  };

  const handleMagicLink = async (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email address.");
      return;
    }

    setSending(true);
    try {
      const result = await signIn("email", {
        email: trimmed,
        callbackUrl: callbackUrl(),
        redirect: false,
      });

      if (result?.error) {
        toast.error("Could not send the sign-in link. Try again.");
        return;
      }

      trackEvent("magic_link_requested");
      setEmailSent(true);
      toast.success("Sign-in link sent. Check your inbox.");
    } catch {
      toast.error("Could not send the sign-in link. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied. Paste it in Chrome or Safari.");
  };

  return (
    <div className="landing-root flex min-h-screen items-center justify-center px-4">
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-[var(--landing-line)] bg-white p-5 shadow-[var(--landing-shadow-sm)] sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/" className="flex items-center">
          <BrandLogo size="lg" priority wordmarkClassName="text-xl" />
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
              <WarningIcon
                size={18}
                className="mt-0.5 shrink-0 text-[var(--landing-coral)]"
                weight="fill"
              />
              <p className="text-sm text-[var(--landing-ink-soft)]">
                Google sign-in does not work in in-app browsers. Use the email
                link below, or open this page in Chrome or Safari.
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

        {emailSent ? (
          <div className="w-full rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4 text-center">
            <p className="text-sm font-semibold text-[var(--landing-ink)]">
              Check your inbox
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              We sent a sign-in link to {email}. It works in this app.
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="flex w-full flex-col gap-3">
            <label htmlFor="auth-email" className="sr-only">
              Email address
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[var(--landing-line)] bg-white px-4 py-3 text-sm text-[var(--landing-ink)] outline-none focus:border-[var(--landing-accent)]"
            />
            <motion.button
              type="submit"
              disabled={sending}
              className="landing-primary-btn w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
              whileTap={{ scale: 0.98 }}
            >
              <EnvelopeSimpleIcon size={18} />
              {sending ? "Sending link..." : "Email me a sign-in link"}
            </motion.button>
          </form>
        )}

        <div className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-[var(--landing-line)]" aria-hidden="true" />
          <span className="text-xs font-semibold text-[var(--landing-ink-soft)]">or</span>
          <span className="h-px flex-1 bg-[var(--landing-line)]" aria-hidden="true" />
        </div>

        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={inWebView}
          className="landing-secondary-btn w-full text-sm disabled:cursor-not-allowed disabled:opacity-40"
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
