"use client";

import { useState } from "react";
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
  FunnelIcon,
} from "@phosphor-icons/react";
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

const STATUS_CONFIG = {
  evaluated: { label: "Evaluated", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  applied: { label: "Applied", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  interviewing: { label: "Interviewing", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  offer: { label: "Offer", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  withdrawn: { label: "Withdrawn", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "interviewing", label: "Interviewing" },
  { key: "closed", label: "Closed" },
];

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.evaluated;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function StatusSelect({ currentStatus, onStatusChange, disabled }) {
  return (
    <Select value={currentStatus} onValueChange={onStatusChange} disabled={disabled}>
      <SelectTrigger className="h-7 w-full sm:w-[130px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
          <SelectItem key={key} value={key} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function filterApplications(applications, filter) {
  if (filter === "all") return applications;
  if (filter === "active") return applications.filter((a) => ["evaluated", "applied", "interviewing"].includes(a.status));
  if (filter === "interviewing") return applications.filter((a) => a.status === "interviewing");
  if (filter === "closed") return applications.filter((a) => ["offer", "rejected", "withdrawn"].includes(a.status));
  return applications;
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

  if (isLoading) return <Loader />;

  const applications = data || [];
  const filtered = filterApplications(applications, activeFilter);

  // Stats
  const total = applications.length;
  const active = applications.filter((a) => ["evaluated", "applied", "interviewing"].includes(a.status)).length;
  const interviews = applications.filter((a) => a.status === "interviewing").length;
  const offers = applications.filter((a) => a.status === "offer").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold font-outfit">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your job applications from evaluation to offer.
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Total", value: total },
          { label: "Active", value: active },
          { label: "Interviewing", value: interviews },
          { label: "Offers", value: offers },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-xl">
            <CardContent className="px-4 py-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <FunnelIcon size={14} className="text-muted-foreground" />
        {FILTER_TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeFilter === tab.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter(tab.key)}
            className="text-xs"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Application List */}
      {filtered.length === 0 ? (
        <Card className="rounded-2xl border shadow-lg">
          {applications.length === 0 ? (
            <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16 text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <KanbanIcon size={28} className="text-muted-foreground/60" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold font-outfit text-foreground">
                  No applications yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-[320px]">
                  Every CV you tailor is tracked here automatically. Tailor your first
                  resume to start your application pipeline.
                </p>
              </div>
              <Link
                href="/dashboard/tailor"
                className="inline-flex items-center gap-2 font-outfit font-semibold text-sm bg-foreground text-background rounded-[10px] px-5 py-2.5 transition-all duration-200 hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
              >
                Tailor your first resume
              </Link>
            </CardContent>
          ) : (
            <CardContent className="py-10 text-center text-muted-foreground text-sm">
              No applications match this filter.
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app, i) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Card className="rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/dashboard/applications/${app._id}`}
                        className="text-sm font-semibold hover:underline line-clamp-1"
                      >
                        {app.jobTitle || "Untitled"}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BuildingsIcon size={12} />
                          {app.jobCompany || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarIcon size={12} />
                          <FormattedDate
                            date={app.createdAt}
                            options={{ month: "short", day: "numeric" }}
                          />
                        </span>
                        {app.matchGrade && (
                          <span className="text-xs font-medium text-muted-foreground">
                            {app.matchGrade}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusSelect
                        currentStatus={app.status}
                        onStatusChange={(status) =>
                          updateMutation.mutate({ id: app._id, status })
                        }
                        disabled={updateMutation.isPending}
                      />
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Open job listing"
                        >
                          <ArrowSquareOutIcon size={16} />
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (confirm("Remove this application?")) {
                            deleteMutation.mutate(app._id);
                          }
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete application"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
