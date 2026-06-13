"use client";

import { useState } from "react";
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

const STATUS_CONFIG = {
  evaluated: { label: "Evaluated", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  applied: { label: "Applied", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  interviewing: { label: "Interviewing", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  offer: { label: "Offer", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  withdrawn: { label: "Withdrawn", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
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
      <div className="mx-auto max-w-3xl p-4 sm:p-6 text-center text-muted-foreground">
        Application not found.
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.evaluated;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => router.push("/dashboard/applications")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeftIcon size={14} />
          Back to Applications
        </button>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold font-outfit">{app.jobTitle}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <BuildingsIcon size={14} />
                {app.jobCompany}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarIcon size={14} />
                <FormattedDate date={app.createdAt} />
              </span>
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  View listing <ArrowSquareOutIcon size={12} />
                </a>
              )}
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </motion.div>

      {/* Status Update */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
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
          <Card className="rounded-2xl border shadow-lg">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClockIcon size={16} />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
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
        <Card className="rounded-2xl border shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <NotepadIcon size={16} />
              Notes & Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

      {/* Match Score */}
      {app.matchScore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="rounded-2xl border shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Match Score</span>
                <span className="text-lg font-bold tabular-nums">{app.matchScore.toFixed(1)}/5</span>
                {app.matchGrade && (
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300">
                    {app.matchGrade}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
