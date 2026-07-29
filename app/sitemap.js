import { SITE_URL } from "@/lib/site";
import { POSTS } from "@/content/blog";
import { MARKETING_PAGES } from "@/content/pages";
import { RESUME_EXAMPLES } from "@/content/resume-examples";

export default function sitemap() {
  const lastModified = new Date();

  const staticRoutes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    {
      path: "/tailor-cv-from-job-link",
      changeFrequency: "weekly",
      priority: 0.9,
    },
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
    "ats-resume-checker",
    "ai-cover-letter-generator",
    "cover-letter-builder",
    "resume-optimizer",
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
    })
  );

  // Posts carry their own lastModified so a content refresh is a real signal.
  const postRoutes = POSTS.map(({ meta }) => ({
    url: `${SITE_URL}/blog/${meta.slug}`,
    lastModified: new Date(meta.updated || meta.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routes, ...postRoutes];
}
