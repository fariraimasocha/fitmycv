"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRightIcon,
  ArrowSquareOutIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { ApplicationCopilot } from "@/components/applications/ApplicationCopilot";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useConfirm } from "@/hooks/use-confirm";
import { STAGES, STAGE_BY_KEY } from "@/lib/applications";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's application-detail-sheet.tsx.

const FORWARD_COUNT = 5; // Saved to Offer. "Move to" never suggests an outcome stage.
const stageIndex = (status) => STAGES.findIndex((s) => s.key === status);
const dateInputValue = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
// English keeps the browser's date format. Other languages format in the language the user picked.
const formatDate = (value, locale, fallback) =>
  value
    ? new Date(value).toLocaleDateString(locale === "en" ? undefined : locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : fallback;
const byNewest = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();
const isStage = (entry) => (entry.kind ?? "stage") === "stage";
const currentStageAnchorId = (history, status) =>
  [...history].sort(byNewest).find((entry) => isStage(entry) && entry.status === status)?._id;

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Fact({ label, value }) {
  const t = useTranslations("dashboard.appComponents.detail");
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value || t("notSet")}</dd>
    </div>
  );
}

const EMPTY_CONTACT = { name: "", role: "", kind: "", email: "", phone: "" };

function ContactsEditor({ contacts, pending, onChange }) {
  const t = useTranslations("dashboard.appComponents.detail");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(EMPTY_CONTACT);
  const [error, setError] = useState("");

  const reset = () => {
    setDraft(EMPTY_CONTACT);
    setError("");
    setAdding(false);
  };

  const add = () => {
    if (pending || !draft.name.trim()) return;
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim())) {
      setError(t("invalidEmail"));
      return;
    }
    onChange([...contacts, draft]);
    reset();
  };

  const submitOnEnter = (event) => {
    if (event.key === "Enter") add();
  };

  return (
    <div className="flex flex-col gap-2">
      {contacts.map((contact, i) => (
        <div key={contact._id ?? `${contact.name}-${i}`} className="group flex items-center gap-3 text-sm">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] font-outfit text-xs font-semibold text-foreground">
            {contact.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{contact.name}</div>
            {contact.role && <div className="truncate text-xs text-muted-foreground">{contact.role}</div>}
            {contact.email && (
              <a
                href={`mailto:${encodeURIComponent(contact.email)}`}
                className="block truncate text-xs text-[var(--landing-accent)] hover:underline"
              >
                {contact.email}
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${encodeURIComponent(contact.phone)}`}
                className="block truncate text-xs text-[var(--landing-accent)] hover:underline"
              >
                {contact.phone}
              </a>
            )}
          </div>
          {contact.kind && (
            <span className="inline-flex h-6 items-center rounded-md border border-[var(--landing-line)] px-2 text-[11px] font-medium text-muted-foreground">
              {contact.kind}
            </span>
          )}
          <button
            type="button"
            aria-label={t("removeContact", { name: contact.name })}
            disabled={pending}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-40"
            onClick={() => onChange(contacts.filter((_, j) => j !== i))}
          >
            <XIcon size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
      {adding ? (
        <div className="flex flex-col gap-2 rounded-md border border-[var(--landing-line)] p-2.5">
          <Input
            value={draft.name}
            placeholder={t("name")}
            aria-label={t("name")}
            autoFocus
            onChange={(event) => setDraft((d) => ({ ...d, name: event.target.value }))}
            onKeyDown={submitOnEnter}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={draft.role}
              placeholder={t("rolePlaceholder")}
              aria-label={t("role")}
              onChange={(event) => setDraft((d) => ({ ...d, role: event.target.value }))}
              onKeyDown={submitOnEnter}
            />
            <Input
              value={draft.kind}
              list="contact-kinds"
              placeholder={t("label")}
              aria-label={t("label")}
              onChange={(event) => setDraft((d) => ({ ...d, kind: event.target.value }))}
              onKeyDown={submitOnEnter}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="email"
              value={draft.email}
              placeholder={t("emailPlaceholder")}
              aria-label={t("email")}
              onChange={(event) => {
                setError("");
                setDraft((d) => ({ ...d, email: event.target.value }));
              }}
              onKeyDown={submitOnEnter}
            />
            <Input
              type="tel"
              value={draft.phone}
              placeholder={t("phonePlaceholder")}
              aria-label={t("phone")}
              onChange={(event) => setDraft((d) => ({ ...d, phone: event.target.value }))}
              onKeyDown={submitOnEnter}
            />
          </div>
          <datalist id="contact-kinds">
            <option value={t("kinds.recruiter")} />
            <option value={t("kinds.hiringManager")} />
            <option value={t("kinds.referral")} />
            <option value={t("kinds.interviewer")} />
          </datalist>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="dashboard-secondary-btn dashboard-secondary-btn-sm" onClick={reset}>
              {t("cancel")}
            </button>
            <button
              type="button"
              className="dashboard-primary-btn dashboard-primary-btn-sm"
              disabled={!draft.name.trim() || pending}
              onClick={add}
            >
              {t("addContact")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <PlusIcon size={14} aria-hidden="true" />
          {t("addContact")}
        </button>
      )}
    </div>
  );
}

function ApplicationTimeline({ application, pending, onAddNote, onUpdateEntry, onDeleteEntry }) {
  const t = useTranslations("dashboard.appComponents.detail");
  const tDashboard = useTranslations("dashboard");
  const locale = useLocale();
  const [note, setNote] = useState("");
  const [editingDate, setEditingDate] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [dateDraft, setDateDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const history = application.statusHistory ?? [];
  const anchorId = currentStageAnchorId(history, application.status);
  const sorted = [...history].sort(byNewest);

  const add = () => {
    const text = note.trim();
    if (pending || !text) return;
    onAddNote(text, () => setNote(""));
  };

  return (
    <Section title={t("timeline")}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            value={note}
            disabled={pending}
            aria-label={t("addNotePlaceholder")}
            placeholder={t("addNotePlaceholder")}
            onChange={(event) => setNote(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                add();
              }
            }}
          />
          <button
            type="button"
            className="dashboard-secondary-btn shrink-0"
            disabled={!note.trim() || pending}
            onClick={add}
          >
            {t("addNote")}
          </button>
        </div>
        <div className="relative flex flex-col gap-2 ps-4 before:absolute before:inset-y-2 before:start-1 before:w-px before:bg-[var(--landing-line)]">
          {sorted.map((entry) => {
            const stage = isStage(entry) ? STAGE_BY_KEY[entry.status] : null;
            const isAnchor = String(entry._id) === String(anchorId);
            return (
              <div
                key={entry._id}
                className="group relative rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] p-3 text-sm"
              >
                <span
                  className={cn(
                    "absolute top-4 -start-4.25 size-2.5 rounded-full border-2 border-[var(--landing-surface)]",
                    !stage && "bg-[var(--landing-accent)]/70"
                  )}
                  style={stage ? { background: stage.color } : undefined}
                />
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {stage ? (
                      <div className="font-medium">{t("movedTo", { stage: tDashboard(`stages.${entry.status}`) })}</div>
                    ) : (
                      <button
                        type="button"
                        className="block w-full rounded-sm text-start hover:text-[var(--landing-accent)] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
                        onClick={() => {
                          setEditingNote(entry);
                          setNoteDraft(entry.note);
                        }}
                      >
                        {entry.note}
                      </button>
                    )}
                    {stage && entry.note && <div className="mt-1 text-xs text-muted-foreground">{entry.note}</div>}
                    {isAnchor && <div className="mt-1 text-xs text-muted-foreground">{t("currentStage")}</div>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      className="inline-flex h-7 items-center rounded-md border border-[var(--landing-line)] px-2 text-xs tabular-nums text-muted-foreground transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      onClick={() => {
                        setEditingDate(entry);
                        setDateDraft(dateInputValue(entry.date));
                      }}
                    >
                      {formatDate(entry.date, locale, t("notSet"))}
                    </button>
                    {!isAnchor && (
                      <button
                        type="button"
                        aria-label={t("deleteEntry")}
                        disabled={pending}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-40"
                        onClick={() => onDeleteEntry(entry._id)}
                      >
                        <TrashIcon size={14} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={Boolean(editingDate)} onOpenChange={(open) => !open && setEditingDate(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("editDate")}</DialogTitle>
            <DialogDescription>{t("editDateDescription")}</DialogDescription>
          </DialogHeader>
          <Input type="date" aria-label={t("date")} value={dateDraft} onChange={(event) => setDateDraft(event.target.value)} />
          <DialogFooter>
            <button type="button" className="dashboard-secondary-btn" onClick={() => setEditingDate(null)}>
              {t("cancel")}
            </button>
            <button
              type="button"
              className="dashboard-primary-btn"
              disabled={!dateDraft || pending}
              onClick={() => onUpdateEntry(editingDate._id, { date: dateDraft }, () => setEditingDate(null))}
            >
              {t("saveDate")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingNote)} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("editNote")}</DialogTitle>
            <DialogDescription>{t("editNoteDescription")}</DialogDescription>
          </DialogHeader>
          <Textarea aria-label={t("note")} value={noteDraft} rows={4} onChange={(event) => setNoteDraft(event.target.value)} />
          <DialogFooter>
            <button type="button" className="dashboard-secondary-btn" onClick={() => setEditingNote(null)}>
              {t("cancel")}
            </button>
            <button
              type="button"
              className="dashboard-primary-btn"
              disabled={!noteDraft.trim() || pending}
              onClick={() => onUpdateEntry(editingNote._id, { text: noteDraft.trim() }, () => setEditingNote(null))}
            >
              {t("saveNote")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}

export function ApplicationDetailSheet({ application, onOpenChange, onEdit }) {
  const t = useTranslations("dashboard.appComponents.detail");
  const tDashboard = useTranslations("dashboard");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [confirm, confirmDialog] = useConfirm();
  const id = application?._id;

  const { data } = useQuery({
    queryKey: ["applications", "detail", id],
    queryFn: () => requestJson(`/api/applications/${id}`),
    enabled: Boolean(id),
    ...(application ? { initialData: application } : {}),
  });
  const current = data ?? application;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["applications"] });

  const update = useMutation({
    mutationFn: ({ body }) => requestJson(`/api/applications/${id}`, { method: "PUT", body }),
    onSuccess: (_data, { then }) => {
      invalidate();
      then?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: () => requestJson(`/api/applications/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidate();
      toast.success(t("deleted"));
      onOpenChange(false);
    },
    onError: () => toast.error(t("deleteError")),
  });

  if (!current) return null;

  const save = (body, then) => update.mutate({ body, then });
  const idx = stageIndex(current.status);
  const nextStage = idx >= 0 && idx < FORWARD_COUNT - 1 ? STAGES[idx + 1] : null;

  return (
    <Sheet open={Boolean(application)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-lg">
        <SheetHeader className="gap-3">
          <div className="flex items-start justify-between gap-3 pe-8">
            <div className="min-w-0">
              <SheetTitle className="truncate font-outfit">{current.jobTitle}</SheetTitle>
              <div className="truncate text-sm text-muted-foreground">
                {[current.jobCompany, current.location].filter(Boolean).join(", ")}
              </div>
            </div>
            <button
              type="button"
              className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
              onClick={() => onEdit(current)}
            >
              <PencilSimpleIcon size={16} aria-hidden="true" />
              {t("edit")}
            </button>
          </div>
          <div className="flex gap-1.5">
            {STAGES.map((stage, i) => (
              <span
                key={stage.key}
                title={tDashboard(`stages.${stage.key}`)}
                className={cn("h-1.5 flex-1 rounded-full", i > idx && "bg-[var(--landing-paper-strong)]")}
                style={i <= idx ? { background: stage.color } : undefined}
              />
            ))}
          </div>
          <div className="flex min-h-9 items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: STAGE_BY_KEY[current.status]?.color }}
                aria-hidden="true"
              />
              {STAGE_BY_KEY[current.status] ? tDashboard(`stages.${current.status}`) : current.status}
            </span>
            {nextStage && (
              <button
                type="button"
                className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
                disabled={update.isPending}
                onClick={() => save({ status: nextStage.key })}
              >
                {t("moveToStage", { stage: tDashboard(`stages.${nextStage.key}`) })}
                <ArrowRightIcon size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4 [&>*]:shrink-0">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Fact label={t("salary")} value={current.salary} />
            <Fact label={t("source")} value={current.source} />
            <Fact label={t("appliedOn")} value={current.appliedAt ? formatDate(current.appliedAt, locale, t("notSet")) : null} />
          </dl>

          {current.jobUrl && (
            <a
              href={current.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--landing-accent-dark)] hover:underline"
            >
              <ArrowSquareOutIcon size={14} aria-hidden="true" />
              {t("openPosting")}
            </a>
          )}

          {current.notes?.trim() && (
            <Section title={t("notes")}>
              <p className="text-sm break-words whitespace-pre-wrap">{current.notes}</p>
            </Section>
          )}

          <Section title={t("documentsSent")}>
            {current.tailoredCVId ? (
              <Link
                href={`/dashboard/tailored/${current.tailoredCVId}`}
                className="dashboard-list-row group flex items-center gap-3 px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--landing-accent-soft)] font-outfit text-[10px] font-semibold text-[var(--landing-accent-dark)]">
                  CV
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {t("tailoredForJob")}
                </span>
                <ArrowRightIcon
                  size={14}
                  className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">{t("noCv")}</p>
            )}
          </Section>

          <ApplicationCopilot application={current} />

          <Section title={t("contacts")}>
            <ContactsEditor
              key={current._id}
              contacts={current.contacts ?? []}
              pending={update.isPending}
              onChange={(contacts) => save({ contacts })}
            />
          </Section>

          {current.followUpDate && (
            <Section title={t("followUp")}>
              <div className="rounded-md border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-2.5 text-sm text-foreground">
                <span className="font-medium tabular-nums">{formatDate(current.followUpDate, locale, t("notSet"))}</span>
                {current.followUpNote ? `: ${current.followUpNote}` : ""}
              </div>
            </Section>
          )}

          <ApplicationTimeline
            key={`timeline-${current._id}`}
            application={current}
            pending={update.isPending}
            onAddNote={(text, then) => save({ addNote: text }, then)}
            onUpdateEntry={(entryId, input, then) => save({ updateEntry: { entryId, ...input } }, then)}
            onDeleteEntry={(entryId) => {
              void confirm(t("deleteEntryTitle"), {
                description: t("deleteEntryDescription"),
                confirmText: t("delete"),
              }).then((confirmed) => {
                if (confirmed) save({ deleteEntry: entryId });
              });
            }}
          />
        </div>

        <div className="flex items-center gap-1 border-t border-[var(--landing-line)] p-4">
          {current.status !== "rejected" && (
            <Button
              size="sm"
              variant="ghost"
              className="h-control hover:bg-[var(--landing-paper-soft)]"
              disabled={update.isPending}
              onClick={() => save({ status: "rejected" })}
            >
              <XCircleIcon size={16} aria-hidden="true" />
              {t("markRejected")}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-control hover:bg-[var(--landing-paper-soft)]"
            onClick={() => save({ archived: !current.archived })}
          >
            {current.archived ? t("unarchive") : t("archive")}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="ms-auto h-control text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={remove.isPending}
            onClick={async () => {
              const confirmed = await confirm(t("confirmTitle"), {
                description: t("confirmDescription", { title: current.jobTitle, company: current.jobCompany }),
                confirmText: t("delete"),
              });
              if (confirmed) remove.mutate();
            }}
          >
            <TrashIcon size={16} aria-hidden="true" />
            {t("delete")}
          </Button>
        </div>
        {confirmDialog}
      </SheetContent>
    </Sheet>
  );
}
