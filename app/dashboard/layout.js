import DashboardShell from "./DashboardShell";

// Server layout so /dashboard/* can carry real metadata. robots.txt already
// disallows crawling, but that alone doesn't stop indexing of linked URLs —
// noindex does. The interactive shell lives in DashboardShell.jsx.
export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
