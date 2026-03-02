"use client";

import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores/checkout-store";

const features = [
  "AI-powered CV tailoring",
  "Smart cover letter generation",
  "Job requirement analysis",
  "PDF export & download",
  "Unlimited generations",
];

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const setPendingCheckout = useCheckoutStore((s) => s.setPendingCheckout);

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/api/polar/checkout");
    } else {
      setPendingCheckout(true);
      router.push("/auth");
    }
  };

  return (
    <section
      id="pricing"
      className="bg-[#F8FAFC] flex flex-col items-center gap-8 px-5 sm:px-8 md:px-16 lg:px-[100px] xl:px-[140px] py-16 md:py-20 lg:py-[100px]"
    >
      {/* Header */}
      <div className="flex flex-col items-center" style={{ gap: 20 }}>
        {/* Badge — no background */}
        <span
          className="inline-flex items-center justify-center"
          style={{
            borderRadius: 9999,
            border: "1px solid #E2E8F0",
            padding: "8px 20px",
            fontFamily: "var(--font-sn-pro)",
            fontWeight: 500,
            fontSize: 14,
            color: "#64748B",
          }}
        >
          Pricing
        </span>
        <h2
          className="text-[#0F172A] text-center text-[28px] md:text-[36px] lg:text-[44px]"
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 800,
            letterSpacing: "-1.8px",
          }}
        >
          Simple, transparent pricing
        </h2>
        <p
          className="text-[#64748B] text-center text-base md:text-lg"
          style={{
            fontFamily: "var(--font-sn-pro)",
            fontWeight: 400,
          }}
        >
          Everything you need to land your next role.
        </p>
      </div>

      {/* Card */}
      <div
        className="flex flex-col bg-white w-full max-w-[480px]"
        style={{
          borderRadius: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: "1px solid #E5E7EB",
          gap: 28,
          padding: 40,
        }}
      >
        {/* Card top */}
        <div className="flex flex-col" style={{ gap: 8 }}>
          <span
            className="text-[#0F172A]"
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            Premium
          </span>
          <span
            className="text-[#94A3B8]"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontSize: 15,
              fontWeight: 400,
            }}
          >
            Try free for 3 days. Cancel anytime.
          </span>
        </div>

        {/* Price row */}
        <div className="flex flex-row items-end" style={{ gap: 4 }}>
          <span
            className="text-[#0F172A]"
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            $4.99
          </span>
          <span
            className="text-[#94A3B8]"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontSize: 16,
              fontWeight: 400,
              paddingBottom: 4,
            }}
          >
            /month
          </span>
        </div>

        {/* Features list */}
        <div className="flex flex-col" style={{ gap: 20 }}>
          {features.map((feature) => (
            <div
              key={feature}
              className="flex flex-row items-center"
              style={{ gap: 14 }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#0F172A",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                }}
              >
                <Check size={12} color="white" strokeWidth={3} />
              </div>
              <span
                className="text-[#0F172A]"
                style={{
                  fontFamily: "var(--font-sn-pro)",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="w-full transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "#0F172A",
            borderRadius: 12,
            padding: "16px 32px",
            fontFamily: "var(--font-outfit)",
            fontWeight: 600,
            fontSize: 16,
            color: "white",
            cursor: "pointer",
          }}
        >
          Start 3-Day Free Trial
        </button>

        {/* Note */}
        <p
          className="text-[#94A3B8] text-center"
          style={{
            fontFamily: "var(--font-sn-pro)",
            fontSize: 13,
            fontWeight: 400,
          }}
        >
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
