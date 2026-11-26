import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import TrackerLink from "@/components/landing/TrackerLink";
import { ProductImage } from "@/components/landing/ProductPreview";
import FaqSection from "@/components/content/FaqSection";
import JsonLd from "@/components/JsonLd";
import { faqSchema, localeAlternates, pageMetadata } from "@/lib/seo";
import { webPageSchema } from "@/lib/structured-data";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.redesign" });
  const alternates = localeAlternates(locale, "/job-tracker");
  return { ...pageMetadata({ title: t("tracker"), description: t("trackerBody"), path: alternates.canonical }), alternates };
}

export default async function JobTrackerPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing.redesign" });
  const h = await getTranslations({ locale, namespace: "header" });
  const faqs = [1, 2].map((n) => ({ q: t(`faqQ${n}`), a: t(`faqA${n}`) }));
  return <div className="landing-root public-redesign min-h-screen">
    <Header />
    <main id="main-content">
      <section className="public-section public-product-hero"><div className="public-container public-story">
        <div className="public-story-copy"><p className="public-eyebrow">{t("tracker")}</p><h1 className="public-product-title">{t("trackerTitle")}</h1><p className="public-copy">{t("trackerBody")}</p><TrackerLink /><Link href="/pricing" className="public-pricing-link">{h("pricing")}</Link><p className="public-access-note">{t("faqA1")}</p></div>
        <ProductImage tracker priority />
      </div></section>
      <section className="public-section"><div className="public-container public-tracker-features">
        {["save", "stage", "detail"].map((key, index) => <article key={key}><span className="public-step-number" aria-hidden="true">0{index + 1}</span><h2 className="public-item-title">{t(`${key}Title`)}</h2><p className="public-copy">{t(`${key}Body`)}</p></article>)}
      </div></section>
      <section className="public-section"><div className="public-container"><p className="public-eyebrow">{t("tracker")}</p><h2 className="public-section-title">{t("stepsTitle")}</h2><ol className="public-tracker-steps">{[1,2,3].map((n) => <li key={n}><span aria-hidden="true">0{n}</span>{t(`step${n}`)}</li>)}</ol><TrackerLink /></div></section>
      <FaqSection faqs={faqs} heading={t("faqTitle")} />
    </main>
    <Footer />
    <JsonLd data={faqSchema(faqs)} />
    <JsonLd data={{ ...webPageSchema({ name: t("tracker"), description: t("trackerBody"), path: localeAlternates(locale, "/job-tracker").canonical }), inLanguage: locale }} />
  </div>;
}
