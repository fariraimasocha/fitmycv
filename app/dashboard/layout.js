import { NextIntlClientProvider } from "next-intl";
import DashboardShell from "./DashboardShell";

// Server layout so /dashboard/* can carry real metadata. robots.txt already
// disallows crawling, but that alone doesn't stop indexing of linked URLs.
// noindex does. The interactive shell lives in DashboardShell.jsx.
export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  // Without a messages prop the provider passes every namespace, which the
  // dashboard needs. The root layout only sends the public ones.
  return (
    <NextIntlClientProvider>
      <DashboardShell>{children}</DashboardShell>
    </NextIntlClientProvider>
  );
}
