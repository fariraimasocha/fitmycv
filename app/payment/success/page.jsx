"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const PREMIUM_STATUS_ENDPOINT = "/api/user/premium-status";

export default function PaymentSuccessPage() {
  const { update } = useSession();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["premium-status"],
    queryFn: async () => {
      const res = await fetch(PREMIUM_STATUS_ENDPOINT, {
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Failed to check premium status");
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
    if (!isPremiumConfirmed) return;
    setSessionUpdating(true);
    update().then(() => router.push("/dashboard"));
  }, [isPremiumConfirmed, update, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--landing-bg)] px-4">
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
          Payment Successful!
        </h1>

        <p className="text-lg font-medium text-[var(--landing-ink)] mb-4">
          Premium Activated
        </p>

        <p className="text-[var(--landing-ink-soft)] mb-6">
          Thank you for your purchase! You now have access to all premium
          features.
        </p>

        {isPremiumConfirmed ? (
          <p className="text-sm text-[var(--landing-ink-soft)]">
            {sessionUpdating ? "Updating session..." : "Redirecting to dashboard..."}
          </p>
        ) : (
          <div>
            <p className="text-sm text-[var(--landing-ink-soft)] mb-4">
              Activating premium features...
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-[var(--landing-ink-faint)] underline"
            >
              Taking too long? Skip to dashboard
            </button>
          </div>
        )}

        {isPremiumConfirmed && (
          <p className="text-sm text-[var(--landing-success)] mt-4">
            Premium status confirmed ✓
          </p>
        )}
      </div>
    </div>
  );
}
