import MarketingPage from "@/components/content/MarketingPage";
import { atsResumeChecker } from "@/content/pages/tools";
import { localeAlternates, pageMetadata } from "@/lib/seo";

const PATH = "/ats-resume-checker";

// English reads the original content file. Other languages keep the same page
// shape in messages/<locale>/ats-resume-checker.json, loaded only on the
// server, so the long copy never ships to the browser.
async function getPage(locale) {
  if (locale === "en") return atsResumeChecker;
  const translated = (await import(`../../../messages/${locale}/ats-resume-checker.json`)).default;
  return { ...atsResumeChecker, ...translated };
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const page = await getPage(locale);
  const alternates = localeAlternates(locale, PATH);
  const base = pageMetadata({
    absoluteTitle: page.seoTitle.includes("FitMyCV") ? page.seoTitle : `${page.seoTitle} | FitMyCV`,
    description: page.description,
    path: alternates.canonical,
    keywords: page.keywords,
    image: page.image,
  });
  return { ...base, alternates };
}

export default async function AtsResumeCheckerPage({ params }) {
  const { locale } = await params;
  return <MarketingPage page={await getPage(locale)} locale={locale} />;
}
