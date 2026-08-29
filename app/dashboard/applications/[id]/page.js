"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  BuildingsIcon,
  CalendarIcon,
  ArrowSquareOutIcon,
  NotepadIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import FormattedDate from "@/components/FormattedDate";
import {
  DashboardPageShell,
  DashboardPageHeader,
} from "@/components/dashboard";
import { GradeBadge } from "@/components/GradeBadge";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

const STATUS_CONFIG = {
  evaluated: { label: "Evaluated", color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]" },
  applied: { label: "Applied", color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink)]" },
  interviewing: { label: "Interviewing", color: "border border-[var(--landing-line)] bg-[var(--landing-primary-soft)] text-[var(--landing-ink)]" },
  offer: { label: "Offer", color: "border border-[var(--landing-line)] bg-[#eef8f1] text-[var(--landing-success)]" },
  rejected: { label: "Rejected", color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-accent)]" },
  withdrawn: { label: "Withdrawn", color: "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-soft)]" },
};

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notesLoaded, setNotesLoaded] = useState(false);

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

  // Initialize notes from fetched data
  if (app && !notesLoaded) {
    setNotes(app.notes || "");
    setFollowUpDate(app.followUpDate ? new Date(app.followUpDate).toISOString().split("T")[0] : "");
    setNotesLoaded(true);
  }

  const updateMutation = useMutation({
    mutationFn: async (body) => {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Updated");
    },
    onError: () => toast.error("Failed to update"),
  });

  if (isLoading) return <Loader />;
  if (!app) {
    return (
      <DashboardPageShell width="narrow">
        <p className="text-center text-sm text-muted-foreground">Application not found.</p>
      </DashboardPageShell>
    );
  }

  const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.evaluated;

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
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        }
      />

      {/* Status Update */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
          <CardHeader className="px-4 py-4 sm:px-6">
            <CardTitle className="text-base">Update Status</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => (
                <Button
                  key={key}
                  variant={app.status === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateMutation.mutate({ status: key })}
                  disabled={updateMutation.isPending || app.status === key}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      {app.statusHistory?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
            <CardHeader className="px-4 py-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClockIcon size={16} />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="space-y-3">
                {[...app.statusHistory].reverse().map((entry, i) => {
                  const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.evaluated;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
                            {config.label}
                          </span>
                          <FormattedDate
                            date={entry.date}
                            className="text-xs text-muted-foreground"
                            options={{
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }}
                          />
                        </div>
                        {entry.note && (
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Notes & Follow-up */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
          <CardHeader className="px-4 py-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <NotepadIcon size={16} />
              Notes & Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Follow-up Date
              </label>
              <Input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-48"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Add notes about this application..."
              />
            </div>
            <Button
              size="sm"
              onClick={() =>
                updateMutation.mutate({
                  notes,
                  followUpDate: followUpDate || null,
                })
              }
              disabled={updateMutation.isPending}
            >
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {app.matchScore != null && (
        <p className="text-sm leading-7 text-[var(--landing-ink-soft)]">
          Match {app.matchScore.toFixed(1)}/5
        </p>
      )}
    </DashboardPageShell>
  );
}
