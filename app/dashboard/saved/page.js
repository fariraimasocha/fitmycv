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

function locationLabel(job) {
  if (job.isRemote) return "Remote";
  const parts = [job.city, job.state].filter(Boolean);
  return parts.length ? parts.join(", ") : job.country ?? "";
}

function SavedJobCard({ item, onRemove, removing }) {
  const job = item.job ?? {};
  return (
    <Card className="rounded-xl border shadow-sm">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-sm font-bold">
          {job.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={job.logo} alt={job.company ?? ""} className="h-full w-full object-contain" />
          ) : (
            (job.company?.[0] ?? "?").toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold line-clamp-1">{job.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {[job.company, locationLabel(job)].filter(Boolean).join(" · ")}
          </p>
          {job.salary && <p className="text-xs text-muted-foreground mt-0.5">{job.salary}</p>}
          <div className="flex items-center gap-2 mt-2">
            {job.applyLink && (
              <Button asChild size="sm" variant="outline">
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
        </div>
      </CardContent>
    </Card>
  );
}

function UpgradeGate() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <Card className="rounded-xl border-border text-center">
        <CardContent className="py-12 space-y-4">
          <CrownIcon className="size-8 text-amber-500 mx-auto" />
          <div className="space-y-1">
            <p className="text-lg font-semibold">Saved jobs are a Pro feature</p>
            <p className="text-sm text-muted-foreground">
              Upgrade to receive daily job matches and save the ones you like.
            </p>
          </div>
          <Button asChild>
            <Link href="/api/polar/checkout">
              Upgrade to Pro
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
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
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Saved Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Jobs you saved from your daily match emails.
        </p>
      </div>

      {!items || items.length === 0 ? (
        <Card className="rounded-xl border-dashed">
          <CardContent className="py-12 text-center space-y-2">
            <BookmarkSimpleIcon className="size-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium">No saved jobs yet</p>
            <p className="text-sm text-muted-foreground">
              Hit “☆ Save” on any role in your daily job-match email and it&apos;ll show up here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-3"
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
    </div>
  );
}

export default function SavedJobsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SavedJobs />
    </Suspense>
  );
}
