"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  LightbulbIcon,
  WarningCircleIcon,
  ChatTeardropDotsIcon,
  BookmarkSimpleIcon,
  CaretDownIcon,
  CaretUpIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { DashboardPanelHeader } from "@/components/dashboard";

const STAR_FIELDS = [
  ["Situation", "situation"],
  ["Task", "task"],
  ["Action", "action"],
  ["Result", "result"],
  ["Reflection", "reflection"],
];

function StoryAccordion({ story, index, onSave }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[var(--landing-paper-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-ink)]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] font-outfit text-sm font-semibold tabular-nums text-foreground">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {story.requirement}
          </span>
          <span className="block text-xs text-muted-foreground">STAR story</span>
        </span>
        {expanded ? (
          <CaretUpIcon size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : (
          <CaretDownIcon size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </button>
      {expanded && (
        <div className="flex flex-col gap-3 border-t border-[var(--landing-line)] px-3 pb-3 pt-3">
          {STAR_FIELDS.map(([label, key]) =>
            story[key] ? (
              <div key={key}>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-sm leading-6 text-foreground">{story[key]}</p>
              </div>
            ) : null,
          )}
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(story)}
              className="dashboard-secondary-btn dashboard-secondary-btn-sm self-start"
            >
              <BookmarkSimpleIcon size={14} aria-hidden="true" />
              Save to story bank
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="tool-skeleton h-14 w-full rounded-md" />
      ))}
      <div className="tool-skeleton h-24 w-full rounded-md" />
    </div>
  );
}

function SectionTitle({ icon: Icon, tone, children }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <span
        className={
          tone === "success"
            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--landing-success-soft)] text-[var(--landing-success)]"
            : tone === "accent"
              ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]"
              : "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground"
        }
      >
        <Icon size={14} aria-hidden="true" />
      </span>
      {children}
    </h3>
  );
}

export default function InterviewPrepCard({ prepData, isLoading, jobTitle, jobCompany }) {
  if (isLoading) {
    return (
      <section className="dashboard-card dashboard-card-pad rounded-lg">
        <DashboardPanelHeader
          title="Interview prep"
          description="Writing STAR stories and talking points from your CV and this posting"
        />
        <div className="mt-4">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (!prepData) {
    return (
      <section className="dashboard-card dashboard-card-pad rounded-lg">
        <DashboardPanelHeader
          title="Interview prep"
          description="STAR stories, tricky questions and talking points for this role."
        />
        <p className="mt-4 rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-4 text-sm leading-6 text-[var(--landing-ink-soft)]">
          Your interview prep will appear here once the CV is tailored.
        </p>
      </section>
    );
  }

  const handleSaveStory = async (story) => {
    try {
      const res = await fetch("/api/story-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: {
            title: story.requirement,
            situation: story.situation,
            task: story.task,
            action: story.action,
            result: story.result,
            reflection: story.reflection,
            tags: [],
            usedFor: [{ jobTitle: jobTitle || "", company: jobCompany || "", date: new Date() }],
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Story saved to your story bank");
    } catch {
      toast.error("Couldn't save the story. Try again.");
    }
  };

  const { stories, redFlagQA, talkingPoints } = prepData;

  return (
    <section className="dashboard-card flex flex-col overflow-hidden rounded-lg">
      <div className="dashboard-card-pad border-b border-[var(--landing-line)]">
        <DashboardPanelHeader
          title="Interview prep"
          description="Drawn from your tailored CV and this posting."
        />
      </div>
      <div className="divide-y divide-[var(--landing-line)]">
        {stories?.length > 0 && (
          <div className="dashboard-card-pad">
            <SectionTitle icon={ChatTeardropDotsIcon}>STAR stories</SectionTitle>
            <ul className="mt-3 flex flex-col gap-2">
              {stories.map((story, i) => (
                <StoryAccordion key={i} story={story} index={i} onSave={handleSaveStory} />
              ))}
            </ul>
          </div>
        )}

        {redFlagQA?.length > 0 && (
          <div className="dashboard-card-pad">
            <SectionTitle icon={WarningCircleIcon} tone="accent">
              Questions to prepare for
            </SectionTitle>
            <ul className="mt-3 flex flex-col gap-2">
              {redFlagQA.map((qa, i) => (
                <li
                  key={i}
                  className="rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-3"
                >
                  <p className="text-sm font-medium text-foreground">{qa.question}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--landing-ink-soft)]">
                    {qa.suggestedAnswer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {talkingPoints?.length > 0 && (
          <div className="dashboard-card-pad">
            <SectionTitle icon={LightbulbIcon} tone="success">
              Talking points
            </SectionTitle>
            <ul className="mt-3 flex flex-col gap-2">
              {talkingPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-6 text-[var(--landing-ink-soft)]">
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="mt-1.5 shrink-0 text-[var(--landing-success)]"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
