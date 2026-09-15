"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatCircleDotsIcon, SidebarSimpleIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/Loader";
import { AgentChat } from "@/components/agent/AgentChat";
import { ResumePane } from "@/components/agent/ResumePane";
import { ThreadSidebar } from "@/components/agent/ThreadSidebar";
import { useConfirm } from "@/hooks/use-confirm";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";
import { DEFAULT_TEMPLATE, getTemplateDefaultStyle } from "@/utils/cv-templates/metadata";
import { normalizeTemplateStyle } from "@/utils/cv-templates/style";

// Ported from Reactive Resume's /agent/$threadId route: three resizable panes on
// desktop, tabs on smaller screens.

const DESKTOP_QUERY = "(min-width: 1024px)";

// Exactly one layout mounts, so the composer and its draft text are never duplicated.
function useIsDesktopLayout() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(DESKTOP_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

const DECISION_TOAST = {
  apply: "Edit applied to the draft",
  reject: "Edit declined",
  restore: "Draft restored",
};

export default function AgentThreadPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirm, confirmDialog] = useConfirm();
  const [mobileTab, setMobileTab] = useState("chat");
  const threadsPanelRef = useRef(null);
  const resumePanelRef = useRef(null);
  const [isThreadsCollapsed, setIsThreadsCollapsed] = useState(false);
  const [isResumeCollapsed, setIsResumeCollapsed] = useState(false);
  const isDesktopLayout = useIsDesktopLayout();
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
      toast.success(DECISION_TOAST[action]);
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
  const messageCount = thread?.messages.length ?? 0;
  const sending = send.isPending;

  useEffect(() => {
    if (thread?.title) setDetailLabel(thread.title);
    return () => setDetailLabel(null);
  }, [thread?.title, setDetailLabel]);

  // Keep the newest message in view.
  useEffect(() => {
    for (const list of document.querySelectorAll("[data-agent-scroll]")) list.scrollTop = list.scrollHeight;
  }, [messageCount, sending]);

  const togglePanel = (ref, setCollapsed) => {
    const panel = ref.current;
    if (!panel) return;
    if (panel.isCollapsed()) {
      panel.expand();
      setCollapsed(false);
    } else {
      panel.collapse();
      setCollapsed(true);
    }
  };

  if (threadQuery.isLoading) return <Loader />;

  if (!thread) {
    return (
      <div className="grid h-[calc(100dvh-3.5rem)] place-items-center p-6 text-center sm:h-[calc(100dvh-4rem)]">
        <div className="space-y-4">
          <p className="text-muted-foreground">We couldn&apos;t open this thread.</p>
          <Button asChild>
            <Link href="/dashboard/agent">Start a new thread</Link>
          </Button>
        </div>
      </div>
    );
  }

  const template = referenceCV?.template ?? DEFAULT_TEMPLATE;
  const style = normalizeTemplateStyle(referenceCV?.templateStyle ?? getTemplateDefaultStyle(template));

  const handleDelete = async () => {
    const confirmed = await confirm("Delete this thread?", {
      description: "This deletes the conversation. The draft CV stays in Tailored CVs.",
    });
    if (confirmed) remove.mutate();
  };

  const chatProps = {
    thread,
    sending,
    sendingText: send.variables,
    onSend: (message, restore) => send.mutate(message, { onError: restore }),
    decidingId: decide.isPending ? decide.variables?.proposalId : null,
    onDecide: (proposalId, action) => decide.mutate({ proposalId, action }),
    onReviewChange: (value) => review.mutate(value),
    onDelete: () => void handleDelete(),
  };
  const resumePane = <ResumePane draft={draft} template={template} style={style} />;

  return (
    <div className="h-[calc(100dvh-3.5rem)] min-w-0 overflow-hidden bg-[var(--landing-bg)] sm:h-[calc(100dvh-4rem)]">
      {isDesktopLayout ? (
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel
            id="threads"
            panelRef={threadsPanelRef}
            defaultSize="18%"
            minSize="220px"
            maxSize="360px"
            collapsible
            collapsedSize="0px"
            onResize={(size) => setIsThreadsCollapsed(size.inPixels < 24)}
          >
            <ThreadSidebar activeThreadId={id} className={cn(isThreadsCollapsed && "invisible")} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="chat" defaultSize="52%" minSize="320px">
            <AgentChat
              {...chatProps}
              onToggleThreads={() => togglePanel(threadsPanelRef, setIsThreadsCollapsed)}
              onToggleResume={() => togglePanel(resumePanelRef, setIsResumeCollapsed)}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            id="resume"
            panelRef={resumePanelRef}
            defaultSize="30%"
            minSize="340px"
            maxSize="70%"
            collapsible
            collapsedSize="0px"
            onResize={(size) => setIsResumeCollapsed(size.inPixels < 24)}
          >
            <div className={cn("h-full", isResumeCollapsed && "invisible")}>{resumePane}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex h-full min-w-0 flex-col">
          <div className="shrink-0 border-b border-[var(--landing-line)] p-2">
            <Tabs value={mobileTab} onValueChange={setMobileTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="threads">
                  <SidebarSimpleIcon />
                  Threads
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <ChatCircleDotsIcon />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="resume">
                  <SquaresFourIcon />
                  Draft
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className={cn("h-full min-w-0", mobileTab !== "threads" && "hidden")}>
              <ThreadSidebar activeThreadId={id} className="border-r-0" />
            </div>
            <div className={cn("h-full min-w-0", mobileTab !== "chat" && "hidden")}>
              <AgentChat {...chatProps} />
            </div>
            <div className={cn("h-full min-w-0", mobileTab !== "resume" && "hidden")}>{resumePane}</div>
          </div>
        </div>
      )}
      {confirmDialog}
    </div>
  );
}
