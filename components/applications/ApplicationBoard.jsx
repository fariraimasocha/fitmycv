"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { STAGES } from "@/lib/applications";
import { cn } from "@/lib/utils";

// Ported from Reactive Resume's board.tsx.

// Cap the cards per column so a busy stage doesn't mount hundreds of draggable
// nodes at once. The rest reveal in batches.
const COLUMN_PAGE_SIZE = 50;

function DraggableCard({ application, onOpen, onEdit }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: application._id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className={cn(isDragging && "opacity-30")}>
      <ApplicationCard application={application} onClick={onOpen} onEdit={onEdit} />
    </div>
  );
}

function Column({ stage, applications, onOpen, onEdit }) {
  const t = useTranslations("dashboard");
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const label = t(`stages.${stage.key}`);
  const [visible, setVisible] = useState(COLUMN_PAGE_SIZE);
  const shown = applications.slice(0, visible);
  const remaining = applications.length - shown.length;

  return (
    <section
      aria-label={t("appComponents.board.columnLabel", { stage: label, count: applications.length })}
      className={cn(
        "flex w-72 shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] transition-colors",
        isOver && "border-[var(--landing-ink-soft)] bg-[var(--landing-primary-soft)]"
      )}
    >
      {/* One header recipe for every column, so the trays share one top edge. */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[var(--landing-line)] bg-[var(--landing-surface)] px-3">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: stage.color }}
          aria-hidden="true"
        />
        <span className="truncate text-sm font-semibold text-foreground">{label}</span>
        <span className="ms-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--landing-primary-soft)] px-1.5 text-xs font-medium tabular-nums text-muted-foreground">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex min-h-40 flex-1 flex-col gap-2 overflow-y-auto p-2 lg:max-h-[calc(100dvh-24rem)]"
      >
        {shown.map((app) => (
          <DraggableCard key={app._id} application={app} onOpen={() => onOpen(app)} onEdit={onEdit} />
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => setVisible((v) => v + COLUMN_PAGE_SIZE)}
            className="h-control-sm rounded-md border border-dashed border-[var(--landing-line)] text-xs font-medium text-muted-foreground transition-colors hover:bg-[var(--landing-surface)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {t("appComponents.board.showMore", { count: Math.min(remaining, COLUMN_PAGE_SIZE) })}
          </button>
        )}
      </div>
    </section>
  );
}

export function ApplicationBoard({ applications, onOpen, onEdit, onMove }) {
  const [activeId, setActiveId] = useState(null);
  // A small activation distance so a click still opens the detail sheet instead of starting a drag.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const byStage = useMemo(() => {
    const map = new Map(STAGES.map((s) => [s.key, []]));
    for (const app of applications) map.get(app.status)?.push(app);
    return map;
  }, [applications]);

  const activeApp = activeId ? applications.find((a) => a._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={({ active, over }) => {
        setActiveId(null);
        if (!over) return;
        const app = applications.find((a) => a._id === active.id);
        if (app && app.status !== over.id) onMove(app._id, String(over.id));
      }}
    >
      <div className="flex min-h-0 gap-3 overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          <Column
            key={stage.key}
            stage={stage}
            applications={byStage.get(stage.key) ?? []}
            onOpen={onOpen}
            onEdit={onEdit}
          />
        ))}
      </div>
      <DragOverlay>{activeApp ? <ApplicationCard application={activeApp} dragging /> : null}</DragOverlay>
    </DndContext>
  );
}
