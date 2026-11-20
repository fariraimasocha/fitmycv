"use client";

// The closing card on the free tools, and the one place that hands a visitor
// to the app. A posting (`jobText`) opens in the tailor's job box. A CV the
// tool already read (`cvText`) goes along to onboarding, so sign-up skips the
// PDF upload.

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRightIcon } from "@phosphor-icons/react";

import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff, saveCvHandoff } from "@/lib/ats-handoff";
import { trackEvent } from "@/lib/analytics";

export default function HandoffCta({
  title,
  body,
  label,
  source,
  cvText = "",
  jobText = "",
  score = null,
  track,
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();

  const go = () => {
    const signedIn = Boolean(session?.user);
    const job = jobText.trim();
    trackEvent("ats_handoff_cta", {
      source,
      signed_in: signedIn,
      with_cv: Boolean(cvText.trim()),
      ...(job ? { score } : {}),
      ...track,
    });
    if (job) saveAtsHandoff({ jobText: job, score, source });
    if (signedIn) {
      router.push("/dashboard/tailor");
      return;
    }
    if (cvText.trim()) saveCvHandoff(cvText, source);
    // With a posting waiting, sign-in lands on the tailor. Without one, on onboarding.
    const next = job ? "/dashboard/tailor" : "/dashboard/onboarding";
    const authUrl = `/auth?next=${encodeURIComponent(next)}`;
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

  return <CtaCard title={title} body={body} label={label} onClick={go} />;
}

/** The closing card shared by the free tools. */
export function CtaCard({ title, body, label, onClick }) {
  return (
    <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">{title}</p>
        <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">{body}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="landing-primary-btn group shrink-0 font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
      >
        {label}
        <ArrowRightIcon
          size={16}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
}
