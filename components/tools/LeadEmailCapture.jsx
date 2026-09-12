"use client";

import { useState } from "react";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

export default function LeadEmailCapture({ score, missingKeywordCount }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email address.");
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
        toast.error(data.error ?? "Could not save your email.");
        return;
      }

      trackEvent("lead_captured", { source: "ats_checker" });
      setSaved(true);
      toast.success("Sent. Check your inbox for your score and next steps.");
    } catch {
      toast.error("Could not save your email.");
    } finally {
      setSubmitting(false);
    }
  };

  if (saved) {
    return (
      <div className="mt-8 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-5">
        <p className="text-sm font-semibold text-[var(--landing-ink)]">
          Check your inbox
        </p>
        <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
          We emailed your score and a link to fix the gaps.
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
        Email me this score and a link to fix the gaps
      </p>
      <p className="mt-1 text-sm text-[var(--landing-ink-soft)]">
        Optional. No account needed.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="lead-email" className="sr-only">
          Email address
        </label>
        <input
          id="lead-email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-[var(--landing-line)] bg-white px-4 py-2.5 text-sm text-[var(--landing-ink)] outline-none focus:border-[var(--landing-accent)]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="landing-secondary-btn shrink-0 font-outfit text-sm disabled:opacity-60"
        >
          <EnvelopeSimpleIcon size={16} />
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
