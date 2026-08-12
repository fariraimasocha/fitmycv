"use client";

import {
  HouseIcon,
  ReadCvLogoIcon,
  PenIcon,
  StackIcon,
  BinocularsIcon,
  KanbanIcon,
  BookOpenIcon,
  ScalesIcon,
  BookmarkSimpleIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";

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

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Home", url: "/dashboard", icon: HouseIcon },
    ],
  },
  {
    label: "CV Toolkit",
    items: [
      { title: "My CV", url: "/dashboard/resume", icon: ReadCvLogoIcon },
      { title: "Tailor CV", url: "/dashboard/tailor", icon: PenIcon },
      { title: "Tailored CVs", url: "/dashboard/tailored", icon: StackIcon },
      { title: "Story Bank", url: "/dashboard/story-bank", icon: BookOpenIcon },
    ],
  },
  {
    label: "Job Search",
    items: [
      { title: "Applications", url: "/dashboard/applications", icon: KanbanIcon },
      { title: "Saved Jobs", url: "/dashboard/saved", icon: BookmarkSimpleIcon },
      { title: "Company Research", url: "/dashboard/company-research", icon: BinocularsIcon },
      { title: "Compare Offers", url: "/dashboard/compare", icon: ScalesIcon },
    ],
  },
  {
    label: "Settings",
    items: [
      { title: "Preferences", url: "/dashboard/preferences", icon: SlidersHorizontalIcon },
    ],
  },
];

export function AppSidebar({ ...props }) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[var(--landing-line)] bg-[var(--landing-paper-soft)]"
      {...props}
    >
      <SidebarHeader className="border-b border-[var(--landing-line)]/60">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="gap-0 py-2">
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter className="border-t border-[var(--landing-line)]/60">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
