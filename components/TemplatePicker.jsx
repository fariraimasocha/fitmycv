"use client";

import { useState } from "react";
import { CheckCircleIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResumeTemplate } from "@/components/ResumePreview";
import { TEMPLATE_METADATA, DEFAULT_TEMPLATE } from "@/utils/cv-templates/metadata";

function TemplateThumbnail({ template, data }) {
  return (
    <div className="relative aspect-3/4 w-full overflow-hidden rounded-md border border-border bg-white">
      <div className="pointer-events-none absolute inset-0 w-160 origin-top-left scale-33 select-none">
        <ResumeTemplate data={data} template={template} />
      </div>
    </div>
  );
}

export default function TemplatePicker({ value, onChange, data }) {
  const [open, setOpen] = useState(false);

  const current =
    TEMPLATE_METADATA.find((t) => t.id === value) ||
    TEMPLATE_METADATA.find((t) => t.id === DEFAULT_TEMPLATE);

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start rounded-md border-border">
          <SquaresFourIcon size={16} aria-hidden="true" />
          <span className="truncate">{current.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>
            Previews use your own CV. The downloaded PDF matches exactly what you see.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {TEMPLATE_METADATA.map((t) => {
            const selected = t.id === value;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.id)}
                className={`group relative flex flex-col gap-2 rounded-lg border p-2 text-left transition-colors ${
                  selected
                    ? "border-primary ring-2 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {selected && (
                  <span className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] text-[var(--landing-ink)]">
                    <CheckCircleIcon
                      size={16}
                      weight="fill"
                      aria-hidden="true"
                    />
                  </span>
                )}
                <TemplateThumbnail template={t.id} data={data} />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    {t.badge && (
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {t.badge}
                      </Badge>
                    )}
                  </div>
                  {t.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {t.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
