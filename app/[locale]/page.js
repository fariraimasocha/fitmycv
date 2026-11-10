import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import StatsStrip from "@/components/landing/StatsStrip";
import ProductSuite from "@/components/landing/ProductSuite";
import TheProblem from "@/components/landing/TheProblem";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import TemplateStrip from "@/components/landing/TemplateStrip";
import Testimonial from "@/components/landing/Testimonial";
import TrustSignals from "@/components/landing/TrustSignals";
import Pricing from "@/components/landing/Pricing";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";
import StickyCtaBar from "@/components/landing/StickyCtaBar";
import FounderFaqSection from "@/components/landing/FounderFaqSection";
import JsonLd from "@/components/JsonLd";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { faqSchema, howToSchema, localeAlternates } from "@/lib/seo";
import {
  getSoftwareApplicationSchema,
  webPageSchema,
} from "@/lib/structured-data";
import { getHomeFaqs, getHomeSteps } from "@/content/pages/home";
import { getServerPricing } from "@/lib/server-pricing";
import { getLandingStats } from "@/lib/landing-stats";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.meta" });
  const alternates = localeAlternates(locale, "");
  const image = {
    url: "/social-preview.jpg?v=2",
    width: 1200,
    height: 630,
    alt: t("ogAlt"),
  };

  return {
    title: {
      absolute: t("title"),
    },
    description: t("description"),
    alternates,
    openGraph: {
      type: "website",
      url: `${SITE_URL}${alternates.canonical}`,
      title: t("ogTitle"),
      description: t("description"),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("description"),
      images: [image],
    },
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [{ pricing }, t, stats] = await Promise.all([
    getServerPricing(),
    getTranslations({ locale, namespace: "landing.meta" }),
    getLandingStats(),
  ]);

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <Hero lifetimePrice={pricing.lifetime.price} userCount={stats.users} />
        {/* Proof straight under the hero, then problem, method, product. */}
        <StatsStrip users={stats.users} tailored={stats.tailored} />
        <TheProblem />
        <HowItWorks lifetimePrice={pricing.lifetime.price} />
        <ProductSuite />
        <UseCases />
        <Testimonial />
        <TemplateStrip />
        <TrustSignals />
        <Pricing />
        <FounderFaqSection />
        <CTABand lifetimePrice={pricing.lifetime.price} />
      </main>
      <StickyCtaBar />
      <Footer />
      <JsonLd
        data={{
          ...webPageSchema({
            name: t("schemaName"),
            description: t("description"),
            path: localeAlternates(locale, "").canonical,
          }),
          inLanguage: locale,
        }}
      />
      <JsonLd data={faqSchema(getHomeFaqs(locale))} />
      <JsonLd
        data={howToSchema({
          name: t("howToName"),
          description: t("howToDescription"),
          steps: getHomeSteps(locale).map(({ title, copy }) => ({
            name: title,
            text: copy,
          })),
        })}
      />
      <JsonLd data={getSoftwareApplicationSchema(pricing)} />
    </div>
  );
}
