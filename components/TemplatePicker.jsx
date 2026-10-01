"use client";

import { useState } from "react";
import { CaretDownIcon, CheckCircleIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
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
import TemplateStyleToolbar from "@/components/cv/TemplateStyleToolbar";
import { ResumeTemplate } from "@/components/ResumePreview";
import {
  TEMPLATE_METADATA,
  DEFAULT_TEMPLATE,
  getTemplateDefaultStyle,
} from "@/utils/cv-templates/metadata";
import { normalizeTemplateStyle } from "@/utils/cv-templates/style";

// Badge text lives in metadata as English. Known labels map to message keys;
// anything else (like "ATS 98%") renders as written.
const BADGE_KEYS = {
  "ATS-safe": "atsSafe",
  "Skills-first": "skillsFirst",
  "Two-column": "twoColumn",
  "Accent red": "accentRed",
  "One-pager": "onePager",
  Serif: "serif",
  "Small caps": "smallCaps",
};

function TemplateThumbnail({ template, data, style }) {
  return (
    <div className="relative aspect-3/4 w-full overflow-hidden rounded-md border border-border bg-white">
      <div className="pointer-events-none absolute inset-0 w-160 origin-top-left scale-33 select-none">
        <ResumeTemplate data={data} template={template} style={style} />
      </div>
    </div>
  );
}

export default function TemplatePicker({
  value,
  onChange,
  data,
  style,
  onStyleChange,
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("tailor.templatePicker");

  const current =
    TEMPLATE_METADATA.find((t) => t.id === value) ||
    TEMPLATE_METADATA.find((t) => t.id === DEFAULT_TEMPLATE);
  const resolvedStyle = normalizeTemplateStyle(
    style ?? getTemplateDefaultStyle(value),
  );

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-haspopup="dialog"
          className="w-full justify-start rounded-md border-border"
        >
          <SquaresFourIcon size={16} aria-hidden="true" />
          <span className="truncate">{current.name}</span>
          <CaretDownIcon size={14} aria-hidden="true" className="ml-auto shrink-0 opacity-60" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        {onStyleChange ? (
          <TemplateStyleToolbar
            value={resolvedStyle}
            onChange={onStyleChange}
            template={value}
          />
        ) : null}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {TEMPLATE_METADATA.map((tpl) => {
            const selected = tpl.id === value;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleSelect(tpl.id)}
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
                <TemplateThumbnail
                  template={tpl.id}
                  data={data}
                  style={resolvedStyle}
                />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-sm font-semibold">{tpl.name}</p>
                    {tpl.badge && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {BADGE_KEYS[tpl.badge]
                          ? t(`badges.${BADGE_KEYS[tpl.badge]}`)
                          : tpl.badge}
                      </Badge>
                    )}
                  </div>
                  {tpl.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {t.has(`descriptions.${tpl.id}`)
                        ? t(`descriptions.${tpl.id}`)
                        : tpl.description}
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
