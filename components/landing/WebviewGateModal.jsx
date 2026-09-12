"use client";

import { CopyIcon, XIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function WebviewGateModal({ open, onClose, fullScreen = false }) {
  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + "/auth");
    toast.success("Link copied. Paste it in Chrome or Safari.");
  };

  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-[var(--landing-bg)] p-6"
          : "fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="webview-gate-title"
    >
      <div
        className={
          fullScreen
            ? "w-full max-w-lg rounded-2xl border border-[var(--landing-line)] bg-white p-8 shadow-[var(--landing-shadow-sm)]"
            : "w-full max-w-md rounded-2xl border border-[var(--landing-line)] bg-white p-6 shadow-[var(--landing-shadow-sm)]"
        }
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="webview-gate-title"
            className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]"
          >
            Open in your browser to sign in
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--landing-ink-soft)]">
          Google sign-in does not work inside the LinkedIn app. Copy this link
          and open it in Chrome or Safari. You can also sign in with email on
          the next screen.
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="landing-primary-btn mt-5 w-full text-sm"
        >
          <CopyIcon size={16} />
          Copy sign-in link
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)]"
        >
          Continue anyway
        </button>
      </div>
    </div>
  );
}
