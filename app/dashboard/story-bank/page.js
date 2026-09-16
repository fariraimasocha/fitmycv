"use client";

import { useId, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpenIcon,
  BriefcaseIcon,
  CaretDownIcon,
  ListChecksIcon,
  PlusIcon,
  SpinnerGapIcon,
  TagIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
  DashboardEmptyState,
  DashboardStatStrip,
} from "@/components/dashboard";
import { cn } from "@/lib/utils";

const PAGE_TITLE = "Story Bank";
const PAGE_DESCRIPTION =
  "STAR stories you saved from interview prep, in one place. Open one to rehearse it before an interview.";

// Reflection is deliberately last and separated. It is not part of the STAR
// acronym, so it gets a divider rather than another row in the rail.
const STAR_SECTIONS = ["situation", "task", "action", "result"];

const STORY_FIELDS = [
  { key: "situation", label: "Situation", hint: "Where you were and what was going on." },
  { key: "task", label: "Task", hint: "What you had to do." },
  { key: "action", label: "Action", hint: "What you did, step by step." },
  { key: "result", label: "Result", hint: "What changed. Use numbers if you have them." },
  { key: "reflection", label: "Reflection", hint: "What you learned. Optional." },
];

const EMPTY_FORM = {
  title: "",
  situation: "",
  task: "",
  action: "",
  result: "",
  reflection: "",
  tags: "",
};

const MAX_ROW_TAGS = 2;

function usedForLabel(usedFor) {
  if (!usedFor?.length) return null;
  if (usedFor.length === 1) {
    const [first] = usedFor;
    const target = [first.jobTitle, first.company].filter(Boolean).join(" at ");
    return target ? `Used for ${target}` : "Used for 1 application";
  }
  return `Used for ${usedFor.length} applications`;
}

function applicationKey(use) {
  return [use.jobTitle, use.company].filter(Boolean).join("|");
}

function TagPill({ children }) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-1.5 text-xs font-medium text-[var(--landing-ink-soft)]">
      {children}
    </span>
  );
}

function StarRow({ label, value }) {
  return (
    <div className="sm:grid sm:grid-cols-[5.5rem_1fr] sm:gap-x-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--landing-accent-dark)] sm:pt-1">
        {label}
      </p>
      <p className="mt-0.5 text-sm leading-6 whitespace-pre-wrap text-foreground sm:mt-0">{value}</p>
    </div>
  );
}

function StoryRow({ story, index }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const title = story.title || `Story ${index + 1}`;
  const meta = usedForLabel(story.usedFor);
  const star = STAR_SECTIONS.filter((key) => story[key]);
  const tags = story.tags ?? [];
  const hiddenTags = tags.length - MAX_ROW_TAGS;

  return (
    <li className="group">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={cn(
          "dashboard-row-pad flex w-full items-center gap-3 text-left transition-colors",
          "hover:bg-[var(--landing-paper-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40",
          expanded && "bg-[var(--landing-paper-soft)]"
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
          <BookOpenIcon size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
          <span className="mt-0.5 flex min-w-0 items-center gap-x-2 text-xs text-muted-foreground">
            {meta && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <BriefcaseIcon size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{meta}</span>
              </span>
            )}
            <span className="inline-flex shrink-0 items-center gap-1 tabular-nums">
              <ListChecksIcon size={12} aria-hidden="true" />
              {star.length} of {STAR_SECTIONS.length} STAR parts
            </span>
          </span>
        </span>
        {tags.length > 0 && (
          <span className="hidden shrink-0 items-center gap-1 sm:flex">
            {tags.slice(0, MAX_ROW_TAGS).map((tag) => (
              <TagPill key={tag}>{tag}</TagPill>
            ))}
            {hiddenTags > 0 && <TagPill>+{hiddenTags}</TagPill>}
          </span>
        )}
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--landing-ink-soft)] transition-colors group-hover:bg-[var(--landing-primary-soft)] group-hover:text-foreground"
        >
          <CaretDownIcon
            size={14}
            className={cn("transition-transform duration-200", expanded && "rotate-180")}
          />
        </span>
      </button>

      {expanded && (
        <div
          id={panelId}
          className="dashboard-row-pad space-y-3.5 border-t border-[var(--landing-line)] pt-3.5"
        >
          {star.length === 0 && !story.reflection && (
            <p className="text-sm text-muted-foreground">This story has a title only.</p>
          )}
          {star.map((key) => (
            <StarRow key={key} label={key} value={story[key]} />
          ))}
          {story.reflection && (
            <div className={cn(star.length > 0 && "border-t border-[var(--landing-line)] pt-3.5")}>
              <StarRow label="Reflection" value={story.reflection} />
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 border-t border-[var(--landing-line)] pt-3.5 sm:hidden">
              <TagIcon size={12} className="mr-1 text-muted-foreground" aria-hidden="true" />
              {tags.map((tag) => (
                <TagPill key={tag}>{tag}</TagPill>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function RowSkeleton() {
  return (
    <li className="dashboard-row-pad flex items-center gap-3">
      <span className="tool-skeleton h-10 w-10 shrink-0 rounded-md" />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="tool-skeleton h-3.5 w-1/2 rounded-sm" />
        <span className="tool-skeleton h-3 w-1/3 rounded-sm" />
      </span>
      <span className="tool-skeleton h-8 w-8 shrink-0 rounded-md" />
    </li>
  );
}

function AddStoryDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const formId = useId();
  const [form, setForm] = useState(EMPTY_FORM);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const save = useMutation({
    mutationFn: async (values) => {
      const tags = values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const res = await fetch("/api/story-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: {
            title: values.title.trim(),
            situation: values.situation.trim(),
            task: values.task.trim(),
            action: values.action.trim(),
            result: values.result.trim(),
            reflection: values.reflection.trim(),
            tags,
            usedFor: [],
          },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Couldn't save your story. Try again.");
      return json.data;
    },
    onSuccess: (stories) => {
      if (Array.isArray(stories)) queryClient.setQueryData(["story-bank"], stories);
      else queryClient.invalidateQueries({ queryKey: ["story-bank"] });
      toast.success("Story saved");
      setForm(EMPTY_FORM);
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const canSave = form.title.trim().length > 0 && !save.isPending;

  return (
    <Dialog open={open} onOpenChange={(next) => !save.isPending && onOpenChange(next)}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-[var(--landing-line)] bg-[var(--landing-surface)] shadow-none sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-outfit">Add a story</DialogTitle>
          <DialogDescription>
            Write it in STAR form so it is ready to use in an interview.
          </DialogDescription>
        </DialogHeader>
        <form
          id={formId}
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSave) save.mutate(form);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-title`}>Title</Label>
            <Input
              id={`${formId}-title`}
              value={form.title}
              onChange={update("title")}
              placeholder="Led a migration under a tight deadline"
              required
              autoFocus
              className="h-10 border-[var(--landing-line)] bg-[var(--landing-bg)] shadow-none"
            />
          </div>
          {STORY_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`${formId}-${field.key}`}>{field.label}</Label>
              <Textarea
                id={`${formId}-${field.key}`}
                value={form[field.key]}
                onChange={update(field.key)}
                rows={2}
                className="min-h-16 border-[var(--landing-line)] bg-[var(--landing-bg)] shadow-none"
              />
              <p className="text-xs text-muted-foreground">{field.hint}</p>
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-tags`}>Tags</Label>
            <Input
              id={`${formId}-tags`}
              value={form.tags}
              onChange={update("tags")}
              placeholder="leadership, delivery"
              className="h-10 border-[var(--landing-line)] bg-[var(--landing-bg)] shadow-none"
            />
            <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
          </div>
        </form>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={save.isPending}
            className="dashboard-secondary-btn"
          >
            Cancel
          </button>
          <button type="submit" form={formId} disabled={!canSave} className="dashboard-primary-btn">
            {save.isPending ? (
              <>
                <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              "Save story"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StoryBankPage() {
  const [addOpen, setAddOpen] = useState(false);

  const { data: stories, isLoading } = useQuery({
    queryKey: ["story-bank"],
    queryFn: async () => {
      const res = await fetch("/api/story-bank");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
  });

  const list = useMemo(() => (Array.isArray(stories) ? stories : []), [stories]);

  const { applicationCount, tagCount } = useMemo(() => {
    const applications = new Set();
    const tags = new Set();
    list.forEach((story) => {
      story.usedFor?.forEach((use) => {
        const key = applicationKey(use);
        if (key) applications.add(key);
      });
      story.tags?.forEach((tag) => tags.add(tag));
    });
    return { applicationCount: applications.size, tagCount: tags.size };
  }, [list]);

  const count = list.length;
  const addButton = (
    <button type="button" onClick={() => setAddOpen(true)} className="dashboard-primary-btn">
      <PlusIcon size={16} weight="bold" aria-hidden="true" />
      Add story
    </button>
  );

  if (isLoading) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <DashboardPanel pad={false} delay={0.05} aria-hidden="true">
          <div className="grid grid-cols-2 divide-y divide-[var(--landing-line)] sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <span className="tool-skeleton h-8 w-8 shrink-0 rounded-md" />
                <span className="flex flex-1 flex-col gap-1.5">
                  <span className="tool-skeleton h-3 w-1/2 rounded-sm" />
                  <span className="tool-skeleton h-3.5 w-1/3 rounded-sm" />
                </span>
              </div>
            ))}
          </div>
        </DashboardPanel>
        <DashboardPanel pad={false} delay={0.1} aria-label="Loading stories">
          <div className="border-b border-[var(--landing-line)] px-3 py-3 sm:px-4">
            <span className="tool-skeleton block h-3.5 w-28 rounded-sm" />
            <span className="tool-skeleton mt-1.5 block h-3 w-40 rounded-sm" />
          </div>
          <ul className="divide-y divide-[var(--landing-line)]">
            {[0, 1, 2].map((i) => (
              <RowSkeleton key={i} />
            ))}
          </ul>
        </DashboardPanel>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={count > 0 ? addButton : undefined}
      />

      {count === 0 ? (
        <DashboardEmptyState
          icon={BookOpenIcon}
          title="Your stories will show up here"
          description="Save a STAR story from Interview prep on a tailored CV, or write one yourself."
          actionLabel="Add story"
          onAction={() => setAddOpen(true)}
          secondaryLabel="Open tailored CVs"
          secondaryHref="/dashboard/tailored"
        />
      ) : (
        <>
          <DashboardStatStrip
            columns={3}
            items={[
              {
                icon: BookOpenIcon,
                label: "Stories",
                value: count,
                tone: "accent",
              },
              {
                icon: BriefcaseIcon,
                label: "Applications covered",
                value: applicationCount,
              },
              {
                icon: TagIcon,
                label: "Tags",
                value: tagCount,
              },
            ]}
          />

          <DashboardPanel pad={false} delay={0.1} aria-label="Saved stories">
            <DashboardPanelHeader
              title="Saved stories"
              description={`${count} ${count === 1 ? "story" : "stories"}. Open one to read the full answer.`}
              className="border-b border-[var(--landing-line)] px-3 py-3 sm:px-4"
            />
            <ul className="divide-y divide-[var(--landing-line)]">
              {list.map((story, i) => (
                <StoryRow key={story._id || i} story={story} index={i} />
              ))}
            </ul>
          </DashboardPanel>
        </>
      )}

      <AddStoryDialog open={addOpen} onOpenChange={setAddOpen} />
    </DashboardPageShell>
  );
}
