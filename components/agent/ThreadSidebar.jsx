"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatCircleDotsIcon, DotsThreeVerticalIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
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

// Ported from Reactive Resume's agent thread-sidebar.tsx.

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
            aria-label="Thread actions"
            className="absolute top-2 right-1.5 opacity-60 transition-opacity group-hover/thread:opacity-100 hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
          >
            <DotsThreeVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" disabled={remove.isPending} onClick={() => void handleDelete()}>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {confirmDialog}
    </>
  );
}

export function ThreadSidebar({ activeThreadId = null, className }) {
  const [now] = useState(() => Date.now());
  const { data: threads, isLoading } = useQuery({
    queryKey: ["agent-threads"],
    queryFn: () => requestJson("/api/agent/threads"),
  });

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col border-r border-[var(--landing-line)] bg-[var(--landing-paper-soft)]",
        className
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--landing-line)] px-3">
        <ChatCircleDotsIcon className="size-4 shrink-0" />
        <div className="min-w-0 truncate font-semibold">Threads</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          <Button
            asChild
            variant="ghost"
            className="mb-2 w-full justify-start border border-dashed border-[var(--landing-line)] bg-[var(--landing-surface)]/40 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/agent">
              <PlusIcon />
              New thread
            </Link>
          </Button>
          {isLoading && <div className="px-3 py-2 text-sm text-muted-foreground">Loading threads…</div>}
          {threads?.length === 0 && (
            <div className="rounded-md border border-dashed border-[var(--landing-line)] p-3 text-sm text-muted-foreground">
              No threads yet.
            </div>
          )}
          {threads?.map((thread) => (
            <div
              key={thread._id}
              className={cn(
                "group/thread relative rounded-md transition-colors hover:bg-[var(--landing-primary-soft)]",
                thread._id === activeThreadId && "bg-[var(--landing-primary-soft)]"
              )}
            >
              <Link
                href={`/dashboard/agent/${thread._id}`}
                aria-current={thread._id === activeThreadId ? "page" : undefined}
                className="block min-w-0 rounded-md px-3 py-2 pr-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <div className="truncate font-medium text-foreground">{thread.title}</div>
                <div className="truncate text-xs text-muted-foreground">{relativeTime(thread.updatedAt, now)}</div>
              </Link>
              <ThreadActions thread={thread} activeThreadId={activeThreadId} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
