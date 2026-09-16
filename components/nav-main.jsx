"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function NavGroup({ label, items, pathname, onNavigate }) {
  return (
    <SidebarGroup className="py-1.5">
      <SidebarGroupLabel className="h-7 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          // Match on segment boundaries only, else /dashboard/tailored/xyz
          // also lights up /dashboard/tailor.
          const isActive =
            pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(`${item.url}/`));

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                asChild
                className={cn(
                  "h-9 gap-2.5 rounded-md px-2.5 font-medium text-[var(--landing-ink)] transition-colors hover:bg-[var(--landing-primary-soft)] [&>svg]:size-[18px]",
                  isActive && "dashboard-nav-active"
                )}
              >
                <Link href={item.url} onClick={onNavigate}>
                  {item.icon && (
                    <item.icon weight={isActive ? "fill" : "regular"} aria-hidden="true" />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavMain({ groups }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      {groups.map((group) => (
        <NavGroup
          key={group.label}
          label={group.label}
          items={group.items}
          pathname={pathname}
          onNavigate={handleNavigate}
        />
      ))}
    </>
  );
}
