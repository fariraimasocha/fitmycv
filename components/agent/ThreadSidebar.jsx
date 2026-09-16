"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRightIcon,
  ChatCircleDotsIcon,
  ClockIcon,
  FileTextIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DashboardEmptyState,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard";
import { useConfirm } from "@/hooks/use-confirm";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

const UNITS = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

function relativeTime(date, now) {
  const seconds = Math.round((new Date(date).getTime() - now) / 1000);
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return "Just now";
}

function ThreadRow({ thread, active, now, onNavigate, onDelete, deleting }) {
  return (
    <li
      className={cn(
        "group relative flex items-center gap-3 transition-colors",
        "dashboard-row-pad",
        active ? "bg-[var(--landing-paper-soft)]" : "hover:bg-[var(--landing-paper-soft)]"
      )}
    >
      {/* Stretched link: the whole row navigates, the delete button stays a
          sibling rather than a child of the anchor. */}
      <Link
        href={`/dashboard/agent/${thread._id}`}
        onClick={onNavigate}
        aria-label={thread.title}
        aria-current={active ? "page" : undefined}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40"
      />
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
          active
            ? "bg-[var(--landing-ink)] text-white"
            : "border border-[var(--landing-line)] text-foreground"
        )}
      >
        <ChatCircleDotsIcon size={18} aria-hidden="true" />
      </span>
      <div className="pointer-events-none relative z-10 min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{thread.title}</p>
        <div className="mt-0.5 flex min-w-0 items-center gap-x-2 text-xs text-muted-foreground">
          {thread.sourceLabel && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <FileTextIcon size={12} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{thread.sourceLabel}</span>
            </span>
          )}
          <span className="inline-flex shrink-0 items-center gap-1 tabular-nums">
            <ClockIcon size={12} aria-hidden="true" />
            {relativeTime(thread.updatedAt, now)}
          </span>
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={deleting}
            onClick={onDelete}
            aria-label={`Delete ${thread.title}`}
            className={cn(
              "relative z-10 shrink-0 text-[var(--landing-ink-soft)] transition-opacity",
              "hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring/40",
              "max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            )}
          >
            <TrashIcon size={16} aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete thread</TooltipContent>
      </Tooltip>
      <ArrowRightIcon
        size={14}
        className="shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
        aria-hidden="true"
      />
    </li>
  );
}

function RowSkeleton() {
  return (
    <li className="dashboard-row-pad flex items-center gap-3">
      <span className="tool-skeleton h-10 w-10 shrink-0 rounded-md" />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="tool-skeleton h-3.5 w-2/5 rounded-sm" />
        <span className="tool-skeleton h-3 w-3/5 rounded-sm" />
      </span>
    </li>
  );
}

/**
 * Every thread, newest first. With `title` it renders as a full panel with a
 * header and count (the CV Agent start page). Without it, a bare divided list
 * for the thread drawer.
 */
export function ThreadList({ activeThreadId = null, onNavigate, title, delay = 0 }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirm, confirmDialog] = useConfirm();
  const [now] = useState(() => Date.now());
  const framed = Boolean(title);

  const { data: threads, isLoading } = useQuery({
    queryKey: ["agent-threads"],
    queryFn: () => requestJson("/api/agent/threads"),
  });

  const remove = useMutation({
    mutationFn: (threadId) => requestJson(`/api/agent/threads/${threadId}`, { method: "DELETE" }),
    onSuccess: (_data, threadId) => {
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
      toast.success("Thread deleted. Its draft is still in Tailored CVs.");
      if (activeThreadId === threadId) router.push("/dashboard/agent");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleDelete = async (threadId) => {
    const confirmed = await confirm("Delete this thread?", {
      description: "This deletes the conversation. The draft CV stays in Tailored CVs.",
    });
    if (confirmed) remove.mutate(threadId);
  };

  const count = threads?.length ?? 0;

  const list = isLoading ? (
    <ul aria-label="Loading threads" className="divide-y divide-[var(--landing-line)]">
      {[0, 1, 2].map((i) => (
        <RowSkeleton key={i} />
      ))}
    </ul>
  ) : (
    <ul className="divide-y divide-[var(--landing-line)]">
      {threads.map((thread) => (
        <ThreadRow
          key={thread._id}
          thread={thread}
          active={thread._id === activeThreadId}
          now={now}
          onNavigate={onNavigate}
          onDelete={() => void handleDelete(thread._id)}
          deleting={remove.isPending && remove.variables === thread._id}
        />
      ))}
    </ul>
  );

  if (!isLoading && count === 0) {
    return framed ? (
      <DashboardEmptyState
        compact
        icon={ChatCircleDotsIcon}
        title="Your threads will show up here"
        description="Start a thread above. Each one edits its own copy of a CV."
        delay={delay}
      />
    ) : (
      <div className="p-3">
        <p className="rounded-md border border-dashed border-[var(--landing-line)] px-4 py-6 text-center text-sm text-muted-foreground">
          Your threads will show up here.
        </p>
      </div>
    );
  }

  if (!framed) {
    return (
      <>
        <div className="border-b border-[var(--landing-line)]">{list}</div>
        {confirmDialog}
      </>
    );
  }

  return (
    <>
      <DashboardPanel pad={false} delay={delay} aria-label={title}>
        <DashboardPanelHeader
          title={title}
          description={
            isLoading
              ? "Newest first"
              : `${count} ${count === 1 ? "thread" : "threads"}, newest first`
          }
          className="border-b border-[var(--landing-line)] px-3 py-3 sm:px-4"
        />
        {list}
      </DashboardPanel>
      {confirmDialog}
    </>
  );
}
