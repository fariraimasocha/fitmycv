import Link from "next/link";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { TEMPLATE_METADATA } from "@/utils/cv-templates/metadata";

const FEATURED_IDS = new Set(["classic", "modern", "technical"]);
const FEATURED_TEMPLATES = TEMPLATE_METADATA.filter(({ id }) =>
  FEATURED_IDS.has(id),
);

export default function TemplatesPromo() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container grid items-center gap-10 rounded-3xl border border-[var(--landing-line)] bg-[var(--landing-surface)] px-6 py-10 shadow-[var(--landing-shadow-sm)] md:grid-cols-2 md:px-10 lg:px-14">
        <div>
          <span className="landing-eyebrow">11 ATS-safe templates</span>
          <h2 className="landing-heading mt-5 font-serif-display text-3xl font-normal sm:text-4xl">
            Switch the look, not your whole CV.
          </h2>
          <p className="landing-copy mt-4 max-w-xl text-base">
            Every layout is single-column, parser-friendly, and ready for your
            content. Change templates any time without retyping a word.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/cv-templates" className="landing-primary-btn text-sm">
              Explore templates
              <ArrowUpRightIcon size={16} aria-hidden="true" />
            </Link>
            <Link href="/auth" className="landing-secondary-btn text-sm">
              Build my CV
            </Link>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          {FEATURED_TEMPLATES.map((template) => (
            <li
              key={template.id}
              className="rounded-2xl border border-[var(--landing-line)] bg-white p-4"
            >
              <div
                aria-hidden="true"
                className="mb-4 flex aspect-[3/4] flex-col gap-2 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-3"
              >
                <span className="h-2 w-2/3 rounded-full bg-[var(--landing-ink)]" />
                <span className="h-1 w-1/2 rounded-full bg-[var(--landing-line)]" />
                <span className="mt-2 h-1 w-full rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-5/6 rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-full rounded-full bg-[var(--landing-line)]" />
                <span className="mt-2 h-1 w-2/3 rounded-full bg-[var(--landing-primary)]" />
                <span className="h-1 w-full rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-4/5 rounded-full bg-[var(--landing-line)]" />
              </div>
              <p className="flex items-center gap-2 font-outfit text-sm font-extrabold text-[var(--landing-ink)]">
                <CheckCircleIcon
                  size={15}
                  weight="fill"
                  className="text-[var(--landing-primary)]"
                  aria-hidden="true"
                />
                {template.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
