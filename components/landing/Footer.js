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
      { key: "rezi", href: "/rezi-alternative" },
      { key: "resumeWorded", href: "/resume-worded-alternative" },
      { key: "visualcv", href: "/visualcv-alternative" },
      { key: "enhancv", href: "/enhancv-alternative" },
      { key: "huntr", href: "/huntr-alternative" },
      { key: "tailoredcv", href: "/tailoredcv-alternative" },
      { key: "seekario", href: "/seekario-alternative" },
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
    <div className="mb-10 flex break-inside-avoid flex-col gap-4">
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
  const r = useTranslations("landing.redesign");

  return (
    <footer className="public-footer">
      <div className="public-container flex flex-col gap-12">
        {/* Top row */}
        <div className="public-footer-grid">
          {/* Brand col */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            <div className="flex flex-row items-center">
              <BrandLogo size="sm" wordmarkClassName="text-lg" />
            </div>
            <p className="font-sans text-sm text-[var(--landing-ink-soft)] leading-relaxed max-w-[260px]">
              {t("tagline")}
            </p>
            <details className="public-footer-badges">
              <summary>{t("headings.featuredOn")}</summary>
              {/* eslint-disable @next/next/no-img-element -- external badge images */}
              <div className="flex flex-wrap items-center gap-3">
                <a href="https://launchfriday.xyz/launch/fitmycv-6074cc" target="_blank" rel="noopener">
                  <img
                    src="https://launchfriday.xyz/badge.svg"
                    alt="Launching on LaunchFriday"
                    width="200"
                    height="54"
                    loading="lazy"
                  />
                </a>
                <a href="https://findly.tools/fitmycv?utm_source=fitmycv" target="_blank" rel="nofollow noopener noreferrer">
                  <img
                    src="https://findly.tools/badges/findly-tools-badge-dark.svg"
                    alt="Featured on Findly.tools"
                    width="175"
                    height="55"
                    loading="lazy"
                  />
                </a>
                <a href="https://nicklaunches.com/products/fitmycv/" target="_blank" rel="nofollow noopener">
                  <img
                    src="https://nicklaunches.com/badges/featured-dark.png"
                    alt="FitMyCV on Nick Launches"
                    width="244"
                    height="56"
                    loading="lazy"
                  />
                </a>
                <a href="https://ufind.best/products/tailor-your-cv-to-any-job-link" target="_blank" rel="nofollow noopener">
                  <img
                    src="https://ufind.best/badges/ufind-best-badge-dark.svg"
                    alt="Featured on ufind.best"
                    width="150"
                    loading="lazy"
                  />
                </a>
                <a
                  href="https://saasearch.io/product/fitmycv?utm_source=badge&utm_medium=referral&utm_campaign=featured_badge&ref=saasearch"
                  target="_blank"
                  rel="nofollow noopener"
                >
                  <img
                    src="https://saasearch.io/api/badge/fitmycv?theme=dark"
                    alt="Featured on SaaSearch"
                    className="h-12 w-auto"
                    loading="lazy"
                  />
                </a>
                <a href="https://peerpush.com/p/fitmycv" target="_blank" rel="nofollow noopener">
                  <img
                    src="https://peerpush.com/p/fitmycv/badge.png"
                    alt="FitMyCV on PeerPush"
                    width="230"
                    height="65"
                    loading="lazy"
                    className="h-auto w-57.5"
                  />
                </a>
                <a href="https://twelve.tools" target="_blank" rel="nofollow noopener">
                  <img
                    src="https://twelve.tools/badge2-dark.svg"
                    alt="Featured on Twelve Tools"
                    width="148"
                    height="40"
                    loading="lazy"
                  />
                </a>
                <a href="https://saascity.io" target="_blank" rel="nofollow noopener">
                  <img
                    src="https://saascity.io/badges/featured-dark.svg"
                    alt="Featured on SaaSCity"
                    width="150"
                    height="54"
                    loading="lazy"
                  />
                </a>
                <a href="https://startupfa.me/s/fitmycv?utm_source=fitmycv.link" target="_blank" rel="nofollow noopener">
                  <img
                    src="https://startupfa.me/badges/featured-badge.webp"
                    alt="FitMyCV - Featured on Startup Fame"
                    width="171"
                    height="54"
                    loading="lazy"
                  />
                </a>
                <a href="https://dofollow.tools" target="_blank" rel="nofollow noopener">
                  <img
                    src="https://dofollow.tools/badge/badge_dark.svg"
                    alt="Featured on Dofollow.Tools"
                    width="200"
                    height="54"
                    loading="lazy"
                  />
                </a>
              </div>
              {/* eslint-enable @next/next/no-img-element */}
            </details>
          </div>

          <div className="public-footer-links">
            {columns.filter((column) => ["product", "freeTools", "resources", "company"].includes(column.key)).map((column) => (
              <div key={column.key}>
                <FooterColumn heading={t(`headings.${column.key}`)} links={column.key === "product" ? [{ label: r("tracker"), href: "/job-tracker" }, ...column.links] : column.links} />
              </div>
            ))}
          </div>
        </div>

        <details className="public-footer-more"><summary>{r("resources")}</summary><div className="grid gap-8 pt-6 sm:grid-cols-3">{columns.filter((column) => ["compare", "atsGuides", "otherApps"].includes(column.key)).map((column) => <FooterColumn key={column.key} heading={t(`headings.${column.key}`)} links={column.links} />)}</div></details>

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
