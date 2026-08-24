import Link from "next/link";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { TEMPLATE_METADATA } from "@/utils/cv-templates/metadata";

const FEATURED_IDS = ["classic", "modern", "technical"];
const FEATURED_TEMPLATES = FEATURED_IDS.map((id) => {
  const template = TEMPLATE_METADATA.find((item) => item.id === id);
  if (!template) {
    throw new Error(`Missing featured CV template metadata: ${id}`);
  }
  return template;
});

export default function TemplatesPromo() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container grid items-center gap-10 rounded-3xl border border-[var(--landing-line)] bg-[var(--landing-surface)] px-6 py-10 shadow-[var(--landing-shadow-sm)] md:grid-cols-2 md:px-10 lg:px-14">
        <div>
          <span className="landing-eyebrow">
            {TEMPLATE_METADATA.length} ATS-safe templates
          </span>
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

        <ul className="grid grid-cols-3 gap-2 sm:gap-3">
          {FEATURED_TEMPLATES.map((template) => (
            <li
              key={template.id}
              className="min-w-0 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-2 sm:p-3"
            >
              <div
                aria-hidden="true"
                className="mb-3 flex h-24 flex-col gap-1 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-paper-strong)] p-2 sm:h-28 sm:p-3"
              >
                <span className="h-2 w-2/3 shrink-0 rounded-full bg-[var(--landing-ink)]" />
                <span className="h-1 w-1/2 shrink-0 rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-full shrink-0 rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-5/6 shrink-0 rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-full shrink-0 rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-2/3 shrink-0 rounded-full bg-[var(--landing-primary)]" />
                <span className="h-1 w-full shrink-0 rounded-full bg-[var(--landing-line)]" />
                <span className="h-1 w-4/5 shrink-0 rounded-full bg-[var(--landing-line)]" />
              </div>
              <p className="flex min-w-0 flex-col items-start gap-1 font-outfit text-xs font-extrabold text-[var(--landing-ink)] sm:text-sm lg:flex-row lg:items-center lg:gap-2">
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
