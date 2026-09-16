"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookmarkSimpleIcon,
  BuildingsIcon,
  CrownIcon,
  MapPinIcon,
  MoneyIcon,
  TrashIcon,
  ArrowSquareOutIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DashboardPageShell,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
  DashboardEmptyState,
} from "@/components/dashboard";
import { cn } from "@/lib/utils";

const PAGE_TITLE = "Saved Jobs";
const PAGE_DESCRIPTION = "Roles you saved from your daily job-match emails.";

function locationLabel(job) {
  if (job.isRemote) return "Remote";
  const parts = [job.city, job.state].filter(Boolean);
  return parts.length ? parts.join(", ") : job.country ?? "";
}

function RowAction({ label, onClick, disabled, className, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={onClick}
          aria-label={label}
          className={cn(
            "shrink-0 rounded-md text-[var(--landing-ink-soft)] hover:bg-[var(--landing-primary-soft)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40",
            className
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SavedJobRow({ item, confirming, onRemove, removing }) {
  const job = item.job ?? {};
  const location = locationLabel(job);
  const title = job.title || "Untitled role";

  return (
    <li className="group flex flex-col gap-3 px-4 py-3 transition-colors hover:bg-[var(--landing-paper-soft)] sm:flex-row sm:items-center sm:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--landing-line)] bg-[var(--landing-surface)] font-outfit text-sm font-semibold text-foreground">
          {job.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={job.logo} alt="" className="h-full w-full object-contain" />
          ) : (
            (job.company?.[0] ?? title[0] ?? "?").toUpperCase()
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            {job.company && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <BuildingsIcon size={12} aria-hidden="true" />
                <span className="truncate">{job.company}</span>
              </span>
            )}
            {location && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPinIcon size={12} aria-hidden="true" />
                <span className="truncate">{location}</span>
              </span>
            )}
            {job.salary && (
              <span className="inline-flex min-w-0 items-center gap-1 tabular-nums">
                <MoneyIcon size={12} aria-hidden="true" />
                <span className="truncate">{job.salary}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-13 sm:pl-0">
        {job.applyLink && (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noreferrer"
            className="dashboard-secondary-btn dashboard-secondary-btn-sm flex-1 sm:flex-none"
          >
            Apply
            <ArrowSquareOutIcon size={14} aria-hidden="true" />
          </a>
        )}
        <RowAction
          label={confirming ? "Click again to remove" : `Remove ${title}`}
          disabled={removing}
          onClick={() => onRemove(item._id)}
          className={cn(
            "h-9 w-9 hover:bg-destructive/10 hover:text-destructive",
            confirming && "bg-destructive/10 text-destructive"
          )}
        >
          {confirming ? (
            <CheckIcon size={16} weight="bold" aria-hidden="true" />
          ) : (
            <TrashIcon size={16} aria-hidden="true" />
          )}
        </RowAction>
      </div>
    </li>
  );
}

function ListSkeleton() {
  return (
    <div className="dashboard-card overflow-hidden rounded-lg">
      <div className="flex flex-col gap-1.5 border-b border-[var(--landing-line)] px-4 py-4 sm:px-5">
        <div className="tool-skeleton h-3.5 w-28 rounded-sm" />
        <div className="tool-skeleton h-3 w-16 rounded-sm" />
      </div>
      <ul className="divide-y divide-[var(--landing-line)]">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <div className="tool-skeleton h-10 w-10 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="tool-skeleton h-3.5 w-1/2 rounded-sm" />
              <div className="tool-skeleton h-3 w-1/3 rounded-sm" />
            </div>
            <div className="tool-skeleton h-9 w-20 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SavedJobs() {
  const { data: session, status } = useSession();
  const isPremium = !!session?.user?.isPremium;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  useEffect(() => {
    const saved = searchParams.get("saved");
    if (saved === "1") toast.success("Job saved");
    else if (saved === "0") toast.error("Couldn't save that job. The link may have expired.");
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
      toast.success("Job removed");
      setConfirmRemoveId(null);
    },
    onError: () => {
      toast.error("Couldn't remove the job. Try again.");
      setConfirmRemoveId(null);
    },
  });

  // First click asks, second click removes, the same as the tailored CV list.
  const handleRemove = (id) => {
    if (confirmRemoveId === id) remove.mutate(id);
    else setConfirmRemoveId(id);
  };

  if (status === "loading" || (isPremium && isLoading)) {
    return (
      <DashboardPageShell>
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <ListSkeleton />
      </DashboardPageShell>
    );
  }

  if (!isPremium) {
    return (
      <DashboardPageShell>
        <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <DashboardEmptyState
          icon={CrownIcon}
          title="Saved jobs are on Pro"
          description="Upgrade to get daily job matches by email and save the ones you like."
          actionLabel="See Pro plans"
          actionHref="/dashboard/upgrade"
        />
      </DashboardPageShell>
    );
  }

  const count = items?.length ?? 0;

  return (
    <DashboardPageShell>
      <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      {count === 0 ? (
        <DashboardEmptyState
          icon={BookmarkSimpleIcon}
          title="Your saved jobs will appear here"
          description="Press Save on a role in your daily job-match email and it shows up on this page."
        />
      ) : (
        <DashboardPanel pad={false} as="section">
          <div className="border-b border-[var(--landing-line)] px-4 py-4 sm:px-5">
            <DashboardPanelHeader
              title="All saved jobs"
              description={`${count} ${count === 1 ? "job" : "jobs"}`}
            />
          </div>
          <ul className="divide-y divide-[var(--landing-line)]">
            {items.map((item) => (
              <SavedJobRow
                key={item._id}
                item={item}
                confirming={confirmRemoveId === item._id}
                onRemove={handleRemove}
                removing={remove.isPending}
              />
            ))}
          </ul>
        </DashboardPanel>
      )}
    </DashboardPageShell>
  );
}

export default function SavedJobsPage() {
  return (
    <Suspense
      fallback={
        <DashboardPageShell>
          <DashboardPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
          <ListSkeleton />
        </DashboardPageShell>
      }
    >
      <SavedJobs />
    </Suspense>
  );
}
