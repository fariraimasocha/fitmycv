"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  getInAppBrowserLabel,
  tryOpenExternalBrowser,
  copyText,
} from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";
import { platformOf, useUserAgent } from "@/hooks/use-user-agent";

export default function AuthPage() {
  const t = useTranslations("auth");
  const getPendingCheckout = useCheckoutStore((s) => s.getPendingCheckout);
  const getPendingCheckoutPlan = useCheckoutStore((s) => s.getPendingCheckoutPlan);
  const ua = useUserAgent();
  const inWebView = isInAppBrowser(ua);
  const isLinkedIn = isLinkedInWebView(ua);
  const platform = platformOf(ua);
  // getInAppBrowserLabel returns a brand name, or "in-app browser" when it
  // cannot tell. null means the translated generic label.
  const rawBrowserLabel = ua ? getInAppBrowserLabel(ua) : null;
  const browserLabel = rawBrowserLabel === "in-app browser" ? null : rawBrowserLabel;
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (inWebView) {
      trackEvent("auth_webview_detected", { platform: platform === "desktop" ? "other" : platform, isLinkedIn });
    }
  }, [inWebView, platform, isLinkedIn]);

  const callbackUrl = () => {
    const hasPending = getPendingCheckout();
    const pendingPlan = getPendingCheckoutPlan() ?? "lifetime";
    if (hasPending) {
      return `/dashboard?checkout=pending&plan=${pendingPlan}`;
    }
    // Safe same-origin path only. Used by ATS → tailor handoff.
    try {
      const next = new URLSearchParams(window.location.search).get("next");
      if (
        next &&
        next.startsWith("/") &&
        !next.startsWith("//") &&
        !next.includes("://")
      ) {
        return next;
      }
    } catch {
      // ignore
    }
    return "/dashboard";
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: callbackUrl() });
  };

  const handleMagicLink = async (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error(t("toasts.emailRequired"));
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
        toast.error(t("toasts.sendError"));
        return;
      }

      trackEvent("magic_link_requested");
      setEmailSent(true);
      toast.success(t("toasts.sent"));
    } catch {
      toast.error(t("toasts.sendError"));
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async () => {
    const text = window.location.href;
    try {
      await copyText(text);
      toast.success(t("toasts.copied"));
      trackEvent("auth_copy_link", { platform });
    } catch {
      toast.error(t("toasts.copyError"));
    }
  };

  const handleOpenExternal = () => {
    trackEvent("auth_try_open_external", { platform });
    const didTry = tryOpenExternalBrowser(window.location.href);
    if (!didTry) {
      handleCopyLink();
    } else if (platform === "android") {
      toast.success(t("toasts.openingChrome"));
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
          <h1 className="text-xl font-semibold text-[var(--landing-ink)]">{t("title")}</h1>
          <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
            {t("subtitle")}
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
                  {t("webview.blocked", {
                    browser: isLinkedIn
                      ? "LinkedIn"
                      : browserLabel ?? t("webview.inAppBrowser"),
                  })}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800">
                  {isLinkedIn
                    ? platform === "ios"
                      ? t("webview.linkedinIos")
                      : platform === "android"
                        ? t("webview.linkedinAndroid")
                        : t("webview.linkedinOther")
                    : t("webview.other")}
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
                {t("webview.copyLink")}
              </button>
              {platform === "android" && (
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--landing-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
                >
                  <ArrowSquareOutIcon size={16} />
                  {t("webview.openChrome")}
                </button>
              )}
            </div>
            <p className="text-xs leading-relaxed text-amber-700">
              {isLinkedIn
                ? t("webview.emailWorksLinkedin")
                : t("webview.emailWorksApp")}
            </p>
          </div>
        )}

        {emailSent ? (
          <div className="w-full rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4 text-center">
            <p className="text-sm font-semibold text-[var(--landing-ink)]">
              {t("emailSent.title")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              {t("emailSent.body", { email })}
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="flex w-full flex-col gap-3">
            <label htmlFor="auth-email" className="sr-only">
              {t("emailLabel")}
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
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
              {sending ? t("sending") : t("sendLink")}
            </motion.button>
          </form>
        )}

        <div className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-[var(--landing-line)]" aria-hidden="true" />
          <span className="text-xs font-semibold text-[var(--landing-ink-soft)]">{t("or")}</span>
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
          {t("google")}
        </motion.button>
      </motion.div>
    </div>
  );
}
