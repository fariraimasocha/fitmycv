"use client";

import { useEffect, useState } from "react";
import {
  CopyIcon,
  XIcon,
  EnvelopeSimpleIcon,
  ArrowSquareOutIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { isAndroid, isIOS, tryOpenExternalBrowser } from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";

export default function WebviewGateModal({
  open,
  onClose,
  onContinueWithEmail,
  targetUrl,
  fullScreen = false,
}) {
  const [platform, setPlatform] = useState("unknown");

  useEffect(() => {
    if (!open) return;
    const ua = navigator.userAgent || "";
    if (isAndroid(ua)) setPlatform("android");
    else if (isIOS(ua)) setPlatform("ios");
    else setPlatform("desktop");
  }, [open]);

  if (!open) return null;

  const urlToShare =
    targetUrl || (typeof window !== "undefined" ? `${window.location.origin}/auth` : "/auth");

  const handleCopy = async () => {
    const text = urlToShare;
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
      trackEvent("webview_copy_link", { platform });
    } catch {
      toast.error("Could not copy. Long press the link to copy it.");
    }
  };

  const handleOpenExternal = () => {
    trackEvent("webview_try_open_external", { platform });
    const didTry = tryOpenExternalBrowser(urlToShare);
    if (!didTry) {
      // iOS fallback is copy + instruction
      handleCopy();
    } else if (platform === "android") {
      toast.success("Opening in Chrome. If nothing happens, use Copy link.");
    }
  };

  const handleContinueEmail = () => {
    trackEvent("webview_continue_with_email", { platform });
    if (onContinueWithEmail) onContinueWithEmail();
    else onClose?.();
  };

  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-[var(--landing-bg)] p-4 sm:p-6"
          : "fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="webview-gate-title"
    >
      <div
        className={
          fullScreen
            ? "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--landing-line)] bg-white p-6 shadow-[var(--landing-shadow-sm)] sm:p-7"
            : "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--landing-line)] bg-white p-6 shadow-[var(--landing-shadow-sm)]"
        }
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="webview-gate-title"
            className="font-outfit text-lg font-extrabold leading-tight text-[var(--landing-ink)]"
          >
            Open in your browser to sign in
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
          <WarningCircleIcon
            size={16}
            weight="fill"
            className="mt-0.5 shrink-0 text-amber-600"
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed text-amber-900">
            Google does not allow sign in inside the LinkedIn app. Use Chrome or Safari, or
            continue with email which works here.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--landing-ink-soft)]">
            How to open in your browser
          </p>
          {platform === "ios" ? (
            <ol className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">1.</span>
                <span>
                  Tap the <span className="font-semibold text-[var(--landing-ink)]">•••</span> or
                  share icon at the top right of LinkedIn.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">2.</span>
                <span>
                  Choose <span className="font-semibold text-[var(--landing-ink)]">Open in Browser</span> or{" "}
                  <span className="font-semibold text-[var(--landing-ink)]">Open in Safari</span>.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">3.</span>
                <span>Sign in with Google once the page reloads in Safari.</span>
              </li>
            </ol>
          ) : platform === "android" ? (
            <ol className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">1.</span>
                <span>
                  Tap the <span className="font-semibold text-[var(--landing-ink)]">⋮</span> menu at the top
                  right.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">2.</span>
                <span>
                  Choose <span className="font-semibold text-[var(--landing-ink)]">Open in Chrome</span> or{" "}
                  <span className="font-semibold text-[var(--landing-ink)]">Open in browser</span>.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">3.</span>
                <span>Sign in with Google once the page reloads in Chrome.</span>
              </li>
            </ol>
          ) : (
            <ol className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">1.</span>
                <span>Copy the sign in link below.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">2.</span>
                <span>Paste it in Chrome or Safari.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">3.</span>
                <span>Sign in with Google there.</span>
              </li>
            </ol>
          )}
          <p className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs text-[var(--landing-ink-soft)]">
            {urlToShare}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="landing-primary-btn w-full text-sm"
          >
            <CopyIcon size={16} />
            Copy sign in link
          </button>

          {platform === "android" && (
            <button
              type="button"
              onClick={handleOpenExternal}
              className="landing-secondary-btn w-full text-sm"
            >
              <ArrowSquareOutIcon size={18} />
              Try opening in Chrome
            </button>
          )}

          <button
            type="button"
            onClick={handleContinueEmail}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--landing-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--landing-ink)] hover:bg-[var(--landing-paper-soft)]"
          >
            <EnvelopeSimpleIcon size={18} />
            Continue with email instead
          </button>
        </div>

        <p className="mt-3 text-center text-xs leading-relaxed text-[var(--landing-ink-soft)]">
          Email sign in works inside LinkedIn. No need to switch browser.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
        >
          Continue browsing
        </button>
      </div>
    </div>
  );
}
