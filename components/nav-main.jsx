"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// groups is an array of item arrays; the group padding is the only gap between them.
export function NavMain({ groups }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return groups.map((items, i) => (
    <Fragment key={i}>
      <SidebarGroup className="py-1">
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            // Match on segment boundaries only, else /dashboard/tailored/xyz
            // also lights up /dashboard/tailor.
            const isActive =
              pathname === item.url ||
              (item.url !== "/dashboard" && pathname.startsWith(`${item.url}/`));

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  asChild
                  className={cn(
                    "h-10 gap-3 rounded-lg px-3 text-sm font-semibold text-[var(--landing-ink-soft)] transition-colors hover:bg-[var(--landing-primary-soft)] hover:text-[var(--landing-ink)] [&>svg]:size-5 group-data-[collapsible=icon]:p-1.5!",
                    isActive && "dashboard-nav-active"
                  )}
                >
                  <Link href={item.url} onClick={handleNavigate}>
                    <item.icon weight={isActive ? "fill" : "regular"} aria-hidden="true" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </Fragment>
  ));
}
