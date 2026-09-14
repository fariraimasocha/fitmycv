"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  BuildingsIcon,
  CalendarIcon,
  ArrowSquareOutIcon,
  NotepadIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  UsersIcon,
  SparkleIcon,
  CopyIcon,
  SpinnerGapIcon,
  TrashIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import { DashboardPageShell, DashboardPageHeader } from "@/components/dashboard";
import { GradeBadge } from "@/components/GradeBadge";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";
import { STAGES, STAGE_LABEL, STAGE_STYLE } from "@/lib/applications";
import { cn } from "@/lib/utils";

const CARD = "dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0";

function Section({ delay, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      {children}
    </motion.div>
  );
}

function toForm(app) {
  return {
    jobCompany: app.jobCompany || "",
    jobTitle: app.jobTitle || "",
    jobUrl: app.jobUrl || "",
    location: app.location || "",
    salary: app.salary || "",
    source: app.source || "",
    tags: (app.tags || []).join(", "),
    followUpDate: app.followUpDate ? new Date(app.followUpDate).toISOString().split("T")[0] : "",
    jobDescription: app.jobDescription || "",
    notes: app.notes || "",
  };
}

const COPILOT_ACTIONS = [
  { kind: "match", label: "Check match" },
  { kind: "follow-up", label: "Draft follow-up" },
  { kind: "cover-letter", label: "Draft cover letter" },
];

function Copilot({ id }) {
  const [result, setResult] = useState(null);

  const run = useMutation({
    mutationFn: async (kind) => {
      const res = await fetch(`/api/applications/${id}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.data) throw new Error(json.error || "Couldn't finish that. Try again.");
      return { kind, ...json.data };
    },
    onSuccess: setResult,
    onError: (error) => toast.error(error.message),
  });

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Couldn't copy. Select the text and copy it yourself.");
    }
  };

  return (
    <Card className={CARD}>
      <CardHeader className="dashboard-card-pad">
        <CardTitle className="flex items-center gap-2 text-base">
          <SparkleIcon size={16} aria-hidden="true" />
          Copilot
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Uses the CV tailored for this job, or your main CV if there isn&apos;t one.
        </p>
      </CardHeader>
      <CardContent className="dashboard-card-pad space-y-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {COPILOT_ACTIONS.map(({ kind, label }) => {
            const busy = run.isPending && run.variables === kind;
            return (
              <Button
                key={kind}
                variant="outline"
                size="sm"
                className="rounded-md border-[var(--landing-line)]"
                onClick={() => run.mutate(kind)}
                disabled={run.isPending}
                aria-busy={busy}
              >
                {busy && <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />}
                {label}
              </Button>
            );
          })}
        </div>

        {result?.match && (
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-outfit text-2xl font-semibold tabular-nums">{result.match.overall}%</span>{" "}
              <span className="text-muted-foreground">overlap with the job description</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Counted from shared skills, keywords and experience signals. No AI is involved.
            </p>
            {result.match.skillsMissing.length > 0 && (
              <p className="text-[var(--landing-ink-soft)]">
                Skills the job names that your CV doesn&apos;t: {result.match.skillsMissing.join(", ")}.
              </p>
            )}
            <ul className="list-disc space-y-1 pl-5 text-[var(--landing-ink-soft)]">
              {result.match.improvements.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {result?.text && (
          <div className="space-y-2">
            <p className="rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-3 text-sm leading-6 whitespace-pre-wrap">
              {result.text}
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Read it through before you send it.</p>
              <Button variant="ghost" size="sm" className="rounded-md" onClick={() => copy(result.text)}>
                <CopyIcon size={14} aria-hidden="true" />
                Copy text
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const EMPTY_CONTACT = { name: "", role: "", kind: "", email: "", phone: "" };

function Contacts({ contacts, onSave, pending }) {
  const [draft, setDraft] = useState(EMPTY_CONTACT);
  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  return (
    <Card className={CARD}>
      <CardHeader className="dashboard-card-pad">
        <CardTitle className="flex items-center gap-2 text-base">
          <UsersIcon size={16} aria-hidden="true" />
          Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-card-pad space-y-4 pt-0">
        {contacts.length > 0 && (
          <ul className="divide-y divide-[var(--landing-line)]">
            {contacts.map((c, i) => (
              <li key={c._id} className="flex items-start justify-between gap-3 py-2.5 first:pt-0">
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-foreground">
                    {c.name}
                    {c.kind && (
                      <span className="ml-2 rounded-sm bg-[var(--landing-paper-strong)] px-1.5 py-0.5 text-xs font-normal text-[var(--landing-ink-soft)]">
                        {c.kind}
                      </span>
                    )}
                  </p>
                  {c.role && <p className="text-muted-foreground">{c.role}</p>}
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-[var(--landing-accent)] hover:underline">
                        <EnvelopeSimpleIcon size={12} aria-hidden="true" />
                        {c.email}
                      </a>
                    )}
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-[var(--landing-accent)] hover:underline">
                        <PhoneIcon size={12} aria-hidden="true" />
                        {c.phone}
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${c.name}`}
                  disabled={pending}
                  onClick={() => onSave(contacts.filter((_, j) => j !== i), "Contact removed")}
                >
                  <TrashIcon size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim()) return;
            onSave([...contacts, draft], "Contact added", () => setDraft(EMPTY_CONTACT));
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="contact-name">Name *</Label>
            <Input id="contact-name" required value={draft.name} onChange={set("name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-kind">Relationship</Label>
            <Input id="contact-kind" placeholder="Recruiter, referral" value={draft.kind} onChange={set("kind")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-role">Job title</Label>
            <Input id="contact-role" value={draft.role} onChange={set("role")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" type="email" value={draft.email} onChange={set("email")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input id="contact-phone" type="tel" value={draft.phone} onChange={set("phone")} />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="outline" size="sm" className="rounded-md" disabled={pending || !draft.name.trim()}>
              Add contact
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const [noteText, setNoteText] = useState("");

  const { data: app, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const res = await fetch(`/api/applications/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
  });

  const setDetailLabel = useBreadcrumbStore((s) => s.setDetailLabel);

  useEffect(() => {
    if (app?.jobTitle) setDetailLabel(app.jobTitle);
    return () => setDetailLabel(null);
  }, [app?.jobTitle, setDetailLabel]);

  // Seed the edit form once from the fetched record.
  if (app && form === null) setForm(toForm(app));

  const update = useMutation({
    mutationFn: async ({ body }) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Couldn't save. Try again.");
      return json.data;
    },
    onSuccess: (_data, { message, then }) => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      if (message) toast.success(message);
      then?.();
    },
    onError: (error) => toast.error(error.message),
  });

  const save = (body, message, then) => update.mutate({ body, message, then });

  if (isLoading || (app && !form)) return <Loader />;
  if (!app) {
    return (
      <DashboardPageShell width="narrow">
        <p className="text-center text-sm text-muted-foreground">Application not found.</p>
      </DashboardPageShell>
    );
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const timeline = [...(app.statusHistory || [])].reverse();

  return (
    <DashboardPageShell width="narrow">
      <button
        type="button"
        onClick={() => router.push("/dashboard/applications")}
        className="mb-2 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon size={14} />
        Back to Applications
      </button>

      <DashboardPageHeader
        title={app.jobTitle}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BuildingsIcon size={14} />
              {app.jobCompany}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarIcon size={14} />
              <FormattedDate date={app.createdAt} />
            </span>
            {app.jobUrl && (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--landing-accent)] hover:underline"
              >
                View listing
                <ArrowSquareOutIcon size={12} />
              </a>
            )}
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <GradeBadge grade={app.matchGrade} size="md" />
            <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-medium", STAGE_STYLE[app.status])}>
              {STAGE_LABEL[app.status]}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-md border-[var(--landing-line)]"
              disabled={update.isPending}
              onClick={() =>
                save({ archived: !app.archived }, app.archived ? "Application restored" : "Application archived")
              }
            >
              {app.archived ? <ArrowCounterClockwiseIcon size={14} /> : <ArchiveIcon size={14} />}
              {app.archived ? "Restore" : "Archive"}
            </Button>
          </div>
        }
      />

      {app.archived && (
        <p className="rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3 py-2 text-sm text-[var(--landing-ink-soft)]">
          This application is archived, so it&apos;s hidden from your board. Restore it to track it again.
        </p>
      )}

      <Section delay={0.05}>
        <Card className={CARD}>
          <CardHeader className="dashboard-card-pad">
            <CardTitle className="text-base">Stage</CardTitle>
          </CardHeader>
          <CardContent className="dashboard-card-pad pt-0">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {STAGES.map(({ key, label }) => (
                <Button
                  key={key}
                  variant={app.status === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => save({ status: key }, `Moved to ${label}`)}
                  disabled={update.isPending || app.status === key}
                  aria-pressed={app.status === key}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section delay={0.1}>
        <Copilot id={id} />
      </Section>

      <Section delay={0.15}>
        <Card className={CARD}>
          <CardHeader className="dashboard-card-pad">
            <CardTitle className="flex items-center gap-2 text-base">
              <NotepadIcon size={16} />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="dashboard-card-pad pt-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save(
                  { ...form, tags: form.tags.split(","), followUpDate: form.followUpDate || null },
                  "Changes saved"
                );
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="d-company">Company</Label>
                  <Input id="d-company" value={form.jobCompany} onChange={set("jobCompany")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-role">Role</Label>
                  <Input id="d-role" value={form.jobTitle} onChange={set("jobTitle")} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="d-url">Job link</Label>
                  <Input id="d-url" type="url" placeholder="https://" value={form.jobUrl} onChange={set("jobUrl")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-location">Location</Label>
                  <Input id="d-location" value={form.location} onChange={set("location")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-salary">Salary</Label>
                  <Input id="d-salary" value={form.salary} onChange={set("salary")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-source">Source</Label>
                  <Input id="d-source" value={form.source} onChange={set("source")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="d-follow-up">Follow-up date</Label>
                  <Input id="d-follow-up" type="date" value={form.followUpDate} onChange={set("followUpDate")} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="d-tags">Tags</Label>
                  <Input id="d-tags" placeholder="remote, fintech" value={form.tags} onChange={set("tags")} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="d-description">Job description</Label>
                  <Textarea
                    id="d-description"
                    rows={5}
                    placeholder="Paste the posting so Copilot can check your match"
                    value={form.jobDescription}
                    onChange={set("jobDescription")}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="d-notes">Notes</Label>
                  <Textarea id="d-notes" rows={3} value={form.notes} onChange={set("notes")} />
                </div>
              </div>
              <Button type="submit" size="sm" disabled={update.isPending}>
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </Section>

      <Section delay={0.2}>
        <Contacts
          contacts={app.contacts || []}
          pending={update.isPending}
          onSave={(contacts, message, then) => save({ contacts }, message, then)}
        />
      </Section>

      <Section delay={0.25}>
        <Card className={CARD}>
          <CardHeader className="dashboard-card-pad">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClockIcon size={16} />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="dashboard-card-pad space-y-4 pt-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (noteText.trim()) save({ addNote: noteText }, "Note added", () => setNoteText(""));
              }}
              className="space-y-2"
            >
              <Label htmlFor="note" className="sr-only">
                Add a note
              </Label>
              <Textarea
                id="note"
                rows={2}
                placeholder="Add a note, such as who you spoke to"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <Button type="submit" variant="outline" size="sm" className="rounded-md" disabled={update.isPending || !noteText.trim()}>
                Add note
              </Button>
            </form>

            <ol className="space-y-3">
              {timeline.map((entry) => {
                const isNote = entry.kind === "note";
                return (
                  <li key={entry._id} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isNote ? (
                          <span className="text-xs font-medium text-foreground">Note</span>
                        ) : (
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STAGE_STYLE[entry.status] || STAGE_STYLE.evaluated)}>
                            {STAGE_LABEL[entry.status] || entry.status}
                          </span>
                        )}
                        <FormattedDate
                          date={entry.date}
                          className="text-xs text-muted-foreground"
                          options={{ month: "short", day: "numeric", year: "numeric" }}
                        />
                      </div>
                      {entry.note && (
                        <p
                          className={cn(
                            "mt-0.5 whitespace-pre-wrap",
                            isNote ? "text-sm text-foreground" : "text-xs text-muted-foreground"
                          )}
                        >
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </Section>
    </DashboardPageShell>
  );
}
