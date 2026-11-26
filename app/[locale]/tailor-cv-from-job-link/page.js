import { getTranslations } from "next-intl/server";
import ProductActionLink from "@/components/landing/ProductActionLink";
import { ProductImage } from "@/components/landing/ProductPreview";
import { ProductStories } from "@/components/landing/PublicProductSections";
import Header from "@/components/Header";
import PublicHowItWorks from "@/components/landing/PublicHowItWorks";
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
      "ai resume tailor",
      "ai resume tailoring",
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
    image: "/social-preview.jpg?v=2",
  });
  return { ...base, alternates };
}

export default async function TailorCvFromJobLinkPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pages.tailorCvFromJobLink",
  });
  const content = await getContent(locale);
  const homePath = locale === "en" ? "/" : `/${locale}`;
  const pagePath = locale === "en" ? PATH : `/${locale}${PATH}`;

  return (
    <div className="landing-root public-redesign min-h-screen">
      <Header />
      <main id="main-content">
        <section className="public-section public-product-hero">
          <div className="public-container public-story">
            <div className="public-story-copy">
              <p className="public-eyebrow">{t("eyebrow")}</p>
              <h1 className="public-product-title">{t("titleStart")} <em>{t("titleHighlight")}</em></h1>
              <p className="public-copy">{t("intro")}</p>
              <ul className="public-benefits">{["link", "ats", "speed"].map((key) => <li key={key}>{t(`benefits.${key}.title`)}</li>)}</ul>
              <ProductActionLink product="tailor">{t("ctaPrimary")}</ProductActionLink>
            </div>
            <ProductImage priority />
          </div>
        </section>
        <ProductStories tailorOnly />

        <PublicHowItWorks />

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
