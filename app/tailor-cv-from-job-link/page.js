import Link from "next/link";
import {
  ArrowRightIcon,
  LinkIcon,
  SealCheckIcon,
  LightningIcon,
} from "@phosphor-icons/react/dist/ssr";

import Header from "@/components/Header";
import HowItWorks from "@/components/landing/HowItWorks";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";
import TrustSignals from "@/components/landing/TrustSignals";
import Blocks from "@/components/content/Blocks";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import { BLOCKS, FAQS, HOW_TO } from "@/content/pages/tailor-cv-from-job-link";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  pageMetadata,
} from "@/lib/seo";
import { softwareApplicationSchema } from "@/lib/structured-data";

export const metadata = pageMetadata({
  absoluteTitle: "Tailor Your CV From a Job Link (2026) | FitMyCV",
  description:
    "Tailor your resume to a job description with free AI: paste any job link from LinkedIn, Indeed, Glassdoor or a careers page, or paste the JD text, and get a tailored CV and cover letter.",
  path: "/tailor-cv-from-job-link",
  keywords: [
    "tailor cv from job link",
    "paste job link to tailor resume",
    "tailor resume to job description ai free",
    "ai resume builder based on job description",
    "tailor resume from job url",
    "tailored cv from job posting url",
    "ai resume from job link",
    "job specific resume",
    "tailor resume from linkedin job link",
    "indeed resume matcher",
  ],
  image: "/og-image.jpg",
});

const BENEFITS = [
  {
    icon: LinkIcon,
    title: "Paste a link, not a wall of text",
    body: "Drop in a job URL from LinkedIn, Indeed, Glassdoor, or any board. FitMyCV reads the role and pulls out the requirements, skills, and keywords, including the sections hidden behind a 'see more' toggle.",
  },
  {
    icon: SealCheckIcon,
    title: "Built to pass ATS filters",
    body: "Your CV is rewritten to mirror the exact language in the listing, then exported as a single-column, text-based PDF that applicant tracking systems parse the way you wrote it.",
  },
  {
    icon: LightningIcon,
    title: "CV + cover letter in seconds",
    body: "Both documents come from the same parse of the same posting, so they reinforce each other. Edit either inline, then export to recruiter-ready PDFs with one click.",
  },
];

const SUPPORTED_BOARDS = ["LinkedIn", "Indeed", "Glassdoor", "Company sites"];

export default function TailorCvFromJobLinkPage() {
  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_50%_18%,oklch(0.94_0.02_84_/_0.7),transparent_34rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <div className="landing-eyebrow">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--landing-primary)]" />
              AI CV tailoring
            </div>

            <h1
              className="font-serif-display mt-6 max-w-5xl font-normal leading-[0.98] tracking-normal text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(38px, 6vw, 78px)" }}
            >
              Paste a job URL,{" "}
              <span className="relative inline-block px-2">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[0.07em] -z-10 h-[0.32em] -rotate-1 bg-[oklch(0.9_0.04_45_/_0.45)]"
                />
                tailor your CV to it.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              Tailor your resume to a job description with AI: paste a job
              link from LinkedIn, Indeed, or any board — or paste the posting
              text — and FitMyCV rewrites your CV and cover letter to match
              the role, keyword for keyword.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth"
                className="landing-primary-btn group min-w-[210px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
              >
                Tailor my CV
                <ArrowRightIcon
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/ats-resume-checker"
                className="landing-secondary-btn min-w-[190px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
              >
                Score my CV first
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--landing-ink-soft)]">
                Works with
              </span>
              {SUPPORTED_BOARDS.map((board) => (
                <span
                  key={board}
                  className="rounded-full border border-[var(--landing-line)] bg-[oklch(0.985_0.012_84)] px-3 py-1 text-xs font-bold text-[var(--landing-ink-soft)]"
                >
                  {board}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="landing-section">
          <div className="landing-container flex flex-col items-center gap-4">
            <h2 className="landing-heading text-center font-outfit text-3xl font-extrabold sm:text-4xl">
              One job link. A CV built for that role.
            </h2>
            <p className="landing-copy text-center text-base">
              Stop sending the same generic resume to every posting. FitMyCV
              tailors a fresh CV from each job link you paste.
            </p>
          </div>

          <div className="landing-container mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="landing-card flex flex-col gap-4 rounded-2xl p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                  <Icon size={24} aria-hidden="true" weight="bold" />
                </div>
                <h3 className="font-outfit text-xl font-extrabold text-[var(--landing-ink)]">
                  {title}
                </h3>
                <p className="landing-copy text-sm leading-7">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <HowItWorks />

        {/* Long-form body */}
        <section className="px-5 pb-10 pt-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-3xl">
            <Blocks blocks={BLOCKS} />
          </div>
        </section>

        <TrustSignals />

        <FaqSection
          faqs={FAQS}
          heading="Tailoring your CV from a job link: FAQ"
          intro="Everything about turning a job link into a tailored application."
        />

        <CTABand />
      </main>
      <Footer />

      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd data={howToSchema(HOW_TO)} />
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          {
            name: "Tailor CV from a job link",
            path: "/tailor-cv-from-job-link",
          },
        ])}
      />
    </div>
  );
}
