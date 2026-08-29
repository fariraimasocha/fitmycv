"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  KanbanIcon,
  BuildingsIcon,
  CalendarIcon,
  ArrowSquareOutIcon,
  TrashIcon,
  BriefcaseIcon,
  ChatCircleIcon,
  TrophyIcon,
  PlusIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardStatCard,
  DashboardStatGrid,
  DashboardEmptyState,
  DashboardFilterPills,
} from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  evaluated: {
    label: "Evaluated",
    color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]",
  },
  applied: {
    label: "Applied",
    color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink)]",
  },
  interviewing: {
    label: "Interviewing",
    color: "border border-[var(--landing-line)] bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]",
  },
  offer: {
    label: "Offer",
    color: "border border-[var(--landing-line)] bg-[#eef8f1] text-[var(--landing-success)]",
  },
  rejected: {
    label: "Rejected",
    color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-accent)]",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]",
  },
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "interviewing", label: "Interviewing" },
  { key: "closed", label: "Closed" },
];

function gradeColor(grade) {
  if (!grade || grade === "N/A") {
    return "bg-muted text-muted-foreground";
  }
  const letter = grade.charAt(0);
  if (letter === "A") return "bg-emerald-50 text-emerald-800";
  if (letter === "B") return "bg-blue-50 text-blue-800";
  if (letter === "C") return "bg-amber-50 text-amber-800";
  return "bg-red-50 text-red-700";
}

function filterApplications(applications, filter) {
  if (filter === "all") return applications;
  if (filter === "active") {
    return applications.filter((a) =>
      ["evaluated", "applied", "interviewing"].includes(a.status)
    );
  }
  if (filter === "interviewing") {
    return applications.filter((a) => a.status === "interviewing");
  }
  if (filter === "closed") {
    return applications.filter((a) =>
      ["offer", "rejected", "withdrawn"].includes(a.status)
    );
  }
  return applications;
}

function countForFilter(applications, filter) {
  return filterApplications(applications, filter).length;
}

function StatusSelect({ currentStatus, onStatusChange, disabled }) {
  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.evaluated;

  return (
    <Select
      value={currentStatus}
      onValueChange={onStatusChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "h-8 w-full min-w-0 rounded-full border-0 px-2.5 text-xs font-semibold shadow-none focus:ring-2 focus:ring-ring/40 sm:h-7 sm:w-auto sm:min-w-[108px]",
          config.color
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
          <SelectItem key={key} value={key} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ApplicationRow({ app, index, onStatusChange, onDelete, statusPending }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
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
        className="group cursor-pointer rounded-2xl border-border py-0 gap-0 transition-all hover:border-[var(--landing-line)] hover:shadow-[var(--landing-shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <CardContent className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-sm font-bold text-[var(--landing-primary-dark)]">
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
                      "hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-flex",
                      gradeColor(app.matchGrade)
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
                  <FormattedDate
                    date={app.createdAt}
                    options={{ month: "short", day: "numeric" }}
                  />
                </span>
                {app.matchGrade && (
                  <span
                    className={cn(
                      "inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:hidden",
                      gradeColor(app.matchGrade)
                    )}
                  >
                    {app.matchGrade}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex w-full items-center gap-1.5 border-t border-border/60 pt-3 sm:w-auto sm:shrink-0 sm:border-0 sm:pt-0"
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
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open job listing"
                  aria-label="Open job listing"
                >
                  <ArrowSquareOutIcon size={16} />
                </a>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:bg-red-50 hover:text-red-600"
              title="Delete application"
              aria-label="Delete application"
              onClick={() => onDelete(app._id)}
            >
              <TrashIcon size={16} />
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

export default function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application removed");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const applications = data || [];

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter((a) =>
      ["evaluated", "applied", "interviewing"].includes(a.status)
    ).length;
    const interviews = applications.filter((a) => a.status === "interviewing").length;
    const offers = applications.filter((a) => a.status === "offer").length;
    return { total, active, interviews, offers };
  }, [applications]);

  const filtered = useMemo(
    () => filterApplications(applications, activeFilter),
    [applications, activeFilter]
  );

  const filterCounts = useMemo(
    () =>
      FILTER_TABS.reduce((acc, tab) => {
        acc[tab.key] = countForFilter(applications, tab.key);
        return acc;
      }, {}),
    [applications]
  );

  const handleDelete = (id) => {
    if (confirm("Remove this application?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Loader />;

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: KanbanIcon,
      delay: 0,
    },
    {
      label: "Active",
      value: stats.active,
      icon: BriefcaseIcon,
      delay: 0.05,
    },
    {
      label: "Interviewing",
      value: stats.interviews,
      icon: ChatCircleIcon,
      delay: 0.1,
    },
    {
      label: "Offers",
      value: stats.offers,
      icon: TrophyIcon,
      delay: 0.15,
    },
  ];

  return (
    <DashboardPageShell width="wide">
      <DashboardPageHeader
        title="Applications"
        description="Track every tailored CV from evaluation through to offer."
        action={
          applications.length > 0 ? (
            <Button
              asChild
              className="rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90"
            >
              <Link href="/dashboard/tailor">
                <PlusIcon size={16} />
                Tailor new CV
              </Link>
            </Button>
          ) : null
        }
      />

      <DashboardStatGrid>
        {statCards.map((card) => (
          <DashboardStatCard key={card.label} {...card} />
        ))}
      </DashboardStatGrid>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <DashboardFilterPills
          tabs={FILTER_TABS.map((tab) => ({
            ...tab,
            count: filterCounts[tab.key],
          }))}
          activeKey={activeFilter}
          onChange={setActiveFilter}
        />
        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "application" : "applications"}
        </p>
      </div>

      {filtered.length === 0 ? (
        applications.length === 0 ? (
          <DashboardEmptyState
            icon={KanbanIcon}
            title="No applications yet"
            description="Every CV you tailor is tracked here automatically. Tailor your first resume to start your pipeline."
            actionLabel="Tailor your first resume"
            actionHref="/dashboard/tailor"
          />
        ) : (
          <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
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
        )
      ) : (
        <div className="space-y-2">
          {filtered.map((app, i) => (
            <ApplicationRow
              key={app._id}
              app={app}
              index={i}
              statusPending={updateMutation.isPending}
              onStatusChange={(id, status) => updateMutation.mutate({ id, status })}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </DashboardPageShell>
  );
}
