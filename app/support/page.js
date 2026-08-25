import Link from "next/link";
import {
  EnvelopeSimpleIcon,
  LinkIcon,
  CreditCardIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
} from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Support",
  description:
    "Need help with FitMyCV? Get answers about tailoring your CV from a job link, billing, and your account — or email our support team directly.",
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    type: "website",
    url: "/support",
    siteName: "FitMyCV",
    title: "Support | FitMyCV",
    description:
      "Need help with FitMyCV? Get answers about tailoring your CV from a job link, billing, and your account — or email our support team directly.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "FitMyCV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support | FitMyCV",
    description:
      "Need help with FitMyCV? Get answers about tailoring your CV from a job link, billing, and your account — or email our support team directly.",
    images: ["/og-image.jpg"],
  },
};

const HELP_LINKS = [
  {
    icon: LinkIcon,
    title: "Tailoring your CV from a job link",
    body: "Learn how to paste a job link and get a CV and cover letter matched to the role.",
    href: "/tailor-cv-from-job-link",
    cta: "How it works",
  },
  {
    icon: CreditCardIcon,
    title: "Plans and billing",
    body: "See what Premium includes, how pricing works, and how to cancel anytime.",
    href: "/pricing",
    cta: "View pricing",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Free ATS resume checker",
    body: "Score your CV against a job description and see which required terms are missing.",
    href: "/ats-resume-checker",
    cta: "Check my CV",
  },
  {
    icon: BookOpenIcon,
    title: "Guides and resume examples",
    body: "How ATS parsing works, how to tailor a CV, and worked examples for ten roles.",
    href: "/blog",
    cta: "Read the guides",
  },
];

export default function SupportPage() {
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
            className="absolute inset-x-0 top-0 -z-10 h-[440px] bg-[radial-gradient(circle_at_50%_18%,oklch(0.92_0.06_174_/_0.72),transparent_28rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <div className="landing-eyebrow">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--landing-primary)]" />
              Support
            </div>
            <h1
              className="mt-6 max-w-3xl font-outfit font-extrabold leading-[1.02] tracking-normal text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(36px, 5.4vw, 64px)" }}
            >
              How can we help?
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              Browse common topics below, or reach our team directly — we usually
              reply within one business day.
            </p>
          </div>
        </section>

        {/* Contact card */}
        <section className="landing-section-tight">
          <div className="landing-container">
            <div className="landing-card-strong mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl p-8 text-center sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                <EnvelopeSimpleIcon size={24} aria-hidden="true" weight="bold" />
              </div>
              <h2 className="font-outfit text-2xl font-extrabold text-white">
                Email our support team
              </h2>
              <p className="max-w-md text-base leading-7 text-white/80">
                Questions about your account, billing, or a tailored CV? Send us a
                message and we&apos;ll get back to you.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="landing-secondary-btn mt-2 font-outfit text-base"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
        </section>

        {/* Help topics */}
        <section className="landing-section">
          <div className="landing-container flex flex-col items-center gap-4">
            <h2 className="landing-heading text-center font-outfit text-3xl font-extrabold sm:text-4xl">
              Popular help topics
            </h2>
          </div>

          <div className="landing-container mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {HELP_LINKS.map(({ icon: Icon, title, body, href, cta }) => (
              <Link
                key={href}
                href={href}
                className="landing-card group flex flex-col gap-4 rounded-2xl p-7 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                  <Icon size={24} aria-hidden="true" weight="bold" />
                </div>
                <h3 className="font-outfit text-xl font-extrabold text-[var(--landing-ink)]">
                  {title}
                </h3>
                <p className="landing-copy text-sm leading-7">{body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 font-outfit text-sm font-bold text-[var(--landing-primary-dark)]">
                  {cta}
                  <ArrowRightIcon
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
