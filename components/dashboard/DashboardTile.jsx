"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

// Teal's launcher tile: a hairline card with a tinted round icon over a short
// label. Use a row of them for the "start something" choices on a page, not
// for content. Tones map to existing soft tokens so the palette stays ours.
const TONES = {
  neutral: "bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]",
  accent: "bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]",
  success: "bg-[var(--landing-success-soft)] text-[var(--landing-success)]",
};

export function DashboardTile({ href, onClick, icon: Icon, label, description, tone = "neutral", className }) {
  const body = (
    <>
      <span className={cn("flex size-14 items-center justify-center rounded-full", TONES[tone] ?? TONES.neutral)}>
        <Icon size={26} aria-hidden="true" />
      </span>
      <span className="font-outfit text-base font-medium text-[var(--landing-ink)]">{label}</span>
      {description && <span className="-mt-2 text-xs text-muted-foreground">{description}</span>}
    </>
  );
  const cls = cn(
    "dashboard-card flex min-h-40 flex-col items-center justify-center gap-4 rounded-lg p-5 text-center transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-ink)]",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
}

export function DashboardTileGrid({ children, className }) {
  return <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>{children}</div>;
}
