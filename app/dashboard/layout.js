"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import AuthProvider from "@/components/providers/auth-provider";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
            </header>
            <main className="flex-1 p-4 pt-0">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}
