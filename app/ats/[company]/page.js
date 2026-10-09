import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import Blocks from "@/components/content/Blocks";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import { ATS_CHECKED_ON, ATS_COMPANIES, getAtsCompany } from "@/content/ats-companies";
import { UNIVERSAL_RULES } from "@/content/pages/ats";
import { getAtsVendor } from "@/lib/ats-detect";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

// dynamicParams stays on, like resume-examples: notFound() below 404s unknown slugs.

export function generateStaticParams() {
  return ATS_COMPANIES.map(({ slug }) => ({ company: slug }));
}

const checkedOn = new Date(`${ATS_CHECKED_ON}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const boardLabel = (url) => url.replace(/^https:\/\//, "").replace(/\/$/, "");

function faqsFor(company, vendor) {
  return [
    {
      q: `What ATS does ${company.name} use?`,
      a: `${company.name} posts its jobs on ${vendor.name}. Its job board is at ${boardLabel(company.evidenceUrl)}, which is on ${vendor.name}'s own website.`,
    },
    {
      q: `Does every ${company.name} job go through ${vendor.name}?`,
      a: `Not always. Large companies sometimes use a different system for some countries or for campus hiring. Paste the link of the exact job into the ATS lookup to check it.`,
    },
    {
      q: `How should I format my CV for ${vendor.name}?`,
      a: "Use one column, standard headings, real text rather than images, and the words the posting uses. The rules on this page apply to every applicant tracking system.",
    },
  ];
}

export async function generateMetadata({ params }) {
  const { company: slug } = await params;
  const company = getAtsCompany(slug);
  if (!company) return {};
  const vendor = getAtsVendor(company.ats);
  return pageMetadata({
    absoluteTitle: `Which ATS Does ${company.name} Use? | FitMyCV`,
    description: `${company.name} posts its jobs on ${vendor.name}. See the job board, and how to format your CV so ${vendor.name} reads it.`,
    path: `/ats/${company.slug}`,
    keywords: [
      `${company.name.toLowerCase()} ats`,
      `what ats does ${company.name.toLowerCase()} use`,
      `${company.name.toLowerCase()} applicant tracking system`,
      `${company.name.toLowerCase()} ${vendor.name.toLowerCase()}`,
    ],
  });
}

export default async function AtsCompanyPage({ params }) {
  const { company: slug } = await params;
  const company = getAtsCompany(slug);
  if (!company) notFound();
  const vendor = getAtsVendor(company.ats);
  const faqs = faqsFor(company, vendor);
  const peers = ATS_COMPANIES.filter((c) => c.ats === company.ats && c.slug !== slug).slice(0, 8);

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main dir="ltr">
        <section className="relative isolate overflow-hidden px-5 pb-12 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
            >
              <Link href="/" className="hover:text-[var(--landing-ink)]">
                Home
              </Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <Link href="/ats" className="hover:text-[var(--landing-ink)]">
                ATS lookup
              </Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <span className="text-[var(--landing-ink)]">{company.name}</span>
            </nav>

            <h1
              className="font-serif-display mt-6 font-normal leading-[1.04] tracking-tight text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}
            >
              Which ATS does {company.name} use?
            </h1>
            <p className="mt-6 text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
              {company.name} posts its jobs on <strong className="text-[var(--landing-ink)]">{vendor.name}</strong>.
            </p>
          </div>
        </section>

        <section className="px-5 pb-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
            <div className="landing-card rounded-2xl p-6">
              <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
                How we know
              </p>
              <p className="mt-3 text-base leading-8 text-[var(--landing-ink)]">
                {company.name}&apos;s job board is at{" "}
                <a
                  href={company.evidenceUrl}
                  rel="nofollow noopener"
                  target="_blank"
                  className="break-all font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
                >
                  {boardLabel(company.evidenceUrl)}
                </a>
                , on {vendor.name}&apos;s own website. We checked it on {checkedOn} and it had open jobs.
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--landing-ink-soft)]">
                Checking a different {company.name} job? Paste its link into the{" "}
                <Link href="/ats" className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4">
                  ATS lookup
                </Link>
                .
              </p>
            </div>

            <div>
              <Blocks
                blocks={[
                  { h2: `Format your CV so ${vendor.name} can read it` },
                  {
                    p: `${vendor.name} turns your CV file into text before anyone reads it. These rules keep that text in the right order.`,
                  },
                  { ul: UNIVERSAL_RULES },
                  {
                    p: `More detail is in [the ${vendor.guide === "/blog/ats-resume-guide" ? "ATS resume guide" : `${vendor.name} CV guide`}](${vendor.guide}).`,
                  },
                ]}
              />
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                  Applying to {company.name}?
                </p>
                <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                  Paste the job link and FitMyCV rewrites your own CV in one column, using that posting&apos;s words.
                </p>
              </div>
              <Link href="/tailor-cv-from-job-link" className="landing-primary-btn shrink-0 font-outfit text-sm">
                Tailor my CV
              </Link>
            </div>
          </div>
        </section>

        <FaqSection faqs={faqs} heading={`${company.name} ATS FAQ`} />

        {peers.length ? (
          <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
            <div className="landing-container">
              <h2 className="landing-section-title text-xl sm:text-2xl">Other companies on {vendor.name}</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {peers.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/ats/${c.slug}`}
                      className="inline-block rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3.5 py-1.5 text-sm font-bold text-[var(--landing-ink)] hover:border-[var(--landing-primary)]"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <CTABand />
      </main>
      <Footer />

      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "ATS lookup", path: "/ats" },
          { name: company.name, path: `/ats/${company.slug}` },
        ])}
      />
    </div>
  );
}
