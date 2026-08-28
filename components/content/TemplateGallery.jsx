import Link from "next/link";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

import { TEMPLATE_METADATA } from "@/utils/cv-templates/metadata";

// One-line positioning for each layout the app ships, so the gallery says
// something useful rather than listing eleven identical names.
const NOTES = {
  classic: "The safe default. Clear headings, generous spacing, works everywhere.",
  modern: "Slightly warmer type and a lighter rule between sections.",
  clean: "Maximum whitespace. Good when your content is short and strong.",
  minimal: "The tightest styling: nothing on the page but your words.",
  technical: "Foregrounds a structured skills and tooling block.",
  sidebar: "A distinct header block, still single-column in reading order.",
  spotlight: "Emphasises the summary at the top of page one.",
  executive: "More room for a scope-led summary and board-level history.",
  compact: "Densest layout, for fitting a long history onto one page.",
  elegant: "Restrained serif headings with a conservative body face.",
  professional: "Corporate and neutral. The other safe default.",
};

export default function TemplateGallery() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container">
        <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
          The eleven layouts
        </h2>
        <p className="landing-copy mt-3 text-base">
          Every one is single-column with standard headings, so your content
          survives extraction. Switch between them any time without retyping.
        </p>

        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_METADATA.map(({ id, name }) => (
            <li
              key={id}
              className="landing-card flex flex-col gap-2.5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                  <CheckIcon size={14} weight="bold" aria-hidden="true" />
                </span>
                <span className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                  {name}
                </span>
              </div>
              <p className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                {NOTES[id]}
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
            Free to build and store. Tailoring to a job posting is on the paid
            plan.
          </p>
        </div>
      </div>
    </section>
  );
}
