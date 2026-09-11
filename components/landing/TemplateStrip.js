"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

import { ResumeTemplate } from "@/components/ResumePreview";
import {
  TEMPLATE_METADATA,
  getTemplateDefaultStyle,
} from "@/utils/cv-templates/metadata";
import { SAMPLE_CV } from "@/utils/cv-templates/sample-cv";

// Six of the nineteen. The full gallery renders every layout as a real
// document, which is the right trade on a page someone opened to browse
// templates and the wrong one on a homepage: this band exists to show they
// are real, then send you to the gallery.
const SHOWN = ["classic", "modern", "accent", "executive", "technical", "rezi"];

const CARDS = SHOWN.map((id) => TEMPLATE_METADATA.find((t) => t.id === id)).filter(
  Boolean,
);

const GAP = 20;

function ArrowButton({ dir, onClick }) {
  const Icon = dir === "prev" ? CaretLeftIcon : CaretRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous templates" : "Next templates"}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] text-[var(--landing-ink)] landing-shadow-lift transition-colors duration-300 hover:bg-[var(--landing-paper-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent)] focus-visible:ring-offset-2"
    >
      <Icon size={17} weight="bold" aria-hidden="true" />
    </button>
  );
}

/**
 * A scroll-snapped row of full-size template previews with prev and next.
 *
 * ponytail: deliberately stateless. An earlier version tracked scroll position
 * to grey out the arrows at each end, which meant a scroll listener calling
 * setState sixty times a second across six full resume documents, measuring
 * layout on every event. That stalled the main thread badly enough to freeze
 * the tab. Clamping makes a press at either end a harmless no-op, so the
 * disabled styling was all the state bought, and it is not worth a freeze.
 */
export default function TemplateStrip() {
  const trackRef = useRef(null);

  const move = (direction) => {
    const el = trackRef.current;
    if (!el) return;

    const slide = el.querySelector(":scope > li");
    const step = slide ? slide.getBoundingClientRect().width + GAP : el.clientWidth;
    const max = el.scrollWidth - el.clientWidth;

    el.scrollLeft = Math.max(0, Math.min(max, el.scrollLeft + direction * step));
  };

  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="landing-eyebrow-plain">Templates</span>
            <h2 className="landing-section-title mt-3 text-2xl sm:text-3xl">
              Nineteen layouts, all built to survive a parser
            </h2>
            <p className="landing-copy mt-4 text-base">
              Single column, standard headings, no graphics that scramble on
              extraction. Change the colour and the font on any of them.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ArrowButton dir="prev" onClick={() => move(-1)} />
            <ArrowButton dir="next" onClick={() => move(1)} />
            <Link
              href="/cv-templates"
              className="landing-secondary-btn landing-secondary-btn-sm font-outfit group"
            >
              See all templates
              <ArrowRightIcon
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Native scroll with snap points, so a touch swipe and a keyboard
            scroll keep working without carousel state to fall out of step with
            the DOM. The arrows only set scrollLeft. */}
        <ul
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {CARDS.map((template) => (
            <li key={template.id} className="template-slide snap-start">
              <Link
                href="/cv-templates"
                className="landing-card landing-lift group flex flex-col overflow-hidden rounded-2xl"
              >
                <span className="relative block aspect-3/4 w-full overflow-hidden bg-white">
                  <span className="template-doc pointer-events-none absolute inset-0 select-none">
                    <ResumeTemplate
                      data={SAMPLE_CV}
                      template={template.id}
                      style={getTemplateDefaultStyle(template.id)}
                    />
                  </span>
                </span>
                <span className="flex items-center justify-between gap-2 border-t border-[var(--landing-line)] px-5 py-4">
                  <span className="font-outfit text-base font-bold text-[var(--landing-ink)]">
                    {template.name}
                  </span>
                  {template.badge ? (
                    <span className="shrink-0 rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--landing-ink-soft)]">
                      {template.badge}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
