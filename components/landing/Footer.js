import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import BrandLogo from "@/components/BrandLogo";
import { FREE_TOOLS } from "@/lib/free-tools";

// Root-relative hrefs throughout. The footer renders on every page, so bare
// "#features" anchors would dead-end everywhere except the homepage.

// `key` points at landing.footer.links. Free tool labels come from the tool
// catalog and stay English, so they carry a plain `label` instead.
const columns = [
  {
    key: "product",
    links: [
      { key: "tailor", href: "/tailor-cv-from-job-link" },
      { key: "optimizer", href: "/resume-optimizer" },
      { key: "aiCoverLetter", href: "/ai-cover-letter-generator" },
      { key: "coverLetterBuilder", href: "/cover-letter-builder" },
      { key: "pricing", href: "/pricing" },
    ],
  },
  {
    key: "freeTools",
    links: FREE_TOOLS.map(({ label, href }) => ({ label, href })),
  },
  {
    key: "resources",
    links: [
      { key: "blog", href: "/blog" },
      { key: "atsGuide", href: "/blog/ats-resume-guide" },
      { key: "howToWrite", href: "/how-to-write-a-resume" },
      { key: "tips", href: "/resume-tips" },
      { key: "resumeExamples", href: "/resume-examples" },
      { key: "cvExamples", href: "/cv-examples" },
      { key: "cvTemplates", href: "/cv-templates" },
      { key: "faq", href: "/#faq" },
    ],
  },
  {
    key: "compare",
    links: [
      { key: "jobscan", href: "/jobscan-alternative" },
      { key: "teal", href: "/teal-alternative" },
      { key: "kickresume", href: "/kickresume-alternative" },
    ],
  },
  {
    key: "atsGuides",
    links: [
      { key: "workday", href: "/workday-resume-format" },
      { key: "greenhouse", href: "/greenhouse-ats-resume" },
      { key: "lever", href: "/lever-ats-resume" },
      { key: "taleo", href: "/taleo-resume-format" },
      { key: "icims", href: "/icims-resume-format" },
    ],
  },
  {
    key: "company",
    links: [
      { key: "support", href: "/support" },
      { key: "privacy", href: "/privacy-policy" },
      { key: "terms", href: "/terms-and-conditions" },
    ],
  },
  {
    key: "otherApps",
    links: [
      { label: "LinkGenie", href: "https://linkgenie.one" },
      { label: "Payfari", href: "https://payfari.com" },
    ],
  },
];

const LINK_CLASS =
  "tap-target font-sans text-sm font-semibold text-[var(--landing-ink-soft)] hover:text-[var(--landing-ink)] transition-colors";

function FooterColumn({ heading, links }) {
  const t = useTranslations("landing.footer.links");

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-outfit font-bold text-sm text-[var(--landing-ink)]">{heading}</h3>
      <ul className="flex flex-col gap-3">
        {links.map(({ key, label: plainLabel, href }) => {
          const label = key ? t(key) : plainLabel;
          return (
            <li key={href}>
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
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("landing.footer");

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
              {t("tagline")}
            </p>
          </div>

          <div className="flex flex-col flex-wrap gap-8 sm:flex-row sm:gap-12 lg:gap-14">
            {columns.map((column) => (
              <FooterColumn
                key={column.key}
                heading={t(`headings.${column.key}`)}
                links={column.links}
              />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full border-t border-[var(--landing-line)] gap-4 pt-6">
          <p className="font-sans text-sm text-[var(--landing-ink-soft)]">
            {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
