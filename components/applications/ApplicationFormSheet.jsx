"use client";

import { useId, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LinkSimpleIcon, SparkleIcon, SpinnerGapIcon, XIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { jobToText } from "@/lib/ats/rules";
import { STAGES } from "@/lib/applications";
import { requestJson } from "@/lib/request-json";

// Ported from Reactive Resume's application-form-sheet.tsx.

const SOURCE_OPTIONS = ["LinkedIn", "Indeed", "Company website", "Referral", "Recruiter", "Other"];
const MAX_JOB_DESCRIPTION_CHARS = 20_000;
// A paste shorter than this is a snippet, not a posting, so it doesn't spend a model call.
const MIN_AUTOFILL_CHARS = 200;
const NO_CV = "none";

const emptyForm = () => ({
  jobCompany: "",
  jobTitle: "",
  location: "",
  salary: "",
  source: "",
  status: "evaluated",
  tailoredCVId: "",
  tags: [],
  jobUrl: "",
  stageEnteredAt: "",
  jobDescription: "",
  followUpDate: "",
  followUpNote: "",
  notes: "",
});

const dateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

function toForm(app) {
  return {
    jobCompany: app.jobCompany ?? "",
    jobTitle: app.jobTitle ?? "",
    location: app.location ?? "",
    salary: app.salary ?? "",
    source: app.source ?? "",
    status: app.status,
    tailoredCVId: app.tailoredCVId ? String(app.tailoredCVId) : "",
    tags: app.tags ?? [],
    jobUrl: app.jobUrl ?? "",
    stageEnteredAt: "",
    jobDescription: app.jobDescription ?? "",
    followUpDate: dateInput(app.followUpDate),
    followUpNote: app.followUpNote ?? "",
    notes: app.notes ?? "",
  };
}

function Field({ label, required, htmlFor, children }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

// Type-and-Enter tag input with chips and an autocomplete list of existing tags.
function TagsField({ id, value, suggestions, onChange }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };
  return (
    <div className="flex flex-col gap-2">
      <Input
        id={id}
        value={draft}
        list={`${id}-list`}
        placeholder="Type a tag and press Enter"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            add();
          }
        }}
        onBlur={add}
      />
      <datalist id={`${id}-list`}>
        {suggestions.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex h-6 items-center gap-1 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] pl-2 pr-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove tag ${tag}`}
                className="flex h-4 w-4 items-center justify-center rounded-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onChange(value.filter((t) => t !== tag))}
              >
                <XIcon size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ApplicationFormSheet({ open, onOpenChange, application, allTags = [] }) {
  const queryClient = useQueryClient();
  const uid = useId();
  const isEditing = Boolean(application);
  const [form, setForm] = useState(() => (application ? toForm(application) : emptyForm()));

  // Re-sync when the sheet's target changes (a different application, or create and edit).
  const [syncedId, setSyncedId] = useState(application?._id ?? null);
  if ((application?._id ?? null) !== syncedId) {
    setSyncedId(application?._id ?? null);
    setForm(application ? toForm(application) : emptyForm());
  }

  const { data: cvs = [] } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: () => requestJson("/api/tailored-cv"),
    enabled: open,
  });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const fill = (fields) =>
    setForm((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(fields).filter(([, v]) => v)) }));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["applications"] });

  const save = useMutation({
    mutationFn: (payload) =>
      application
        ? requestJson(`/api/applications/${application._id}`, { method: "PUT", body: payload })
        : requestJson("/api/applications", { method: "POST", body: payload }),
    onSuccess: () => {
      invalidate();
      toast.success(isEditing ? "Application updated" : "Application added to your pipeline");
      if (!isEditing) setForm(emptyForm());
      onOpenChange(false);
    },
    onError: () =>
      toast.error(isEditing ? "Couldn't save your changes. Try again." : "Couldn't add the application. Try again."),
  });

  const autofill = useMutation({
    mutationFn: (jobDescription) =>
      requestJson("/api/applications/autofill", { method: "POST", body: { jobDescription } }),
    onSuccess: (result) => {
      fill({ jobCompany: result.company, jobTitle: result.role, location: result.location, salary: result.salary });
      toast.success("Filled in what we could from the posting");
    },
    onError: (error) => toast.error(error.message),
  });

  const fromLink = useMutation({
    mutationFn: () => requestJson("/api/job/extract", { method: "POST", body: { url: form.jobUrl.trim() } }),
    onSuccess: (job) => {
      fill({
        jobTitle: job.title,
        jobCompany: job.company,
        location: job.location,
        salary: job.salary,
        jobDescription: jobToText(job),
      });
      toast.success("Filled in from the link");
    },
    onError: (error) => toast.error(error.message),
  });

  const runAutofill = (text) => {
    const posting = text.trim();
    if (posting.length < MIN_AUTOFILL_CHARS || autofill.isPending) return;
    autofill.mutate(posting.slice(0, MAX_JOB_DESCRIPTION_CHARS));
  };

  const submit = () => {
    if (!form.jobCompany.trim() || !form.jobTitle.trim()) return;
    const payload = {
      jobCompany: form.jobCompany,
      jobTitle: form.jobTitle,
      status: form.status,
      location: form.location,
      salary: form.salary,
      source: form.source,
      tailoredCVId: form.tailoredCVId || null,
      tags: form.tags,
      jobUrl: form.jobUrl,
      jobDescription: form.jobDescription,
      notes: form.notes,
      followUpNote: form.followUpNote,
      followUpDate: form.followUpDate || null,
    };
    save.mutate(isEditing ? payload : { ...payload, stageEnteredAt: form.stageEnteredAt || undefined });
  };

  const field = (name) => `${uid}-${name}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-outfit">{isEditing ? "Edit application" : "Add application"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the details of this application."
              : "Track a job you are applying to and link the CV you sent."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 [&>*]:shrink-0">
          {/* Collapsed by default so the form stays short. Stored with the application for the copilot. */}
          <Accordion
            type="single"
            collapsible
            defaultValue={form.jobDescription ? undefined : undefined}
            className="rounded-md border border-dashed border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3"
          >
            <AccordionItem value="job-description" className="border-0">
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <SparkleIcon size={16} className="text-[var(--landing-accent-dark)]" aria-hidden="true" />
                  Job description
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <p className="text-xs leading-5 text-muted-foreground">
                  Paste the whole job description from the posting. We fill in the fields and keep the text with this
                  application for fit scoring and drafts.
                </p>
                <Textarea
                  className="field-sizing-fixed h-40"
                  value={form.jobDescription}
                  rows={8}
                  maxLength={MAX_JOB_DESCRIPTION_CHARS}
                  placeholder="Paste the full job description here"
                  onChange={(event) => set("jobDescription", event.target.value)}
                  onPaste={(event) => runAutofill(event.clipboardData.getData("text"))}
                />
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    {autofill.isPending ? "Reading the posting" : "Pasting fills the fields for you."}
                  </p>
                  <button
                    type="button"
                    className="dashboard-secondary-btn dashboard-secondary-btn-sm shrink-0"
                    disabled={form.jobDescription.trim().length < MIN_AUTOFILL_CHARS || autofill.isPending}
                    onClick={() => runAutofill(form.jobDescription)}
                  >
                    {autofill.isPending ? (
                      <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                    ) : (
                      <SparkleIcon size={16} aria-hidden="true" />
                    )}
                    Fill fields
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Field label="Company" required htmlFor={field("company")}>
            <Input id={field("company")} value={form.jobCompany} onChange={(e) => set("jobCompany", e.target.value)} />
          </Field>
          <Field label="Role / title" required htmlFor={field("role")}>
            <Input id={field("role")} value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location" htmlFor={field("location")}>
              <Input
                id={field("location")}
                value={form.location}
                list={field("locations")}
                placeholder="Remote, hybrid or a city"
                onChange={(e) => set("location", e.target.value)}
              />
              <datalist id={field("locations")}>
                <option value="Remote" />
                <option value="Hybrid" />
                <option value="In-office" />
              </datalist>
            </Field>
            <Field label="Salary range" htmlFor={field("salary")}>
              <Input id={field("salary")} value={form.salary} onChange={(e) => set("salary", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source" htmlFor={field("source")}>
              <Input
                id={field("source")}
                value={form.source}
                list={field("sources")}
                placeholder="LinkedIn, referral"
                onChange={(e) => set("source", e.target.value)}
              />
              <datalist id={field("sources")}>
                {SOURCE_OPTIONS.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </Field>
            <Field label="Stage" htmlFor={field("stage")}>
              <Select value={form.status} onValueChange={(value) => set("status", value)}>
                <SelectTrigger id={field("stage")} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((stage) => (
                    <SelectItem key={stage.key} value={stage.key}>
                      <span className="h-2 w-2 rounded-full" style={{ background: stage.color }} aria-hidden="true" />
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Job posting link" htmlFor={field("url")}>
            <div className="flex gap-2">
              <Input
                id={field("url")}
                type="url"
                value={form.jobUrl}
                placeholder="https://"
                onChange={(e) => set("jobUrl", e.target.value)}
              />
              <button
                type="button"
                className="dashboard-secondary-btn shrink-0"
                disabled={!/^https?:\/\//i.test(form.jobUrl.trim()) || fromLink.isPending}
                onClick={() => fromLink.mutate()}
              >
                {fromLink.isPending ? (
                  <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <LinkSimpleIcon size={16} aria-hidden="true" />
                )}
                Fill from link
              </button>
            </div>
          </Field>
          {!isEditing && (
            <Field label="Stage date" htmlFor={field("stage-date")}>
              <Input
                id={field("stage-date")}
                type="date"
                value={form.stageEnteredAt}
                onChange={(e) => set("stageEnteredAt", e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">Leave it empty to use today.</p>
            </Field>
          )}
          <Field label="CV" htmlFor={field("cv")}>
            <Select value={form.tailoredCVId || NO_CV} onValueChange={(value) => set("tailoredCVId", value === NO_CV ? "" : value)}>
              <SelectTrigger id={field("cv")} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_CV}>No CV linked</SelectItem>
                {cvs.map((cv) => (
                  <SelectItem key={cv._id} value={String(cv._id)}>
                    {[cv.jobTitle || "Tailored CV", cv.jobCompany].filter(Boolean).join(" at ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Link the tailored CV you sent so the copilot can score your fit against it.
            </p>
          </Field>
          <Field label="Tags" htmlFor={field("tags")}>
            <TagsField id={field("tags")} value={form.tags} suggestions={allTags} onChange={(tags) => set("tags", tags)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Follow-up date" htmlFor={field("follow-up")}>
              <Input
                id={field("follow-up")}
                type="date"
                value={form.followUpDate}
                onChange={(e) => set("followUpDate", e.target.value)}
              />
            </Field>
            <Field label="Follow-up note" htmlFor={field("follow-up-note")}>
              <Input
                id={field("follow-up-note")}
                value={form.followUpNote}
                onChange={(e) => set("followUpNote", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Notes" htmlFor={field("notes")}>
            <Textarea
              id={field("notes")}
              value={form.notes}
              rows={3}
              placeholder="Who referred you, things to emphasize"
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--landing-line)]">
          <button type="button" className="dashboard-secondary-btn" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="dashboard-primary-btn"
            disabled={!form.jobCompany.trim() || !form.jobTitle.trim() || save.isPending}
            onClick={submit}
          >
            {isEditing ? "Save changes" : "Add to pipeline"}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
