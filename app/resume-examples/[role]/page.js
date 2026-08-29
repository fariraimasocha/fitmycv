import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import { RESUME_EXAMPLES, getResumeExample } from "@/content/resume-examples";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return RESUME_EXAMPLES.map(({ slug }) => ({ role: slug }));
}

function faqsFor({ role }) {
  return [
    {
      q: `What should a ${role.toLowerCase()} resume include?`,
      a: `A three-line summary naming the role and one strong result, reverse-chronological experience with achievement bullets that each carry a number, a grouped skills section, and education or registrations. Everything on the page should answer the posting you are applying to.`,
    },
    {
      q: `How long should a ${role.toLowerCase()} CV be?`,
      a: "One page under roughly eight years of experience and two beyond that. Relevance matters more than length. A second page of unrelated history is worse than a single page that is entirely on target.",
    },
    {
      q: `What keywords do ${role.toLowerCase()} job postings use?`,
      a: "Take them from the specific posting rather than from a generic list. Recruiters search literal strings and different employers use different vocabulary for the same work. The keywords listed on this page are a starting point, not a substitute for reading the advert.",
    },
    {
      q: "Can I copy this resume example directly?",
      a: "Use the structure, not the sentences. A CV that is a copied example describes someone else's career, and interviews expose that immediately. Copy the shape of the bullets (verb, specific action, measurable result) and fill them with your own work.",
    },
  ];
}

export async function generateMetadata({ params }) {
  const { role: slug } = await params;
  const example = getResumeExample(slug);
  if (!example) return {};

  // Role names vary from "Nurse" to "Customer Service Representative", so the
  // brand suffix only fits on some. Append it when the title stays under 60.
  const baseTitle =
    example.seoTitle || `${example.role} Resume Example (2026)`;

  return pageMetadata({
    absoluteTitle:
      baseTitle.length + " | FitMyCV".length <= 60
        ? `${baseTitle} | FitMyCV`
        : baseTitle,
    description:
      example.seoDescription ||
      `A ${example.role.toLowerCase()} resume example with a worked summary, before-and-after bullets, a skills section, and the keywords that matter.`,
    path: `/resume-examples/${example.slug}`,
    keywords: example.seoKeywords || [
      `${example.role.toLowerCase()} resume example`,
      `${example.role.toLowerCase()} cv example`,
      `${example.role.toLowerCase()} resume`,
      `${example.role.toLowerCase()} cv template`,
      `how to write a ${example.role.toLowerCase()} cv`,
    ],
  });
}

export default async function ResumeExamplePage({ params }) {
  const { role: slug } = await params;
  const example = getResumeExample(slug);
  if (!example) notFound();

  const faqs = [...(example.faqs || []), ...faqsFor(example)];
  const others = RESUME_EXAMPLES.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden px-5 pb-12 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(circle_at_50%_14%,oklch(0.94_0.02_84_/_0.7),transparent_30rem)]"
          />
          <div className="mx-auto w-full max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[var(--landing-ink-soft)]"
            >
              <Link href="/" className="hover:text-[var(--landing-ink)]">
                Home
              </Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <Link
                href="/resume-examples"
                className="hover:text-[var(--landing-ink)]"
              >
                Resume examples
              </Link>
              <CaretRightIcon size={11} aria-hidden="true" />
              <span className="text-[var(--landing-ink)]">{example.role}</span>
            </nav>

            <h1
              className="font-serif-display mt-6 font-normal leading-[1.04] tracking-tight text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(32px, 4.4vw, 52px)" }}
            >
              {example.role} resume example
            </h1>
            <p className="mt-6 text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
              {example.intro}
            </p>
          </div>
        </section>

        <section className="px-5 pb-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
            {/* Summary */}
            <div>
              <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
                The professional summary
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                Three lines, written last. Name the target title, the level and
                domain, and one result strong enough to earn the next paragraph.
              </p>
              <blockquote className="landing-card mt-5 rounded-2xl border-l-4 border-l-[var(--landing-primary)] p-6 font-mono text-sm leading-7 text-[var(--landing-ink)]">
                {example.summary}
              </blockquote>
            </div>

            {/* Bullets */}
            <div>
              <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
                Experience bullets, rewritten
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                Same work, described so a hiring manager can tell what you
                actually did. Every rewrite follows the same shape: verb,
                specific action, measurable result.
              </p>

              <div className="mt-6 flex flex-col gap-5">
                {example.bullets.map(({ before, after }) => (
                  <div key={before} className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[oklch(0.62_0.19_24_/_0.3)] bg-[oklch(0.62_0.19_24_/_0.06)] p-5">
                      <div className="flex items-center gap-2">
                        <XIcon
                          size={15}
                          weight="bold"
                          aria-hidden="true"
                          className="text-[var(--landing-coral)]"
                        />
                        <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-coral)]">
                          Before
                        </span>
                      </div>
                      <p className="mt-3 font-mono text-sm leading-7 text-[var(--landing-ink)]">
                        {before}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[oklch(0.56_0.13_150_/_0.32)] bg-[oklch(0.56_0.13_150_/_0.07)] p-5">
                      <div className="flex items-center gap-2">
                        <CheckIcon
                          size={15}
                          weight="bold"
                          aria-hidden="true"
                          className="text-[var(--landing-success)]"
                        />
                        <span className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-success)]">
                          After
                        </span>
                      </div>
                      <p className="mt-3 font-mono text-sm leading-7 text-[var(--landing-ink)]">
                        {after}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
                The skills section
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                Grouped rather than one long comma-separated wall. Everything
                here should also appear inside a bullet above, where it has
                evidence attached.
              </p>
              <ul className="landing-card mt-5 flex flex-col gap-3 rounded-2xl p-6">
                {example.skills.map((line) => (
                  <li
                    key={line}
                    className="font-mono text-sm leading-7 text-[var(--landing-ink)]"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div>
              <h2 className="landing-heading font-outfit text-2xl font-extrabold sm:text-3xl">
                Keywords these postings lean on
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                A starting point, not a substitute for reading the advert. Take
                the exact vocabulary from the posting in front of you. The{" "}
                <Link
                  href="/free-ats-keyword-checker"
                  className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
                >
                  free keyword checker
                </Link>{" "}
                ranks them for you in a few seconds.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {example.keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3.5 py-1.5 text-xs font-bold text-[var(--landing-ink)]"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip */}
            <aside className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-6">
              <p className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                The one thing most {example.role.toLowerCase()} CVs miss
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--landing-ink-soft)]">
                {example.tip}
              </p>
            </aside>

            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
                  Tailor this for the job you are applying to
                </p>
                <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--landing-ink-soft)]">
                  Paste the posting URL and FitMyCV rewrites your own CV against
                  it: your experience, that role&apos;s vocabulary.
                </p>
              </div>
              <Link
                href="/tailor-cv-from-job-link"
                className="landing-primary-btn shrink-0 font-outfit text-sm"
              >
                Tailor my CV
              </Link>
            </div>
          </div>
        </section>

        <FaqSection
          faqs={faqs}
          heading={`${example.role} CV FAQ`}
        />

        <section className="landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
          <div className="landing-container">
            <h2 className="landing-heading font-outfit text-xl font-extrabold sm:text-2xl">
              More resume examples
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/resume-examples/${item.slug}`}
                  className="landing-card flex flex-col gap-2 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                    {item.role}
                  </span>
                  <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                    {item.blurb}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />

      <JsonLd
        data={articleSchema({
          headline: `${example.role} resume example`,
          description:
            example.seoDescription ||
            `A ${example.role.toLowerCase()} resume example with a worked summary, before-and-after bullets, a skills section, and the keywords that matter.`,
          path: `/resume-examples/${example.slug}`,
          datePublished: example.date || "2026-07-29",
          dateModified: example.updated || example.date || "2026-08-28",
        })}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resume examples", path: "/resume-examples" },
          { name: example.role, path: `/resume-examples/${example.slug}` },
        ])}
      />
    </div>
  );
}
