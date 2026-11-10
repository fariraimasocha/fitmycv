"use client";

import {
  HouseIcon,
  ReadCvLogoIcon,
  PenIcon,
  StackIcon,
  BinocularsIcon,
  MagnifyingGlassIcon,
  KanbanIcon,
  DotsNineIcon,
  SlidersHorizontalIcon,
  RobotIcon,
} from "@phosphor-icons/react";

import Link from "next/link";
import { useTranslations } from "next-intl";

import BrandLogo from "@/components/BrandLogo";
import LanguagePicker from "@/components/LanguagePicker";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Teal-style rail: no group labels, one divider after Home, the less used
// tools (story bank, saved jobs, compare offers) live on the All tools page.
// Titles are keys under dashboard.sidebar.items, translated at render.
const navGroups = [
  [{ title: "home", url: "/dashboard", icon: HouseIcon }],
  [
    { title: "resume", url: "/dashboard/resume", icon: ReadCvLogoIcon },
    { title: "tailor", url: "/dashboard/tailor", icon: PenIcon },
    { title: "tailored", url: "/dashboard/tailored", icon: StackIcon },
    { title: "agent", url: "/dashboard/agent", icon: RobotIcon },
    { title: "findJobs", url: "/dashboard/jobs", icon: MagnifyingGlassIcon },
    { title: "applications", url: "/dashboard/applications", icon: KanbanIcon },
    { title: "companyResearch", url: "/dashboard/company-research", icon: BinocularsIcon },
    { title: "tools", url: "/dashboard/tools", icon: DotsNineIcon },
  ],
];

const footerItems = [
  { title: "preferences", url: "/dashboard/preferences", icon: SlidersHorizontalIcon },
];

export function AppSidebar({ ...props }) {
  const t = useTranslations("dashboard.sidebar");
  const translate = (items) => items.map((item) => ({ ...item, title: t(`items.${item.title}`) }));

  return (
    <Sidebar
      collapsible="icon"
      className="border-e border-[var(--landing-line)] bg-[var(--landing-bg)]"
      {...props}
    >
      {/* h-16 matches the top bar, so the two bottom borders form one line.
          Collapsed, there is room for one 32px control: the logo shows, and
          the toggle takes its place on hover or keyboard focus. */}
      <SidebarHeader className="group/header h-16 shrink-0 flex-row items-center justify-between gap-2 border-b border-[var(--landing-line)] px-3 py-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <Link
          href="/dashboard"
          aria-label="FitMyCV"
          className="flex min-w-0 items-center rounded-md md:group-data-[collapsible=icon]:group-hover/header:hidden md:group-data-[collapsible=icon]:group-focus-within/header:hidden"
        >
          <BrandLogo
            size="md"
            alt=""
            className="group-data-[collapsible=icon]:[&>span]:hidden"
            wordmarkClassName="text-xl"
          />
        </Link>
        <SidebarTrigger className="hidden size-8 shrink-0 rounded-md text-[var(--landing-ink-soft)] hover:bg-[var(--landing-primary-soft)] md:inline-flex md:group-data-[collapsible=icon]:sr-only md:group-data-[collapsible=icon]:group-hover/header:not-sr-only md:group-data-[collapsible=icon]:group-focus-within/header:not-sr-only" />
      </SidebarHeader>
      <SidebarContent className="gap-0 px-1 py-2 group-data-[collapsible=icon]:px-0">
        <NavMain groups={navGroups.map(translate)} />
      </SidebarContent>
      <SidebarFooter className="gap-1 px-1 pb-3 group-data-[collapsible=icon]:px-0">
        <NavMain groups={[translate(footerItems)]} />
        <NavUser />
        <LanguagePicker
          align="start"
          className="mx-2 h-9 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-[var(--landing-primary-soft)] hover:text-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:[&>span]:hidden"
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
