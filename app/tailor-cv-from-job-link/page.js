import Link from "next/link";
import {
  ArrowRightIcon,
  LinkIcon,
  SealCheckIcon,
  LightningIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import HowItWorks from "@/components/landing/HowItWorks";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Tailor Your CV From a Job Link",
  description:
    "Paste any job link and FitMyCV tailors your CV and cover letter to the role in seconds. AI scrapes the listing, matches ATS keywords, and exports to PDF — works with LinkedIn, Indeed, Glassdoor and more.",
  keywords: [
    "tailor cv from job link",
    "tailor resume from job url",
    "paste job link to tailor resume",
    "tailored cv from job posting url",
    "ai resume from job link",
  ],
  alternates: {
    canonical: "/tailor-cv-from-job-link",
  },
  openGraph: {
    type: "website",
    url: "/tailor-cv-from-job-link",
    siteName: "FitMyCV",
    title: "Tailor Your CV From a Job Link in Seconds | FitMyCV",
    description:
      "Paste any job link and get a tailored CV and cover letter in seconds — AI keyword matching, ATS optimization, and one-click PDF export.",
    images: [
      {
        url: "/hero.png",
        width: 3024,
        height: 1714,
        alt: "Tailor your CV from any job link with FitMyCV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailor Your CV From a Job Link in Seconds | FitMyCV",
    description:
      "Paste any job link and get a tailored CV and cover letter in seconds — AI keyword matching, ATS optimization, and one-click PDF export.",
    images: ["/hero.png"],
  },
};

const BENEFITS = [
  {
    icon: LinkIcon,
    title: "Paste a link, not a wall of text",
    body: "Drop in a job URL from LinkedIn, Indeed, Glassdoor, or any board. FitMyCV scrapes the role and pulls out the requirements, skills, and keywords for you.",
  },
  {
    icon: SealCheckIcon,
    title: "Built to pass ATS filters",
    body: "Your CV is rewritten to mirror the exact language in the listing, so applicant tracking systems match you to the role instead of filtering you out.",
  },
  {
    icon: LightningIcon,
    title: "CV + cover letter in seconds",
    body: "Get a tailored resume and a matching cover letter in one pass, then export both to clean, recruiter-ready PDFs with a single click.",
  },
];

const FAQS = [
  {
    q: "How do I tailor my CV from a job link?",
    a: "Sign in, upload your reference CV once, then paste the job link you want to apply for. FitMyCV scrapes the listing, matches it against your experience, and rewrites your CV and cover letter to fit the role — usually in under a minute.",
  },
  {
    q: "Which job boards work with a pasted link?",
    a: "FitMyCV works with links from LinkedIn, Indeed, Glassdoor, and most major job boards and company career pages. Paste the URL of the posting and the requirements are detected automatically.",
  },
  {
    q: "Will tailoring my CV from the job link help me pass ATS?",
    a: "Yes. The tailored CV mirrors the keywords and phrasing from the job posting, which is exactly what applicant tracking systems scan for. That keyword match is one of the biggest factors in getting past the first automated screen.",
  },
  {
    q: "Do I get a cover letter as well?",
    a: "Every tailored CV comes with a matching cover letter generated from the same job link and your experience, so your whole application is aligned to the role. Both export to PDF.",
  },
  {
    q: "How long does it take?",
    a: "From pasting the job link to a polished, downloadable CV takes roughly 30 to 60 seconds.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

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
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.985_0.012_84)_72%,oklch(0.965_0.02_84)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_50%_18%,oklch(0.92_0.06_174_/_0.72),transparent_34rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <div className="landing-eyebrow">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--landing-primary)]" />
              AI CV tailoring
            </div>

            <h1
              className="mt-6 max-w-5xl font-outfit font-extrabold leading-[0.98] tracking-normal text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(40px, 6.6vw, 84px)" }}
            >
              Tailor your CV{" "}
              <span className="relative inline-block px-2">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[0.07em] -z-10 h-[0.32em] -rotate-1 bg-[oklch(0.87_0.071_313_/_0.72)]"
                />
                from any job link.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              Paste a job link from LinkedIn, Indeed, or any board and FitMyCV
              rewrites your resume and cover letter to match the role — keyword
              for keyword, ready in seconds.
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
                href="#how-it-works"
                className="landing-secondary-btn min-w-[190px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
              >
                See how it works
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

        {/* FAQ */}
        <section className="landing-section landing-muted-band">
          <div className="landing-container flex flex-col items-center gap-4">
            <h2 className="landing-heading text-center font-outfit text-3xl font-extrabold sm:text-4xl">
              Tailoring your CV from a job link — FAQ
            </h2>
            <p className="landing-copy text-center text-base">
              Everything you need to know about turning a job link into a
              tailored application.
            </p>
          </div>

          <div className="landing-container mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3">
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="landing-card group rounded-2xl px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                  {q}
                  <PlusIcon
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-[var(--landing-primary-dark)] transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="landing-copy mt-3 text-sm leading-7">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
