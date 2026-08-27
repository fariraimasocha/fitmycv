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
import AuthProvider from "@/components/providers/auth-provider";
import OnboardingGuard from "@/components/OnboardingGuard";
import FeedbackModal from "@/components/FeedbackModal";
import { ChatCircleDotsIcon } from "@phosphor-icons/react";

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
};

function DashboardBreadcrumb() {
  const pathname = usePathname();

  const isTailoredDetail =
    pathname.startsWith("/dashboard/tailored/") &&
    pathname !== "/dashboard/tailored";

  if (isTailoredDetail) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/tailored">Tailored CVs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const isApplicationDetail =
    pathname.startsWith("/dashboard/applications/") &&
    pathname !== "/dashboard/applications";

  if (isApplicationDetail) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/applications">Applications</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const isCompanyResearchDetail =
    pathname.startsWith("/dashboard/company-research/") &&
    pathname !== "/dashboard/company-research";

  if (isCompanyResearchDetail) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/company-research">Company Research</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Brief Detail</BreadcrumbPage>
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

export default function DashboardShell({ children }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const pathname = usePathname();
  const isOnboarding = pathname === "/dashboard/onboarding";

  if (isOnboarding) {
    return (
      <AuthProvider>
        <OnboardingGuard>{children}</OnboardingGuard>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <OnboardingGuard>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-w-0 overflow-x-clip">
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--landing-line)] bg-[var(--landing-bg)]/90 px-3 backdrop-blur-md sm:h-16 sm:px-4">
              <SidebarTrigger className="-ml-1 shrink-0 rounded-lg hover:bg-[var(--landing-primary-soft)]" />
              <Separator orientation="vertical" className="mr-1 h-4 shrink-0 bg-[var(--landing-line)] sm:mr-2" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <DashboardBreadcrumb />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground sm:text-sm"
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
    </AuthProvider>
  );
}
