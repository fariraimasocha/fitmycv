"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import {
  ArchiveIcon,
  ChartBarIcon,
  ChartLineUpIcon,
  ChatsCircleIcon,
  FunnelIcon,
  HandshakeIcon,
  KanbanIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
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
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPageShell,
  DashboardStatStrip,
  DashboardTabBar,
} from "@/components/dashboard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STAGE_LABEL, computeInsights } from "@/lib/applications";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's /dashboard/applications route.

const PAGE_TITLE = "Applications";
const PAGE_DESCRIPTION = "Track every role from saved to offer. Move cards as you hear back.";

const SORT_OPTIONS = [
  { value: "updated", label: "Last updated" },
  { value: "applied", label: "Date applied" },
  { value: "company", label: "Company A to Z" },
  { value: "role", label: "Role A to Z" },
];

const VIEWS = [
  { id: "board", label: "Board", icon: <KanbanIcon size={14} aria-hidden="true" /> },
  { id: "table", label: "Table", icon: <RowsIcon size={14} aria-hidden="true" /> },
  { id: "insights", label: "Insights", icon: <ChartBarIcon size={14} aria-hidden="true" /> },
];

const LIST_KEY = ["applications", "list"];

const time = (value) => (value ? new Date(value).getTime() : 0);
const COMPARE = {
  updated: (a, b) => time(b.updatedAt) - time(a.updatedAt),
  applied: (a, b) => time(b.appliedAt) - time(a.appliedAt),
  company: (a, b) => (a.jobCompany || "").localeCompare(b.jobCompany || ""),
  role: (a, b) => (a.jobTitle || "").localeCompare(b.jobTitle || ""),
};

// Toolbar controls share one height with the view tabs and the -sm buttons.
const CONTROL = "h-9";
const SECONDARY_SM = "dashboard-secondary-btn dashboard-secondary-btn-sm";

function Rise({ children, delay = 0, className }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TagChecklist({ allTags, tags, onChange }) {
  return (
    <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
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
      <SelectTrigger
        aria-label="Sort by"
        className={cn(
          CONTROL,
          "rounded-md border-[var(--landing-line)] bg-[var(--landing-surface)] shadow-none data-[size=default]:h-9",
          className
        )}
      >
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

function ArchivedToggle({ archived, count, onToggle, className }) {
  return (
    <button
      type="button"
      aria-pressed={archived}
      onClick={onToggle}
      className={cn(
        SECONDARY_SM,
        archived && "border-foreground bg-[var(--landing-primary-soft)]",
        className
      )}
    >
      <ArchiveIcon size={16} aria-hidden="true" />
      Archived
      <span className="tabular-nums text-muted-foreground">{count}</span>
    </button>
  );
}

function PageSkeleton() {
  return (
    <DashboardPageShell width="full">
      <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <div className="dashboard-card grid grid-cols-2 divide-y divide-[var(--landing-line)] rounded-lg sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <div className="tool-skeleton h-8 w-8 rounded-md" />
            <div className="flex flex-col gap-1.5">
              <div className="tool-skeleton h-3 w-16 rounded-sm" />
              <div className="tool-skeleton h-3.5 w-8 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
      <div className="tool-skeleton h-9 w-56 rounded-md" />
      <div className="flex gap-3 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex w-72 shrink-0 flex-col gap-2">
            <div className="tool-skeleton h-8 rounded-md" />
            <div className="tool-skeleton h-48 rounded-lg" />
          </div>
        ))}
      </div>
    </DashboardPageShell>
  );
}

function ApplicationsTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [view, setView] = useState(() => {
    const requested = searchParams.get("view");
    return VIEWS.some((v) => v.id === requested) ? requested : "board";
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

  const active = useMemo(() => applications.filter((app) => !app.archived), [applications]);
  const insights = useMemo(() => computeInsights(active), [active]);

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

  if (isLoading) return <PageSkeleton />;

  const archivedCount = applications.length - active.length;
  const isEmpty = applications.length === 0;
  const selected = applications.find((app) => app._id === selectedId) ?? null;
  const filtersActive = tags.length > 0 || archived;

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

  const stats = [
    { icon: KanbanIcon, label: "In your pipeline", value: insights.total },
    { icon: PaperPlaneTiltIcon, label: "Applied", value: insights.applied },
    { icon: ChatsCircleIcon, label: "Interviews", value: insights.interviews },
    { icon: HandshakeIcon, label: "Offers", value: insights.offers, tone: "success" },
    {
      icon: ChartLineUpIcon,
      label: "Response rate",
      value: insights.applied > 0 ? `${insights.responseRate}%` : "n/a",
      tone: "accent",
    },
  ];

  return (
    <DashboardPageShell width="full">
      <DashboardPageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          isEmpty ? null : (
            <>
              <Link href="/dashboard/tailor" className="dashboard-secondary-btn">
                <PenIcon size={16} aria-hidden="true" />
                Tailor a CV
              </Link>
              <button type="button" onClick={() => setAddOpen(true)} className="dashboard-primary-btn">
                <PlusIcon size={16} weight="bold" aria-hidden="true" />
                Add application
              </button>
            </>
          )
        }
      />

      {isEmpty ? (
        <DashboardEmptyState
          icon={KanbanIcon}
          title="Track your first application"
          description="Add a job you are applying to and link the CV you sent. Every CV you tailor is added here as Saved."
          actionLabel="Add application"
          onAction={() => setAddOpen(true)}
          secondaryLabel="Tailor a CV"
          secondaryHref="/dashboard/tailor"
        />
      ) : (
        <>
          <DashboardStatStrip items={stats} columns={5} />

          <Rise delay={0.1} className="flex flex-col gap-3">
            {/* View tabs left, filters right. Search grows, everything else keeps its width. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <DashboardTabBar
                ariaLabel="Applications view"
                tabs={VIEWS}
                activeTab={view}
                onTabChange={changeView}
              />

              {view !== "insights" && (
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
                    <MagnifyingGlassIcon
                      size={16}
                      className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      value={search}
                      aria-label="Search applications"
                      placeholder="Search by company or role"
                      onChange={(event) => setSearch(event.target.value)}
                      className={cn(CONTROL, "pl-9")}
                    />
                  </div>

                  {allTags.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          aria-pressed={tags.length > 0}
                          className={cn(
                            SECONDARY_SM,
                            "max-sm:hidden",
                            tags.length > 0 && "border-foreground bg-[var(--landing-primary-soft)]"
                          )}
                        >
                          <TagIcon size={16} aria-hidden="true" />
                          {tags.length ? `${tags.length} ${tags.length === 1 ? "tag" : "tags"}` : "Tags"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-60 rounded-lg border-[var(--landing-line)] p-2 shadow-none">
                        <TagChecklist allTags={allTags} tags={tags} onChange={setTags} />
                        {tags.length > 0 && (
                          <button
                            type="button"
                            className="mt-1 h-8 w-full rounded-md text-xs font-medium text-muted-foreground transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-foreground"
                            onClick={() => setTags([])}
                          >
                            Clear tags
                          </button>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}

                  <SortSelect sort={sort} onChange={setSort} className="w-40 max-sm:hidden" />

                  {archivedCount > 0 && (
                    <ArchivedToggle
                      archived={archived}
                      count={archivedCount}
                      onToggle={() => setArchived((value) => !value)}
                      className="max-sm:hidden"
                    />
                  )}

                  {/* Mobile: one button holds every filter so the row never overflows on a phone. */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label="Filters"
                        aria-pressed={filtersActive}
                        className={cn(SECONDARY_SM, "relative w-9 shrink-0 px-0 sm:hidden")}
                      >
                        <FunnelIcon size={16} aria-hidden="true" />
                        {filtersActive && (
                          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--landing-accent)]" />
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="flex w-64 flex-col gap-3 rounded-lg border-[var(--landing-line)] p-3 shadow-none">
                      {allTags.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs text-muted-foreground">Tags</Label>
                          <TagChecklist allTags={allTags} tags={tags} onChange={setTags} />
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs text-muted-foreground">Sort by</Label>
                        <SortSelect sort={sort} onChange={setSort} className="w-full" />
                      </div>
                      {archivedCount > 0 && (
                        <ArchivedToggle
                          archived={archived}
                          count={archivedCount}
                          onToggle={() => setArchived((value) => !value)}
                          className="w-full"
                        />
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {view !== "insights" && filtered.length === 0 ? (
              <DashboardEmptyState
                compact
                icon={MagnifyingGlassIcon}
                title="No applications match"
                description="Change your search or filters to see applications here."
                actionLabel="Clear filters"
                onAction={clearFilters}
                delay={0}
              />
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
              <ApplicationInsights applications={active} />
            )}
          </Rise>
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
    </DashboardPageShell>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ApplicationsTracker />
    </Suspense>
  );
}
