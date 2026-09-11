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
    label: "Resume job match checker",
    href: "/resume-job-match-checker",
    body: "Paste a resume and a posting. See the match, missing skills, and what to fix first.",
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
    label: "Resume examples for fourteen jobs",
    href: "/resume-examples",
    body: "Worked summaries, before-and-after bullets, and the keywords those postings use.",
  },
];

export default function ResourcesStrip() {
  return (
    <section className="landing-section-tight landing-tinted-band px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container">
        <div className="max-w-2xl">
          <h2 className="landing-section-title text-2xl sm:text-3xl">
            Everything else on the site
          </h2>
          <p className="landing-copy mt-4 text-base">
            Free tools and guides, whether or not you ever pay us a penny.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {RESOURCES.map(({ label, href, body }) => (
            <Link key={href} href={href} className="minimal-card group block">
              <span className="minimal-card-inner flex h-full flex-col gap-2 p-6">
                <span className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                  {label}
                </span>
                <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {body}
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-primary-dark)]">
                  Open
                  <ArrowRightIcon
                    size={12}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
