"use client";

import { useTranslations } from "next-intl";
import {
  ReadCvLogoIcon,
  PenIcon,
  StackIcon,
  RobotIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  KanbanIcon,
  BookmarkSimpleIcon,
  BinocularsIcon,
  ScalesIcon,
} from "@phosphor-icons/react";
import { DashboardPageShell, DashboardTile, DashboardTileGrid } from "@/components/dashboard";

// Every tool in one grid, so the sidebar can stay short. Labels reuse the
// sidebar item keys so a tool has one name everywhere.
const SECTIONS = [
  {
    key: "cv",
    items: [
      { key: "resume", href: "/dashboard/resume", icon: ReadCvLogoIcon },
      { key: "tailor", href: "/dashboard/tailor", icon: PenIcon },
      { key: "tailored", href: "/dashboard/tailored", icon: StackIcon },
      { key: "agent", href: "/dashboard/agent", icon: RobotIcon },
      { key: "storyBank", href: "/dashboard/story-bank", icon: BookOpenIcon },
    ],
  },
  {
    key: "jobs",
    items: [
      { key: "findJobs", href: "/dashboard/jobs", icon: MagnifyingGlassIcon },
      { key: "applications", href: "/dashboard/applications", icon: KanbanIcon },
      { key: "saved", href: "/dashboard/saved", icon: BookmarkSimpleIcon },
      { key: "companyResearch", href: "/dashboard/company-research", icon: BinocularsIcon },
      { key: "compare", href: "/dashboard/compare", icon: ScalesIcon },
    ],
  },
];

export default function ToolsPage() {
  const t = useTranslations("dashboard.sidebar");

  return (
    <DashboardPageShell>
      {SECTIONS.map((section) => (
        <section key={section.key} className="space-y-3">
          <h2 className="font-outfit text-lg font-medium text-[var(--landing-ink)]">
            {t(`groups.${section.key}`)}
          </h2>
          <DashboardTileGrid className="lg:grid-cols-5">
            {section.items.map((item) => (
              <DashboardTile key={item.key} href={item.href} icon={item.icon} label={t(`items.${item.key}`)} />
            ))}
          </DashboardTileGrid>
        </section>
      ))}
    </DashboardPageShell>
  );
}
