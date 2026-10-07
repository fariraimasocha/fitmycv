import { SITE_URL } from "@/lib/site";
import { POSTS } from "@/content/blog";
import { MARKETING_PAGES } from "@/content/pages";
import { RESUME_EXAMPLES } from "@/content/resume-examples";
import { TRANSLATED_PATHS, localeAlternates } from "@/lib/seo";
import { routing } from "@/i18n/routing";

function languageUrls(path) {
  const { languages } = localeAlternates("en", path);
  return Object.fromEntries(
    Object.entries(languages).map(([lang, href]) => [lang, `${SITE_URL}${href}`])
  );
}

export default function sitemap() {
  const lastModified = new Date();

  const staticRoutes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    {
      path: "/tailor-cv-from-job-link",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { path: "/jobs", changeFrequency: "daily", priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/resume-examples", changeFrequency: "monthly", priority: 0.8 },
    { path: "/cv-examples", changeFrequency: "monthly", priority: 0.7 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
    { path: "/support", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
  ];

  // Landing pages carrying a primary keyword rank above the informational ones.
  const highIntent = new Set([
    "resume-job-match-checker",
    "cv-format-checker",
    "resume-weak-words-checker",
    "employment-gap-explanation-generator",
    "missing-resume-keywords",
    "resume-bullet-rewriter",
    "resume-headline-generator",
    "professional-summary-generator",
    "job-description-to-resume-bullets",
    "linkedin-url-for-resume",
    "resume-keywords",
    "ats-resume-checker",
    "ai-cover-letter-generator",
    "cover-letter-builder",
    "resume-optimizer",
    "huntr-alternative",
    "enhancv-alternative",
    "rezi-alternative",
    "resume-worded-alternative",
    "tailoredcv-alternative",
    "seekario-alternative",
    "visualcv-alternative",
  ]);

  const marketingRoutes = MARKETING_PAGES.map(({ slug }) => ({
    path: `/${slug}`,
    changeFrequency: "monthly",
    priority: highIntent.has(slug) ? 0.9 : 0.7,
  }));

  const exampleRoutes = RESUME_EXAMPLES.map(({ slug }) => ({
    path: `/resume-examples/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const routes = [...staticRoutes, ...marketingRoutes, ...exampleRoutes].map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
      ...(TRANSLATED_PATHS.includes(path)
        ? { alternates: { languages: languageUrls(path) } }
        : {}),
    })
  );

  // Each translated page also gets its own entry per language.
  const localizedRoutes = routing.locales.filter((l) => l !== routing.defaultLocale).flatMap((locale) =>
    staticRoutes
      .filter(({ path }) => TRANSLATED_PATHS.includes(path))
      .map(({ path, changeFrequency, priority }) => ({
        url: `${SITE_URL}${localeAlternates(locale, path).canonical}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages: languageUrls(path) },
      }))
  );

  // Posts carry their own lastModified so a content refresh is a real signal.
  const postRoutes = POSTS.map(({ meta }) => ({
    url: `${SITE_URL}/blog/${meta.slug}`,
    lastModified: new Date(meta.updated || meta.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routes, ...localizedRoutes, ...postRoutes];
}
