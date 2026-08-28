import Link from "next/link";
import { ArrowRightIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import Blocks from "@/components/content/Blocks";
import FaqSection from "@/components/content/FaqSection";
import KeywordChecker from "@/components/tools/KeywordChecker";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
} from "@/lib/seo";
import { softwareApplicationSchema } from "@/lib/structured-data";

const PRODUCT_SLUGS = new Set([
  "ats-resume-checker",
  "free-ats-keyword-checker",
  "resume-optimizer",
  "ai-cover-letter-generator",
  "cover-letter-builder",
]);

/**
 * Shared shell for the data-driven marketing pages in `content/pages`.
 * Every page gets the same hero, prose column, FAQ block, internal-link rail,
 * and schema stack — so a new landing page is a content file, not a layout.
 */
export default function MarketingPage({ page, children }) {
  const {
    slug,
    eyebrow,
    h1,
    lede,
    ctas = [],
    tool,
    blocks = [],
    faqs = [],
    faqHeading,
    related = [],
    howTo,
    breadcrumbName,
  } = page;

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-5 pb-16 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_50%_16%,oklch(0.92_0.06_174_/_0.7),transparent_32rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center justify-center gap-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
            >
              <Link href="/" className="hover:text-[var(--landing-ink)]">
                Home
              </Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <span className="text-[var(--landing-ink)]">
                {breadcrumbName || h1}
              </span>
            </nav>

            {eyebrow ? (
              <span className="landing-eyebrow">
                <span
                  className="h-2 w-2 rounded-full bg-[var(--landing-primary)]"
                  aria-hidden="true"
                />
                {eyebrow}
              </span>
            ) : null}

            <h1
              className="mt-6 max-w-4xl font-outfit font-extrabold leading-[1.02] tracking-tight text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(36px, 5.4vw, 68px)" }}
            >
              {h1}
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              {lede}
            </p>

            {ctas.length ? (
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {ctas.map(({ label, href, variant = "primary" }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`${
                      variant === "primary"
                        ? "landing-primary-btn group"
                        : "landing-secondary-btn"
                    } min-w-[200px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2`}
                  >
                    {label}
                    {variant === "primary" ? (
                      <ArrowRightIcon
                        size={17}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Interactive tool */}
        {tool ? (
          <section id="tool" className="scroll-mt-24 px-5 pb-4 sm:px-10 lg:px-16 xl:px-24">
            <div className="mx-auto w-full max-w-4xl">
              <KeywordChecker mode={tool} />
            </div>
          </section>
        ) : null}

        {/* Page-specific sections (template galleries, example grids, …) */}
        {children}

        {/* Prose */}
        {blocks.length ? (
          <section className="px-5 pb-8 pt-14 sm:px-10 lg:px-16 xl:px-24">
            <div className="mx-auto w-full max-w-3xl">
              <Blocks blocks={blocks} />
            </div>
          </section>
        ) : null}

        {faqs.length ? (
          <FaqSection faqs={faqs} heading={faqHeading || "Frequently asked questions"} />
        ) : null}

        {/* Internal-link rail — every page links out to at least two others. */}
        {related.length ? (
          <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
            <div className="landing-container">
              <h2 className="landing-heading font-outfit text-xl font-extrabold sm:text-2xl">
                Where to go next
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map(({ label, href, body }) => (
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
        ) : null}

        <CTABand />
      </main>
      <Footer />

      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}
      {howTo ? <JsonLd data={howToSchema(howTo)} /> : null}
      {PRODUCT_SLUGS.has(slug) ? (
        <JsonLd data={softwareApplicationSchema} />
      ) : null}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: breadcrumbName || h1, path: `/${slug}` },
        ])}
      />
    </div>
  );
}
