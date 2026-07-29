import { notFound } from "next/navigation";

import MarketingPage from "@/components/content/MarketingPage";
import TemplateGallery from "@/components/content/TemplateGallery";
import { MARKETING_PAGES, getMarketingPage } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

// Static routes always win over this segment, so the existing pages (/pricing,
// /support, /blog, …) are unaffected. `dynamicParams = false` makes anything
// not in the registry a proper 404 rather than a rendered empty page.
export const dynamicParams = false;

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
    <MarketingPage page={page}>
      {page.showTemplates ? <TemplateGallery /> : null}
    </MarketingPage>
  );
}
