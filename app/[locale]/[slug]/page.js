import { notFound } from "next/navigation";

import MarketingPage from "@/components/content/MarketingPage";
import TemplateGallery from "@/components/content/TemplateGallery";
import { MARKETING_PAGES, getMarketingPage } from "@/content/pages";
import { TRANSLATED_TOOL_SLUGS, localeAlternates, pageMetadata } from "@/lib/seo";

// Static routes always win over this segment, so the existing pages (/pricing,
// /support, /blog, …) are unaffected. Anything not in the registry still 404s,
// via the notFound() below.
//
// dynamicParams stays on by design. With it off, this root-level catch-all made
// Next throw an internal NoFallbackError for every unknown top-level path, which
// is every bot scanning for /wp-admin and /.env. The 404 was correct either way,
// but the logged sentinel drowned out real errors.

export function generateStaticParams() {
  return MARKETING_PAGES.map(({ slug }) => ({ slug }));
}

const isTranslated = (slug) => TRANSLATED_TOOL_SLUGS.includes(slug);

// English reads the content file. Translated tools keep the same page shape in
// messages/<locale>/tool-pages/<slug>.json, loaded only on the server, so the
// long copy never ships to the browser.
async function getPage(locale, slug) {
  const page = getMarketingPage(slug);
  if (!page || locale === "en" || !isTranslated(slug)) return page;
  const translated = (await import(`../../../messages/${locale}/tool-pages/${slug}.json`)).default;
  return { ...page, ...translated };
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const page = await getPage(locale, slug);
  if (!page) return {};

  const alternates = isTranslated(slug) ? localeAlternates(locale, `/${slug}`) : null;
  const base = pageMetadata({
    absoluteTitle: page.seoTitle.includes("FitMyCV")
      ? page.seoTitle
      : `${page.seoTitle} | FitMyCV`,
    description: page.description,
    path: alternates?.canonical ?? `/${slug}`,
    keywords: page.keywords,
    image: page.image,
  });
  if (alternates) return { ...base, alternates };
  // An untranslated page under /fr is the English page again. It stays reachable
  // for visitors with a language cookie (a redirect would loop with next-intl),
  // but search engines only get the English URL.
  if (locale !== "en") return { ...base, robots: { index: false, follow: true } };
  return base;
}

export default async function MarketingSlugPage({ params }) {
  const { locale, slug } = await params;
  const page = await getPage(locale, slug);
  if (!page) notFound();

  return (
    <MarketingPage
      page={page}
      locale={isTranslated(slug) ? locale : "en"}
      hideHero={Boolean(page.showTemplates)}
    >
      {page.showTemplates ? (
        <TemplateGallery asPageHeading title={page.h1} lede={page.lede} />
      ) : null}
    </MarketingPage>
  );
}
