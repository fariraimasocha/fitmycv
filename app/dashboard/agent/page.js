"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CaretRightIcon, RobotIcon, SpinnerGapIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormattedDate from "@/components/FormattedDate";
import { DashboardEmptyState, DashboardPageHeader, DashboardPageShell } from "@/components/dashboard";

async function requestJson(url, { method = "GET", body } = {}) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const failure = await res.json().catch(() => ({}));
    throw new Error(failure.error || "Couldn't reach FitMyCV. Try again.");
  }
  return (await res.json()).data;
}

export default function AgentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sourceId, setSourceId] = useState("reference");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const threads = useQuery({
    queryKey: ["agent-threads"],
    queryFn: () => requestJson("/api/agent/threads"),
  });

  const { data: tailored = [] } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: () => requestJson("/api/tailored-cv"),
  });
  // Drafts are copies already; starting from one would stack copies.
  const sources = tailored.filter((cv) => !cv.jobTitle?.startsWith("Agent draft"));

  const start = useMutation({
    mutationFn: () => requestJson("/api/agent/threads", { method: "POST", body: { sourceId } }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
      queryClient.invalidateQueries({ queryKey: ["tailored-cvs"] });
      router.push(`/dashboard/agent/${data._id}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: (threadId) => requestJson(`/api/agent/threads/${threadId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
      toast.success("Thread deleted. Its draft is still in Tailored CVs.");
      setConfirmDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setConfirmDeleteId(null);
    },
  });

  const list = threads.data ?? [];

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="CV agent"
        description="Chat with an AI agent that edits a copy of your CV. Your original stays as it is, and you can review each change before it applies."
      />

      <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
        <CardContent className="dashboard-card-pad space-y-2">
          <Label htmlFor="agent-source">Start from</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={sourceId} onValueChange={setSourceId}>
              <SelectTrigger id="agent-source" className="w-full sm:flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reference">Main CV</SelectItem>
                {sources.map((cv) => (
                  <SelectItem key={cv._id} value={cv._id}>
                    {[cv.jobTitle || "Tailored CV", cv.jobCompany].filter(Boolean).join(" at ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => start.mutate()}
              disabled={start.isPending}
              aria-busy={start.isPending}
              className="rounded-md bg-foreground font-outfit font-medium text-background hover:bg-black"
            >
              {start.isPending && <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />}
              Start thread
            </Button>
          </div>
        </CardContent>
      </Card>

      {threads.isLoading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Loading threads…</p>
      ) : threads.isError ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{threads.error.message}</p>
      ) : list.length === 0 ? (
        <DashboardEmptyState
          icon={RobotIcon}
          title="No threads yet"
          description="Start a thread above. The agent works on a copy, so you can try ideas without touching your CV."
        />
      ) : (
        <ul className="space-y-2">
          {list.map((thread) => (
            <li key={thread._id}>
              <Card className="rounded-lg border-[var(--landing-line)] py-0 gap-0 transition-colors hover:border-[#ccc5bb]">
                <CardContent className="dashboard-row-pad flex items-center gap-3">
                  <Link href={`/dashboard/agent/${thread._id}`} className="group flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                      <RobotIcon size={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground group-hover:underline">
                        {thread.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {thread.sourceLabel} ·{" "}
                        <FormattedDate date={thread.updatedAt} options={{ month: "short", day: "numeric" }} />
                      </span>
                    </span>
                    <CaretRightIcon size={14} className="shrink-0 text-muted-foreground/60" aria-hidden="true" />
                  </Link>
                  <Button
                    variant={confirmDeleteId === thread._id ? "destructive" : "ghost"}
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title={confirmDeleteId === thread._id ? "Tap again to confirm" : "Delete thread"}
                    aria-label={
                      confirmDeleteId === thread._id ? `Confirm delete ${thread.title}` : `Delete ${thread.title}`
                    }
                    disabled={remove.isPending}
                    onClick={() =>
                      confirmDeleteId === thread._id ? remove.mutate(thread._id) : setConfirmDeleteId(thread._id)
                    }
                  >
                    {confirmDeleteId === thread._id ? "?" : <TrashIcon size={16} />}
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </DashboardPageShell>
  );
}
