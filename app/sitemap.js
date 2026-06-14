import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const lastModified = new Date();

  const routes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    {
      path: "/tailor-cv-from-job-link",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
    { path: "/support", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
