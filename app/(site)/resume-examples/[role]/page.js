import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRightIcon, CheckIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import { RESUME_EXAMPLES, getResumeExample } from "@/content/resume-examples";
import { keywordsPageFor } from "@/content/resume-keywords";
import { getExampleCvs } from "@/content/example-cvs";
import { ResumeTemplate } from "@/components/ResumePreview";
import { scoreResumeJobMatch } from "@/lib/resume-job-match";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  pageMetadata,
} from "@/lib/seo";

// dynamicParams stays on: with it off, an unknown param made Next throw an
// internal NoFallbackError into the logs. The notFound() below 404s either way.

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

// The text the match checker would read off the CV.
function cvText(cv) {
  return [
    cv.basics.label,
    cv.basics.summary,
    ...cv.work.flatMap((w) => [w.position, w.company, w.description]),
    ...cv.skills.flatMap((s) => [s.category, ...s.skills]),
  ].join("\n");
}

// The CV stays white in both themes: it is a document, not page chrome.
function CvDocument({ data, template, label }) {
  return (
    <figure
      aria-label={label}
      className="overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-white text-gray-900 shadow-sm"
    >
      <ResumeTemplate data={data} template={template} />
    </figure>
  );
}

function FullCvs({ cvs }) {
  return cvs.map((cv) => (
    <div key={cv.id} id={cv.id} className="scroll-mt-28">
      <h2 className="landing-section-title text-2xl sm:text-3xl">{cv.heading}</h2>
      <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">{cv.note}</p>
      <div className="mt-5">
        <CvDocument data={cv.data} template={cv.template} label={cv.heading} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={`/auth?template=${cv.template}`} className="landing-primary-btn font-outfit text-sm">
          Build my CV with this template
        </Link>
        <Link
          href="/tailor-cv-from-job-link"
          className="text-sm font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
        >
          Or tailor the CV you have
        </Link>
      </div>
    </div>
  ));
}

function TailoringDemo({ tailoring, role }) {
  const { posting, before, after, template, changes } = tailoring;
  const scoreBefore = scoreResumeJobMatch(posting.text, cvText(before));
  const scoreAfter = scoreResumeJobMatch(posting.text, cvText(after));
  const missingAfter = new Set(scoreAfter.keywords.missing.map((k) => k.term));
  const gained = scoreBefore.keywords.missing.map((k) => k.term).filter((t) => !missingAfter.has(t));

  const scores = [
    { label: "Match score", before: scoreBefore.overall, after: scoreAfter.overall },
    { label: "Posting keywords covered", before: `${scoreBefore.keywords.score}%`, after: `${scoreAfter.keywords.score}%` },
  ];

  return (
    <div id="tailored" className="scroll-mt-28">
      <h2 className="landing-section-title text-2xl sm:text-3xl">
        The same CV, tailored to a job ad
      </h2>
      <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
        One CV does not fit every posting. Below is the first {role.toLowerCase()} CV on
        this page, tailored to the job ad underneath. The facts stay the same. The words
        and the order change to match what this employer asked for.
      </p>

      <div className="landing-card mt-6 rounded-2xl p-6">
        <p className="font-outfit text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--landing-ink-soft)]">
          Example job ad, written for this page
        </p>
        <p className="mt-2 font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
          {posting.title}, {posting.company}
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {posting.asks.map((ask) => (
            <li key={ask} className="flex gap-2 text-sm leading-6 text-[var(--landing-ink)]">
              <CheckIcon size={15} weight="bold" aria-hidden="true" className="mt-1 shrink-0 text-[var(--landing-primary)]" />
              {ask}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {scores.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-5">
            <p className="text-sm font-bold text-[var(--landing-ink-soft)]">{s.label}</p>
            <p className="mt-2 font-outfit text-3xl font-extrabold tabular-nums text-[var(--landing-ink)]">
              {s.before}
              <span className="mx-2 text-lg text-[var(--landing-ink-soft)]" aria-label="to">
                to
              </span>
              <span className="text-[var(--landing-success)]">{s.after}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--landing-ink-soft)]">
        Both scores come from our free{" "}
        <Link
          href="/resume-job-match-checker"
          className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
        >
          resume job match checker
        </Link>
        , run on this ad.
        {gained.length ? ` Posting words the tailored CV now uses: ${gained.join(", ")}.` : ""}
      </p>

      <h3 className="mt-8 font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
        What changed
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {changes.map((change) => (
          <li key={change} className="flex gap-2 text-base leading-7 text-[var(--landing-ink-soft)]">
            <CheckIcon size={15} weight="bold" aria-hidden="true" className="mt-1.5 shrink-0 text-[var(--landing-success)]" />
            {change}
          </li>
        ))}
      </ul>

      <h3 className="mt-8 font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
        The tailored CV
      </h3>
      <div className="mt-4">
        <CvDocument data={after} template={template} label={`${role} CV tailored to ${posting.title}`} />
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
            Do this with your own CV
          </p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--landing-ink-soft)]">
            Paste a job link. FitMyCV rewrites your CV in that posting&apos;s words,
            working only from what your CV already says.
          </p>
        </div>
        <Link href="/tailor-cv-from-job-link" className="landing-primary-btn shrink-0 font-outfit text-sm">
          Tailor my CV to a job
        </Link>
      </div>
    </div>
  );
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
  setRequestLocale("en");
  const { role: slug } = await params;
  const example = getResumeExample(slug);
  const keywordsPage = example ? keywordsPageFor(example.slug) : null;
  if (!example) notFound();
  const full = getExampleCvs(example.slug);
  const updated = example.updated
    ? new Date(`${example.updated}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  const faqs = [...(example.faqs || []), ...faqsFor(example)];
  const others = RESUME_EXAMPLES.filter((item) => item.slug !== slug).slice(0, 3);

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
              {full ? `${example.role} CV examples` : `${example.role} resume example`}
            </h1>
            <p className="mt-6 text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
              {example.intro}
            </p>
            {updated ? (
              <p className="mt-4 text-sm font-bold text-[var(--landing-ink-soft)]">
                Updated {updated}
              </p>
            ) : null}
            {full ? (
              <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
                {[...full.cvs.map((cv) => [cv.id, cv.heading]), ...(full.tailoring ? [["tailored", "Tailored to a job ad"]] : [])].map(
                  ([id, label]) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className="rounded-full border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-3.5 py-1.5 text-xs font-bold text-[var(--landing-ink)] hover:border-[var(--landing-ink-soft)]"
                    >
                      {label}
                    </a>
                  )
                )}
              </nav>
            ) : null}
          </div>
        </section>

        <section className="px-5 pb-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
            {full ? <FullCvs cvs={full.cvs} /> : null}
            {full?.tailoring ? <TailoringDemo tailoring={full.tailoring} role={example.role} /> : null}

            {/* Summary */}
            <div>
              <h2 className="landing-section-title text-2xl sm:text-3xl">
                The professional summary
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--landing-ink-soft)]">
                Three lines, written last. Name the target title, the level and
                domain, and one result strong enough to earn the next paragraph.
              </p>
              <blockquote className="landing-card mt-5 rounded-2xl border-s-4 border-s-[var(--landing-primary)] p-6 font-mono text-sm leading-7 text-[var(--landing-ink)]">
                {example.summary}
              </blockquote>
            </div>

            {/* Bullets */}
            <div>
              <h2 className="landing-section-title text-2xl sm:text-3xl">
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
              <h2 className="landing-section-title text-2xl sm:text-3xl">
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
              <h2 className="landing-section-title text-2xl sm:text-3xl">
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
              {keywordsPage ? (
                <p className="mt-5 text-base leading-8 text-[var(--landing-ink-soft)]">
                  A longer list, grouped by where each term belongs on the page,
                  is on{" "}
                  <Link
                    href={`/${keywordsPage.slug}`}
                    className="font-semibold text-[var(--landing-primary-dark)] underline underline-offset-4"
                  >
                    {keywordsPage.role.toLowerCase()} resume keywords
                  </Link>
                  .
                </p>
              ) : null}
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
            <h2 className="landing-section-title text-xl sm:text-2xl">
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
