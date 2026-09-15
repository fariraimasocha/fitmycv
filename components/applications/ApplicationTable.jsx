"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArchiveIcon, ArrowRightIcon, CaretLeftIcon, CaretRightIcon, TagIcon, TrashIcon } from "@phosphor-icons/react";
import { ApplicationActionsMenu } from "@/components/applications/ApplicationActionsMenu";
import { Badge } from "@/components/ui/badge";
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
import { STAGES, STAGE_BY_KEY, initials, tileColor } from "@/lib/applications";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's table-view.tsx.

const PAGE_SIZE = 25;

const appliedOn = (app) => {
  const date = app.appliedAt ?? app.createdAt;
  return date ? new Date(date).toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "numeric" }) : "Not set";
};

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
        <Button size="sm" variant="secondary" className="h-7">
          <TagIcon />
          Add tag
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2">
        <div className="flex gap-2">
          <Input
            autoFocus
            value={value}
            placeholder="New tag…"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
          />
          <Button size="sm" onClick={submit}>
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StageLabel({ status }) {
  const stage = STAGE_BY_KEY[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 shrink-0 rounded-sm" style={{ background: stage?.color }} />
      {stage?.label ?? status}
    </span>
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
    onError: () => toast.error("Bulk update failed. Try again."),
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
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-foreground px-3 py-2 text-background">
          <span className="text-sm font-semibold">{selected.size} selected</span>
          <span className="mx-1 h-4 w-px bg-background/25" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-7">
                <ArrowRightIcon />
                Move stage
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {STAGES.map((stage) => (
                <DropdownMenuItem key={stage.key} onClick={() => bulk.mutate({ ids, status: stage.key })}>
                  <span className="size-2 rounded-sm" style={{ background: stage.color }} />
                  {stage.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddTagPopover onAdd={(tag) => bulk.mutate({ ids, addTags: [tag] })} />
          <Button size="sm" variant="secondary" className="h-7" onClick={() => bulk.mutate({ ids, archived: true })}>
            <ArchiveIcon />
            Archive
          </Button>
          <Button size="sm" variant="secondary" className="h-7 text-destructive" onClick={() => void deleteSelected()}>
            <TrashIcon />
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-7 text-background hover:bg-background/15 hover:text-background"
            onClick={() => setSelection(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Desktop: full table. Mobile: stacked cards instead of a wide horizontal scroll. */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-[var(--landing-line)] max-sm:hidden">
        <table className="w-full min-w-225 border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--landing-paper-soft)]/90 backdrop-blur">
            <tr className="[&>th]:px-3 [&>th]:py-2.5 [&>th]:text-left [&>th]:text-xs [&>th]:font-medium [&>th]:tracking-wide [&>th]:whitespace-nowrap [&>th]:text-muted-foreground [&>th]:uppercase">
              <th className="w-10">
                <Checkbox
                  checked={allChecked ? true : someChecked ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th>Company / Role</th>
              <th>Stage</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Tags</th>
              <th>Source</th>
              <th>Applied</th>
              <th className="w-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((app) => (
              <tr
                key={app._id}
                className={cn(
                  "border-t border-[var(--landing-line)] transition-colors hover:bg-[var(--landing-paper-soft)]",
                  selected.has(app._id) && "bg-[var(--landing-primary-soft)]"
                )}
              >
                <td className="px-3 py-2">
                  <Checkbox
                    checked={selected.has(app._id)}
                    onCheckedChange={() => toggleOne(app._id)}
                    aria-label={`Select ${app.jobCompany}`}
                  />
                </td>
                <td className="px-3 py-2">
                  <button type="button" className="flex items-center gap-2.5 text-left" onClick={() => onOpen(app)}>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white",
                        tileColor(app.jobCompany)
                      )}
                    >
                      {initials(app.jobCompany)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium hover:underline">{app.jobTitle}</div>
                      <div className="truncate text-xs text-muted-foreground">{app.jobCompany}</div>
                    </div>
                  </button>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <StageLabel status={app.status} />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{app.location || "Not set"}</td>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{app.salary || "Not set"}</td>
                <td className="px-3 py-2">
                  <div className="flex max-w-40 flex-wrap gap-1">
                    {(app.tags || []).slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                    {(app.tags || []).length > 2 && (
                      <span className="text-xs text-muted-foreground">+{app.tags.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{app.source || "Not set"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{appliedOn(app)}</td>
                <td className="px-1 py-2">
                  <ApplicationActionsMenu application={app} onEdit={onEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto sm:hidden">
        {rows.map((app) => (
          <div
            key={app._id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-[var(--landing-line)] p-3",
              selected.has(app._id) && "bg-[var(--landing-primary-soft)]"
            )}
          >
            <Checkbox
              checked={selected.has(app._id)}
              onCheckedChange={() => toggleOne(app._id)}
              aria-label={`Select ${app.jobCompany}`}
            />
            <button type="button" className="flex min-w-0 flex-1 items-center gap-2.5 text-left" onClick={() => onOpen(app)}>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white",
                  tileColor(app.jobCompany)
                )}
              >
                {initials(app.jobCompany)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{app.jobTitle}</div>
                <div className="truncate text-xs text-muted-foreground">{app.jobCompany}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <StageLabel status={app.status} />
                  {app.salary && <span className="truncate font-medium text-foreground">· {app.salary}</span>}
                </div>
              </div>
            </button>
            <ApplicationActionsMenu application={app} onEdit={onEdit} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing {rows.length} of {applications.length}
        </span>
        {pageCount > 1 && (
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Previous page"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
            >
              <CaretLeftIcon />
            </Button>
            <span className="text-xs">
              {safePage + 1} / {pageCount}
            </span>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Next page"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
            >
              <CaretRightIcon />
            </Button>
          </div>
        )}
      </div>
      {confirmDialog}
    </div>
  );
}
