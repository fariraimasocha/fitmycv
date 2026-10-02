"use client";

import {
  CopyIcon,
  XIcon,
  EnvelopeSimpleIcon,
  ArrowSquareOutIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { tryOpenExternalBrowser } from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";
import { platformOf, useUserAgent } from "@/hooks/use-user-agent";

// Bold step labels inside the translated instructions.
const strong = (chunks) => (
  <span className="font-semibold text-[var(--landing-ink)]">{chunks}</span>
);

export default function WebviewGateModal({
  open,
  onClose,
  onContinueWithEmail,
  targetUrl,
  fullScreen = false,
}) {
  const t = useTranslations("landing.webview");
  const platform = platformOf(useUserAgent());

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
      toast.success(t("toastCopied"));
      trackEvent("webview_copy_link", { platform });
    } catch {
      toast.error(t("toastCopyFailed"));
    }
  };

  const handleOpenExternal = () => {
    trackEvent("webview_try_open_external", { platform });
    const didTry = tryOpenExternalBrowser(urlToShare);
    if (!didTry) {
      // iOS fallback is copy + instruction
      handleCopy();
    } else if (platform === "android") {
      toast.success(t("toastOpening"));
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
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
            aria-label={t("close")}
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
            {t("warning")}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--landing-ink-soft)]">
            {t("howTo")}
          </p>
          {platform === "ios" ? (
            <ol className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">1.</span>
                <span>{t.rich("ios1", { b: strong })}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">2.</span>
                <span>{t.rich("ios2", { b: strong })}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">3.</span>
                <span>{t("ios3")}</span>
              </li>
            </ol>
          ) : platform === "android" ? (
            <ol className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">1.</span>
                <span>{t.rich("android1", { b: strong })}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">2.</span>
                <span>{t.rich("android2", { b: strong })}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">3.</span>
                <span>{t("android3")}</span>
              </li>
            </ol>
          ) : (
            <ol className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">1.</span>
                <span>{t("desktop1")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">2.</span>
                <span>{t("desktop2")}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[var(--landing-ink)]">3.</span>
                <span>{t("desktop3")}</span>
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
            {t("copy")}
          </button>

          {platform === "android" && (
            <button
              type="button"
              onClick={handleOpenExternal}
              className="landing-secondary-btn w-full text-sm"
            >
              <ArrowSquareOutIcon size={18} />
              {t("openChrome")}
            </button>
          )}

          <button
            type="button"
            onClick={handleContinueEmail}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--landing-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--landing-ink)] hover:bg-[var(--landing-paper-soft)]"
          >
            <EnvelopeSimpleIcon size={18} />
            {t("continueEmail")}
          </button>
        </div>

        <p className="mt-3 text-center text-xs leading-relaxed text-[var(--landing-ink-soft)]">
          {t("emailNote")}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
        >
          {t("continueBrowsing")}
        </button>
      </div>
    </div>
  );
}
