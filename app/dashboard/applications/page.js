"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import posthog from "posthog-js";
import {
  ArchiveIcon,
  BriefcaseIcon,
  ChartBarIcon,
  FunnelIcon,
  KanbanIcon,
  MagnifyingGlassIcon,
  PenIcon,
  PlusIcon,
  RowsIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { ApplicationBoard } from "@/components/applications/ApplicationBoard";
import { ApplicationDetailSheet } from "@/components/applications/ApplicationDetailSheet";
import { ApplicationFormSheet } from "@/components/applications/ApplicationFormSheet";
import { ApplicationInsights } from "@/components/applications/ApplicationInsights";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STAGE_LABEL } from "@/lib/applications";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's /dashboard/applications route.

const SORT_OPTIONS = [
  { value: "updated", label: "Last updated" },
  { value: "applied", label: "Date applied" },
  { value: "company", label: "Company A to Z" },
  { value: "role", label: "Role A to Z" },
];

const VIEWS = [
  { value: "board", label: "Board", icon: KanbanIcon },
  { value: "table", label: "Table", icon: RowsIcon },
  { value: "insights", label: "Insights", icon: ChartBarIcon },
];

const LIST_KEY = ["applications", "list"];

const time = (value) => (value ? new Date(value).getTime() : 0);
const COMPARE = {
  updated: (a, b) => time(b.updatedAt) - time(a.updatedAt),
  applied: (a, b) => time(b.appliedAt) - time(a.appliedAt),
  company: (a, b) => (a.jobCompany || "").localeCompare(b.jobCompany || ""),
  role: (a, b) => (a.jobTitle || "").localeCompare(b.jobTitle || ""),
};

const trackEvent = (name, props) => {
  if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.capture(name, props);
  }
};

function TagChecklist({ allTags, tags, onChange }) {
  return (
    <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
      {allTags.map((tag) => (
        <label
          key={tag}
          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[var(--landing-paper-soft)]"
        >
          <Checkbox
            checked={tags.includes(tag)}
            onCheckedChange={(checked) => onChange(checked ? [...tags, tag] : tags.filter((t) => t !== tag))}
          />
          <span className="truncate">{tag}</span>
        </label>
      ))}
    </div>
  );
}

function SortSelect({ sort, onChange, className }) {
  return (
    <Select value={sort} onValueChange={onChange}>
      <SelectTrigger aria-label="Sort by" className={cn("h-8", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--landing-paper-strong)]">
        <BriefcaseIcon className="size-7 text-muted-foreground" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-lg font-semibold">Track your first application</h2>
        <p className="text-sm text-muted-foreground">
          Add a job you&apos;re applying to and link the CV you sent. Move it across the board as you hear back. Every CV
          you tailor shows up here too.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onAdd}>
          <PlusIcon />
          Add application
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/tailor">
            <PenIcon />
            Tailor a CV
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ApplicationsTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [view, setView] = useState(() => {
    const requested = searchParams.get("view");
    return VIEWS.some((v) => v.value === requested) ? requested : "board";
  });
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [sort, setSort] = useState("updated");
  const [archived, setArchived] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(() => searchParams.get("applicationId"));

  const { data: applications = [], isLoading } = useQuery({
    queryKey: LIST_KEY,
    queryFn: () => requestJson("/api/applications?archived=all"),
  });

  const move = useMutation({
    mutationFn: ({ id, status }) => requestJson(`/api/applications/${id}`, { method: "PUT", body: { status } }),
    // Move the card at once and roll back if the save fails.
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: LIST_KEY });
      const previous = queryClient.getQueryData(LIST_KEY);
      queryClient.setQueryData(LIST_KEY, (rows = []) => rows.map((row) => (row._id === id ? { ...row, status } : row)));
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(LIST_KEY, context.previous);
      toast.error("Couldn't move the application. Try again.");
    },
    onSuccess: (_data, { status }) => {
      trackEvent("application_status_changed", { status });
      toast.success(`Moved to ${STAGE_LABEL[status]}`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });

  const allTags = useMemo(() => [...new Set(applications.flatMap((app) => app.tags || []))].sort(), [applications]);

  // Board and table hide archived rows unless asked; filters and sort run on the client.
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications
      .filter((app) => archived || !app.archived)
      .filter((app) => tags.every((tag) => (app.tags || []).includes(tag)))
      .filter(
        (app) =>
          !query ||
          (app.jobCompany || "").toLowerCase().includes(query) ||
          (app.jobTitle || "").toLowerCase().includes(query)
      )
      .sort(COMPARE[sort]);
  }, [applications, search, tags, sort, archived]);

  if (isLoading) return <Loader />;

  const archivedCount = applications.filter((app) => app.archived).length;
  const isEmpty = applications.length === 0;
  const selected = applications.find((app) => app._id === selectedId) ?? null;

  const changeView = (next) => {
    setView(next);
    router.replace(next === "board" ? "/dashboard/applications" : `/dashboard/applications?view=${next}`, {
      scroll: false,
    });
  };

  const startEdit = (application) => {
    setSelectedId(null);
    setEditing(application);
  };

  const clearFilters = () => {
    setSearch("");
    setTags([]);
    setArchived(false);
  };

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col gap-4 p-4 sm:h-[calc(100dvh-4rem)] sm:p-6">
      <div className="relative flex items-center gap-x-2.5 max-sm:flex-col max-sm:gap-y-3">
        <div className="flex flex-1 items-center justify-center gap-x-2.5 md:justify-start">
          <BriefcaseIcon weight="light" className="size-5" />
          <h1 className="text-xl font-medium tracking-tight">Applications</h1>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-x-2">
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard/tailor">
                <PenIcon />
                Tailor a CV
              </Link>
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <PlusIcon />
              Add application
            </Button>
          </div>
        )}
      </div>

      <Separator className="bg-[var(--landing-line)]" />

      {isEmpty ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : (
        <>
          {/* One row: search grows, filters stay fixed, icon-only view switcher on the right. */}
          <div className="flex items-center gap-2">
            <div className="relative max-w-72 min-w-24 flex-1">
              <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                aria-label="Search applications"
                placeholder="Search applications…"
                onChange={(event) => setSearch(event.target.value)}
                className="h-8 pl-8"
              />
            </div>

            {allTags.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="w-40 shrink justify-start font-normal max-sm:hidden">
                    <TagIcon />
                    <span className="truncate">
                      {tags.length ? `${tags.length} ${tags.length === 1 ? "tag" : "tags"}` : "Filter by tags"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-2">
                  <TagChecklist allTags={allTags} tags={tags} onChange={setTags} />
                  {tags.length > 0 && (
                    <Button size="sm" variant="ghost" className="mt-1 w-full" onClick={() => setTags([])}>
                      Clear tags
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            )}

            {view !== "insights" && <SortSelect sort={sort} onChange={setSort} className="w-40 max-sm:hidden" />}

            {archivedCount > 0 && view !== "insights" && (
              <Button
                size="sm"
                variant={archived ? "secondary" : "outline"}
                className="shrink-0 max-sm:hidden"
                onClick={() => setArchived((value) => !value)}
              >
                <ArchiveIcon />
                Archived ({archivedCount})
              </Button>
            )}

            {/* Mobile: one button holds every filter so the row never overflows on a phone. */}
            {view !== "insights" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon-sm" variant="outline" aria-label="Filters" className="relative shrink-0 sm:hidden">
                    <FunnelIcon />
                    {(tags.length > 0 || archived) && (
                      <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[var(--landing-accent)]" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="flex w-64 flex-col gap-3 p-3">
                  {allTags.length > 0 && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Filter by tags</Label>
                      <TagChecklist allTags={allTags} tags={tags} onChange={setTags} />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Sort by</Label>
                    <SortSelect sort={sort} onChange={setSort} className="w-full" />
                  </div>
                  {archivedCount > 0 && (
                    <Button
                      size="sm"
                      variant={archived ? "secondary" : "outline"}
                      className="w-full"
                      onClick={() => setArchived((value) => !value)}
                    >
                      <ArchiveIcon />
                      Archived ({archivedCount})
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            )}

            <Tabs className="ml-auto shrink-0" value={view} onValueChange={changeView}>
              <TabsList>
                {VIEWS.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger key={value} value={value} title={label} aria-label={label}>
                    <Icon />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {view !== "insights" && filtered.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <p className="text-sm font-medium">No applications match your filters.</p>
                <Button size="sm" variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : view === "board" ? (
              <ApplicationBoard
                applications={filtered}
                onOpen={(app) => setSelectedId(app._id)}
                onEdit={setEditing}
                onMove={(id, status) => move.mutate({ id, status })}
              />
            ) : view === "table" ? (
              <ApplicationTable applications={filtered} onOpen={(app) => setSelectedId(app._id)} onEdit={setEditing} />
            ) : (
              <ApplicationInsights applications={applications.filter((app) => !app.archived)} />
            )}
          </div>
        </>
      )}

      <ApplicationFormSheet open={addOpen} onOpenChange={setAddOpen} allTags={allTags} />
      <ApplicationFormSheet
        open={Boolean(editing)}
        application={editing}
        allTags={allTags}
        onOpenChange={(open) => !open && setEditing(null)}
      />
      <ApplicationDetailSheet
        application={selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onEdit={startEdit}
      />
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ApplicationsTracker />
    </Suspense>
  );
}
