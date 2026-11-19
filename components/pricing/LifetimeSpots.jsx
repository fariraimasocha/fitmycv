"use client";

// "6 of 20 lifetime spots left at this price", with a bar of the spots
// already taken. Real count from /api/lifetime-spots; renders nothing while
// loading, on error, or at 0.

import { useQuery } from "@tanstack/react-query";

export default function LifetimeSpots({ className = "" }) {
  const { data } = useQuery({
    queryKey: ["lifetime-spots"],
    queryFn: () => fetch("/api/lifetime-spots").then((r) => (r.ok ? r.json() : null)),
    staleTime: 60_000,
  });
  if (!data?.left) return null;

  const taken = data.total - data.left;

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border border-[var(--landing-accent)]/30 bg-[var(--landing-accent-soft)] px-3.5 py-3 ${className}`}
    >
      <p className="flex items-center gap-2 text-sm font-semibold tabular-nums text-[var(--landing-ink)]">
        <span className="relative flex size-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex size-full rounded-full bg-[var(--landing-accent)] opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-[var(--landing-accent)]" />
        </span>
        <span>
          <span className="text-[var(--landing-accent)]">{data.left} of {data.total}</span> lifetime spots left at this price
        </span>
      </p>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: data.total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < taken ? "bg-[var(--landing-accent)]" : "bg-[var(--landing-ink)]/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
