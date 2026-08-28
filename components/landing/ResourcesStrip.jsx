import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

// Contextual internal links on the homepage. The footer carries navigation
// links to the same places; this band exists so the highest-value pages get a
// real in-content link with descriptive anchor text.
const RESOURCES = [
  {
    label: "Tailor a CV from a job link",
    href: "/tailor-cv-from-job-link",
    body: "The flagship flow: paste a posting URL, get a tailored CV and cover letter.",
  },
  {
    label: "Free ATS resume checker",
    href: "/ats-resume-checker",
    body: "Score your CV against a job description and see the terms you are missing.",
  },
  {
    label: "How to write an ATS-friendly resume",
    href: "/blog/ats-resume-guide",
    body: "Formatting, keywords, and the mistakes that get CVs filtered out before a human reads them.",
  },
  {
    label: "Resume examples for ten jobs",
    href: "/resume-examples",
    body: "Worked summaries, before-and-after bullets, and the keywords those postings use.",
  },
];

export default function ResourcesStrip() {
  return (
    <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
            Everything else on the site
          </h2>
          <p className="landing-copy text-center text-base">
            Free tools and guides, whether or not you ever pay us a penny.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {RESOURCES.map(({ label, href, body }) => (
            <Link
              key={href}
              href={href}
              className="landing-card group flex flex-col gap-2 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                {label}
              </span>
              <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                {body}
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-primary-dark)]">
                Open
                <ArrowRightIcon
                  size={12}
                  weight="bold"
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
