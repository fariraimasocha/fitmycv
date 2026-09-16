"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArchiveIcon, ArrowRightIcon, CaretLeftIcon, CaretRightIcon, TagIcon, TrashIcon } from "@phosphor-icons/react";
import { ApplicationActionsMenu } from "@/components/applications/ApplicationActionsMenu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useConfirm } from "@/hooks/use-confirm";
import { STAGES, STAGE_BY_KEY, initials } from "@/lib/applications";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's table-view.tsx.

const PAGE_SIZE = 25;

const appliedOn = (app) => {
  const date = app.appliedAt ?? app.createdAt;
  return date
    ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "Not set";
};

// Bulk bar buttons sit on a dark strip, so they use a light fill instead of
// the shell's outline recipe.
const BULK_BTN =
  "inline-flex h-8 items-center gap-1.5 rounded-md bg-background/15 px-2.5 text-xs font-medium text-background transition-colors hover:bg-background/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/40 disabled:opacity-50";

function AddTagPopover({ onAdd }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const submit = () => {
    const tag = value.trim();
    if (!tag) return;
    onAdd(tag);
    setValue("");
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={BULK_BTN}>
          <TagIcon size={14} aria-hidden="true" />
          Add tag
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2">
        <div className="flex gap-2">
          <Input
            autoFocus
            value={value}
            aria-label="New tag"
            placeholder="New tag"
            className="h-9"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
          />
          <button type="button" className="dashboard-primary-btn dashboard-primary-btn-sm" onClick={submit}>
            Add
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StageLabel({ status }) {
  const stage = STAGE_BY_KEY[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: stage?.color }} aria-hidden="true" />
      {stage?.label ?? status}
    </span>
  );
}

function TagList({ tags = [] }) {
  if (tags.length === 0) return <span className="text-muted-foreground">None</span>;
  return (
    <div className="flex max-w-40 flex-wrap items-center gap-1">
      {tags.slice(0, 2).map((tag) => (
        <span
          key={tag}
          className="inline-flex h-5 items-center rounded-sm bg-[var(--landing-paper-soft)] px-1.5 text-[11px] font-medium text-muted-foreground"
        >
          {tag}
        </span>
      ))}
      {tags.length > 2 && <span className="text-xs tabular-nums text-muted-foreground">+{tags.length - 2}</span>}
    </div>
  );
}

export function ApplicationTable({ applications, onOpen, onEdit }) {
  const queryClient = useQueryClient();
  const [confirm, confirmDialog] = useConfirm();
  const [selection, setSelection] = useState(() => new Set());
  const [page, setPage] = useState(0);

  // Only rows still in the filtered set count, so the bar never reports rows the user can't see.
  const visibleIds = new Set(applications.map((app) => app._id));
  const selected = new Set([...selection].filter((id) => visibleIds.has(id)));
  const ids = [...selected];

  const bulk = useMutation({
    mutationFn: (body) => requestJson("/api/applications/bulk", { method: "POST", body }),
    onSuccess: (data, body) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setSelection(new Set());
      if (body.delete) toast.success(`Deleted ${data.deleted} ${data.deleted === 1 ? "application" : "applications"}`);
    },
    onError: () => toast.error("Couldn't update those applications. Try again."),
  });

  const pageCount = Math.max(1, Math.ceil(applications.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = applications.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const pageIds = rows.map((row) => row._id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));

  const toggleAll = () =>
    setSelection((prev) => {
      const next = new Set(prev);
      for (const id of pageIds) {
        if (allChecked) next.delete(id);
        else next.add(id);
      }
      return next;
    });

  const toggleOne = (id) =>
    setSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const deleteSelected = async () => {
    const confirmed = await confirm(`Delete ${ids.length} ${ids.length === 1 ? "application" : "applications"}?`, {
      description: "Their full timelines will be deleted for good.",
    });
    if (confirmed) bulk.mutate({ ids, delete: true });
  };

  return (
    <div className="flex flex-col gap-3">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-foreground px-3 py-2 text-background">
          <span className="text-sm font-semibold tabular-nums">{selected.size} selected</span>
          <span className="mx-1 h-4 w-px bg-background/25" aria-hidden="true" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={BULK_BTN}>
                <ArrowRightIcon size={14} aria-hidden="true" />
                Move stage
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {STAGES.map((stage) => (
                <DropdownMenuItem key={stage.key} onClick={() => bulk.mutate({ ids, status: stage.key })}>
                  <span className="h-2 w-2 rounded-full" style={{ background: stage.color }} aria-hidden="true" />
                  {stage.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddTagPopover onAdd={(tag) => bulk.mutate({ ids, addTags: [tag] })} />
          <button type="button" className={BULK_BTN} onClick={() => bulk.mutate({ ids, archived: true })}>
            <ArchiveIcon size={14} aria-hidden="true" />
            Archive
          </button>
          <button
            type="button"
            className={cn(BULK_BTN, "hover:bg-destructive hover:text-white")}
            onClick={() => void deleteSelected()}
          >
            <TrashIcon size={14} aria-hidden="true" />
            Delete
          </button>
          <button
            type="button"
            className={cn(BULK_BTN, "ml-auto bg-transparent")}
            onClick={() => setSelection(new Set())}
          >
            Clear
          </button>
        </div>
      )}

      {/* Desktop: full table. Mobile: stacked rows instead of a wide horizontal scroll. */}
      <div className="dashboard-card overflow-auto rounded-lg max-sm:hidden">
        <table className="w-full min-w-225 border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--landing-paper-soft)]">
            <tr className="[&>th]:h-10 [&>th]:px-3 [&>th]:text-left [&>th]:text-xs [&>th]:font-medium [&>th]:tracking-wide [&>th]:whitespace-nowrap [&>th]:text-muted-foreground [&>th]:uppercase">
              <th className="w-10">
                <Checkbox
                  checked={allChecked ? true : someChecked ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th>Company and role</th>
              <th>Stage</th>
              <th>Location</th>
              <th className="text-right!">Salary</th>
              <th>Tags</th>
              <th>Source</th>
              <th className="text-right!">Applied</th>
              <th className="w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--landing-line)] border-t border-[var(--landing-line)]">
            {rows.map((app) => (
              <tr
                key={app._id}
                className={cn(
                  "transition-colors hover:bg-[var(--landing-paper-soft)]",
                  selected.has(app._id) && "bg-[var(--landing-primary-soft)]"
                )}
              >
                <td className="px-3 py-2.5">
                  <Checkbox
                    checked={selected.has(app._id)}
                    onCheckedChange={() => toggleOne(app._id)}
                    aria-label={`Select ${app.jobCompany}`}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    className="group flex max-w-full items-center gap-2.5 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    onClick={() => onOpen(app)}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] font-outfit text-[10px] font-semibold text-foreground">
                      {initials(app.jobCompany)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground group-hover:underline">
                        {app.jobTitle}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{app.jobCompany}</span>
                    </span>
                  </button>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <StageLabel status={app.status} />
                </td>
                <td className="max-w-40 truncate px-3 py-2.5 text-muted-foreground">{app.location || "Not set"}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap tabular-nums">
                  {app.salary ? (
                    <span className="font-medium text-foreground">{app.salary}</span>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <TagList tags={app.tags} />
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{app.source || "Not set"}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap tabular-nums text-muted-foreground">
                  {appliedOn(app)}
                </td>
                <td className="px-1 py-2.5">
                  <ApplicationActionsMenu application={app} onEdit={onEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-2 sm:hidden">
        {rows.map((app) => (
          <li
            key={app._id}
            className={cn(
              "dashboard-list-row dashboard-row-pad flex items-center gap-3",
              selected.has(app._id) && "bg-[var(--landing-primary-soft)]"
            )}
          >
            <Checkbox
              checked={selected.has(app._id)}
              onCheckedChange={() => toggleOne(app._id)}
              aria-label={`Select ${app.jobCompany}`}
            />
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-3 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              onClick={() => onOpen(app)}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] font-outfit text-xs font-semibold text-foreground">
                {initials(app.jobCompany)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">{app.jobTitle}</span>
                <span className="block truncate text-xs text-muted-foreground">{app.jobCompany}</span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <StageLabel status={app.status} />
                  {app.salary && (
                    <span className="truncate font-medium tabular-nums text-foreground">{app.salary}</span>
                  )}
                </span>
              </span>
            </button>
            <ApplicationActionsMenu application={app} onEdit={onEdit} />
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          Showing {rows.length} of {applications.length}
        </span>
        {pageCount > 1 && (
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Previous page"
              disabled={safePage === 0}
              className="rounded-md border-[var(--landing-line)] shadow-none hover:bg-[var(--landing-paper-soft)]"
              onClick={() => setPage(safePage - 1)}
            >
              <CaretLeftIcon size={14} aria-hidden="true" />
            </Button>
            <span className="tabular-nums">
              {safePage + 1} / {pageCount}
            </span>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Next page"
              disabled={safePage >= pageCount - 1}
              className="rounded-md border-[var(--landing-line)] shadow-none hover:bg-[var(--landing-paper-soft)]"
              onClick={() => setPage(safePage + 1)}
            >
              <CaretRightIcon size={14} aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
      {confirmDialog}
    </div>
  );
}
