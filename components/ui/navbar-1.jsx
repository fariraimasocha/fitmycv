"use client";

import { useState } from "react";
import { CaretDownIcon, LayoutIcon, ListIcon, SignOutIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
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
  { label: "Jobs", href: "/jobs" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/cv-templates" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
];

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--landing-bg)]/95 backdrop-blur-sm">
      <div className="landing-container flex h-16 items-center justify-between gap-6 px-5 sm:px-10 lg:px-16 xl:px-24">
        <Link href="/" className="flex flex-row items-center">
          <BrandLogo size="md" priority wordmarkClassName="text-xl" />
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-7 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className="text-sm font-medium text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
              >
                Free tools
                <CaretDownIcon size={12} weight="bold" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-72 border-[var(--landing-line)] bg-[var(--landing-surface)] p-1.5 text-[var(--landing-ink)]"
            >
              {FREE_TOOLS.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild>
                  <Link
                    href={tool.href}
                    className="flex cursor-pointer flex-col items-start gap-0.5 rounded-md px-3 py-2"
                  >
                    <span className="text-sm font-medium">{tool.label}</span>
                    <span className="text-xs leading-5 text-[var(--landing-ink-soft)]">
                      {tool.body}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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
                    <LayoutIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <SignOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" className="landing-primary-btn landing-primary-btn-sm">
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[var(--landing-ink)] md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
        </button>
      </div>

      {/* Rendered only while open so its links stay out of the tab order when
          closed. The open state fades in with CSS; dropping framer-motion here
          takes ~44KB of JavaScript off every page that shows the header. */}
      {isOpen && (
        <div className="landing-rise border-t border-[var(--landing-line)] bg-[var(--landing-bg)] px-5 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-base font-medium text-[var(--landing-ink)]"
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-ink-soft)]">
                Free tools
              </p>
              {FREE_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="text-base font-medium text-[var(--landing-ink)]"
                  onClick={() => setIsOpen(false)}
                >
                  {tool.label}
                </Link>
              ))}
            </div>
            {session ? (
              <Link href="/dashboard" className="landing-primary-btn landing-primary-btn-sm w-full" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <Link href="/auth" className="landing-primary-btn landing-primary-btn-sm w-full" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar1 };
