"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRightIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DashboardPageHeader,
  DashboardPageShell,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard";
import { ThreadList } from "@/components/agent/ThreadSidebar";
import { requestJson } from "@/lib/request-json";

export default function AgentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sourceId, setSourceId] = useState("reference");

  const { data: tailored = [], isLoading: isLoadingCvs } = useQuery({
    queryKey: ["tailored-cvs"],
    queryFn: () => requestJson("/api/tailored-cv"),
  });
  // Drafts are copies already; starting from one would stack copies.
  const sources = tailored.filter((cv) => !cv.jobTitle?.startsWith("Agent draft"));

  const start = useMutation({
    mutationFn: () => requestJson("/api/agent/threads", { method: "POST", body: { sourceId } }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agent-threads"] });
      queryClient.invalidateQueries({ queryKey: ["tailored-cvs"] });
      router.push(`/dashboard/agent/${data._id}`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="CV Agent"
        description="Ask for changes in plain words. The agent edits a copy of your CV, so the original stays as it is."
      />

      <DashboardPanel delay={0.05} aria-label="Start a thread">
        <DashboardPanelHeader title="Start a thread" description="Choose the CV to work on." />
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (!start.isPending) start.mutate();
          }}
        >
          <Select value={sourceId} onValueChange={setSourceId} disabled={isLoadingCvs}>
            <SelectTrigger
              aria-label="CV to work on"
              className="w-full min-w-0 bg-[var(--landing-surface)] shadow-none data-[size=default]:h-10 sm:flex-1"
            >
              <SelectValue placeholder="Choose a CV" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reference">Main CV</SelectItem>
              {sources.map((cv) => (
                <SelectItem key={cv._id} value={cv._id}>
                  {[cv.jobTitle || "Tailored CV", cv.jobCompany].filter(Boolean).join(" at ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="submit"
            disabled={start.isPending || isLoadingCvs}
            aria-busy={start.isPending}
            className="dashboard-primary-btn w-full sm:w-auto"
          >
            {start.isPending ? (
              <>
                <SpinnerGapIcon size={16} className="animate-spin" aria-hidden="true" />
                Starting…
              </>
            ) : (
              <>
                Start thread
                <ArrowRightIcon size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </DashboardPanel>

      <ThreadList title="Your threads" delay={0.1} />
    </DashboardPageShell>
  );
}
