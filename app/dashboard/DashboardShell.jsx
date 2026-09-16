"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import OnboardingGuard from "@/components/OnboardingGuard";
import FeedbackModal from "@/components/FeedbackModal";
import { ChatCircleDotsIcon } from "@phosphor-icons/react";
import { useBreadcrumbStore } from "@/stores/breadcrumb-store";

const PATH_LABELS = {
  "/dashboard": "Home",
  "/dashboard/resume": "My CV",
  "/dashboard/tailor": "Tailor CV",
  "/dashboard/tailored": "Tailored CVs",
  "/dashboard/profile": "Profile",
  "/dashboard/upgrade": "Upgrade to Pro",
  "/dashboard/company-research": "Company Research",
  "/dashboard/applications": "Applications",
  "/dashboard/story-bank": "Story Bank",
  "/dashboard/compare": "Compare Offers",
  "/dashboard/saved": "Saved Jobs",
  "/dashboard/preferences": "Preferences",
  "/dashboard/agent": "CV Agent",
};

// Detail pages read "Parent > item", with the item title from the breadcrumb store.
const DETAIL_PARENTS = [
  { base: "/dashboard/tailored", label: "Tailored CVs", fallback: "Detail" },
  { base: "/dashboard/applications", label: "Applications", fallback: "Detail" },
  { base: "/dashboard/company-research", label: "Company Research", fallback: "Brief" },
  { base: "/dashboard/agent", label: "CV Agent", fallback: "Thread" },
];

function DashboardBreadcrumb() {
  const pathname = usePathname();
  const detailLabel = useBreadcrumbStore((s) => s.detailLabel);
  const parent = DETAIL_PARENTS.find((p) => pathname.startsWith(`${p.base}/`));

  if (parent) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={parent.base}>{parent.label}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">{detailLabel || parent.fallback}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const label = PATH_LABELS[pathname] ?? "Dashboard";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate">{label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// The session provider lives once, in app/layout.js. Mounting a second one here
// broke it: next-auth keeps session state in a module-level singleton, so a
// provider that mounts when one is already populated hits the "!event" early
// return in _getSession and never calls its own setSession. On a client-side
// nav from the landing page this left useSession() undefined until a hard
// reload, and unmounting it wiped the root provider's state on the way out.
export default function DashboardShell({ children }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
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
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--landing-line)] bg-[var(--landing-bg)]/90 px-3 backdrop-blur-md sm:h-16 sm:px-4">
              <SidebarTrigger className="-ml-1 shrink-0 rounded-md hover:bg-[var(--landing-primary-soft)]" />
              <Separator orientation="vertical" className="mr-1 h-4 shrink-0 bg-[var(--landing-line)] sm:mr-2" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <DashboardBreadcrumb />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(true)}
                  className="dashboard-secondary-btn dashboard-secondary-btn-sm text-muted-foreground hover:text-foreground"
                >
                  <ChatCircleDotsIcon size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">Feedback</span>
                </button>
              </div>
            </header>
            <main className="min-w-0 flex-1 overflow-x-clip bg-[var(--landing-bg)]">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </OnboardingGuard>
  );
}
