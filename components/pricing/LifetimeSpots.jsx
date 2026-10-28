"use client";

// "3 of 20 lifetime spots left at this price". Real count from
// /api/lifetime-spots; renders nothing while loading, on error, or at 0.

import { useQuery } from "@tanstack/react-query";

export default function LifetimeSpots({ className = "" }) {
  const { data } = useQuery({
    queryKey: ["lifetime-spots"],
    queryFn: () => fetch("/api/lifetime-spots").then((r) => (r.ok ? r.json() : null)),
    staleTime: 60_000,
  });
  if (!data?.left) return null;

  return (
    <p className={`text-xs font-semibold tabular-nums text-[var(--landing-accent)] ${className}`}>
      {data.left} of {data.total} lifetime spots left at this price
    </p>
  );
}
