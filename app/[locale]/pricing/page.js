import Header from "@/components/Header";
import Pricing from "@/components/landing/Pricing";
import FaqSection from "@/components/content/FaqSection";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/JsonLd";
import { getServerPricing } from "@/lib/server-pricing";
import { SHOW_MONTHLY } from "@/lib/pricing";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.pricingPage.meta" });
  const { pricing } = await getServerPricing();
  const prices = {
    lifetime: pricing.lifetime.price,
    month: pricing.month.price,
  };
  const pageCopy = await getTranslations({ locale, namespace: "pages.pricingPage" });
  const description = SHOW_MONTHLY
    ? t("description", prices)
    : `${pageCopy("intro")} ${pageCopy("priceOnce", { price: pricing.lifetime.price })}.`;
  const alternates = localeAlternates(locale, "/pricing");

  return {
    title: t("title", prices),
    description,
    keywords: [
      "fitmycv pricing",
      "cv tailoring tool price",
      "ai resume builder pricing",
      "tailor cv from job link cost",
      "ats resume optimizer pricing",
    ],
    alternates,
    openGraph: {
      type: "website",
      url: alternates.canonical,
      siteName: "FitMyCV",
      title: t("socialTitle"),
      description: SHOW_MONTHLY ? t("ogDescription", prices) : description,
      images: [
        {
          url: "/hero-new.png",
          width: 3024,
          height: 1724,
          alt: t("imageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("socialTitle"),
      description: SHOW_MONTHLY ? t("twitterDescription", prices) : description,
      images: ["/hero-new.png"],
    },
  };
}

const FAQ_KEYS = ["cost", "includes", "cancel", "payment", "regional"];

function buildFaqs(t, pricing, cancelAnswer) {
  const prices = {
    lifetime: pricing.lifetime.price,
    month: pricing.month.price,
  };
  return FAQ_KEYS.map((key) => ({
    q: t(`faqs.${key}.q`),
    a: !SHOW_MONTHLY && key === "cost"
      ? t("priceOnce", { price: pricing.lifetime.price })
      : !SHOW_MONTHLY && key === "cancel"
        ? cancelAnswer
        : t(`faqs.${key}.a`, prices),
  }));
}

export default async function PricingPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.pricingPage" });
  const { pricing } = await getServerPricing();
  const pricingCopy = await getTranslations({ locale, namespace: "pages.pricing" });
  const trust = await getTranslations({ locale, namespace: "landing.trust" });
  const faqs = buildFaqs(t, pricing, trust("signals.cancel.body"));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="landing-root public-redesign min-h-screen">
      <Header />
      <main id="main-content">
        <section className="public-pricing-hero">
          <div className="public-container public-hero-copy">
            <p className="public-eyebrow">{t("eyebrow")}</p>
            <h1 className="public-hero-title">{SHOW_MONTHLY ? t("title") : pricingCopy("introOnce")}</h1>
            <p className="public-hero-description">{t("intro")}</p>
          </div>
        </section>

        <Pricing showIntro={false} />
        <FaqSection faqs={faqs} heading={t("faqTitle")} intro={t("faqIntro")} muted={false} />

      </main>
      <Footer />

      <JsonLd data={faqJsonLd} />
    </div>
  );
}
