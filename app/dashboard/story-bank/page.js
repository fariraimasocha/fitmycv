"use client";

import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { BookOpenIcon, CaretDownIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
} from "@/components/dashboard";
import { cn } from "@/lib/utils";

const PAGE_TITLE = "Story Bank";
const PAGE_DESCRIPTION =
  "Your accumulated STAR stories across all applications. Use these to prepare for any interview.";

// Reflection is deliberately last and separated — it is not part of the STAR
// acronym, so it gets a divider rather than another row in the rail.
const STAR_SECTIONS = ["situation", "task", "action", "result"];

function usedForLabel(usedFor) {
  if (!usedFor?.length) return null;
  if (usedFor.length === 1) {
    const [first] = usedFor;
    return `Used for ${[first.company, first.jobTitle].filter(Boolean).join(" — ")}`;
  }
  return `Used for ${usedFor.length} applications`;
}

function StarRow({ label, value }) {
  return (
    <div className="sm:grid sm:grid-cols-[5.5rem_1fr] sm:gap-x-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--landing-accent-dark)] sm:pt-1">
        {label}
      </p>
      <p className="mt-0.5 text-sm leading-6 text-foreground sm:mt-0">{value}</p>
    </div>
  );
}

function StoryCard({ story, index }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const meta = usedForLabel(story.usedFor);
  const star = STAR_SECTIONS.filter((key) => story[key]);

  return (
    <Card className="dashboard-list-row group overflow-hidden rounded-2xl border-border py-0 gap-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="dashboard-row-pad flex w-full items-start gap-3 text-left transition-colors hover:bg-[var(--landing-paper-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">
            {story.title || `Story ${index + 1}`}
          </p>
          {meta && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>
          )}
          {story.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--landing-ink-soft)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--landing-ink-soft)] transition-colors group-hover:bg-[var(--landing-primary-soft)] group-hover:text-foreground"
        >
          <CaretDownIcon
            size={14}
            className={cn("transition-transform duration-200", expanded && "rotate-180")}
          />
        </span>
      </button>

      {expanded && (
        <CardContent
          id={panelId}
          className="dashboard-row-pad space-y-3.5 border-t border-[var(--landing-line)] pt-3.5"
        >
          {star.map((key) => (
            <StarRow key={key} label={key} value={story[key]} />
          ))}
          {story.reflection && (
            <div
              className={cn(
                star.length > 0 && "border-t border-[var(--landing-line)] pt-3.5"
              )}
            >
              <StarRow label="Reflection" value={story.reflection} />
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function StoryBankPage() {
  const reduceMotion = useReducedMotion();

  const { data: stories, isLoading } = useQuery({
    queryKey: ["story-bank"],
    queryFn: async () => {
      const res = await fetch("/api/story-bank");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      {!stories || stories.length === 0 ? (
        <DashboardEmptyState
          icon={BookOpenIcon}
          title="No stories saved yet"
          description="Tailor a resume and use the Interview Prep tab to generate stories, then save them here."
          actionLabel="Go to Tailor CV"
          actionHref="/dashboard/tailor"
        />
      ) : (
        <div className="space-y-2">
          <p className="text-right text-xs text-muted-foreground">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </p>
          {stories.map((story, i) => (
            <motion.div
              key={story._id || i}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <StoryCard story={story} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </DashboardPageShell>
  );
}
