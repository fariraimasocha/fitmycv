import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
  localeAlternates,
  pageMetadata,
} from "@/lib/seo";
import { softwareApplicationSchema } from "@/lib/structured-data";

const PATH = "/tailor-cv-from-job-link";

// The long-form body (FAQs, how-to steps, article blocks) is too big for the
// messages that ship to every client page, so each language keeps its own file
// and only this server page loads it. English reads the original content file.
async function getContent(locale) {
  if (locale === "en") return { BLOCKS, FAQS, HOW_TO };
  return (await import(`../../../messages/${locale}/tailor-cv-from-job-link.json`)).default;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.tailorCvFromJobLink.meta",
  });
  const alternates = localeAlternates(locale, PATH);
  const base = pageMetadata({
    absoluteTitle: t("title"),
    description: t("description"),
    path: alternates.canonical,
    keywords: [
      "tailor cv to job description",
      "tailor cv to job description in seconds",
      "tailor resume to job description",
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
    image: "/social-preview.jpg",
  });
  return { ...base, alternates };
}

const BENEFITS = [
  { key: "link", icon: LinkIcon },
  { key: "ats", icon: SealCheckIcon },
  { key: "speed", icon: LightningIcon },
];

const SUPPORTED_BOARDS = ["LinkedIn", "Indeed", "Glassdoor"];

export default async function TailorCvFromJobLinkPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.tailorCvFromJobLink",
  });
  const content = await getContent(locale);
  const boards = [...SUPPORTED_BOARDS, t("companySites")];
  const homePath = locale === "en" ? "/" : `/${locale}`;
  const pagePath = locale === "en" ? PATH : `/${locale}${PATH}`;

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
              {t("eyebrow")}
            </div>

            <h1
              className="font-serif-display mt-6 max-w-5xl font-normal leading-[0.98] tracking-normal text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(38px, 6vw, 78px)" }}
            >
              {t("titleStart")}{" "}
              <span className="relative inline-block px-2">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[0.07em] -z-10 h-[0.32em] -rotate-1 bg-[oklch(0.9_0.04_45_/_0.45)]"
                />
                {t("titleHighlight")}
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              {t("intro")}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth"
                className="landing-primary-btn group min-w-[210px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
              >
                {t("ctaPrimary")}
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
                {t("ctaSecondary")}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--landing-ink-soft)]">
                {t("worksWith")}
              </span>
              {boards.map((board) => (
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
              {t("benefitsTitle")}
            </h2>
            <p className="landing-copy text-center text-base">
              {t("benefitsIntro")}
            </p>
          </div>

          <div className="landing-container mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="landing-card flex flex-col gap-4 rounded-2xl p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                  <Icon size={24} aria-hidden="true" weight="bold" />
                </div>
                <h3 className="font-outfit text-xl font-extrabold text-[var(--landing-ink)]">
                  {t(`benefits.${key}.title`)}
                </h3>
                <p className="landing-copy text-sm leading-7">
                  {t(`benefits.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <HowItWorks />

        {/* Long-form body */}
        <section className="px-5 pb-10 pt-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-3xl">
            <Blocks blocks={content.BLOCKS} />
          </div>
        </section>

        <TrustSignals />

        <FaqSection
          faqs={content.FAQS}
          heading={t("faqHeading")}
          intro={t("faqIntro")}
        />

        <CTABand />
      </main>
      <Footer />

      <JsonLd data={faqSchema(content.FAQS)} />
      <JsonLd data={howToSchema(content.HOW_TO)} />
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: t("breadcrumbHome"), path: homePath },
          { name: t("breadcrumbPage"), path: pagePath },
        ])}
      />
    </div>
  );
}
