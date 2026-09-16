"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, KanbanIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { computeInsights } from "@/lib/applications";
import { cn } from "@/lib/utils";

function CardFrame({ children, className, delay }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn("min-w-0", className)}
    >
      <Card className="dashboard-card h-full gap-0 rounded-lg py-0">
        <CardContent className="dashboard-card-pad flex h-full flex-col">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Header({ title, description, href, linkLabel }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-outfit text-sm font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {linkLabel}
          <ArrowRightIcon size={12} weight="bold" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function DashboardPipelineCard({
  applications,
  isPremium,
  isLoading,
  className,
  delay = 0,
}) {
  if (!isPremium) {
    return (
      <CardFrame className={className} delay={delay}>
        <Header title="Applications" description="Pipeline tracking is on Pro." />
        <div className="mt-4 flex flex-1 flex-col justify-between gap-4 rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-surface)] text-[var(--landing-ink-soft)] landing-inset-edge">
              <LockSimpleIcon size={17} aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
              Track every role from saved to offer, with follow-up dates and
              contacts in one place.
            </p>
          </div>
          <Link
            href="/dashboard/upgrade"
            className="dashboard-primary-btn w-full text-sm"
          >
            See Pro plans
          </Link>
        </div>
      </CardFrame>
    );
  }

  const rows = Array.isArray(applications) ? applications : [];
  const active = rows.filter((a) => !a.archived);
  const insights = computeInsights(active);
  const stages = insights.funnel;
  const shown = stages.filter((s) => s.count > 0);

  return (
    <CardFrame className={className} delay={delay}>
      <Header
        title="Applications"
        description={
          insights.total > 0
            ? `${insights.total} in your pipeline`
            : "Nothing tracked yet"
        }
        href="/dashboard/applications"
        linkLabel="Open board"
      />

      {isLoading ? (
        <div className="mt-5 flex flex-1 flex-col gap-3">
          <div className="tool-skeleton h-2.5 rounded-full" />
          <div className="tool-skeleton h-4 w-2/3 rounded-sm" />
          <div className="tool-skeleton h-4 w-1/2 rounded-sm" />
        </div>
      ) : insights.total === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-start justify-between gap-4 rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-surface)] text-[var(--landing-ink-soft)] landing-inset-edge">
              <KanbanIcon size={17} aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
              Every CV you tailor is added here as Saved. Move it to Applied
              once you send it.
            </p>
          </div>
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
          >
            Open your pipeline
            <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <>
          {/* One bar, split by stage. Colors come from lib/applications so
              they match the board. */}
          <div
            className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--landing-paper-strong)]"
            role="img"
            aria-label={shown
              .map((s) => `${s.label} ${s.count}`)
              .join(", ")}
          >
            {shown.map((s) => (
              <span
                key={s.key}
                style={{
                  width: `${(s.count / insights.total) * 100}%`,
                  background: s.color,
                }}
                className="h-full"
              />
            ))}
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {stages.map((s) => (
              <li key={s.key} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: s.color }}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate text-[var(--landing-ink-soft)]">
                  {s.label}
                </span>
                <span className="font-medium tabular-nums text-foreground">
                  {s.count}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-[var(--landing-line)] pt-4">
            <div>
              <dt className="text-xs text-muted-foreground">Applied</dt>
              <dd className="font-outfit text-lg font-semibold leading-tight tabular-nums text-foreground">
                {insights.applied}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Interviews</dt>
              <dd className="font-outfit text-lg font-semibold leading-tight tabular-nums text-foreground">
                {insights.interviews}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Response rate</dt>
              <dd className="font-outfit text-lg font-semibold leading-tight tabular-nums text-foreground">
                {insights.applied > 0 ? `${insights.responseRate}%` : "n/a"}
              </dd>
            </div>
          </dl>
        </>
      )}
    </CardFrame>
  );
}
