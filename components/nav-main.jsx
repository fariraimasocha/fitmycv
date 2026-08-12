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
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/80">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.url === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                asChild
                className={cn(
                  "rounded-xl font-medium transition-all",
                  isActive && "dashboard-nav-active"
                )}
              >
                <Link href={item.url} onClick={onNavigate}>
                  {item.icon && <item.icon />}
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
