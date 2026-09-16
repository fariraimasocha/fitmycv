"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChatCircleDotsIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  FileTextIcon,
  ListIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/Loader";
import {
  DashboardEmptyState,
  DashboardPageShell,
  DashboardTabBar,
} from "@/components/dashboard";
import { AgentChat } from "@/components/agent/AgentChat";
import { ResumePane } from "@/components/agent/ResumePane";
import { ThreadList } from "@/components/agent/ThreadSidebar";
import { useConfirm } from "@/hooks/use-confirm";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";
import { DEFAULT_TEMPLATE, getTemplateDefaultStyle } from "@/utils/cv-templates/metadata";
import { normalizeTemplateStyle } from "@/utils/cv-templates/style";

// Desktop shows the chat and the draft side by side. Below lg they share the
// screen and a Chat / Draft switch picks one. Both stay mounted, so switching
// never loses the composer text or the preview zoom.

// Every control in the header bar is 2.25rem tall so the row reads as one line.
const HEADER_ICON_BTN =
  "size-9 shrink-0 rounded-md text-[var(--landing-ink-soft)] hover:bg-[var(--landing-primary-soft)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40";

const DECISION_TOAST = {
  apply: "Change applied to your draft",
  reject: "Change declined",
  restore: "Draft restored",
};

export default function AgentThreadPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirm, confirmDialog] = useConfirm();
  const [pane, setPane] = useState("chat");
  const [threadsOpen, setThreadsOpen] = useState(false);
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);

  const threadQuery = useQuery({
    queryKey: ["agent-thread", id],
    queryFn: () => requestJson(`/api/agent/threads/${id}`),
  });
  const { data: referenceCV } = useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      if (!res.ok) throw new Error("Failed to fetch resume");
      const json = await res.json();
      return json.data;
    },
  });

  const setData = (payload) => queryClient.setQueryData(["agent-thread", id], payload);
  const refreshDraft = (payload) => {
    if (payload.draft) queryClient.invalidateQueries({ queryKey: ["tailored-cv", String(payload.draft._id)] });
  };

  const send = useMutation({
    mutationFn: (message) => requestJson(`/api/agent/threads/${id}/messages`, { method: "POST", body: { text: message } }),
    onSuccess: (payload) => {
      setData(payload);
      refreshDraft(payload);
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const decide = useMutation({
    mutationFn: ({ proposalId, action }) =>
      requestJson(`/api/agent/threads/${id}/proposals/${proposalId}`, { method: "POST", body: { action } }),
    onSuccess: (payload, { action }) => {
      setData(payload);
      refreshDraft(payload);
      // On a phone the draft is on the other tab, so offer a way to see the result.
      const draftHidden = !window.matchMedia("(min-width: 1024px)").matches;
      toast.success(DECISION_TOAST[action], {
        action:
          draftHidden && action !== "reject" ? { label: "View draft", onClick: () => setPane("draft") } : undefined,
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const review = useMutation({
    mutationFn: (reviewEdits) => requestJson(`/api/agent/threads/${id}`, { method: "PATCH", body: { reviewEdits } }),
    onSuccess: (_data, reviewEdits) =>
      queryClient.setQueryData(["agent-thread", id], (old) => old && { ...old, thread: { ...old.thread, reviewEdits } }),
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: () => requestJson(`/api/agent/threads/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
      toast.success("Thread deleted. Its draft is still in Tailored CVs.");
      router.push("/dashboard/agent");
    },
    onError: (error) => toast.error(error.message),
  });

  const thread = threadQuery.data?.thread;
  const draft = threadQuery.data?.draft;

  useEffect(() => {
    if (thread?.title) setDetailLabel(thread.title);
    return () => setDetailLabel(null);
  }, [thread?.title, setDetailLabel]);

  if (threadQuery.isLoading) return <Loader />;

  if (!thread) {
    return (
      <DashboardPageShell width="narrow">
        <DashboardEmptyState
          icon={ChatCircleDotsIcon}
          title="We couldn't open this thread"
          description="It may have been deleted. Start a new thread to keep editing your CV."
          actionLabel="Start a new thread"
          actionHref="/dashboard/agent"
          delay={0}
        />
      </DashboardPageShell>
    );
  }

  const template = referenceCV?.template ?? DEFAULT_TEMPLATE;
  const style = normalizeTemplateStyle(referenceCV?.templateStyle ?? getTemplateDefaultStyle(template));
  const pendingCount = thread.proposals.filter((p) => p.status === "pending").length;

  const paneTabs = [
    {
      id: "chat",
      icon: <ChatCircleDotsIcon size={14} aria-hidden="true" />,
      label: (
        <span className="inline-flex items-center gap-1.5">
          Chat
          {pendingCount > 0 && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--landing-accent)] px-1 text-xs leading-none text-white tabular-nums">
              {pendingCount}
              <span className="sr-only"> changes waiting for review</span>
            </span>
          )}
        </span>
      ),
    },
    { id: "draft", icon: <FileTextIcon size={14} aria-hidden="true" />, label: "Draft" },
  ];

  const handleDelete = async () => {
    const confirmed = await confirm("Delete this thread?", {
      description: "This deletes the conversation. The draft CV stays in Tailored CVs.",
    });
    if (confirmed) remove.mutate();
  };

  const copyConversation = async () => {
    const lines = thread.messages
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim())
      .map((m) => `${m.role === "user" ? "You" : "Agent"}: ${m.content}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n\n"));
      toast.success("Conversation copied");
    } catch {
      toast.error("Couldn't copy. Select the text and copy it yourself.");
    }
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-w-0 flex-col overflow-hidden bg-[var(--landing-bg)] sm:h-[calc(100dvh-4rem)]">
      <header className="shrink-0 border-b border-[var(--landing-line)] bg-[var(--landing-surface)]">
        <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
          <button
            type="button"
            aria-label="Show threads"
            onClick={() => setThreadsOpen(true)}
            className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0 px-2.5 sm:px-3.5"
          >
            <ListIcon size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Threads</span>
          </button>
          <div className="min-w-0 flex-1 px-1">
            <h1 className="truncate font-outfit text-sm font-semibold text-foreground">{thread.title}</h1>
            <p className="truncate text-xs text-muted-foreground">
              Editing a copy of {thread.sourceLabel || "your CV"}
            </p>
          </div>
          <label className="hidden h-9 shrink-0 cursor-pointer items-center gap-2 rounded-md border border-[var(--landing-line)] px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:flex">
            <Switch
              checked={thread.reviewEdits}
              disabled={review.isPending}
              onCheckedChange={(checked) => review.mutate(Boolean(checked))}
            />
            Review edits first
          </label>
          <Button asChild size="icon-sm" variant="ghost" aria-label="New thread" className={HEADER_ICON_BTN}>
            <Link href="/dashboard/agent">
              <PlusIcon size={16} aria-hidden="true" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label="Thread actions" className={HEADER_ICON_BTN}>
                <DotsThreeVerticalIcon size={16} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                className="md:hidden"
                checked={thread.reviewEdits}
                onCheckedChange={(checked) => review.mutate(Boolean(checked))}
              >
                Review edits first
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem onClick={() => void copyConversation()}>
                <CopyIcon />
                Copy conversation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => void handleDelete()}>
                <TrashIcon />
                Delete thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-3 pb-2.5 lg:hidden">
          <DashboardTabBar
            ariaLabel="Show chat or draft"
            tabs={paneTabs}
            activeTab={pane}
            onTabChange={setPane}
            className="w-full sm:w-full [&>button]:flex-1"
          />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-rows-1 lg:grid-cols-[minmax(20rem,2fr)_3fr] xl:grid-cols-[30rem_1fr]">
        <div
          className={cn(
            "min-h-0 min-w-0 lg:block lg:border-r lg:border-[var(--landing-line)]",
            pane !== "chat" && "hidden"
          )}
        >
          <AgentChat
            thread={thread}
            draft={draft}
            sending={send.isPending}
            sendingText={send.variables}
            onSend={(message, restore) => send.mutate(message, { onError: restore })}
            decidingId={decide.isPending ? decide.variables?.proposalId : null}
            onDecide={(proposalId, action) => decide.mutate({ proposalId, action })}
          />
        </div>
        <div className={cn("min-h-0 min-w-0 lg:block", pane !== "draft" && "hidden")}>
          <ResumePane draft={draft} template={template} style={style} />
        </div>
      </div>

      <Sheet open={threadsOpen} onOpenChange={setThreadsOpen}>
        <SheetContent side="left" className="w-80 max-w-[85vw] gap-0 bg-[var(--landing-surface)] p-0">
          <SheetHeader className="border-b border-[var(--landing-line)] p-4">
            <SheetTitle className="font-outfit">Threads</SheetTitle>
            <SheetDescription>Each thread edits its own copy of a CV.</SheetDescription>
          </SheetHeader>
          <div className="border-b border-[var(--landing-line)] p-3">
            <Link
              href="/dashboard/agent"
              onClick={() => setThreadsOpen(false)}
              className="dashboard-primary-btn w-full"
            >
              <PlusIcon size={16} weight="bold" aria-hidden="true" />
              New thread
            </Link>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ThreadList activeThreadId={id} onNavigate={() => setThreadsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      {confirmDialog}
    </div>
  );
}
