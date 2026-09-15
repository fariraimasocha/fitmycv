"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatCircleDotsIcon, DotsThreeVerticalIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function ThreadActions({ thread, activeThreadId }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirm, confirmDialog] = useConfirm();

  const remove = useMutation({
    mutationFn: () => requestJson(`/api/agent/threads/${thread._id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
      toast.success("Thread deleted. Its draft is still in Tailored CVs.");
      if (activeThreadId === thread._id) router.push("/dashboard/agent");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleDelete = async () => {
    const confirmed = await confirm("Delete this thread?", {
      description: "This deletes the conversation. The draft CV stays in Tailored CVs.",
    });
    if (confirmed) remove.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={`Actions for ${thread.title}`}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <DotsThreeVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" disabled={remove.isPending} onClick={() => void handleDelete()}>
            <TrashIcon />
            Delete thread
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {confirmDialog}
    </>
  );
}

/** Every thread, newest first. Used on the CV Agent start page and in the thread drawer. */
export function ThreadList({ activeThreadId = null, onNavigate }) {
  const [now] = useState(() => Date.now());
  const { data: threads, isLoading } = useQuery({
    queryKey: ["agent-threads"],
    queryFn: () => requestJson("/api/agent/threads"),
  });

  if (isLoading) {
    return (
      <div className="space-y-2" aria-label="Loading threads">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-15 animate-pulse rounded-lg bg-[var(--landing-paper-strong)]" />
        ))}
      </div>
    );
  }

  if (!threads?.length) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--landing-line)] px-4 py-6 text-center text-sm text-muted-foreground">
        No threads yet. Start one and it shows up here.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {threads.map((thread) => {
        const active = thread._id === activeThreadId;
        return (
          <li key={thread._id} className="relative">
            <Link
              href={`/dashboard/agent/${thread._id}`}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg border bg-[var(--landing-surface)] py-2.5 pr-12 pl-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40",
                active
                  ? "border-[var(--landing-ink)]"
                  : "border-[var(--landing-line)] hover:border-[var(--landing-ink-faint)]"
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] text-muted-foreground">
                <ChatCircleDotsIcon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{thread.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {[thread.sourceLabel, relativeTime(thread.updatedAt, now)].filter(Boolean).join(" · ")}
                </span>
              </span>
            </Link>
            <ThreadActions thread={thread} activeThreadId={activeThreadId} />
          </li>
        );
      })}
    </ul>
  );
}
