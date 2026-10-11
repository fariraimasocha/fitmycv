"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const PREMIUM_STATUS_ENDPOINT = "/api/user/premium-status";

export default function PaymentSuccessPage() {
  const { update } = useSession();
  const router = useRouter();
  const redirected = useRef(false);

  const { data } = useQuery({
    queryKey: ["premium-status"],
    queryFn: async () => {
      const res = await fetch(PREMIUM_STATUS_ENDPOINT, {
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Couldn't check your Pro status.");
      return res.json();
    },
    refetchInterval: (query) => {
      if (query.state.data?.isPremium) return false;
      if ((query.state.dataUpdateCount ?? 0) >= 10) return false;
      return 2000;
    },
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  const isPremiumConfirmed = !!data?.isPremium;
  const [sessionUpdating, setSessionUpdating] = useState(false);

  useEffect(() => {
    if (!isPremiumConfirmed || redirected.current) return;

    redirected.current = true;
    setSessionUpdating(true);
    update().then(() => router.push("/dashboard"));
  }, [isPremiumConfirmed, update, router]);

  return (
    <div dir="ltr" className="min-h-screen flex items-center justify-center bg-[var(--landing-bg)] px-4">
      <div className="max-w-md w-full bg-[var(--landing-surface)] rounded-lg shadow-sm border border-[var(--landing-line)] p-5 sm:p-8 text-center">
        <div className="w-16 h-16 bg-[var(--landing-success-soft)] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[var(--landing-success)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[var(--landing-ink)] mb-2">
          Payment successful
        </h1>

        <p className="text-lg font-medium text-[var(--landing-ink)] mb-4">
          Thanks for upgrading to Pro
        </p>

        <p className="text-[var(--landing-ink-soft)] mb-6">
          Pro lets you download your tailored CVs and cover letters as
          PDFs.
        </p>

        {isPremiumConfirmed ? (
          <p className="text-sm text-[var(--landing-ink-soft)]">
            {sessionUpdating ? "Pro is on. Loading your account…" : "Taking you to your dashboard…"}
          </p>
        ) : (
          <div>
            <p className="text-sm text-[var(--landing-ink-soft)] mb-4">
              Activating Pro…
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-[var(--landing-ink-faint)] underline"
            >
              Taking too long? Skip to dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
