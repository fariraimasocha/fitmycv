"use client";

import { HouseIcon, ReadCvLogoIcon, PenIcon, StackIcon, BinocularsIcon } from "@phosphor-icons/react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: HouseIcon,
  },
  {
    title: "My Resume",
    url: "/dashboard/resume",
    icon: ReadCvLogoIcon,
  },
  {
    title: "Tailor Resume",
    url: "/dashboard/tailor",
    icon: PenIcon,
  },
  {
    title: "Tailored CVs",
    url: "/dashboard/tailored",
    icon: StackIcon,
  },
  {
    title: "Company Research",
    url: "/dashboard/company-research",
    icon: BinocularsIcon,
  },
];

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
