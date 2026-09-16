"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import BrandLogo from "@/components/BrandLogo";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// The second line names the plan, not the product. The wordmark already says
// what the app is; the plan is the one fact about the account worth seeing
// on every screen.
export function TeamSwitcher() {
  const { data: session } = useSession();
  const plan = session?.user?.isPremium ? "Pro plan" : "Free plan";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="rounded-md hover:bg-[var(--landing-primary-soft)]"
        >
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
              <BrandLogo size="md" showWordmark={false} alt="" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-serif-display text-base font-normal tracking-tight">
                FitMyCV
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {session?.user ? plan : "Tailor your CV"}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
