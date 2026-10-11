import { getLocale, getMessages } from "next-intl/server";
import { auth } from "@/lib/auth";
import RootShell from "@/components/RootShell";
import { rootMetadata } from "@/lib/root-metadata";

export const metadata = rootMetadata;

// Root layout for the signed in app: dashboard, payment and print. It reads
// the session and the NEXT_LOCALE cookie on every request, so it is dynamic
// on purpose. The session is passed down so useSession() has it on the first
// render instead of showing a spinner.
export default async function AppLayout({ children }) {
  const [locale, messages, session] = await Promise.all([getLocale(), getMessages(), auth()]);
  return (
    <RootShell locale={locale} messages={messages} session={session}>
      {children}
    </RootShell>
  );
}
