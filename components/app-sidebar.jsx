"use client";

import {
  HouseIcon,
  ReadCvLogoIcon,
  PenIcon,
  StackIcon,
  BinocularsIcon,
  MagnifyingGlassIcon,
  KanbanIcon,
  BookOpenIcon,
  ScalesIcon,
  BookmarkSimpleIcon,
  SlidersHorizontalIcon,
  RobotIcon,
} from "@phosphor-icons/react";

import { useTranslations } from "next-intl";

import LanguagePicker from "@/components/LanguagePicker";
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

// Labels and titles are keys under dashboard.sidebar, translated at render.
const navGroups = [
  {
    label: "overview",
    items: [
      { title: "home", url: "/dashboard", icon: HouseIcon },
    ],
  },
  {
    label: "cvToolkit",
    items: [
      { title: "resume", url: "/dashboard/resume", icon: ReadCvLogoIcon },
      { title: "tailor", url: "/dashboard/tailor", icon: PenIcon },
      { title: "tailored", url: "/dashboard/tailored", icon: StackIcon },
      { title: "agent", url: "/dashboard/agent", icon: RobotIcon },
      { title: "storyBank", url: "/dashboard/story-bank", icon: BookOpenIcon },
    ],
  },
  {
    label: "jobSearch",
    items: [
      { title: "findJobs", url: "/jobs", icon: MagnifyingGlassIcon },
      { title: "applications", url: "/dashboard/applications", icon: KanbanIcon },
      { title: "saved", url: "/dashboard/saved", icon: BookmarkSimpleIcon },
      { title: "companyResearch", url: "/dashboard/company-research", icon: BinocularsIcon },
      { title: "compare", url: "/dashboard/compare", icon: ScalesIcon },
    ],
  },
  {
    label: "settings",
    items: [
      { title: "preferences", url: "/dashboard/preferences", icon: SlidersHorizontalIcon },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const t = useTranslations("dashboard.sidebar");
  const groups = navGroups.map((group) => ({
    label: t(`groups.${group.label}`),
    items: group.items.map((item) => ({ ...item, title: t(`items.${item.title}`) })),
  }));

  return (
    <Sidebar
      collapsible="icon"
      className="border-e border-[var(--landing-line)] bg-[var(--landing-surface)]"
      {...props}
    >
      <SidebarHeader className="border-b border-[var(--landing-line)]/60">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="gap-0 py-2">
        <NavMain groups={groups} />
      </SidebarContent>
      <SidebarFooter className="border-t border-[var(--landing-line)]/60">
        <NavUser />
        <LanguagePicker
          align="start"
          className="h-8 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-[var(--landing-primary-soft)] hover:text-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:[&>span]:hidden"
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
