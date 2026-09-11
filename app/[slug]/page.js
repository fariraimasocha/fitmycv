import { notFound } from "next/navigation";

import MarketingPage from "@/components/content/MarketingPage";
import TemplateGallery from "@/components/content/TemplateGallery";
import { MARKETING_PAGES, getMarketingPage } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getMarketingPage(slug);
  if (!page) return {};

  return pageMetadata({
    absoluteTitle: page.seoTitle.includes("FitMyCV")
      ? page.seoTitle
      : `${page.seoTitle} | FitMyCV`,
    description: page.description,
    path: `/${page.slug}`,
    keywords: page.keywords,
    image: page.image,
  });
}

export default async function MarketingSlugPage({ params }) {
  const { slug } = await params;
  const page = getMarketingPage(slug);
  if (!page) notFound();

  return (
    <MarketingPage page={page} hideHero={Boolean(page.showTemplates)}>
      {page.showTemplates ? (
        <TemplateGallery asPageHeading title={page.h1} lede={page.lede} />
      ) : null}
    </MarketingPage>
  );
}
