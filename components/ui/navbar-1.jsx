"use client";

import { useState } from "react";
import { FileTextIcon, LayoutIcon, ListIcon, ShieldCheckIcon, SignOutIcon, XIcon } from "@phosphor-icons/react";
import PublicNavGroups from "@/components/landing/PublicNavGroups";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguagePicker from "@/components/LanguagePicker";
import AuthLink from "@/components/landing/AuthLink";
import { useSession, signOut } from "next-auth/react";
import BrandLogo from "@/components/BrandLogo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
const navLinks = [
  { key: "tailor", href: "/tailor-cv-from-job-link", icon: FileTextIcon },
  { key: "atsChecker", href: "/ats-resume-checker", icon: ShieldCheckIcon },
];

const Navbar1 = () => {
  const t = useTranslations("header");
  const r = useTranslations("landing.redesign");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="public-header">
      <div className="public-nav-container">
        <Link href="/" onClick={() => setIsOpen(false)} className="tap-target public-nav-brand flex flex-row items-center">
          <BrandLogo size="md" priority wordmarkClassName="text-xl" />
        </Link>

        <nav aria-label={r("resources")} className="public-nav-primary hidden items-center xl:flex">
          {navLinks.map((item) => (
            <Link key={item.key} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className="public-nav-link">{r(item.key)}</Link>
          ))}
          <PublicNavGroups />
          <Link href="/pricing" aria-current={pathname === "/pricing" ? "page" : undefined} className="public-nav-link">{t("pricing")}</Link>
        </nav>

        <div className="public-nav-actions hidden items-center gap-3 xl:flex">
          <LanguagePicker menuClassName="landing-dark" />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label={t("dashboard")} className="public-account-button">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={session.user?.image} alt={session.user?.name} />
                    <AvatarFallback className="bg-[var(--landing-primary)] text-xs font-semibold text-[var(--landing-on-primary)]">
                      {getInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="landing-dark w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex cursor-pointer items-center">
                    <LayoutIcon className="me-2 h-4 w-4" />
                    {t("dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <SignOutIcon className="me-2 h-4 w-4" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <AuthLink href="/auth" className="landing-primary-btn landing-primary-btn-sm">{t("signUp")}</AuthLink>
              <AuthLink href="/auth" className="landing-secondary-btn landing-secondary-btn-sm">{t("login")}</AuthLink>
            </>
          )}
        </div>

        <button
          type="button"
          id="public-menu-button" aria-expanded={isOpen} aria-controls="public-mobile-menu" className="inline-flex size-control items-center justify-center rounded-lg text-[var(--landing-ink)] xl:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        >
          {isOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
        </button>
      </div>

      {/* Unmount the mobile links when closed to keep them out of the tab order. */}
      {isOpen && (
        <nav id="public-mobile-menu" aria-label={r("resources")} className="public-mobile-menu xl:hidden" onKeyDown={(event) => {
          if (event.key === "Escape") { setIsOpen(false); document.getElementById("public-menu-button")?.focus(); }
        }}>
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="public-mobile-primary-link"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} aria-hidden="true" />
                {r(item.key)}
              </Link>
            ))}
            <PublicNavGroups mobile onNavigate={() => setIsOpen(false)} />
            <Link href="/pricing" onClick={() => setIsOpen(false)} aria-current={pathname === "/pricing" ? "page" : undefined} className="public-nav-link">{t("pricing")}</Link>
            <LanguagePicker align="start" className="self-start" menuClassName="landing-dark" />
            {session ? (
              <Link href="/dashboard" className="landing-primary-btn landing-primary-btn-sm w-full" onClick={() => setIsOpen(false)}>
                {t("dashboard")}
              </Link>
            ) : (
              <>
                <AuthLink
                  href="/auth"
                  className="landing-primary-btn landing-primary-btn-sm w-full"
                  onClick={() => setIsOpen(false)}
                >
                  {t("signUp")}
                </AuthLink>
                <AuthLink
                  href="/auth"
                  className="landing-secondary-btn landing-secondary-btn-sm w-full"
                  onClick={() => setIsOpen(false)}
                >
                  {t("login")}
                </AuthLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export { Navbar1 };
