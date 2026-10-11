import { setRequestLocale } from "next-intl/server";
import NotFoundContent from "@/components/NotFoundContent";

// Static metadata and a pinned locale, so a notFound() inside these
// prerendered pages never reads request headers (that turned 404s into 500s
// on Cloudflare). Next already adds noindex to 404s.
export const metadata = { title: "Page not found" };

export default function NotFound() {
  setRequestLocale("en");
  return <NotFoundContent />;
}
