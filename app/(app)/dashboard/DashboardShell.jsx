"use client";

import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation } from "motion/react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { TOPBAR_ACTIONS_ID } from "@/components/dashboard/DashboardPageHeader";
import { AppSidebar } from "@/components/app-sidebar";
import OnboardingGuard from "@/components/OnboardingGuard";
import { useTranslations } from "next-intl";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

// Values are keys under dashboard.shell.pages, translated at render.
const PATH_LABELS = {
  "/dashboard": "home",
  "/dashboard/resume": "resume",
  "/dashboard/tailor": "tailor",
  "/dashboard/tailored": "tailored",
  "/dashboard/profile": "profile",
  "/dashboard/upgrade": "upgrade",
  "/dashboard/company-research": "companyResearch",
  "/dashboard/applications": "applications",
  "/dashboard/story-bank": "storyBank",
  "/dashboard/compare": "compare",
  "/dashboard/saved": "saved",
  "/dashboard/jobs": "jobs",
  "/dashboard/preferences": "preferences",
  "/dashboard/agent": "agent",
  "/dashboard/tools": "tools",
};

// Detail pages read "Parent > item", with the item title from the breadcrumb store.
const DETAIL_PARENTS = [
  { base: "/dashboard/tailored", label: "tailored", fallback: "detail" },
  { base: "/dashboard/applications", label: "applications", fallback: "detail" },
  { base: "/dashboard/company-research", label: "companyResearch", fallback: "brief" },
  { base: "/dashboard/agent", label: "agent", fallback: "thread" },
];

function DashboardBreadcrumb() {
  const t = useTranslations("dashboard.shell");
  const pathname = usePathname();
  const detailLabel = useBreadcrumbStore((s) => s.detailLabel);
  const parent = DETAIL_PARENTS.find((p) => pathname.startsWith(`${p.base}/`));

  // Teal-style app bar: a back button and the item name on detail pages, the
  // page name everywhere else. The page body no longer repeats it.
  if (parent) {
    return (
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={parent.base}
          aria-label={t("backTo", { page: t(`pages.${parent.label}`) })}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--landing-line)] text-[var(--landing-ink-soft)] transition-colors hover:bg-[var(--landing-paper-soft)] hover:text-[var(--landing-ink)]"
        >
          <ArrowLeftIcon size={16} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
        <p className="truncate font-outfit text-base font-semibold text-[var(--landing-ink)]">
          {detailLabel || t(`fallback.${parent.fallback}`)}
        </p>
      </div>
    );
  }

  const label = PATH_LABELS[pathname] ? t(`pages.${PATH_LABELS[pathname]}`) : t("dashboard");
  return <p className="truncate font-outfit text-base font-semibold text-[var(--landing-ink)]">{label}</p>;
}

// The session provider lives once, in app/layout.js. Mounting a second one here
// broke it: next-auth keeps session state in a module-level singleton, so a
// provider that mounts when one is already populated hits the "!event" early
// return in _getSession and never calls its own setSession. On a client-side
// nav from the landing page this left useSession() undefined until a hard
// reload, and unmounting it wiped the root provider's state on the way out.
export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/dashboard/onboarding";

  if (isOnboarding) {
    return <OnboardingGuard>{children}</OnboardingGuard>;
  }

  return (
    <OnboardingGuard>
      <TooltipProvider>
        <SidebarProvider className="dashboard-shell">
          <AppSidebar />
          <SidebarInset className="min-w-0 overflow-x-clip">
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 sm:h-16 sm:px-6">
              {/* Desktop toggles from the sidebar header, like Teal. Phones need one here. */}
              <SidebarTrigger className="-ms-1 shrink-0 rounded-md hover:bg-[var(--landing-primary-soft)] md:hidden" />
              <Separator orientation="vertical" className="me-1 h-4 shrink-0 bg-[var(--landing-line)] md:hidden" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <DashboardBreadcrumb />
              </div>
              {/* Page actions portal in here from DashboardPageHeader. */}
              <div id={TOPBAR_ACTIONS_ID} className="hidden shrink-0 items-center gap-2 sm:flex" />
            </header>
            <main className="min-w-0 flex-1 overflow-x-clip bg-[var(--landing-surface)]">
              {/* Lets pages use the smaller m.* components from motion/react-m. */}
              <LazyMotion features={domAnimation}>{children}</LazyMotion>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </OnboardingGuard>
  );
}
