"use client";

// "6 of 20 lifetime spots left at this price", with a bar of the spots
// already taken. Real count from /api/lifetime-spots; renders nothing while
// loading, on error, or at 0.

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function LifetimeSpots({ className = "" }) {
  const t = useTranslations("pages.pricingCards");
  const { data } = useQuery({
    queryKey: ["lifetime-spots"],
    queryFn: () => fetch("/api/lifetime-spots").then((r) => (r.ok ? r.json() : null)),
    staleTime: 60_000,
  });
  if (!data?.left) return null;

  const taken = data.total - data.left;

  return (
    // ponytail: one line and a thin bar, no box. The price and the pay button
    // stay the loudest things around it.
    <div className={`flex flex-col gap-2 ${className}`}>
      <p className="flex items-center gap-2 text-sm font-medium tabular-nums text-[var(--landing-ink)]">
        {/* ponytail: a still dot. The count only moves when someone buys, so a
            pulse would fake live activity. */}
        <span className="size-2 shrink-0 rounded-full bg-[var(--landing-accent)]" aria-hidden="true" />
        <span>
          {t.rich("spotsLeft", {
            left: data.left,
            total: data.total,
            accent: (chunks) => <span className="text-[var(--landing-accent)]">{chunks}</span>,
          })}
        </span>
      </p>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: data.total }, (_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i < taken ? "bg-[var(--landing-accent)]" : "bg-[var(--landing-ink)]/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
