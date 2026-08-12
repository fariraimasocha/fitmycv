"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  BookmarkSimpleIcon,
  TrashIcon,
  ArrowSquareOutIcon,
  CrownIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardEmptyState,
} from "@/components/dashboard";

function locationLabel(job) {
  if (job.isRemote) return "Remote";
  const parts = [job.city, job.state].filter(Boolean);
  return parts.length ? parts.join(", ") : job.country ?? "";
}

function SavedJobCard({ item, onRemove, removing }) {
  const job = item.job ?? {};
  return (
    <Card className="dashboard-card rounded-2xl border-border py-0 gap-0">
      <CardContent className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--landing-primary-soft)] text-sm font-bold text-[var(--landing-primary-dark)] sm:h-11 sm:w-11">
            {job.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.logo} alt={job.company ?? ""} className="h-full w-full object-contain" />
            ) : (
              (job.company?.[0] ?? "?").toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold leading-snug sm:line-clamp-1">{job.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:line-clamp-1">
              {[job.company, locationLabel(job)].filter(Boolean).join(" · ")}
            </p>
            {job.salary && <p className="mt-0.5 text-xs text-muted-foreground">{job.salary}</p>}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            {job.applyLink && (
              <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                <a href={job.applyLink} target="_blank" rel="noreferrer">
                  Apply
                  <ArrowSquareOutIcon className="ml-1.5 size-3.5" />
                </a>
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(item._id)}
              disabled={removing}
              className="text-muted-foreground"
              aria-label="Remove saved job"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
      </CardContent>
    </Card>
  );
}

function UpgradeGate() {
  return (
    <DashboardPageShell width="narrow">
      <Card className="dashboard-card rounded-2xl border-border text-center py-0 gap-0">
        <CardContent className="space-y-4 py-12">
          <CrownIcon className="mx-auto size-8 text-[var(--landing-accent)]" />
          <div className="space-y-1">
            <p className="font-outfit text-lg font-semibold">Saved jobs are a Pro feature</p>
            <p className="text-sm text-muted-foreground">
              Upgrade to receive daily job matches and save the ones you like.
            </p>
          </div>
          <Button
            asChild
            className="rounded-[10px] bg-foreground font-outfit font-semibold text-background hover:opacity-90"
          >
            <Link href="/api/polar/checkout?plan=lifetime">
              Upgrade to Pro
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}

function SavedJobs() {
  const { data: session, status } = useSession();
  const isPremium = !!session?.user?.isPremium;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const saved = searchParams.get("saved");
    if (saved === "1") toast.success("Job saved");
    else if (saved === "0") toast.error("Couldn't save that job — the link may have expired");
  }, [searchParams]);

  const { data: items, isLoading } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/saved-jobs");
      if (!res.ok) throw new Error("Failed to fetch");
      return (await res.json()).data;
    },
    enabled: isPremium,
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/saved-jobs?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      toast.success("Removed");
    },
    onError: () => toast.error("Could not remove"),
  });

  if (status === "loading") return <Loader />;
  if (!isPremium) return <UpgradeGate />;
  if (isLoading) return <Loader />;

  return (
    <DashboardPageShell width="narrow">
      <DashboardPageHeader
        title="Saved Jobs"
        description="Jobs you saved from your daily match emails."
      />

      {!items || items.length === 0 ? (
        <DashboardEmptyState
          icon={BookmarkSimpleIcon}
          title="No saved jobs yet"
          description={'Hit "Save" on any role in your daily job-match email and it\'ll show up here.'}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-2"
        >
          {items.map((item) => (
            <SavedJobCard
              key={item._id}
              item={item}
              onRemove={remove.mutate}
              removing={remove.isPending}
            />
          ))}
        </motion.div>
      )}
    </DashboardPageShell>
  );
}

export default function SavedJobsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SavedJobs />
    </Suspense>
  );
}
