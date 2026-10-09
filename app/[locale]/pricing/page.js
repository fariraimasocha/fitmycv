import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Header from "@/components/Header";
import Pricing from "@/components/landing/Pricing";
import CTABand from "@/components/landing/CTABand";
import Footer from "@/components/landing/Footer";
import JsonLd from "@/components/JsonLd";
import { getServerPricing } from "@/lib/server-pricing";
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
  const alternates = localeAlternates(locale, "/pricing");

  return {
    title: t("title", prices),
    description: t("description", prices),
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
      description: t("ogDescription", prices),
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
      description: t("twitterDescription", prices),
      images: ["/hero-new.png"],
    },
  };
}

const FAQ_KEYS = ["cost", "includes", "cancel", "payment", "regional"];

function buildFaqs(t, pricing) {
  const prices = {
    lifetime: pricing.lifetime.price,
    month: pricing.month.price,
  };
  return FAQ_KEYS.map((key) => ({
    q: t(`faqs.${key}.q`),
    a: t(`faqs.${key}.a`, prices),
  }));
}

export default async function PricingPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.pricingPage" });
  const { pricing } = await getServerPricing();
  const faqs = buildFaqs(t, pricing);

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
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden px-5 pb-12 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div className="landing-container flex flex-col items-center text-center">
            <div className="landing-eyebrow">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--landing-primary)]" />
              {t("eyebrow")}
            </div>
            <h1
              className="font-serif-display mt-6 max-w-4xl font-normal leading-[1.02] tracking-normal text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(36px, 5.4vw, 68px)" }}
            >
              {t("title")}
            </h1>
            <p className="mt-5 font-outfit text-lg font-extrabold text-[var(--landing-ink)] sm:text-xl">
              {t("priceOnce", { price: pricing.lifetime.price })}
              <span className="mx-2 font-normal text-[var(--landing-ink-soft)]">
                {t("or")}
              </span>
              {t("priceMonthly", { price: pricing.month.price })}
            </p>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              {t("intro")}
            </p>
          </div>
        </section>

        <Pricing />

        <section className="landing-section">
          <div className="landing-container flex flex-col items-center gap-4">
            <h2 className="landing-section-title text-center text-3xl sm:text-4xl">
              {t("faqTitle")}
            </h2>
            <p className="landing-copy text-center text-base">
              {t("faqIntro")}
            </p>
          </div>

          <div className="landing-container mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3">
            {faqs.map(({ q, a }) => (
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

        <CTABand lifetimePrice={pricing.lifetime.price} />
      </main>
      <Footer />

      <JsonLd data={faqJsonLd} />
    </div>
  );
}
