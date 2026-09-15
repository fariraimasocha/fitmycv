"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  CheckIcon,
  ClockCounterClockwiseIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  GlobeIcon,
  PaperPlaneRightIcon,
  PencilSimpleLineIcon,
  ProhibitIcon,
  ReadCvLogoIcon,
  ShieldCheckIcon,
  SidebarSimpleIcon,
  SparkleIcon,
  SquaresFourIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's agent-chat.tsx, patch-approval-card.tsx and
// tool-part-card.tsx, on FitMyCV's colors.

const STARTER_PROMPTS = [
  "Tailor my CV to this job: ",
  "Tighten my summary to three lines",
  "Rewrite my weakest bullets to show outcomes",
  "Put the skills that matter most first",
  "Turn my duties into achievements",
  "Check my dates and make the formats match",
  "Make my headline fit the role I want",
  "Cut anything that repeats",
  "What would you change for a senior role?",
  "Shorten my longest bullets",
  "Which of my bullets need numbers?",
  "Give my current role a stronger opening line",
];

const TOOLS = {
  read_cv: { label: "Read the CV", icon: ReadCvLogoIcon },
  fetch_job_posting: { label: "Read the job posting", icon: GlobeIcon },
};

const LINE = "border-[var(--landing-line)]";

function truncateValue(value, max = 80) {
  if (value === undefined) return null;
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function chunk(items, rows) {
  return Array.from({ length: rows }, (_, row) => items.filter((_, i) => i % rows === row));
}

function StarterPromptMarquee({ onSelect }) {
  return (
    <div className="relative mx-auto grid w-full max-w-4xl gap-3 overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      {chunk(STARTER_PROMPTS, 3).map((row, rowIndex) => (
        <div
          key={row[0]}
          className="landing-marquee-track flex w-max gap-3 motion-reduce:animate-none"
          style={{ animationDuration: `${48 + rowIndex * 10}s`, animationDirection: rowIndex % 2 ? "reverse" : "normal" }}
        >
          {/* Repeated so the loop has no gap; only the first copy is reachable by keyboard. */}
          {[...row, ...row, ...row, ...row].map((prompt, i) => (
            <Button
              key={`${prompt}-${i}`}
              type="button"
              size="sm"
              variant="outline"
              tabIndex={i < row.length ? undefined : -1}
              aria-hidden={i < row.length ? undefined : true}
              className={cn(
                "h-8 shrink-0 rounded-full bg-[var(--landing-surface)]/70 px-3 font-normal text-muted-foreground hover:text-foreground",
                LINE
              )}
              onClick={() => onSelect(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}

function OperationRow({ operation }) {
  const preview = truncateValue(operation.value);
  return (
    <li className="flex min-w-0 items-baseline gap-2 font-mono text-[11px] leading-relaxed">
      <Badge variant="outline" className="shrink-0 font-mono uppercase">
        {String(operation.op ?? "?")}
      </Badge>
      <span className="shrink-0 text-foreground">{String(operation.path ?? "")}</span>
      {preview && <span className="truncate text-muted-foreground">{preview}</span>}
    </li>
  );
}

function OutlineBubble({ children }) {
  return (
    <div className={cn("w-full min-w-0 rounded-xl border bg-[var(--landing-surface)] px-3 py-2", LINE)}>{children}</div>
  );
}

function PatchApprovalCard({ proposal, disabled, onRespond }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2 font-medium">
        <ShieldCheckIcon className="text-muted-foreground" />
        <span>Review this edit</span>
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium">{proposal.title}</p>
        {proposal.summary && <p className="mt-0.5 text-xs text-muted-foreground">{proposal.summary}</p>}
      </div>
      <ul className={cn("max-h-48 space-y-1 overflow-auto rounded-md border bg-[var(--landing-paper-soft)] p-2", LINE)}>
        {proposal.operations.map((operation, index) => (
          <OperationRow key={`${String(operation.path)}-${index}`} operation={operation} />
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={disabled} onClick={() => onRespond(true)}>
          <CheckIcon />
          Approve
        </Button>
        <Button size="sm" variant="outline" disabled={disabled} onClick={() => onRespond(false)}>
          <ProhibitIcon />
          Deny
        </Button>
      </div>
    </div>
  );
}

function PatchToolCard({ proposal, disabled, onRestore }) {
  const reverted = proposal.status === "reverted";
  return (
    <details className="group text-xs text-muted-foreground">
      <summary className="inline-flex max-w-full cursor-pointer list-none items-center gap-2 rounded-md py-1 font-medium hover:text-foreground [&::-webkit-details-marker]:hidden">
        <PencilSimpleLineIcon className="size-4 shrink-0" />
        <span className="shrink-0">{reverted ? "Patch rolled back" : "Patch applied"}</span>
        <span className="truncate text-muted-foreground/70 group-open:hidden">{proposal.title}</span>
      </summary>
      <div className={cn("mt-2 space-y-2 rounded-md border bg-[var(--landing-paper-soft)] p-3", LINE)}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{proposal.title}</p>
            {reverted && (
              <p className="mt-1">This patch was rolled back when the draft was restored to an earlier state.</p>
            )}
          </div>
          {proposal.canRestore && (
            <Button size="xs" variant="ghost" disabled={disabled} onClick={onRestore}>
              <ClockCounterClockwiseIcon />
              Restore
            </Button>
          )}
        </div>
        <ul className={cn("max-h-48 space-y-1 overflow-auto rounded border bg-[var(--landing-surface)] p-2", LINE)}>
          {proposal.operations.map((operation, index) => (
            <OperationRow key={`${String(operation.path)}-${index}`} operation={operation} />
          ))}
        </ul>
        <details>
          <summary className="cursor-pointer text-muted-foreground/70 hover:text-foreground">Raw JSON</summary>
          <pre
            className={cn(
              "mt-1 max-h-72 overflow-auto rounded border bg-[var(--landing-surface)] p-3 font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap",
              LINE
            )}
          >
            {JSON.stringify(proposal.operations, null, 2)}
          </pre>
        </details>
      </div>
    </details>
  );
}

function ToolPartCard({ message }) {
  const tool = TOOLS[message.toolName];
  const failed = message.content?.startsWith("Error");
  const preview = message.content?.length > 4000 ? `${message.content.slice(0, 4000)}…` : message.content;

  return (
    <details className="group text-xs text-muted-foreground">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md py-1 font-medium hover:text-foreground [&::-webkit-details-marker]:hidden">
        <tool.icon className="size-4" />
        <span>{tool.label}</span>
        <Badge variant={failed ? "destructive" : "outline"}>{failed ? "Failed" : "Done"}</Badge>
      </summary>
      <div className={cn("mt-2 rounded-md border bg-[var(--landing-paper-soft)] p-3", LINE)}>
        <pre
          className={cn(
            "max-h-72 overflow-auto rounded border bg-[var(--landing-surface)] p-2 font-mono text-[11px] break-words whitespace-pre-wrap",
            LINE
          )}
        >
          {preview}
        </pre>
      </div>
    </details>
  );
}

function AskUserQuestion({ id, question, answer, disabled, onAnswer }) {
  const [choice, setChoice] = useState("");
  const [other, setOther] = useState("");

  if (answer !== null) {
    return (
      <div className="flex flex-col gap-1">
        <p className="font-medium">{question.question}</p>
        <p className="text-sm text-muted-foreground">{answer}</p>
      </div>
    );
  }

  const value = other.trim() || choice;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (value) onAnswer(value);
      }}
      className="flex w-full min-w-0 flex-col gap-4 py-1"
    >
      <fieldset disabled={disabled} className="flex min-w-0 flex-col gap-2">
        <legend className="mb-4 text-base leading-snug font-medium text-pretty">{question.question}</legend>
        {question.choices?.map((option) => {
          const checked = choice === option && !other.trim();
          return (
            <label
              key={option}
              className={cn(
                "relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border bg-transparent px-3 py-2.5 text-sm transition-colors select-none hover:bg-[var(--landing-paper-soft)] has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring/40",
                LINE,
                checked && "border-[var(--landing-ink-faint)] bg-[var(--landing-paper-soft)]"
              )}
            >
              <input
                type="radio"
                name={`question-${id}`}
                value={option}
                checked={checked}
                onChange={() => {
                  setChoice(option);
                  setOther("");
                }}
                className="mt-0.5 size-4 shrink-0 accent-[var(--landing-ink)]"
              />
              <span className="min-w-0 flex-1 leading-snug">{option}</span>
            </label>
          );
        })}
        <input
          aria-label="Answer in your own words"
          placeholder="Something else…"
          value={other}
          onChange={(event) => setOther(event.target.value)}
          className={cn(
            "h-11 w-full min-w-0 rounded-lg border bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40 sm:h-9",
            LINE
          )}
        />
      </fieldset>
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={disabled || !value}>
          Send answer
        </Button>
      </div>
    </form>
  );
}

export function AgentChat({
  thread,
  sending,
  sendingText,
  onSend,
  decidingId,
  onDecide,
  onReviewChange,
  onDelete,
  onToggleThreads,
  onToggleResume,
}) {
  const [text, setText] = useState("");
  const composerRef = useRef(null);
  const proposals = new Map(thread.proposals.map((p) => [String(p._id), p]));
  const messages = thread.messages;

  const submit = (value) => {
    const message = value.trim();
    if (!message || sending) return;
    setText("");
    // Put the text back if sending fails, unless the user has started typing again.
    onSend(message, () => setText((current) => current || message));
  };

  const answerAfter = (index) => messages.slice(index + 1).find((m) => m.role === "user")?.content ?? null;

  const copyConversation = async () => {
    const lines = messages
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
    <section className="flex h-full min-h-0 flex-col bg-[var(--landing-bg)]">
      <div className={cn("flex h-14 shrink-0 items-center justify-between border-b px-4", LINE)}>
        <div className="flex min-w-0 items-center gap-2">
          {onToggleThreads && (
            <Button size="icon-sm" variant="ghost" aria-label="Toggle threads" onClick={onToggleThreads}>
              <SidebarSimpleIcon />
            </Button>
          )}
          <div className="min-w-0">
            <div className="truncate font-semibold">Chat</div>
            <div className="truncate text-xs text-muted-foreground">Copy of {thread.sourceLabel || "your CV"}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onToggleResume && (
            <Button size="icon-sm" variant="ghost" aria-label="Toggle draft preview" onClick={onToggleResume}>
              <SquaresFourIcon />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label="Thread actions">
                <DotsThreeVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => void copyConversation()}>
                <CopyIcon />
                Copy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={thread.reviewEdits}
                onCheckedChange={(checked) => onReviewChange(Boolean(checked))}
              >
                Review edits
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-agent-scroll>
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-4 p-4">
          {messages.length === 0 && !sending && (
            <div className="flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex max-w-sm flex-col items-center gap-2">
                <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-foreground">
                  <SparkleIcon className="size-4" />
                </div>
                <div className="font-outfit text-2xl font-medium tracking-tight">What do you want to do?</div>
              </div>
              <div className="w-full min-w-0">
                <StarterPromptMarquee
                  onSelect={(prompt) => {
                    setText(prompt);
                    composerRef.current?.focus();
                  }}
                />
              </div>
            </div>
          )}

          {messages.map((m, index) => {
            if (m.role === "user") {
              return (
                <div key={m._id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-xl bg-foreground px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap text-background">
                    {m.content}
                  </div>
                </div>
              );
            }
            if (m.role === "assistant") {
              return m.content?.trim() ? (
                <div key={m._id} className="text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
                  {m.content}
                </div>
              ) : null;
            }
            if (m.proposalId) {
              const proposal = proposals.get(m.proposalId);
              if (!proposal) return null;
              if (proposal.status === "rejected") {
                return (
                  <div key={m._id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ProhibitIcon />
                    <span>Edit declined: {proposal.title}</span>
                  </div>
                );
              }
              const busy = decidingId === m.proposalId;
              return (
                <OutlineBubble key={m._id}>
                  {proposal.status === "pending" ? (
                    <PatchApprovalCard
                      proposal={proposal}
                      disabled={busy}
                      onRespond={(approved) => onDecide(m.proposalId, approved ? "apply" : "reject")}
                    />
                  ) : (
                    <PatchToolCard proposal={proposal} disabled={busy} onRestore={() => onDecide(m.proposalId, "restore")} />
                  )}
                </OutlineBubble>
              );
            }
            if (m.question) {
              return (
                <OutlineBubble key={m._id}>
                  <AskUserQuestion
                    id={m._id}
                    question={m.question}
                    answer={answerAfter(index)}
                    disabled={sending}
                    onAnswer={submit}
                  />
                </OutlineBubble>
              );
            }
            if (m.role === "tool" && TOOLS[m.toolName]) {
              return <ToolPartCard key={m._id} message={m} />;
            }
            return null;
          })}

          {sending && (
            <>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-xl bg-foreground px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap text-background opacity-70">
                  {sendingText}
                </div>
              </div>
              <div
                role="status"
                className="flex w-fit items-center gap-2 rounded-md bg-[var(--landing-paper-soft)] px-4 py-3 text-sm text-muted-foreground"
              >
                <SparkleIcon className="size-4" />
                Working…
              </div>
            </>
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(text);
        }}
        className={cn("border-t p-3", LINE)}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className={cn("flex items-end gap-1 rounded-md border bg-[var(--landing-surface)] p-1.5", LINE)}>
            <Textarea
              ref={composerRef}
              rows={1}
              value={text}
              aria-label="Message the agent"
              placeholder="Ask for a change, or paste a job link"
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  submit(text);
                }
              }}
              className="max-h-40 min-h-9 resize-none border-0 bg-transparent p-2 leading-5 shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!text.trim() || sending}>
              <PaperPlaneRightIcon />
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
