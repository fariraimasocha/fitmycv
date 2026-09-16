"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArchiveIcon,
  ArrowRightIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
  TrayArrowUpIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { STAGES } from "@/lib/applications";
import { requestJson } from "@/lib/request-json";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's application-actions-menu.tsx.

// Portaled menu and dialog events still bubble through the React tree, so stop
// them before they reach the card (which would start a drag or open the sheet).
const stop = (event) => event.stopPropagation();

export function ApplicationActionsMenu({ application, onEdit, showOnHover, className }) {
  const queryClient = useQueryClient();
  const [confirm, confirmDialog] = useConfirm();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["applications"] });

  const update = useMutation({
    mutationFn: (body) => requestJson(`/api/applications/${application._id}`, { method: "PUT", body }),
    onSuccess: invalidate,
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: () => requestJson(`/api/applications/${application._id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidate();
      toast.success("Application deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  const onDelete = async () => {
    const confirmed = await confirm("Delete this application?", {
      description: `${application.jobTitle} at ${application.jobCompany} and its full timeline will be deleted for good.`,
    });
    if (confirmed) remove.mutate();
  };

  return (
    <div className={cn("shrink-0", className)} onClick={stop} onPointerDown={stop} onKeyDown={stop}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Application actions"
            className={cn(
              "size-6 rounded-md text-muted-foreground hover:bg-[var(--landing-paper-soft)] hover:text-foreground",
              showOnHover &&
                "opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
            )}
          >
            <DotsThreeVerticalIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onEdit(application)}>
            <PencilSimpleIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ArrowRightIcon />
              Move to
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {STAGES.map((stage) => (
                <DropdownMenuItem
                  key={stage.key}
                  disabled={stage.key === application.status}
                  onClick={() => update.mutate({ status: stage.key })}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: stage.color }} aria-hidden="true" />
                  {stage.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => update.mutate({ archived: !application.archived })}>
            {application.archived ? <TrayArrowUpIcon /> : <ArchiveIcon />}
            {application.archived ? "Unarchive" : "Archive"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => void onDelete()}>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {confirmDialog}
    </div>
  );
}
