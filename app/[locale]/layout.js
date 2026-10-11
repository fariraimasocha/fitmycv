import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import RootShell from "@/components/RootShell";
import { rootMetadata } from "@/lib/root-metadata";

export const metadata = rootMetadata;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Root layout for the translated marketing pages. The locale comes from the
// URL and there is no session read, so these pages prerender. The homepage
// and /pricing stay dynamic on their own because they read regional pricing.
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <RootShell locale={locale} messages={messages}>
      {children}
    </RootShell>
  );
}
