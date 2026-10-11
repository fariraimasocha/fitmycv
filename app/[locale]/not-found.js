import NotFoundContent from "@/components/NotFoundContent";

// Static metadata on purpose. getTranslations() here reads request headers,
// which turns the prerendered routes dynamic at runtime and makes every 404
// a 500 on Cloudflare. Next already adds noindex to 404s.
export const metadata = { title: "Page not found" };

export default NotFoundContent;
