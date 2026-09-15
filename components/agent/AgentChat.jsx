"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowCounterClockwiseIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CheckIcon,
  ListChecksIcon,
  ProhibitIcon,
  SortAscendingIcon,
  SparkleIcon,
  TextAlignLeftIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAtPath } from "@/lib/cv-patch";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  {
    icon: BriefcaseIcon,
    label: "Tailor it to a job",
    description: "Paste a job link and it matches your CV to the role",
    text: "Tailor my CV to this job: ",
    send: false,
  },
  {
    icon: TextAlignLeftIcon,
    label: "Tighten my summary",
    description: "Cut it down to three clear lines",
    text: "Tighten my summary to three clear lines.",
    send: true,
  },
  {
    icon: ListChecksIcon,
    label: "Strengthen weak bullets",
    description: "Rewrite duties so they show results",
    text: "Find my weakest bullets and rewrite them to show outcomes. Don't invent numbers.",
    send: true,
  },
  {
    icon: SortAscendingIcon,
    label: "Reorder my skills",
    description: "Put the most relevant skills first",
    text: "Put the skills that matter most for my target role first.",
    send: true,
  },
];

const TOOL_LABEL = {
  read_cv: { done: "Read your CV", failed: "Couldn't read your CV" },
  fetch_job_posting: { done: "Read the job posting", failed: "Couldn't open the job posting" },
};

const SECTION_LABEL = { basics: "Personal details", work: "Experience", education: "Education", skills: "Skills" };
const FIELD_LABEL = {
  name: "Name",
  label: "Headline",
  email: "Email",
  phone: "Phone",
  summary: "Summary",
  location: "Location",
  profiles: "Profiles",
  network: "Network",
  url: "Link",
  company: "Company",
  position: "Job title",
  startDate: "Start date",
  endDate: "End date",
  description: "Bullets",
  institution: "School",
  degree: "Degree",
  fieldOfStudy: "Field of study",
  category: "Category",
  skills: "Skills",
};
const ITEM_NAME = {
  work: (item) => item.company || item.position,
  education: (item) => item.institution,
  skills: (item) => item.category,
};

/** "/work/0/description" reads as "Experience › Acme › Bullets". Entry names come from `draft` when given. */
function describePath(path, draft) {
  const [section, ...rest] = String(path).replace(/^\//, "").split("/");
  const parts = [SECTION_LABEL[section] ?? section];
  rest.forEach((token, i) => {
    if (token === "-") {
      parts.push("New entry");
    } else if (/^\d+$/.test(token)) {
      const item = i === 0 ? draft?.[section]?.[Number(token)] : undefined;
      parts.push((item && ITEM_NAME[section]?.(item)) || `Entry ${Number(token) + 1}`);
    } else {
      parts.push(FIELD_LABEL[token] ?? token);
    }
  });
  return parts.join(" › ");
}

function formatValue(value) {
  if (value === undefined || value === null || value === "") return "Empty";
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value) && value.every((v) => typeof v !== "object")) return value.join(", ");
  return Object.entries(value)
    .filter(([, v]) => v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(
      ([key, v]) =>
        `${FIELD_LABEL[key] ?? key}: ${Array.isArray(v) ? v.map((x) => (typeof x === "object" ? JSON.stringify(x) : x)).join(", ") : v}`
    )
    .join("\n");
}

const STATUS_PILL = {
  pending: {
    label: "Needs your review",
    className: "border-[var(--landing-ink)] text-foreground",
  },
  applied: { label: "Applied", className: "border-[var(--landing-line)] text-muted-foreground" },
  reverted: { label: "Rolled back", className: "border-[var(--landing-line)] text-muted-foreground" },
};

function ProposalCard({ proposal, draft, busy, onDecide }) {
  const pending = proposal.status === "pending";

  if (proposal.status === "rejected") {
    return (
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ProhibitIcon className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">You declined: {proposal.title}</span>
      </p>
    );
  }

  const pill = STATUS_PILL[proposal.status];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)]">
      <div className="flex items-start justify-between gap-3 px-4 pt-3.5 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{proposal.title}</p>
          {proposal.summary && <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{proposal.summary}</p>}
        </div>
        {pill && (
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
              pill.className
            )}
          >
            {pill.label}
          </span>
        )}
      </div>

      <ul className="max-h-80 space-y-3 overflow-y-auto border-t border-[var(--landing-line)] px-4 py-3">
        {proposal.operations.map((op, i) => {
          // Before values and entry names only hold while the draft still matches the proposal.
          const before = pending && op.op !== "add" ? getAtPath(draft, op.path) : undefined;
          return (
            <li key={`${op.op}-${op.path}-${i}`} className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{describePath(op.path, pending ? draft : null)}</p>
              {before !== undefined && (
                <p className="text-sm leading-6 break-words whitespace-pre-wrap text-muted-foreground line-through decoration-muted-foreground/40">
                  <span className="sr-only">Before: </span>
                  {formatValue(before)}
                </p>
              )}
              {op.op !== "remove" && (
                <p className="text-sm leading-6 break-words whitespace-pre-wrap text-foreground">
                  <span className="sr-only">After: </span>
                  {formatValue(op.value)}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {pending && (
        <div className="flex items-center gap-2 border-t border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-4 py-2.5">
          <Button
            size="sm"
            disabled={busy}
            onClick={() => onDecide("apply")}
            className="rounded-md bg-foreground font-medium text-background hover:bg-black"
          >
            <CheckIcon aria-hidden="true" />
            Apply change
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => onDecide("reject")} className="rounded-md">
            Decline
          </Button>
        </div>
      )}
      {proposal.canRestore && (
        <div className="border-t border-[var(--landing-line)] px-2 py-1.5">
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onDecide("restore")}
            className="rounded-md text-muted-foreground hover:text-foreground"
          >
            <ArrowCounterClockwiseIcon aria-hidden="true" />
            Restore to before this change
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, answer, disabled, onAnswer }) {
  return (
    <div className="rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4">
      <p className="text-sm leading-6 font-medium text-foreground">{question.question}</p>
      {answer !== null ? (
        <p className="mt-1.5 text-sm text-muted-foreground">You answered: {answer}</p>
      ) : (
        <>
          {question.choices?.length > 0 && (
            <div className="mt-3 grid gap-2">
              {question.choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  disabled={disabled}
                  onClick={() => onAnswer(choice)}
                  className="min-h-11 rounded-lg border border-[var(--landing-line)] px-3 py-2 text-left text-sm leading-5 text-foreground transition-colors outline-none hover:border-[var(--landing-ink-faint)] hover:bg-[var(--landing-paper-soft)] focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Or type your own answer below.</p>
        </>
      )}
    </div>
  );
}

function ToolRow({ message }) {
  const failed = message.content?.startsWith("Error");
  const Icon = failed ? WarningCircleIcon : CheckCircleIcon;
  return (
    <p className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {TOOL_LABEL[message.toolName][failed ? "failed" : "done"]}
    </p>
  );
}

export function AgentChat({ thread, draft, sending, sendingText, onSend, decidingId, onDecide }) {
  const [text, setText] = useState("");
  const composerRef = useRef(null);
  const scrollRef = useRef(null);
  const proposals = new Map(thread.proposals.map((p) => [String(p._id), p]));
  const messages = thread.messages;

  // Keep the newest message in view.
  useEffect(() => {
    const list = scrollRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length, sending]);

  const submit = (value) => {
    const message = value.trim();
    if (!message || sending) return;
    setText("");
    // Put the text back if sending fails, unless the user has started typing again.
    onSend(message, () => setText((current) => current || message));
  };

  const answerAfter = (index) => messages.slice(index + 1).find((m) => m.role === "user")?.content ?? null;

  return (
    <section aria-label="Chat" className="flex h-full min-h-0 flex-col bg-[var(--landing-bg)]">
      <div ref={scrollRef} className="@container min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-4 px-4 py-5">
          {messages.length === 0 && !sending && (
            <div className="flex flex-1 flex-col justify-center py-6">
              <span className="flex size-10 items-center justify-center rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)]">
                <SparkleIcon className="size-5 text-foreground" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-outfit text-2xl font-semibold tracking-tight text-foreground">
                What should we work on?
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Ask for any change in plain words. The agent edits a copy of {thread.sourceLabel || "your CV"}, so
                your original stays as it is.
              </p>
              <div className="mt-5 grid gap-2 @md:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      if (s.send) {
                        submit(s.text);
                      } else {
                        setText(s.text);
                        composerRef.current?.focus();
                      }
                    }}
                    className="group flex items-start gap-3 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-3 text-left transition-colors outline-none hover:border-[var(--landing-ink-faint)] focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <s.icon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{s.label}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{s.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, index) => {
            if (m.role === "user") {
              return (
                <div key={m._id} className="flex justify-end">
                  <p className="max-w-5/6 rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-background">
                    {m.content}
                  </p>
                </div>
              );
            }
            if (m.role === "assistant") {
              return m.content?.trim() ? (
                <p key={m._id} className="text-sm leading-6 break-words whitespace-pre-wrap text-foreground">
                  {m.content}
                </p>
              ) : null;
            }
            if (m.proposalId) {
              const proposal = proposals.get(m.proposalId);
              if (!proposal) return null;
              return (
                <ProposalCard
                  key={m._id}
                  proposal={proposal}
                  draft={draft}
                  busy={decidingId === m.proposalId}
                  onDecide={(action) => onDecide(m.proposalId, action)}
                />
              );
            }
            if (m.question) {
              return (
                <QuestionCard
                  key={m._id}
                  question={m.question}
                  answer={answerAfter(index)}
                  disabled={sending}
                  onAnswer={submit}
                />
              );
            }
            if (m.role === "tool" && TOOL_LABEL[m.toolName]) {
              return <ToolRow key={m._id} message={m} />;
            }
            return null;
          })}

          {sending && (
            <>
              <div className="flex justify-end">
                <p className="max-w-5/6 rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm leading-6 break-words whitespace-pre-wrap text-background opacity-70">
                  {sendingText}
                </p>
              </div>
              <div role="status" className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-current motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
                Working on it
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
        className="shrink-0 border-t border-[var(--landing-line)] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4"
      >
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-1.5 pl-3.5 shadow-[var(--landing-shadow-sm)] transition-colors focus-within:border-[var(--landing-ink-faint)]">
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
              className="field-sizing-content max-h-40 min-h-9 flex-1 resize-none rounded-none border-0 bg-transparent px-0 py-2 text-base leading-5 shadow-none focus-visible:ring-0 sm:text-sm"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              disabled={!text.trim() || sending}
              className="size-9 shrink-0 rounded-xl bg-foreground text-background hover:bg-black"
            >
              <ArrowUpIcon weight="bold" />
            </Button>
          </div>
          <p className="mt-1.5 hidden px-1 text-xs text-muted-foreground sm:block">
            Press Enter to send. Shift and Enter adds a new line.
          </p>
        </div>
      </form>
    </section>
  );
}
