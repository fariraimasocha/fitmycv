"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRightIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageHeader, DashboardPageShell } from "@/components/dashboard";
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
        eyebrow="CV Toolkit"
        title="CV Agent"
        description="Ask for changes in plain words. The agent edits a copy of your CV, so the original stays as it is."
      />

      <Card className="dashboard-card gap-0 rounded-lg border-[var(--landing-line)] py-0">
        <CardContent className="dashboard-card-pad">
          <h2 className="text-base font-semibold text-foreground">Start a thread</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Choose the CV you want to work on.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Select value={sourceId} onValueChange={setSourceId} disabled={isLoadingCvs}>
              <SelectTrigger aria-label="CV to work on" className="w-full min-w-0 bg-[var(--landing-surface)] sm:flex-1">
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
            <Button
              disabled={start.isPending}
              aria-busy={start.isPending}
              onClick={() => start.mutate()}
              className="w-full rounded-md bg-foreground font-medium text-background hover:bg-black sm:w-auto"
            >
              {start.isPending ? (
                <>
                  <SpinnerGapIcon className="animate-spin" aria-hidden="true" />
                  Starting…
                </>
              ) : (
                <>
                  Start thread
                  <ArrowRightIcon aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Your threads</h2>
        <ThreadList />
      </section>
    </DashboardPageShell>
  );
}
