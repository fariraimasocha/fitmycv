"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowsOutIcon,
  CompassIcon,
  DownloadSimpleIcon,
  RowsIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  SquaresFourIcon,
  TextAlignLeftIcon,
} from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TemplateStyleToolbar from "@/components/cv/TemplateStyleToolbar";
import { ResumeTemplate } from "@/components/ResumePreview";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_METADATA,
  getTemplateDefaultStyle,
  getTemplatesInCategory,
} from "@/utils/cv-templates/metadata";
import { SAMPLE_CV } from "@/utils/cv-templates/sample-cv";
import { normalizeTemplateStyle } from "@/utils/cv-templates/style";
import { printDocument } from "@/utils/print-document";

const NOTES = {
  hybrid: "Skills block up top, then the timeline. Good for career changers.",
  accent: "One column with a single colour accent on headings and dates.",
  graduate: "Education before experience, for a first or second job.",
  classic: "The safe default. Clear headings, generous spacing, works everywhere.",
  modern: "Slightly warmer type and a lighter rule between sections.",
  clean: "Maximum whitespace. Good when your content is short and strong.",
  minimal: "The tightest styling: nothing on the page but your words.",
  technical: "Foregrounds a structured skills and tooling block.",
  sidebar: "The one two-column layout. Pick it when a human screens first.",
  spotlight: "Emphasises the summary at the top of page one.",
  executive: "More room for a scope-led summary and board-level history.",
  compact: "Densest layout, for fitting a long history onto one page.",
  elegant: "Restrained serif headings with a conservative body face.",
  professional: "Corporate and neutral. The other safe default.",
  standard: "Company-first entries. The template recruiters hand out most often.",
  scholar: "Small-caps ruled headings, for engineering and research roles.",
  rezi: "Ruled headings with role-first entries and paragraph achievements.",
  "rezi-simple": "Minimal layout for conservative industries.",
  "rezi-modern": "Accent headings and tighter spacing for tech and product roles.",
};

const CATEGORY_ICONS = {
  all: SquaresFourIcon,
  simple: TextAlignLeftIcon,
  modern: SparkleIcon,
  compact: RowsIcon,
  specialist: CompassIcon,
};

// The document renders at its natural 640px and is scaled down by transform,
// so the thumbnail is the real template rather than a screenshot of one.
const DOC_WIDTH_CLASS = "w-160";

function ScaledDocument({ template, style, scaleClass, width = DOC_WIDTH_CLASS }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 origin-top-left select-none ${width} ${scaleClass}`}
    >
      <ResumeTemplate data={SAMPLE_CV} template={template} style={style} />
    </div>
  );
}

function TemplateCard({ template, style, selected, onSelect, onOpen, onDownload }) {
  return (
    <div
      className={`group template-slide landing-card-deferred relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--landing-surface)] landing-lift landing-shadow-lift ${
        selected ? "border-[var(--landing-accent)]" : "border-[var(--landing-line)]"
      }`}
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-white">
        <ScaledDocument template={template.id} style={style} scaleClass="template-doc" />

        {/* The whole preview is the select target. The pills sit above it. */}
        <button
          type="button"
          onClick={() => onSelect(template.id)}
          aria-pressed={selected}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--landing-accent)]"
        >
          <span className="sr-only">Preview {template.name} in the style you picked</span>
        </button>

        <div className="landing-scrim pointer-events-none absolute inset-0 z-20" />

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 p-4">
          <Link
            href={`/auth?template=${template.id}`}
            className="landing-scrim-item landing-pill-btn landing-pill-solid pointer-events-auto"
          >
            Use this template
          </Link>
          <button
            type="button"
            onClick={() => onDownload(template)}
            className="landing-scrim-item landing-pill-btn landing-pill-ghost pointer-events-auto cursor-pointer"
          >
            <DownloadSimpleIcon size={14} aria-hidden="true" />
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => onOpen(template.id)}
            className="landing-scrim-item landing-pill-btn landing-pill-ghost pointer-events-auto cursor-pointer"
          >
            <SlidersHorizontalIcon size={14} aria-hidden="true" />
            Customize
          </button>
        </div>

        <button
          type="button"
          onClick={() => onOpen(template.id)}
          aria-label={`Preview ${template.name} full size`}
          className="landing-scrim-item absolute right-2 top-2 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-[var(--landing-ink)] shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)]"
        >
          <ArrowsOutIcon size={15} aria-hidden="true" />
        </button>
      </div>

      <div className="border-t border-[var(--landing-line)] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
            {template.name}
          </p>
          {template.badge ? (
            <span className="shrink-0 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--landing-ink-soft)]">{template.badge}</span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--landing-ink-soft)]">
          {NOTES[template.id] || template.description}
        </p>
      </div>
    </div>
  );
}

export default function TemplateGallery({ asPageHeading = false, title, lede }) {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(TEMPLATE_METADATA[0].id);
  const [openTemplate, setOpenTemplate] = useState(null);
  const [style, setStyle] = useState(() =>
    normalizeTemplateStyle(getTemplateDefaultStyle(TEMPLATE_METADATA[0].id)),
  );

  const Heading = asPageHeading ? "h1" : "h2";

  const visible = useMemo(() => getTemplatesInCategory(category), [category]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        TEMPLATE_CATEGORIES.map(({ id }) => [id, getTemplatesInCategory(id).length]),
      ),
    [],
  );

  const openMeta = openTemplate
    ? TEMPLATE_METADATA.find((t) => t.id === openTemplate)
    : null;

  // The toolbar is global to the gallery, the way the reference works: one set
  // of controls restyling every card at once. Selecting a card therefore only
  // moves the highlight, it never rewrites the style the visitor has set.
  const handleSelect = (id) => setSelected(id);

  const handleDownload = (template) => {
    printDocument({
      kind: "cv",
      filename: `FitMyCV - ${template.name} template.pdf`,
      data: SAMPLE_CV,
      template: template.id,
      style,
    });
    toast.success("Opening the print dialog", {
      description: "Choose Save as PDF. The sample text is there for you to replace.",
    });
  };

  return (
    <section
      className={`px-5 sm:px-10 lg:px-16 xl:px-24 ${
        asPageHeading
          ? "pb-12 pt-6 sm:pb-16"
          : "landing-section-tight"
      }`}
    >
      <div className="landing-container">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="landing-eyebrow-plain">Templates</span>
            {/* On the template pages this band is the top of the page, so it
                carries the h1 and its keywords rather than repeating a heading
                the hero above already said. */}
            <Heading className="landing-section-title mt-3 text-3xl sm:text-4xl">
              {title || "Pick a layout, then make it yours"}
            </Heading>
            <p className="landing-copy mt-4 text-base">
              {lede ||
                "Change the colour, the font and the spacing and watch every template update as you go. Download one with the sample text to edit offline, or sign in and fill it with your own."}
            </p>
          </div>
          <Link
            href="/auth"
            className="landing-primary-btn font-outfit shrink-0 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
          >
            Build my CV
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TEMPLATE_CATEGORIES.map(({ id, label }) => {
            const Icon = CATEGORY_ICONS[id];
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                aria-pressed={active}
                className={`landing-lift flex cursor-pointer items-center gap-3 rounded-2xl border bg-[var(--landing-surface)] px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2 ${
                  active
                    ? "border-[var(--landing-accent)] bg-[var(--landing-accent-soft)]"
                    : "border-[var(--landing-line)]"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    active
                      ? "text-[var(--landing-accent-dark)]"
                      : "text-[var(--landing-ink-faint)]"
                  }
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate font-outfit text-sm font-bold text-[var(--landing-ink)]">
                    {label}
                  </span>
                  <span className="block text-xs text-[var(--landing-ink-soft)]">
                    {counts[id]} {counts[id] === 1 ? "template" : "templates"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* The bar and the grid must share a parent: a sticky element only
            travels within its own parent's box, so wrapping the bar alone
            would let it scroll away immediately. */}
        <div className="mt-6">
          {/* No `template` here on purpose: this bar restyles all nineteen
              cards at once, so it must not disable its structure toggles
              based on whichever single card happens to be highlighted. */}
          <TemplateStyleToolbar value={style} onChange={setStyle} sticky />
          <p className="mt-3 text-sm text-[var(--landing-ink-soft)]">
            Accent colour, font, and spacing apply to every preview below. Colour
            changes headings and dates, not the page background.
          </p>

          {/* Says what the filter did. aria-live so a screen reader hears the
              count change instead of silently losing fifteen cards. */}
          <p
            aria-live="polite"
            className="mt-6 text-sm font-semibold text-[var(--landing-ink-soft)]"
          >
            Showing {visible.length} of {TEMPLATE_METADATA.length} templates
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-5 sm:justify-start">
            {visible.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                style={style}
                selected={selected === template.id}
                onSelect={handleSelect}
                onOpen={(id) => {
                  handleSelect(id);
                  setOpenTemplate(id);
                }}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-[var(--landing-ink-soft)]">
          Eighteen of the nineteen are single column with standard headings, so
          your content survives extraction. Sidebar is the exception, and it is
          labelled: two columns read well to a person and badly to a parser.
        </p>
      </div>

      <Dialog open={Boolean(openTemplate)} onOpenChange={(next) => !next && setOpenTemplate(null)}>
        <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-outfit">
              {openMeta ? openMeta.name : "Template"}
            </DialogTitle>
            <DialogDescription>
              {openMeta ? NOTES[openMeta.id] || openMeta.description : null}
            </DialogDescription>
          </DialogHeader>

          {openMeta ? (
            <>
              <TemplateStyleToolbar value={style} onChange={setStyle} template={openMeta.id} />

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/auth?template=${openMeta.id}`}
                  className="landing-primary-btn landing-primary-btn-sm font-outfit"
                >
                  Use this template
                </Link>
                <button
                  type="button"
                  onClick={() => handleDownload(openMeta)}
                  className="landing-secondary-btn landing-secondary-btn-sm font-outfit cursor-pointer"
                >
                  <DownloadSimpleIcon size={15} aria-hidden="true" />
                  Download PDF
                </button>
                <p className="text-xs text-[var(--landing-ink-soft)]">
                  The download carries the sample text and the style you set here.
                </p>
              </div>

              <div className="relative mx-auto aspect-3/4 w-64 overflow-hidden rounded-xl border border-[var(--landing-line)] bg-white sm:w-112">
                <ScaledDocument
                  template={openMeta.id}
                  style={style}
                  scaleClass="scale-40 sm:scale-70"
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
