"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRightIcon, ChatCircleDotsIcon, FilePlusIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThreadSidebar } from "@/components/agent/ThreadSidebar";
import { requestJson } from "@/lib/request-json";

// Ported from Reactive Resume's /agent index and new-thread-setup.tsx.

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
    <div className="flex h-[calc(100dvh-3.5rem)] min-w-0 flex-col overflow-hidden bg-[var(--landing-bg)] sm:h-[calc(100dvh-4rem)] lg:flex-row">
      <div className="h-72 min-h-0 shrink-0 lg:h-auto lg:w-72">
        <ThreadSidebar className="border-r-0 border-b lg:border-r lg:border-b-0" />
      </div>
      <main className="grid min-h-0 min-w-0 flex-1 place-items-center overflow-auto p-4 sm:p-6">
        <div className="mx-auto grid w-full max-w-2xl gap-6">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] shadow-sm lg:size-14">
              <ChatCircleDotsIcon className="size-6 text-foreground" weight="fill" />
            </div>
            <div className="min-w-0">
              <h1 className="font-outfit text-3xl font-semibold tracking-tight lg:text-4xl">Start a thread</h1>
              <p className="mt-1 text-muted-foreground">
                Pick the CV the agent should work on. It edits a copy, so your original stays as it is.
              </p>
            </div>
          </div>

          <div className="rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4 shadow-sm lg:p-6">
            <div className="relative isolate min-h-32 overflow-hidden rounded-md p-1 lg:p-2">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-7 right-1 -z-10 text-8xl leading-none font-black text-foreground/5 select-none lg:-top-10 lg:right-3 lg:text-9xl"
              >
                1
              </span>
              <div className="space-y-3">
                <Label htmlFor="agent-source">Select a CV</Label>
                <Select value={sourceId} onValueChange={setSourceId} disabled={isLoadingCvs}>
                  <SelectTrigger id="agent-source" className="w-full">
                    <SelectValue placeholder={isLoadingCvs ? "Loading CVs…" : "Choose a CV"} />
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
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="h-7 gap-1.5 rounded-md px-2">
                    <FilePlusIcon />
                    Duplicate as AI draft
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-2 flex border-t border-[var(--landing-line)] pt-5 lg:justify-end">
              <Button
                size="lg"
                className="h-11 w-full gap-2 px-5 lg:w-auto"
                disabled={start.isPending}
                onClick={() => start.mutate()}
              >
                Start thread
                {start.isPending ? <SpinnerGapIcon className="animate-spin" /> : <ArrowRightIcon />}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
