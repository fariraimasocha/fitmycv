import { getMessages, setRequestLocale } from "next-intl/server";
import RootShell from "@/components/RootShell";
import { rootMetadata } from "@/lib/root-metadata";

export const metadata = rootMetadata;

// Root layout for the English only public pages: blog, ATS guides, examples,
// jobs and support. Pinning "en" keeps next-intl off the NEXT_LOCALE cookie,
// so these pages prerender. Each page pins it too, since pages and layouts
// render separately.
export default async function SiteLayout({ children }) {
  setRequestLocale("en");
  const messages = await getMessages();
  return (
    <RootShell locale="en" messages={messages}>
      {children}
    </RootShell>
  );
}
