import Link from "next/link";
import { ArrowRightIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import Blocks from "@/components/content/Blocks";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import { RESUME_EXAMPLES } from "@/content/resume-examples";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

// Shared shell for /resume-examples and /cv-examples. Both list the same role
// pages, which live under /resume-examples/<role> so there is exactly one
// canonical URL per example.
export default function ExamplesHub({ hub }) {
  const { slug, eyebrow, h1, lede, blocks, faqs, breadcrumbName } = hub;

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: h1,
    itemListElement: RESUME_EXAMPLES.map((example, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${example.role} resume example`,
      url: `${SITE_URL}/resume-examples/${example.slug}`,
    })),
  };

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden px-5 pb-14 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_50%_16%,oklch(0.92_0.06_174_/_0.68),transparent_32rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
            >
              <Link href="/" className="hover:text-[var(--landing-ink)]">
                Home
              </Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <span className="text-[var(--landing-ink)]">{breadcrumbName}</span>
            </nav>

            <span className="landing-eyebrow">
              <span
                className="h-2 w-2 rounded-full bg-[var(--landing-primary)]"
                aria-hidden="true"
              />
              {eyebrow}
            </span>

            <h1
              className="mt-6 max-w-4xl font-outfit font-extrabold leading-[1.02] tracking-tight text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(36px, 5.2vw, 64px)" }}
            >
              {h1}
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
              {lede}
            </p>
          </div>
        </section>

        <section className="px-5 pb-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="landing-container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RESUME_EXAMPLES.map((example) => (
              <Link
                key={example.slug}
                href={`/resume-examples/${example.slug}`}
                className="landing-card group flex flex-col gap-3 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                  {example.seniority}
                </span>
                <span className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                  {example.role}
                </span>
                <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {example.blurb}
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-primary-dark)]">
                  See the example
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
        </section>

        <section className="px-5 pb-8 pt-14 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-3xl">
            <Blocks blocks={blocks} />
          </div>
        </section>

        <FaqSection faqs={faqs} />
        <CTABand />
      </main>
      <Footer />

      <JsonLd data={listSchema} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: breadcrumbName, path: `/${slug}` },
        ])}
      />
    </div>
  );
}
