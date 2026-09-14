"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { toast } from "sonner";
import posthog from "posthog-js";
import {
  KanbanIcon,
  BuildingsIcon,
  CalendarIcon,
  ArrowSquareOutIcon,
  TrashIcon,
  PlusIcon,
  CaretRightIcon,
  ListIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
  DashboardFilterPills,
  DashboardTabBar,
} from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import { cn } from "@/lib/utils";
import { gradeChipClass } from "@/components/GradeBadge";
import { jobToText } from "@/lib/ats/rules";
import { STAGES, STAGE_LABEL, STAGE_STYLE } from "@/lib/applications";

// recharts is heavy and only the Insights tab needs it.
const Insights = dynamic(() => import("@/components/ApplicationInsights"), {
  loading: () => <p className="py-10 text-center text-sm text-muted-foreground">Loading insights…</p>,
});

const VIEWS = [
  { id: "board", label: "Board", icon: <KanbanIcon size={14} aria-hidden="true" /> },
  { id: "table", label: "Table", icon: <ListIcon size={14} aria-hidden="true" /> },
  { id: "insights", label: "Insights", icon: <ChartBarIcon size={14} aria-hidden="true" /> },
];

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "interviewing", label: "Interview" },
  { key: "closed", label: "Closed" },
];

const ACTIVE = ["evaluated", "applied", "screening", "interviewing"];
const CLOSED = ["offer", "rejected", "withdrawn"];

function filterApplications(applications, filter) {
  if (filter === "active") return applications.filter((a) => ACTIVE.includes(a.status));
  if (filter === "interviewing") return applications.filter((a) => a.status === "interviewing");
  if (filter === "closed") return applications.filter((a) => CLOSED.includes(a.status));
  return applications;
}

const trackEvent = (name, props) => {
  if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.capture(name, props);
  }
};

function StatusSelect({ currentStatus, onStatusChange, disabled }) {
  return (
    <Select value={currentStatus} onValueChange={onStatusChange} disabled={disabled}>
      <SelectTrigger
        aria-label="Stage"
        className={cn(
          "h-8 w-full min-w-0 rounded-md border-0 px-2.5 text-xs font-semibold shadow-none focus:ring-2 focus:ring-ring/40 sm:h-7 sm:w-auto sm:min-w-27",
          STAGE_STYLE[currentStatus] || STAGE_STYLE.evaluated
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {STAGES.map(({ key, label }) => (
          <SelectItem key={key} value={key} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ---------------------------------------------------------------- Board

function BoardCard({ app, onMove, pending, onDragStart, onDragEnd }) {
  const router = useRouter();

  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", app._id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(app._id);
      }}
      onDragEnd={onDragEnd}
      className="cursor-grab gap-0 rounded-md border-[var(--landing-line)] py-0 active:cursor-grabbing"
    >
      <CardContent className="space-y-2 p-3">
        <button
          type="button"
          onClick={() => router.push(`/dashboard/applications/${app._id}`)}
          className="block w-full rounded-sm text-left focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:underline">
            {app.jobTitle || "Untitled"}
          </p>
          <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <BuildingsIcon size={12} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{app.jobCompany}</span>
          </p>
        </button>
        {(app.matchGrade || app.followUpDate || app.tags?.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {app.matchGrade && (
              <span className={cn("rounded-full px-1.5 py-0.5 font-bold", gradeChipClass(app.matchGrade))}>
                {app.matchGrade}
              </span>
            )}
            {app.followUpDate && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <CalendarIcon size={12} aria-hidden="true" />
                Follow up{" "}
                <FormattedDate date={app.followUpDate} options={{ month: "short", day: "numeric" }} />
              </span>
            )}
            {app.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-[var(--landing-paper-strong)] px-1.5 py-0.5 text-[var(--landing-ink-soft)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* The keyboard and touch way to move a card. */}
        <StatusSelect
          currentStatus={app.status}
          onStatusChange={(next) => onMove(app._id, next)}
          disabled={pending}
        />
      </CardContent>
    </Card>
  );
}

function Board({ applications, onMove, pending }) {
  // A ref, not state: only the drag handlers read it.
  const dragId = useRef(null);
  const [overStage, setOverStage] = useState(null);

  const endDrag = () => {
    dragId.current = null;
    setOverStage(null);
  };

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="flex min-w-max items-start gap-3">
        {STAGES.map((stage) => {
          const items = applications.filter((a) => a.status === stage.key);
          return (
            <section
              key={stage.key}
              aria-label={`${stage.label}, ${items.length}`}
              onDragOver={(e) => {
                if (!dragId.current) return;
                e.preventDefault();
                setOverStage(stage.key);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setOverStage((s) => (s === stage.key ? null : s));
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                const app = applications.find((a) => a._id === id);
                endDrag();
                if (app && app.status !== stage.key) onMove(id, stage.key);
              }}
              className={cn(
                "flex w-64 shrink-0 flex-col gap-2 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-2 transition-colors",
                overStage === stage.key && "border-[var(--landing-ink-soft)] bg-[var(--landing-primary-soft)]"
              )}
            >
              <header className="flex items-center justify-between px-1 py-1 text-xs font-semibold text-[var(--landing-ink-soft)]">
                <span>{stage.label}</span>
                <span className="tabular-nums">{items.length}</span>
              </header>
              {items.map((app) => (
                <BoardCard
                  key={app._id}
                  app={app}
                  onMove={onMove}
                  pending={pending}
                  onDragStart={(id) => {
                    dragId.current = id;
                  }}
                  onDragEnd={endDrag}
                />
              ))}
              {items.length === 0 && (
                <p className="rounded-md border border-dashed border-[var(--landing-line)] px-2 py-6 text-center text-xs text-muted-foreground">
                  Drag a card here
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Table

function ApplicationRow({ app, index, onStatusChange, onDelete, statusPending, confirmingDelete }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index, 10) * 0.03 }}
    >
      <Card
        role="button"
        tabIndex={0}
        onClick={() => router.push(`/dashboard/applications/${app._id}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/dashboard/applications/${app._id}`);
          }
        }}
        className="group cursor-pointer rounded-lg border-[var(--landing-line)] py-0 gap-0 transition-colors hover:border-[#ccc5bb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <CardContent className="dashboard-row-pad flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--landing-primary-soft)] text-sm font-bold text-[var(--landing-primary-dark)]">
              {(app.jobCompany?.[0] ?? "?").toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:underline sm:truncate sm:line-clamp-1">
                  {app.jobTitle || "Untitled"}
                </p>
                {app.matchGrade && (
                  <span
                    className={cn(
                      "hidden shrink-0 rounded-full px-2 py-0.5 text-xs font-bold sm:inline-flex",
                      gradeChipClass(app.matchGrade)
                    )}
                  >
                    {app.matchGrade}
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                <span className="inline-flex min-w-0 items-center gap-1">
                  <BuildingsIcon size={12} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{app.jobCompany || "Unknown"}</span>
                </span>
                <span className="hidden text-border sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex shrink-0 items-center gap-1">
                  <CalendarIcon size={12} className="shrink-0" aria-hidden="true" />
                  <FormattedDate date={app.createdAt} options={{ month: "short", day: "numeric" }} />
                </span>
                {app.tags?.length > 0 && (
                  <span className="truncate">{app.tags.join(", ")}</span>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex w-full items-center gap-1.5 border-t border-[var(--landing-line)]/60 pt-3 sm:w-auto sm:shrink-0 sm:border-0 sm:pt-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 flex-1 sm:flex-none">
              <StatusSelect
                currentStatus={app.status}
                onStatusChange={(next) => onStatusChange(app._id, next)}
                disabled={statusPending}
              />
            </div>
            {app.jobUrl && (
              <Button asChild variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground hover:text-foreground">
                <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" title="Open job listing" aria-label="Open job listing">
                  <ArrowSquareOutIcon size={16} />
                </a>
              </Button>
            )}
            <Button
              variant={confirmingDelete ? "destructive" : "ghost"}
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              title={confirmingDelete ? "Tap again to confirm" : "Delete application"}
              aria-label={
                confirmingDelete
                  ? `Confirm delete ${app.jobTitle || "application"}`
                  : `Delete ${app.jobTitle || "application"}`
              }
              onClick={() => onDelete(app._id)}
            >
              {confirmingDelete ? "?" : <TrashIcon size={16} />}
            </Button>
            <CaretRightIcon
              size={14}
              className="ml-auto hidden shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground sm:ml-0 sm:block"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Table({ applications, onStatusChange, statusPending }) {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      trackEvent("application_deleted");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application deleted");
      setConfirmDeleteId(null);
    },
    onError: () => {
      toast.error("Couldn't delete the application. Try again.");
      setConfirmDeleteId(null);
    },
  });

  const filtered = filterApplications(applications, activeFilter);

  const handleDelete = (id) => {
    if (confirmDeleteId === id) deleteMutation.mutate(id);
    else setConfirmDeleteId(id);
  };

  return (
    <div className="space-y-3">
      <DashboardFilterPills
        tabs={FILTER_TABS.map((tab) => ({ ...tab, count: filterApplications(applications, tab.key).length }))}
        activeKey={activeFilter}
        onChange={setActiveFilter}
      />
      {filtered.length === 0 ? (
        <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No applications match this filter.{" "}
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="font-semibold text-foreground underline-offset-2 hover:underline"
            >
              Show all
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((app, i) => (
            <ApplicationRow
              key={app._id}
              app={app}
              index={i}
              statusPending={statusPending}
              confirmingDelete={confirmDeleteId === app._id}
              onStatusChange={onStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Add sheet

const EMPTY_FORM = {
  jobUrl: "",
  jobDescription: "",
  jobCompany: "",
  jobTitle: "",
  location: "",
  salary: "",
  source: "",
  tags: "",
  status: "applied",
};

async function postJson(url, body, fallbackError) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.data) throw new Error(json.error || fallbackError);
  return json.data;
}

function AddApplicationSheet({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  // Fill only what the source found, so typed values survive.
  const fill = (fields) =>
    setForm((f) => ({ ...f, ...Object.fromEntries(Object.entries(fields).filter(([, v]) => v)) }));

  const fromLink = useMutation({
    mutationFn: () =>
      postJson("/api/job/extract", { url: form.jobUrl.trim() }, "Couldn't read that link. Paste the job description instead."),
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

  const fromText = useMutation({
    mutationFn: () =>
      postJson("/api/applications/autofill", { jobDescription: form.jobDescription }, "Couldn't read the description. Fill in the fields yourself."),
    onSuccess: (data) => {
      fill({ jobCompany: data.company, jobTitle: data.role, location: data.location, salary: data.salary });
      toast.success("Filled in from the description");
    },
    onError: (error) => toast.error(error.message),
  });

  const create = useMutation({
    mutationFn: () =>
      postJson("/api/applications", { ...form, tags: form.tags.split(",") }, "Couldn't add the application. Try again."),
    onSuccess: () => {
      trackEvent("application_added_manually");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application added");
      setForm(EMPTY_FORM);
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const canSubmit = form.jobCompany.trim() && form.jobTitle.trim() && !create.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Add application</SheetTitle>
          <SheetDescription>Track a job you applied to outside FitMyCV.</SheetDescription>
        </SheetHeader>

        <form
          id="add-application"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) create.mutate();
          }}
          className="space-y-5 px-4"
        >
          <div className="space-y-2">
            <Label htmlFor="app-url">Job link</Label>
            <div className="flex gap-2">
              <Input
                id="app-url"
                type="url"
                inputMode="url"
                placeholder="https://"
                value={form.jobUrl}
                onChange={set("jobUrl")}
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-md"
                onClick={() => fromLink.mutate()}
                disabled={!form.jobUrl.trim() || fromLink.isPending}
                aria-busy={fromLink.isPending}
              >
                {fromLink.isPending && <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />}
                Fill from link
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-description">Job description</Label>
            <Textarea
              id="app-description"
              rows={5}
              placeholder="Paste the posting if the link doesn't work"
              value={form.jobDescription}
              onChange={set("jobDescription")}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-md"
              onClick={() => fromText.mutate()}
              disabled={!form.jobDescription.trim() || fromText.isPending}
              aria-busy={fromText.isPending}
            >
              {fromText.isPending && <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />}
              Fill from description
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="app-company">Company *</Label>
              <Input id="app-company" required value={form.jobCompany} onChange={set("jobCompany")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-role">Role *</Label>
              <Input id="app-role" required value={form.jobTitle} onChange={set("jobTitle")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-location">Location</Label>
              <Input id="app-location" value={form.location} onChange={set("location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-salary">Salary</Label>
              <Input id="app-salary" value={form.salary} onChange={set("salary")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-source">Source</Label>
              <Input id="app-source" placeholder="LinkedIn, referral" value={form.source} onChange={set("source")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="app-stage">Stage</Label>
              <Select value={form.status} onValueChange={(status) => setForm((f) => ({ ...f, status }))}>
                <SelectTrigger id="app-stage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map(({ key, label }) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-tags">Tags</Label>
            <Input id="app-tags" placeholder="remote, fintech" value={form.tags} onChange={set("tags")} />
            <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
          </div>
        </form>

        <SheetFooter className="px-4">
          <Button
            type="submit"
            form="add-application"
            disabled={!canSubmit}
            className="rounded-md bg-foreground font-outfit font-medium text-background hover:bg-black"
          >
            {create.isPending && <SpinnerGapIcon size={14} className="animate-spin" aria-hidden="true" />}
            Add application
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------- Page

export default function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState("board");
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [adding, setAdding] = useState(false);

  const queryKey = ["applications", { archived: showArchived }];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/applications?archived=${showArchived}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
    placeholderData: keepPreviousData,
  });

  const moveMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    // Move the card at once and roll back if the save fails.
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (list = []) =>
        list.map((a) => (a._id === id ? { ...a, status } : a))
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      toast.error("Couldn't move the application. Try again.");
    },
    onSuccess: (_, { status }) => {
      trackEvent("application_status_changed", { status });
      toast.success(`Moved to ${STAGE_LABEL[status]}`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });

  const applications = useMemo(() => data || [], [data]);

  const allTags = useMemo(
    () => [...new Set(applications.flatMap((a) => a.tags || []))].sort(),
    [applications]
  );

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (tag !== "all" && !(a.tags || []).includes(tag)) return false;
      if (!needle) return true;
      return [a.jobTitle, a.jobCompany, a.location, ...(a.tags || [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(needle));
    });
  }, [applications, search, tag]);

  if (isLoading) return <Loader />;

  const move = (id, status) => moveMutation.mutate({ id, status });
  const isEmpty = applications.length === 0 && !showArchived;

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title="Applications"
        description="Track every application from saved to offer."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="rounded-md border-[var(--landing-line)]">
              <Link href="/dashboard/tailor">Tailor a CV</Link>
            </Button>
            <Button
              onClick={() => setAdding(true)}
              className="rounded-md bg-foreground font-outfit font-medium text-background hover:bg-black"
            >
              <PlusIcon size={16} />
              Add application
            </Button>
          </div>
        }
      />

      {isEmpty ? (
        <DashboardEmptyState
          icon={KanbanIcon}
          title="No applications yet"
          description="Every CV you tailor shows up here. You can also add a job you applied to somewhere else."
          actionLabel="Add application"
          onAction={() => setAdding(true)}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <DashboardTabBar ariaLabel="Application views" tabs={VIEWS} activeTab={view} onTabChange={setView} />
            <div className="flex flex-wrap items-center gap-2">
              {view !== "insights" && (
                <div className="relative w-full sm:w-56">
                  <MagnifyingGlassIcon
                    size={14}
                    className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    aria-label="Search applications"
                    placeholder="Search company or role"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 pl-8"
                  />
                </div>
              )}
              {view !== "insights" && allTags.length > 0 && (
                <Select value={tag} onValueChange={setTag}>
                  <SelectTrigger className="h-9 w-36" aria-label="Filter by tag">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tags</SelectItem>
                    {allTags.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <label className="flex h-9 cursor-pointer items-center gap-2 px-1 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="size-4 accent-[var(--landing-ink)]"
                />
                Show archived
              </label>
            </div>
          </div>

          {showArchived && applications.length === 0 ? (
            <Card className="dashboard-card rounded-lg border-[var(--landing-line)] py-0 gap-0">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Nothing is archived. Archive an application from its page to hide it from the board.
              </CardContent>
            </Card>
          ) : view === "board" ? (
            <Board applications={visible} onMove={move} pending={moveMutation.isPending} />
          ) : view === "table" ? (
            <Table applications={visible} onStatusChange={move} statusPending={moveMutation.isPending} />
          ) : (
            <Insights applications={applications} />
          )}
        </>
      )}

      <AddApplicationSheet open={adding} onOpenChange={setAdding} />
    </DashboardPageShell>
  );
}
