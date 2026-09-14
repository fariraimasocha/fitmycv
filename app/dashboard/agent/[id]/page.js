"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowCounterClockwiseIcon,
  DownloadSimpleIcon,
  PaperPlaneRightIcon,
  PencilSimpleIcon,
  PlusIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/Loader";
import ResumePreview from "@/components/ResumePreview";
import { DashboardPageHeader, DashboardPageShell, DashboardTabBar } from "@/components/dashboard";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";
import { getAtPath } from "@/lib/cv-patch";
import { cn } from "@/lib/utils";
import { printDocument } from "@/utils/print-document";
import { buildPdfFilename } from "@/utils/pdf-filename";
import { DEFAULT_TEMPLATE, getTemplateDefaultStyle } from "@/utils/cv-templates/metadata";
import { normalizeTemplateStyle } from "@/utils/cv-templates/style";

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

const SUGGESTIONS = [
  { label: "Tailor it to a job link", text: "Tailor my CV to this job: ", send: false },
  { label: "Strengthen weak bullets", text: "Find my weakest bullets and rewrite them to show outcomes. Don't invent numbers.", send: true },
  { label: "Tighten my summary", text: "Tighten my summary to three clear lines.", send: true },
];

const PANES = [
  { id: "chat", label: "Chat" },
  { id: "draft", label: "Draft" },
];

const DECISION_TOAST = {
  apply: "Change applied to the draft",
  reject: "Change rejected",
  restore: "Draft restored",
};

const SECTION_LABEL = { basics: "Personal details", work: "Work", education: "Education", skills: "Skills" };
const OP_LABEL = { add: "Add", replace: "Change", remove: "Remove" };
const STATUS_LABEL = { applied: "Applied", rejected: "Rejected", reverted: "Rolled back" };

/** "/work/0/description" reads as "Work, item 1, description". */
function describePath(path) {
  return String(path)
    .slice(1)
    .split("/")
    .map((token, i) => {
      if (i === 0) return SECTION_LABEL[token] ?? token;
      if (token === "-") return "new item";
      return /^\d+$/.test(token) ? `item ${Number(token) + 1}` : token;
    })
    .join(", ");
}

function formatValue(value) {
  if (value === undefined || value === null || value === "") return "Empty";
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value) && value.every((v) => typeof v !== "object")) return value.join(", ");
  return Object.entries(value)
    .filter(([, v]) => v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(([key, v]) => `${key}: ${Array.isArray(v) ? v.map((x) => (typeof x === "object" ? JSON.stringify(x) : x)).join(", ") : v}`)
    .join("\n");
}

function ProposalCard({ proposal, draft, onDecide, busy }) {
  const pending = proposal.status === "pending";

  return (
    <div className="rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{proposal.title}</p>
          {proposal.summary && <p className="text-sm text-muted-foreground">{proposal.summary}</p>}
        </div>
        {!pending && (
          <span className="shrink-0 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2 py-0.5 text-xs font-medium text-[var(--landing-ink-soft)]">
            {STATUS_LABEL[proposal.status]}
          </span>
        )}
      </div>

      <ul className="mt-3 space-y-2">
        {proposal.operations.map((op, i) => {
          // Before values only make sense while the draft still matches the proposal.
          const before = pending && op.op !== "add" ? getAtPath(draft, op.path) : undefined;
          return (
            <li key={`${op.op}-${op.path}-${i}`} className="space-y-1 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                {OP_LABEL[op.op] ?? op.op}: {describePath(op.path)}
              </p>
              {before !== undefined && (
                <p className="rounded-sm bg-[var(--landing-accent-soft)] px-2 py-1 whitespace-pre-wrap text-[var(--landing-ink-soft)] line-through decoration-[var(--landing-accent-line)]">
                  {formatValue(before)}
                </p>
              )}
              {op.op !== "remove" && (
                <p className="rounded-sm bg-[#eef8f1] px-2 py-1 whitespace-pre-wrap text-foreground">
                  {formatValue(op.value)}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {pending && (
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            className="rounded-md bg-foreground font-medium text-background hover:bg-black"
            disabled={busy}
            onClick={() => onDecide("apply")}
          >
            Apply
          </Button>
          <Button size="sm" variant="ghost" className="rounded-md" disabled={busy} onClick={() => onDecide("reject")}>
            Reject
          </Button>
        </div>
      )}
      {proposal.canRestore && (
        <Button
          size="sm"
          variant="outline"
          className="mt-3 rounded-md border-[var(--landing-line)]"
          disabled={busy}
          onClick={() => onDecide("restore")}
        >
          <ArrowCounterClockwiseIcon size={14} aria-hidden="true" />
          Restore to before this change
        </Button>
      )}
    </div>
  );
}

function QuestionCard({ question, active, onAnswer }) {
  return (
    <div className="rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] p-3">
      <p className="text-sm font-medium text-foreground">{question.question}</p>
      {question.choices?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {question.choices.map((choice) => (
            <Button
              key={choice}
              size="sm"
              variant="outline"
              className="h-auto rounded-md border-[var(--landing-line)] py-1.5 text-left whitespace-normal"
              disabled={!active}
              onClick={() => onAnswer(choice)}
            >
              {choice}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AgentThreadPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [pane, setPane] = useState("chat");
  const scrollRef = useRef(null);
  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);

  const threadQuery = useQuery({
    queryKey: ["agent-thread", id],
    queryFn: () => requestJson(`/api/agent/threads/${id}`),
  });
  const { data: threads = [] } = useQuery({
    queryKey: ["agent-threads"],
    queryFn: () => requestJson("/api/agent/threads"),
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

  const send = useMutation({
    mutationFn: (message) => requestJson(`/api/agent/threads/${id}/messages`, { method: "POST", body: { text: message } }),
    onSuccess: (payload) => {
      setData(payload);
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
      if (payload.draft) queryClient.invalidateQueries({ queryKey: ["tailored-cv", String(payload.draft._id)] });
    },
    onError: (error, message) => {
      // Give the unsent text back unless the user has started typing again.
      setText((current) => current || message);
      toast.error(error.message);
    },
  });

  const decide = useMutation({
    mutationFn: ({ proposalId, action }) =>
      requestJson(`/api/agent/threads/${id}/proposals/${proposalId}`, { method: "POST", body: { action } }),
    onSuccess: (payload, { action }) => {
      setData(payload);
      if (payload.draft) queryClient.invalidateQueries({ queryKey: ["tailored-cv", String(payload.draft._id)] });
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
    const list = scrollRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messageCount, sending]);

  if (threadQuery.isLoading) return <Loader />;
  if (!thread) {
    return (
      <DashboardPageShell width="narrow">
        <p className="text-center text-sm text-muted-foreground">
          {threadQuery.error?.message || "This thread doesn't exist."}{" "}
          <Link href="/dashboard/agent" className="font-semibold text-foreground hover:underline">
            Back to threads
          </Link>
        </p>
      </DashboardPageShell>
    );
  }

  const submit = (message) => {
    const value = message.trim();
    if (!value || sending) return;
    setText("");
    send.mutate(value);
  };

  const template = referenceCV?.template ?? DEFAULT_TEMPLATE;
  const style = normalizeTemplateStyle(referenceCV?.templateStyle ?? getTemplateDefaultStyle(template));
  const proposals = new Map(thread.proposals.map((p) => [String(p._id), p]));
  const lastUserIndex = thread.messages.findLastIndex((m) => m.role === "user");

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title={thread.title}
        description={`Editing a copy of ${thread.sourceLabel || "your CV"}. Your original stays as it is.`}
        action={
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={thread.reviewEdits}
              disabled={review.isPending}
              onChange={(e) => review.mutate(e.target.checked)}
              className="size-4 accent-[var(--landing-ink)]"
            />
            Review changes before they apply
          </label>
        }
      />

      <DashboardTabBar className="lg:hidden" ariaLabel="Thread panes" tabs={PANES} activeTab={pane} onTabChange={setPane} />

      <div className="flex items-start gap-4">
        <nav className="hidden w-56 shrink-0 space-y-1 xl:block" aria-label="Threads">
          <Button asChild variant="outline" size="sm" className="mb-2 w-full rounded-md border-[var(--landing-line)]">
            <Link href="/dashboard/agent">
              <PlusIcon size={14} aria-hidden="true" />
              New thread
            </Link>
          </Button>
          {threads.map((t) => (
            <Link
              key={t._id}
              href={`/dashboard/agent/${t._id}`}
              aria-current={t._id === id ? "page" : undefined}
              className={cn(
                "block truncate rounded-md px-2 py-1.5 text-sm",
                t._id === id
                  ? "bg-[var(--landing-primary-soft)] font-medium text-foreground"
                  : "text-muted-foreground hover:bg-[var(--landing-paper-soft)] hover:text-foreground"
              )}
            >
              {t.title}
            </Link>
          ))}
        </nav>

        <Card
          className={cn(
            "dashboard-card min-w-0 flex-1 gap-0 overflow-hidden rounded-lg border-[var(--landing-line)] py-0",
            pane === "chat" ? "flex" : "hidden",
            "lg:flex"
          )}
        >
          <div ref={scrollRef} className="h-120 space-y-3 overflow-y-auto p-4 lg:h-150">
            {messageCount === 0 && !sending && (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                  Tell the agent what you want. It reads your draft, suggests changes, and asks before it removes
                  anything.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button
                      key={s.label}
                      size="sm"
                      variant="outline"
                      className="rounded-md border-[var(--landing-line)]"
                      onClick={() => (s.send ? submit(s.text) : setText(s.text))}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {thread.messages.map((m, index) => {
              if (m.role === "user") {
                return (
                  <div key={m._id} className="flex justify-end">
                    <p className="max-w-md rounded-lg bg-foreground px-3 py-2 text-sm leading-6 whitespace-pre-wrap text-background">
                      {m.content}
                    </p>
                  </div>
                );
              }
              if (m.role === "assistant") {
                return m.content?.trim() ? (
                  <p
                    key={m._id}
                    className="max-w-xl rounded-lg bg-[var(--landing-paper-soft)] px-3 py-2 text-sm leading-6 whitespace-pre-wrap text-foreground"
                  >
                    {m.content}
                  </p>
                ) : null;
              }
              if (m.proposalId && proposals.has(m.proposalId)) {
                return (
                  <ProposalCard
                    key={m._id}
                    proposal={proposals.get(m.proposalId)}
                    draft={draft}
                    busy={decide.isPending}
                    onDecide={(action) => decide.mutate({ proposalId: m.proposalId, action })}
                  />
                );
              }
              if (m.question) {
                return (
                  <QuestionCard
                    key={m._id}
                    question={m.question}
                    active={index > lastUserIndex && !sending}
                    onAnswer={submit}
                  />
                );
              }
              if (m.toolName === "fetch_job_posting") {
                return (
                  <p key={m._id} className="text-xs text-muted-foreground">
                    {m.content.startsWith("Error") ? "Couldn't read that job posting." : "Read the job posting."}
                  </p>
                );
              }
              return null;
            })}

            {sending && (
              <>
                <div className="flex justify-end">
                  <p className="max-w-md rounded-lg bg-foreground px-3 py-2 text-sm leading-6 whitespace-pre-wrap text-background opacity-70">
                    {send.variables}
                  </p>
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                  <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />
                  Working on it…
                </p>
              </>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(text);
            }}
            className="flex items-end gap-2 border-t border-[var(--landing-line)] p-3"
          >
            <Textarea
              aria-label="Message the agent"
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  submit(text);
                }
              }}
              placeholder="Ask for a change, or paste a job link"
              className="max-h-40 min-h-11 resize-none"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!text.trim() || sending}>
              <PaperPlaneRightIcon size={16} />
            </Button>
          </form>
        </Card>

        <section
          aria-label="Draft CV"
          className={cn("min-w-0 flex-1 space-y-3", pane === "draft" ? "block" : "hidden", "lg:block")}
        >
          {draft ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">Draft</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-md border-[var(--landing-line)]">
                    <Link href={`/dashboard/tailored/${draft._id}`}>
                      <PencilSimpleIcon size={14} aria-hidden="true" />
                      Open in editor
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md border-[var(--landing-line)]"
                    onClick={() =>
                      printDocument({
                        kind: "cv",
                        data: draft,
                        template,
                        style,
                        filename: buildPdfFilename(draft.basics?.name, "", "cv"),
                      })
                    }
                  >
                    <DownloadSimpleIcon size={14} aria-hidden="true" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <div className="max-h-150 overflow-y-auto rounded-2xl">
                <ResumePreview data={draft} template={template} style={style} />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">The draft for this thread was deleted. Start a new thread.</p>
          )}
        </section>
      </div>
    </DashboardPageShell>
  );
}
