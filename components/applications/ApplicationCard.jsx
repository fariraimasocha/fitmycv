"use client";

import { FileTextIcon, MapPinIcon } from "@phosphor-icons/react";
import { ApplicationActionsMenu } from "@/components/applications/ApplicationActionsMenu";
import { initials } from "@/lib/applications";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's application-card.tsx.
export function ApplicationCard({ application, onClick, onEdit, dragging }) {
  const followUp = application.followUpDate && !application.archived;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "group relative w-full cursor-pointer rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-3 text-left shadow-sm outline-none transition-colors hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring/40",
        dragging && "opacity-60"
      )}
    >
      {onEdit && (
        <ApplicationActionsMenu
          application={application}
          onEdit={onEdit}
          showOnHover
          className="absolute top-1.5 right-1.5"
        />
      )}
      <div className="flex items-start gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--landing-line)] text-xs font-semibold text-foreground">
          {initials(application.jobCompany)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold tracking-tight">{application.jobTitle}</div>
          <div className="truncate text-xs text-muted-foreground">{application.jobCompany}</div>
        </div>
        {followUp && (
          <span
            title="Needs follow-up"
            className={cn("mt-1 size-2 shrink-0 rounded-full bg-amber-500 ring-2 ring-amber-500/25", onEdit && "mr-6")}
          />
        )}
      </div>
      {(application.location || application.salary) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
          {application.location && (
            <span className="flex min-w-0 items-center gap-1">
              <MapPinIcon className="size-3 shrink-0" />
              <span className="truncate">{application.location}</span>
            </span>
          )}
          {application.location && application.salary && <span className="opacity-40">·</span>}
          {application.salary && <span className="font-medium text-foreground">{application.salary}</span>}
        </div>
      )}
      {(application.tailoredCVId || application.source) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {application.tailoredCVId && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <FileTextIcon className="size-3" />
              CV linked
            </span>
          )}
          {application.source && (
            <span className="inline-flex items-center rounded-md border border-[var(--landing-line)] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {application.source}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
