"use client";

// The closing card on the CV-only free tools. Signed in: straight to the
// tailor. Signed out: the CV the tool already read goes along to onboarding,
// so sign-up skips the PDF upload.

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRightIcon } from "@phosphor-icons/react";

import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveCvHandoff } from "@/lib/ats-handoff";
import { trackEvent } from "@/lib/analytics";

export default function HandoffCta({ title, body, label, source, cvText = "" }) {
  const router = useRouter();
  const { data: session } = useSession();
  const gate = useWebviewGate();

  const go = () => {
    const signedIn = Boolean(session?.user);
    trackEvent("ats_handoff_cta", { source, signed_in: signedIn, with_cv: Boolean(cvText.trim()) });
    if (signedIn) {
      router.push("/dashboard/tailor");
      return;
    }
    if (cvText.trim()) saveCvHandoff(cvText, source);
    const authUrl = `/auth?next=${encodeURIComponent("/dashboard/onboarding")}`;
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

  return <CtaCard title={title} body={body} label={label} onClick={go} />;
}

/** The closing card shared by the free tools. */
export function CtaCard({ title, body, label, onClick }) {
  return (
    <div className="mt-9 flex flex-col gap-4 rounded-2xl border border-[oklch(0.47_0.125_177_/_0.25)] bg-[oklch(0.92_0.06_174_/_0.4)] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">{title}</p>
        <p className="mt-1.5 max-w-lg text-sm leading-6 text-[var(--landing-ink-soft)]">{body}</p>
      </div>
      <button type="button" onClick={onClick} className="landing-primary-btn group shrink-0 font-outfit text-sm">
        {label}
        <ArrowRightIcon
          size={15}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
}
