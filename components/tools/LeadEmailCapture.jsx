"use client";

import { useState } from "react";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics";

export default function LeadEmailCapture({ score, missingKeywordCount }) {
  // Only KeywordChecker renders this, and it reads the layout messages, so the copy lives beside its own.
  const t = useTranslations("pages.tools.keywordChecker.leadEmail");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  // The API sends one email per address, ever, and says so with `duplicate`.
  const [duplicate, setDuplicate] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error(t("emailRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source: "ats_checker",
          score,
          missingKeywordCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // The API's error text is English, so the toast uses the visitor's language.
        toast.error(response.status === 429 ? t("tooMany") : response.status === 400 ? t("invalidEmail") : t("saveError"));
        return;
      }

      trackEvent("lead_captured", { source: "ats_checker" });
      setSaved(true);
      setDuplicate(Boolean(data.duplicate));
      if (data.duplicate) {
        toast.success(t("duplicateToast"));
      } else {
        toast.success(t("sentToast"));
      }
    } catch {
      toast.error(t("saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  if (saved) {
    return (
      <div className="mt-8 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-5">
        <p className="text-sm font-semibold text-[var(--landing-ink)]">
          {duplicate ? t("duplicateTitle") : t("sentTitle")}
        </p>
        <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
          {duplicate ? t("duplicateBody") : t("sentBody")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-5"
    >
      <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
        {t("title")}
      </p>
      <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
        {t("body")}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="lead-email" className="sr-only">
          {t("emailLabel")}
        </label>
        <input
          id="lead-email"
          type="email"
          autoComplete="email"
          placeholder={t("placeholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-control min-w-0 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] px-4 text-sm sm:flex-1 text-[var(--landing-ink)] outline-none focus:border-[var(--landing-accent)]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="landing-secondary-btn shrink-0 font-outfit text-sm disabled:opacity-60"
        >
          <EnvelopeSimpleIcon size={16} />
          {submitting ? t("sending") : t("send")}
        </button>
      </div>
    </form>
  );
}
