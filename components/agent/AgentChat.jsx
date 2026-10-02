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
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAtPath } from "@/lib/cv-patch";
import { cn } from "@/lib/utils";
import { dateLocale } from "@/i18n/routing";

const SUGGESTIONS = [
  {
    icon: BriefcaseIcon,
    key: "tailor",
    text: "Tailor my CV to this job: ",
    send: false,
  },
  {
    icon: TextAlignLeftIcon,
    key: "summary",
    text: "Tighten my summary to three clear lines.",
    send: true,
  },
  {
    icon: ListChecksIcon,
    key: "bullets",
    text: "Find my weakest bullets and rewrite them to show outcomes. Don't invent numbers.",
    send: true,
  },
  {
    icon: SortAscendingIcon,
    key: "skills",
    text: "Put the skills that matter most for my target role first.",
    send: true,
  },
];

// Labels live in messages under dashboard.agent.chat (tools, sections, fields).
const TOOL_NAMES = new Set(["read_cv", "fetch_job_posting"]);
const SECTION_KEYS = new Set(["basics", "work", "education", "skills"]);

function fieldLabel(key, t) {
  return t.has(`fields.${key}`) ? t(`fields.${key}`) : key;
}
const ITEM_NAME = {
  work: (item) => item.company || item.position,
  education: (item) => item.institution,
  skills: (item) => item.category,
};

/** "/work/0/description" reads as "Experience › Acme › Bullets". Entry names come from `draft` when given. */
function describePath(path, draft, t) {
  const [section, ...rest] = String(path).replace(/^\//, "").split("/");
  const parts = [SECTION_KEYS.has(section) ? t(`sections.${section}`) : section];
  rest.forEach((token, i) => {
    if (token === "-") {
      parts.push(t("newEntry"));
    } else if (/^\d+$/.test(token)) {
      const item = i === 0 ? draft?.[section]?.[Number(token)] : undefined;
      parts.push((item && ITEM_NAME[section]?.(item)) || t("entry", { number: Number(token) + 1 }));
    } else {
      parts.push(fieldLabel(token, t));
    }
  });
  return parts.join(" › ");
}

function formatValue(value, t) {
  if (value === undefined || value === null || value === "") return t("empty");
  if (typeof value !== "object") return String(value);
  if (Array.isArray(value) && value.every((v) => typeof v !== "object")) return value.join(", ");
  return Object.entries(value)
    .filter(([, v]) => v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(
      ([key, v]) =>
        `${fieldLabel(key, t)}: ${Array.isArray(v) ? v.map((x) => (typeof x === "object" ? JSON.stringify(x) : x)).join(", ") : v}`
    )
    .join("\n");
}

const STATUS_PILL = {
  pending: {
    label: "status.pending",
    className: "bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]",
  },
  applied: {
    label: "status.applied",
    className: "bg-[var(--landing-success-soft)] text-[var(--landing-success)]",
  },
  reverted: {
    label: "status.reverted",
    className: "bg-[var(--landing-paper-soft)] text-muted-foreground",
  },
};

const TIME_FORMAT = { hour: "2-digit", minute: "2-digit" };
const DATE_TIME_FORMAT = { day: "numeric", month: "short", ...TIME_FORMAT };

/** Same day shows the time only, older messages add the date. */
function formatMessageTime(value, now, locale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const sameDay = date.toDateString() === new Date(now).toDateString();
  // English keeps en-GB so times stay 24 hour, as before.
  return date.toLocaleString(dateLocale(locale), sameDay ? TIME_FORMAT : DATE_TIME_FORMAT);
}

/**
 * One chat bubble. You sit on the right on a paper-soft fill, the agent on the
 * left on plain surface. Both share the same width cap and radius.
 */
function Bubble({ role, at, now, pending, children }) {
  const locale = useLocale();
  const isUser = role === "user";
  const time = formatMessageTime(at, now, locale);
  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-5/6 rounded-lg border border-[var(--landing-line)] px-3.5 py-2.5 text-sm leading-6 break-words whitespace-pre-wrap text-foreground",
          isUser ? "bg-[var(--landing-paper-soft)]" : "bg-[var(--landing-surface)]",
          pending && "opacity-70"
        )}
      >
        {children}
      </div>
      {time && (
        <time dateTime={new Date(at).toISOString()} className="px-1 text-xs tabular-nums text-muted-foreground">
          {time}
        </time>
      )}
    </div>
  );
}

function ProposalCard({ proposal, draft, busy, onDecide }) {
  const t = useTranslations("dashboard.agent.chat");
  const pending = proposal.status === "pending";

  if (proposal.status === "rejected") {
    return (
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <ProhibitIcon size={14} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{t("declined", { title: proposal.title })}</span>
      </p>
    );
  }

  const pill = STATUS_PILL[proposal.status];

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)]">
      <div className="flex items-start justify-between gap-3 px-4 pt-3.5 pb-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{proposal.title}</p>
          {proposal.summary && <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{proposal.summary}</p>}
        </div>
        {pill && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
              pill.className
            )}
          >
            {t(pill.label)}
          </span>
        )}
      </div>

      <ul className="max-h-80 space-y-3 overflow-y-auto border-t border-[var(--landing-line)] px-4 py-3">
        {proposal.operations.map((op, i) => {
          // Before values and entry names only hold while the draft still matches the proposal.
          const before = pending && op.op !== "add" ? getAtPath(draft, op.path) : undefined;
          return (
            <li key={`${op.op}-${op.path}-${i}`} className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{describePath(op.path, pending ? draft : null, t)}</p>
              {before !== undefined && (
                <p className="text-sm leading-6 break-words whitespace-pre-wrap text-muted-foreground line-through decoration-muted-foreground/40">
                  <span className="sr-only">{t("before")} </span>
                  {formatValue(before, t)}
                </p>
              )}
              {op.op !== "remove" && (
                <p className="text-sm leading-6 break-words whitespace-pre-wrap text-foreground">
                  <span className="sr-only">{t("after")} </span>
                  {formatValue(op.value, t)}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {pending && (
        <div className="flex items-center gap-2 border-t border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-4 py-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => onDecide("apply")}
            className="dashboard-primary-btn dashboard-primary-btn-sm"
          >
            <CheckIcon size={16} weight="bold" aria-hidden="true" />
            {t("applyChange")}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onDecide("reject")}
            className="dashboard-secondary-btn dashboard-secondary-btn-sm"
          >
            {t("decline")}
          </button>
        </div>
      )}
      {proposal.canRestore && (
        <div className="border-t border-[var(--landing-line)] px-2 py-1.5">
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onDecide("restore")}
            className="rounded-md text-muted-foreground hover:bg-[var(--landing-paper-soft)] hover:text-foreground"
          >
            <ArrowCounterClockwiseIcon size={16} aria-hidden="true" />
            {t("restore")}
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, answer, disabled, onAnswer }) {
  const t = useTranslations("dashboard.agent.chat");
  return (
    <div className="rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4">
      <p className="text-sm leading-6 font-medium text-foreground">{question.question}</p>
      {answer !== null ? (
        <p className="mt-1.5 text-sm text-muted-foreground">{t("answered", { answer })}</p>
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
                  className="min-h-control rounded-md border border-[var(--landing-line)] px-3 py-2 text-left text-sm leading-5 text-foreground transition-colors outline-none hover:border-[var(--landing-ink-faint)] hover:bg-[var(--landing-paper-soft)] focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">{t("ownAnswer")}</p>
        </>
      )}
    </div>
  );
}

function ToolRow({ message }) {
  const t = useTranslations("dashboard.agent.chat");
  const failed = message.content?.startsWith("Error");
  const Icon = failed ? WarningCircleIcon : CheckCircleIcon;
  return (
    <p className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon
        size={14}
        className={cn("shrink-0", !failed && "text-[var(--landing-success)]")}
        aria-hidden="true"
      />
      {t(`tools.${message.toolName}.${failed ? "failed" : "done"}`)}
    </p>
  );
}

export function AgentChat({ thread, draft, sending, sendingText, onSend, decidingId, onDecide }) {
  const t = useTranslations("dashboard.agent.chat");
  const [text, setText] = useState("");
  // Captured once so "today" in timestamps does not shift while you read.
  const [now] = useState(() => Date.now());
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
    <section aria-label={t("chatLabel")} className="flex h-full min-h-0 flex-col bg-[var(--landing-bg)]">
      <div ref={scrollRef} className="@container min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-4 px-4 py-5">
          {messages.length === 0 && !sending && (
            <div className="flex flex-1 flex-col justify-center py-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
                <SparkleIcon size={20} aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-outfit text-xl font-semibold tracking-[-0.02em] text-foreground">
                {t("emptyTitle")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {t("emptyDescription", { source: thread.sourceLabel || t("yourCv") })}
              </p>
              <div className="mt-5 grid gap-2 @md:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      if (s.send) {
                        submit(s.text);
                      } else {
                        setText(s.text);
                        composerRef.current?.focus();
                      }
                    }}
                    className="group flex items-start gap-3 rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] p-3 text-left transition-colors outline-none hover:border-[var(--landing-ink-faint)] hover:bg-[var(--landing-paper-soft)] focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-foreground">
                      <s.icon size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{t(`suggestions.${s.key}.label`)}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{t(`suggestions.${s.key}.description`)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, index) => {
            if (m.role === "user") {
              return (
                <Bubble key={m._id} role="user" at={m.at} now={now}>
                  {m.content}
                </Bubble>
              );
            }
            if (m.role === "assistant") {
              return m.content?.trim() ? (
                <Bubble key={m._id} role="assistant" at={m.at} now={now}>
                  {m.content}
                </Bubble>
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
            if (m.role === "tool" && TOOL_NAMES.has(m.toolName)) {
              return <ToolRow key={m._id} message={m} />;
            }
            return null;
          })}

          {sending && (
            <>
              <Bubble role="user" pending>
                {sendingText}
              </Bubble>
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
                {t("working")}
              </div>
            </>
          )}
        </div>
      </div>

      {/* The composer is its own hairline panel pinned to the bottom of the pane. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(text);
        }}
        className="shrink-0 border-t border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4"
      >
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-md border border-[var(--landing-line)] bg-[var(--landing-bg)] p-1.5 pl-3 transition-colors focus-within:border-[var(--landing-ink)]">
            <Textarea
              ref={composerRef}
              rows={1}
              value={text}
              aria-label={t("messageLabel")}
              placeholder={t("placeholder")}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  submit(text);
                }
              }}
              className="field-sizing-content max-h-40 min-h-9 flex-1 resize-none rounded-none border-0 bg-transparent px-0 py-2 text-base leading-5 shadow-none focus-visible:ring-0 sm:text-sm"
            />
            <button
              type="submit"
              aria-label={t("send")}
              disabled={!text.trim() || sending}
              className="dashboard-primary-btn size-control shrink-0 px-0"
            >
              <ArrowUpIcon size={16} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1.5 hidden px-1 text-xs text-muted-foreground sm:block">
            {t("hint")}
          </p>
        </div>
      </form>
    </section>
  );
}
