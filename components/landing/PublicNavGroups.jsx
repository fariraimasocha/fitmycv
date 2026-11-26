"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CaretDownIcon,
  FileTextIcon,
  FilesIcon,
  LayoutIcon,
  LifebuoyIcon,
  LinkedinLogoIcon,
  ListMagnifyingGlassIcon,
  PencilLineIcon,
  ShieldCheckIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FREE_TOOLS } from "@/lib/free-tools";

const ICONS = {
  "/resume-job-match-checker": TargetIcon,
  "/ats-resume-checker": ShieldCheckIcon,
  "/cv-checker": ShieldCheckIcon,
  "/resume-keywords-generator": ListMagnifyingGlassIcon,
  "/missing-resume-keywords": ListMagnifyingGlassIcon,
  "/cv-format-checker": FileTextIcon,
  "/linkedin-profile-checker": LinkedinLogoIcon,
  "/linkedin-url-for-resume": LinkedinLogoIcon,
  "/jobs": BriefcaseIcon,
  "/cv-templates": FileTextIcon,
  "/resume-examples": FileTextIcon,
  "/cv-examples": FileTextIcon,
  "/how-to-write-a-resume": PencilLineIcon,
  "/support": LifebuoyIcon,
};

export function usePublicNavGroups() {
  const t = useTranslations("landing.redesign");
  const h = useTranslations("header");
  const f = useTranslations("landing.footer.links");
  const ft = useTranslations("landing.footer");
  const career = FREE_TOOLS.filter(({ href }) => ["/save-job-posting-as-pdf", "/ats"].includes(href));
  const checks = FREE_TOOLS.filter(({ href }) => /checker|match|missing|keywords-generator/.test(href));
  const writing = FREE_TOOLS.filter((tool) => !checks.includes(tool) && !career.includes(tool));
  return [
    {
      key: "tools",
      label: ft("headings.freeTools"),
      groups: [
        { label: t("checks"), icon: ShieldCheckIcon, links: checks },
        { label: t("writing"), icon: PencilLineIcon, links: [...writing,
          { href: "/ai-cover-letter-generator", label: t("coverLetters") },
          { href: "/cover-letter-builder", label: f("coverLetterBuilder") },
        ] },
        { label: t("career"), footer: true, links: career },
        { label: h("pricing"), footer: true, links: [{ href: "/pricing", label: h("pricing") }] },
      ],
    },
    {
      key: "resources",
      label: t("resources"),
      groups: [
        { label: t("resources"), body: t("resourceMenu.learn"), icon: BookOpenIcon, links: [
          { href: "/blog", label: h("blog"), icon: BookOpenIcon, body: t("resourceMenu.blog") },
          { href: "/resume-examples", label: t("resumeExamples"), body: t("resourceMenu.resumeExamples") },
          { href: "/cv-examples", label: t("cvExamples"), icon: FilesIcon, body: t("resourceMenu.cvExamples") },
          { href: "/cv-templates", label: h("templates"), icon: LayoutIcon, body: t("resourceMenu.templates") },
        ] },
        { label: t("career"), body: t("resourceMenu.apply"), icon: BriefcaseIcon, links: [
          { href: "/jobs", label: h("jobs"), body: t("resourceMenu.jobs") },
          { href: "/how-to-write-a-resume", label: t("guide"), featured: true, body: t("resourceMenu.guide") },
          { href: "/support", label: t("support"), body: t("resourceMenu.support") },
        ] },
      ],
    },
  ];
}

export default function PublicNavGroups({ mobile = false, onNavigate }) {
  const menus = usePublicNavGroups();
  const pathname = usePathname();
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  if (mobile) return menus.map((menu) => (
    <details key={menu.key} className="public-mobile-group">
      <summary>{menu.label}<CaretDownIcon size={16} aria-hidden="true" /></summary>
      {menu.groups.map((group) => <div key={group.label} className="public-mobile-links">
        <p className="public-menu-heading">{group.label}</p>
        {group.links.map((link) => {
          const Icon = link.icon || ICONS[link.href] || group.icon || FileTextIcon;
          return <Link key={link.href} href={link.href} onClick={onNavigate} aria-current={pathname === link.href ? "page" : undefined}>
            <Icon size={18} aria-hidden="true" /><span>{link.label}{menu.key === "resources" && link.body && <span className="public-menu-description">{link.body}</span>}</span>
          </Link>;
        })}
      </div>)}
    </details>
  ));
  return menus.map((menu) => {
    const footerGroups = menu.groups.filter((group) => group.footer);
    return <DropdownMenu key={menu.key} dir={direction}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="public-nav-link public-menu-trigger">{menu.label}<CaretDownIcon size={14} aria-hidden="true" /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={14} className={`landing-dark public-mega-menu public-mega-menu-${menu.key}`} collisionPadding={20}>
        <div className="public-menu-columns">
          {menu.groups.filter((group) => !group.footer).map((group) => <div key={group.label}>
            <div className="public-menu-section-header">
              <DropdownMenuLabel className="public-menu-heading">{group.label}</DropdownMenuLabel>
              {group.body && <p className="public-menu-section-description">{group.body}</p>}
            </div>
            {group.links.map((link) => {
              const Icon = link.icon || ICONS[link.href] || group.icon;
              return <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className={`public-menu-item${link.featured ? " public-menu-item-featured" : ""}`} aria-current={pathname === link.href ? "page" : undefined}>
                  <span className="public-menu-icon"><Icon size={18} aria-hidden="true" /></span>
                  <span className="public-menu-text"><span className="public-menu-title">{link.label}</span>{link.body && <span className="public-menu-description">{link.body}</span>}</span>
                  <ArrowUpRightIcon size={14} aria-hidden="true" className="public-menu-arrow rtl:-scale-x-100" />
                </Link>
              </DropdownMenuItem>;
            })}
          </div>)}
        </div>
        {footerGroups.length > 0 && <div className="public-menu-footer">
          {footerGroups.flatMap((group) => group.links).map((link) => <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}<ArrowUpRightIcon size={14} aria-hidden="true" className="rtl:-scale-x-100" /></Link>
          </DropdownMenuItem>)}
        </div>}
      </DropdownMenuContent>
    </DropdownMenu>;
  });
}
