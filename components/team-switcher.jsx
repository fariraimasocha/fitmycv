"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReadCvLogoIcon } from "@phosphor-icons/react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="rounded-xl hover:bg-[var(--landing-primary-soft)]"
        >
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-foreground text-background">
              <ReadCvLogoIcon className="size-4" weight="bold" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-serif-display text-base font-normal tracking-tight">
                FitMyCV
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Tailor your CV
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
