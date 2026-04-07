"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const { update } = useSession();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["premium-status"],
    queryFn: async () => {
      const res = await fetch("/api/user/premium-status");
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

  useEffect(() => {
    if (isPremiumConfirmed) update();
  }, [isPremiumConfirmed, update]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        <p className="text-lg font-medium text-gray-700 mb-4">
          Premium Activated
        </p>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! You now have access to all premium
          features.
        </p>

        {isPremiumConfirmed ? (
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Activating premium features...
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-gray-400 underline"
            >
              Taking too long? Skip to dashboard
            </button>
          </div>
        )}

        {isPremiumConfirmed && (
          <p className="text-sm text-green-600 mt-4">
            Premium status confirmed ✓
          </p>
        )}
      </div>
    </div>
  );
}
