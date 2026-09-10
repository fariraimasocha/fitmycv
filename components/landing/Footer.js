import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import { FREE_TOOLS } from "@/lib/free-tools";

// Root-relative hrefs throughout. The footer renders on every page, so bare
// "#features" anchors would dead-end everywhere except the homepage.

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Tailor CV from a job link", href: "/tailor-cv-from-job-link" },
      { label: "Resume optimizer", href: "/resume-optimizer" },
      { label: "AI cover letter generator", href: "/ai-cover-letter-generator" },
      { label: "Cover letter builder", href: "/cover-letter-builder" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Free tools",
    links: FREE_TOOLS.map(({ label, href }) => ({ label, href })),
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "ATS resume guide", href: "/blog/ats-resume-guide" },
      { label: "How to write a resume", href: "/how-to-write-a-resume" },
      { label: "Resume tips", href: "/resume-tips" },
      { label: "Resume examples", href: "/resume-examples" },
      { label: "CV examples", href: "/cv-examples" },
      { label: "CV templates", href: "/cv-templates" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { label: "Jobscan alternative", href: "/jobscan-alternative" },
      { label: "Teal alternative", href: "/teal-alternative" },
      { label: "Kickresume alternative", href: "/kickresume-alternative" },
    ],
  },
  {
    heading: "ATS guides",
    links: [
      { label: "Workday resume format", href: "/workday-resume-format" },
      { label: "Greenhouse ATS resume", href: "/greenhouse-ats-resume" },
      { label: "Lever ATS resume", href: "/lever-ats-resume" },
      { label: "Taleo resume format", href: "/taleo-resume-format" },
      { label: "iCIMS resume format", href: "/icims-resume-format" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Support", href: "/support" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
  {
    heading: "Other Apps",
    links: [
      { label: "LinkGenie", href: "https://linkgenie.one" },
      { label: "Payfari", href: "https://payfari.com" },
    ],
  },
];

const LINK_CLASS =
  "font-sans text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)] transition-colors";

function FooterColumn({ heading, links }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-outfit font-bold text-sm text-[var(--landing-ink)]">{heading}</h3>
      <ul className="flex flex-col gap-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            {href.startsWith("http") ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                {label}
              </a>
            ) : (
              <Link href={href} className={LINK_CLASS}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="landing-muted-band px-5 py-12 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container flex flex-col gap-12">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-10">
          {/* Brand col */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            <div className="flex flex-row items-center">
              <BrandLogo size="sm" wordmarkClassName="text-lg" />
            </div>
            <p className="font-sans text-sm text-[var(--landing-ink-soft)] leading-relaxed max-w-[260px]">
              AI-powered CV tailoring. Land more interviews with less effort.
            </p>
          </div>

          <div className="flex flex-col flex-wrap gap-8 sm:flex-row sm:gap-12 lg:gap-14">
            {columns.map((column) => (
              <FooterColumn key={column.heading} {...column} />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full border-t border-[var(--landing-line)] gap-4 pt-6">
          <p className="font-sans text-sm text-[var(--landing-ink-soft)]">
            2026 FitMyCV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
