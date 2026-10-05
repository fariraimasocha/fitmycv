"use client";

import { useState } from "react";
import {
  CaretDownIcon,
  FileTextIcon,
  LayoutIcon,
  LinkedinLogoIcon,
  ListChecksIcon,
  ListIcon,
  ListMagnifyingGlassIcon,
  MagnifyingGlassIcon,
  PencilLineIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SparkleIcon,
  TargetIcon,
  TextAlignLeftIcon,
  TextHOneIcon,
  XIcon,
} from "@phosphor-icons/react";
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
import { FREE_TOOLS } from "@/lib/free-tools";

const navLinks = [
  { key: "jobs", href: "/jobs" },
  { key: "howItWorks", href: "/#how-it-works" },
  { key: "templates", href: "/cv-templates" },
  { key: "pricing", href: "/#pricing" },
  { key: "blog", href: "/blog" },
];

// Icons live here, not in lib/free-tools.js, so the footer and any server code
// that reads the catalog never pull in the icon set.
const TOOL_ICONS = {
  "/resume-job-match-checker": TargetIcon,
  "/ats-resume-checker": ShieldCheckIcon,
  "/free-ats-keyword-checker": MagnifyingGlassIcon,
  "/missing-resume-keywords": ListMagnifyingGlassIcon,
  "/resume-bullet-rewriter": PencilLineIcon,
  "/resume-headline-generator": TextHOneIcon,
  "/professional-summary-generator": TextAlignLeftIcon,
  "/job-description-to-resume-bullets": ListChecksIcon,
  "/resume-file-name-generator": FileTextIcon,
  "/linkedin-url-for-resume": LinkedinLogoIcon,
};

function ToolIcon({ href, size }) {
  const Icon = TOOL_ICONS[href] ?? SparkleIcon;
  return (
    <Icon
      size={size}
      aria-hidden="true"
      className="shrink-0 text-[var(--landing-accent)]"
    />
  );
}

const Navbar1 = () => {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSmoothScroll = (e, href) => {
    const hash = href.startsWith("/#") ? href.slice(1) : href;
    if (hash.startsWith("#") && (pathname === "/" || href.startsWith("#"))) {
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (isOpen) setIsOpen(false);
  };

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
    <header className="sticky top-0 z-50 w-full bg-[var(--landing-bg)]/95 backdrop-blur-sm">
      {/* Mirrors the hero exactly: outer section padding, then the shared
          container with its own inset. That puts the logo and the auth buttons
          on the same left and right edges as the hero's grid rules. */}
      <div className="px-5 sm:px-10 lg:px-16 xl:px-24">
        {/* Same rules as the hero, so the verticals run from the very top of the
            screen, down past the nav, and into the hero without a break. The
            pseudo-elements are absolutely positioned, so they are out of flow
            and never become flex items of this row. */}
        <div className="landing-container landing-rules flex h-16 items-center justify-between gap-6 px-4 sm:px-8">
        <Link href="/" className="tap-target flex flex-row items-center">
          <BrandLogo size="md" priority wordmarkClassName="text-xl" />
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-7 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className="tap-target text-sm font-medium text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
            >
              {t(item.key)}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="tap-target inline-flex items-center gap-1 text-sm font-medium text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
              >
                {t("freeTools")}
                <CaretDownIcon size={12} weight="bold" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={10}
              className="grid w-176 max-w-[calc(100vw-2rem)] grid-cols-2 gap-1 rounded-xl border-[var(--landing-line)] bg-[var(--landing-surface)] p-3 text-[var(--landing-ink)] shadow-lg"
            >
              {FREE_TOOLS.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link
                    href={tool.href}
                    className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5"
                  >
                    <span className="mt-0.5">
                      <ToolIcon href={tool.href} size={20} />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-semibold">{tool.label}</span>
                      <span className="text-xs leading-5 text-[var(--landing-ink-soft)]">
                        {tool.body}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguagePicker />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="focus:outline-none">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={session.user?.image} alt={session.user?.name} />
                    <AvatarFallback className="bg-[var(--landing-primary)] text-xs font-semibold text-white">
                      {getInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
              <AuthLink
                href="/auth"
                className="tap-target text-sm font-semibold text-[var(--landing-ink)] transition-colors duration-300 hover:text-[var(--landing-accent-dark)]"
              >
                {t("login")}
              </AuthLink>
              <AuthLink
                href="/auth"
                className="tap-target landing-primary-btn landing-primary-btn-sm font-outfit"
              >
                {t("tryFree")}
              </AuthLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-control items-center justify-center rounded-lg text-[var(--landing-ink)] md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        >
          {isOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
        </button>
        </div>
      </div>

      {/* Rendered only while open so its links stay out of the tab order when
          closed. The open state fades in with CSS; dropping framer-motion here
          takes ~44KB of JavaScript off every page that shows the header. */}
      {isOpen && (
        <div className="landing-rise max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-[var(--landing-line)] bg-[var(--landing-bg)] px-5 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-base font-medium text-[var(--landing-ink)]"
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)]">
                {t("freeTools")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FREE_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex min-h-11 items-start gap-2 rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] p-3 text-sm font-medium leading-5 text-[var(--landing-ink)] transition-colors active:bg-[var(--landing-bg)]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mt-0.5">
                      <ToolIcon href={tool.href} size={16} />
                    </span>
                    <span className="min-w-0">{tool.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <LanguagePicker align="start" className="self-start" />
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
                  {t("tryFree")}
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
        </div>
      )}
    </header>
  );
};

export { Navbar1 };
