"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ReadCvLogoIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ArrowRight, LayoutDashboard, LogOut } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      if (isOpen) setIsOpen(false);
    }
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
    <div className="fixed top-0 left-0 right-0 z-50 w-full">
      <motion.div
        className="mx-auto mt-4 flex w-[calc(100%-3rem)] items-center justify-between gap-3 rounded-full border border-[var(--landing-line)] bg-[oklch(0.997_0.006_84_/_0.85)] py-2 pl-5 pr-2 shadow-[0_14px_34px_oklch(0.205_0.035_244_/_0.10)] backdrop-blur-xl md:w-[calc(100%-6rem)] md:max-w-[66rem] md:justify-between md:gap-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            className="flex items-center text-[var(--landing-primary)]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <ReadCvLogoIcon size={22} weight="bold" />
          </motion.span>
          <span className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">FitMyCv</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <a
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="text-sm font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
              >
                {item.label}
              </a>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA — session-aware */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-9 h-9 cursor-pointer">
                    <AvatarImage
                      src={session.user?.image}
                      alt={session.user?.name}
                    />
                    <AvatarFallback className="bg-[var(--landing-primary-dark)] text-[oklch(0.99_0.006_84)] text-sm font-semibold">
                      {getInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-[var(--landing-ink-soft)]">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--landing-primary-dark)] px-5 py-2.5 font-outfit text-sm font-extrabold text-[oklch(0.99_0.006_84)] transition-colors hover:bg-[var(--landing-primary)]"
            >
              Login
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </motion.div>

        {/* Mobile right side — avatar (when logged in) + menu button */}
        <div className="flex items-center gap-1 md:hidden">
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage
                      src={session.user?.image}
                      alt={session.user?.name}
                    />
                    <AvatarFallback className="bg-[var(--landing-primary-dark)] text-[oklch(0.99_0.006_84)] text-xs font-semibold">
                      {getInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-[var(--landing-ink-soft)]">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className="flex items-center rounded-lg p-2 text-[var(--landing-ink)]"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <ListIcon size={24} />
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[var(--landing-paper-soft)] px-6 pt-24 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 rounded-lg p-2 text-[var(--landing-ink)]"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <XIcon size={24} />
            </motion.button>

            <div className="flex flex-col space-y-6">
              {/* Logged-in: show user info at top */}
              {session && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-3 border-b border-[var(--landing-line)] pb-4"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={session.user?.image}
                      alt={session.user?.name}
                    />
                    <AvatarFallback className="bg-[var(--landing-primary-dark)] text-[oklch(0.99_0.006_84)] text-sm font-semibold">
                      {getInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--landing-ink)]">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-[var(--landing-ink-soft)]">
                      {session.user?.email}
                    </span>
                  </div>
                </motion.div>
              )}

              {navLinks.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <a
                    href={item.href}
                    className="text-base font-semibold text-[var(--landing-ink)]"
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                {session ? (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/dashboard"
                      className="landing-primary-btn w-full text-base"
                      onClick={toggleMenu}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        toggleMenu();
                        handleLogout();
                      }}
                      className="inline-flex w-full items-center justify-center px-5 py-3 text-base font-semibold text-red-600 transition-colors hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="landing-primary-btn w-full text-base"
                    onClick={toggleMenu}
                  >
                    Login
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Navbar1 };
