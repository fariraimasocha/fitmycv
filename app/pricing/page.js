import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Pricing from "@/components/landing/Pricing";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Pricing",
  description:
    "FitMyCV Premium is $16.99 lifetime or $6.99/month. Tailor and download unlimited CVs and cover letters from any job link, with ATS scoring and PDF export.",
  keywords: [
    "fitmycv pricing",
    "cv tailoring tool price",
    "ai resume builder pricing",
    "tailor cv from job link cost",
    "ats resume optimizer pricing",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    type: "website",
    url: "/pricing",
    siteName: "FitMyCV",
    title: "Pricing — Tailored CVs From Any Job Link | FitMyCV",
    description:
      "Simple, transparent pricing. Lifetime access for $16.99 or $6.99/month for unlimited tailored CVs, cover letters, ATS scoring, and PDF export.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FitMyCV pricing — tailor your CV from any job link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Tailored CVs From Any Job Link | FitMyCV",
    description:
      "Premium is $16.99 lifetime or $6.99/month for unlimited tailored CVs, cover letters, ATS scoring, and PDF export. Cancel monthly anytime.",
    images: ["/og-image.jpg"],
  },
};

const FAQS = [
  {
    q: "How much does FitMyCV cost?",
    a: "FitMyCV Premium is $16.99 for lifetime access (pay once, keep it forever) or $6.99 per month with no contracts.",
  },
  {
    q: "What do I get with Premium?",
    a: "Premium unlocks unlimited tailored CVs and cover letters from any job link, a match score and ATS score on every CV, interview prep with company research and outreach, daily job matches by email, and PDF export on everything.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Monthly subscriptions can be canceled anytime — you keep access until the end of your billing period. Lifetime purchases are one-time and non-refundable.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Payments are processed securely through Polar, which accepts all major credit and debit cards.",
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

export default function PricingPage() {
  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-5 pb-12 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(circle_at_50%_18%,oklch(0.92_0.06_174_/_0.72),transparent_30rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <div className="landing-eyebrow">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--landing-primary)]" />
              Pricing
            </div>
            <h1
              className="mt-6 max-w-4xl font-outfit font-extrabold leading-[1.02] tracking-normal text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(36px, 5.4vw, 68px)" }}
            >
              One plan. Unlimited tailored applications.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              Tailor your CV and cover letter to every job link you paste,
              download them as clean PDFs, and track your match and ATS scores —
              all for one simple price.
            </p>
          </div>
        </section>

        <Pricing />

        {/* FAQ */}
        <section className="landing-section">
          <div className="landing-container flex flex-col items-center gap-4">
            <h2 className="landing-heading text-center font-outfit text-3xl font-extrabold sm:text-4xl">
              Pricing FAQ
            </h2>
            <p className="landing-copy text-center text-base">
              Everything you need to know about FitMyCV Premium.
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

      <JsonLd data={faqJsonLd} />
    </div>
  );
}
