import Link from "next/link";

import { ResumeTemplate } from "@/components/ResumePreview";
import { TEMPLATE_METADATA } from "@/utils/cv-templates/metadata";
import { SAMPLE_CV } from "@/utils/cv-templates/sample-cv";

// One-line positioning for each layout the app ships, so the gallery says
// something useful rather than listing sixteen identical names.
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
};

export default function TemplateGallery() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container">
        <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
          The 16 layouts
        </h2>
        <p className="landing-copy mt-3 text-base">
          Fifteen of the sixteen are single-column with standard headings, so
          your content survives extraction. Sidebar is the exception, and it is
          labelled: two columns read well to a person and badly to a parser.
          Switch between any of them at any time without retyping.
        </p>

        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_METADATA.map(({ id, name, badge, description }) => (
            <li
              key={id}
              className="landing-card flex flex-col gap-3 rounded-2xl p-4"
            >
              {/* Same thumbnail treatment as the in-app picker: the real
                  template at full width, scaled down, on sample data. */}
              {/* w-53 is exactly w-160 at scale-33, so the page fits the render
                  instead of leaving a gap beside it at wider breakpoints. */}
              <div className="relative mx-auto aspect-3/4 w-53 overflow-hidden rounded-xl border border-[var(--landing-line)] bg-white">
                <div className="pointer-events-none absolute inset-0 w-160 origin-top-left scale-33 select-none">
                  <ResumeTemplate data={SAMPLE_CV} template={id} />
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                  {name}
                </span>
                {badge && (
                  <span className="landing-eyebrow shrink-0 text-xs">{badge}</span>
                )}
              </div>
              <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                {NOTES[id] || description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link
            href="/auth"
            className="landing-primary-btn font-outfit text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
          >
            Build my CV
          </Link>
          <p className="text-sm font-semibold text-[var(--landing-ink-soft)]">
            Free to build, store and tailor to a job posting. The paid plan is
            the PDF download.
          </p>
        </div>
      </div>
    </section>
  );
}
