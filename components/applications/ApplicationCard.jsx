"use client";

import { FileTextIcon, MapPinIcon } from "@phosphor-icons/react";
import { ApplicationActionsMenu } from "@/components/applications/ApplicationActionsMenu";
import { initials } from "@/lib/applications";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's application-card.tsx. Styled as a flat
// hairline card so it matches the rest of the dashboard.
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
        "dashboard-card group relative w-full cursor-pointer rounded-lg p-3 text-left outline-none transition-colors hover:border-[#ccc5bb] hover:bg-[#fdfcf9] focus-visible:ring-2 focus-visible:ring-ring/40",
        dragging && "opacity-60"
      )}
    >
      {onEdit && (
        <ApplicationActionsMenu
          application={application}
          onEdit={onEdit}
          showOnHover
          className="absolute top-2 right-2"
        />
      )}
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] font-outfit text-xs font-semibold text-foreground">
          {initials(application.jobCompany)}
        </span>
        <div className={cn("min-w-0 flex-1", onEdit && "pr-6")}>
          <p className="truncate text-sm font-semibold text-foreground">{application.jobTitle}</p>
          <p className="truncate text-xs text-muted-foreground">{application.jobCompany}</p>
        </div>
        {followUp && (
          <span
            title="Needs follow-up"
            aria-label="Needs follow-up"
            className={cn(
              "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--landing-accent)] ring-2 ring-[var(--landing-accent-soft)]",
              onEdit && "mr-6"
            )}
          />
        )}
      </div>
      {(application.location || application.salary) && (
        <div className="mt-2.5 flex items-center gap-x-2 text-xs text-muted-foreground">
          {application.location && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPinIcon size={12} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{application.location}</span>
            </span>
          )}
          {application.salary && (
            <span className="ml-auto shrink-0 font-medium tabular-nums text-foreground">
              {application.salary}
            </span>
          )}
        </div>
      )}
      {(application.tailoredCVId || application.source) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {application.tailoredCVId && (
            <span className="inline-flex h-6 items-center gap-1 rounded-md bg-[var(--landing-paper-soft)] px-2 text-[11px] font-medium text-muted-foreground">
              <FileTextIcon size={12} aria-hidden="true" />
              CV linked
            </span>
          )}
          {application.source && (
            <span className="inline-flex h-6 items-center rounded-md border border-[var(--landing-line)] px-2 text-[11px] font-medium text-muted-foreground">
              {application.source}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
