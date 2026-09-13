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
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { useCheckoutStore } from "@/stores/checkout-store";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import {
  isInAppBrowser,
  isLinkedInWebView,
  isAndroid,
  isIOS,
  getInAppBrowserLabel,
  tryOpenExternalBrowser,
} from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";

export default function AuthPage() {
  const getPendingCheckout = useCheckoutStore((s) => s.getPendingCheckout);
  const getPendingCheckoutPlan = useCheckoutStore((s) => s.getPendingCheckoutPlan);
  const [inWebView, setInWebView] = useState(false);
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [platform, setPlatform] = useState("unknown");
  const [browserLabel, setBrowserLabel] = useState("in-app browser");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setInWebView(isInAppBrowser(ua));
    setIsLinkedIn(isLinkedInWebView(ua));
    setBrowserLabel(getInAppBrowserLabel(ua));
    if (isAndroid(ua)) setPlatform("android");
    else if (isIOS(ua)) setPlatform("ios");
    else setPlatform("desktop");
    if (isInAppBrowser(ua)) {
      trackEvent("auth_webview_detected", { platform: isAndroid(ua) ? "android" : isIOS(ua) ? "ios" : "other", isLinkedIn: isLinkedInWebView(ua) });
    }
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

  const handleCopyLink = async () => {
    const text = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success("Link copied. Paste it in Chrome or Safari.");
      trackEvent("auth_copy_link", { platform });
    } catch {
      toast.error("Could not copy. Long press the address bar to copy the link.");
    }
  };

  const handleOpenExternal = () => {
    trackEvent("auth_try_open_external", { platform });
    const didTry = tryOpenExternalBrowser(window.location.href);
    if (!didTry) {
      handleCopyLink();
    } else if (platform === "android") {
      toast.success("Opening in Chrome. If nothing happens, use Copy link.");
    }
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
            className="flex w-full flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
          >
            <div className="flex items-start gap-2">
              <WarningIcon
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
                weight="fill"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  {isLinkedIn
                    ? "Google sign in is blocked inside LinkedIn"
                    : `Google sign in is blocked inside ${browserLabel}`}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800">
                  {isLinkedIn
                    ? platform === "ios"
                      ? "Tap the ••• at the top right, then choose Open in Browser to use Google. Or use email sign in below. It works here."
                      : platform === "android"
                        ? "Tap ⋮ at the top right, then Open in Chrome to use Google. Or use email sign in below. It works here."
                        : "Copy this link and open it in Chrome or Safari to use Google. Or use email sign in below."
                    : "Open this page in Chrome or Safari to use Google. Or use email sign in below. It works in this browser."}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[var(--landing-ink)] shadow-sm ring-1 ring-amber-200 hover:bg-amber-50"
              >
                <CopyIcon size={16} />
                Copy link to open in browser
              </button>
              {platform === "android" && (
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--landing-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
                >
                  <ArrowSquareOutIcon size={16} />
                  Try opening in Chrome
                </button>
              )}
            </div>
            <p className="text-xs leading-relaxed text-amber-700">
              Email sign in works without leaving {isLinkedIn ? "LinkedIn" : "this app"}.
            </p>
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
