"use client";

import { CheckIcon, GlobeIcon } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { LOCALE_LABELS, UNTRANSLATED, routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const YEAR = 60 * 60 * 24 * 365;

// ponytail: emoji flags, no assets. Windows has no flag emoji and shows the
// two letters instead (GB, FR). Swap in SVG flags if that matters.
const LOCALE_FLAGS = {
  en: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸",
  de: "🇩🇪",
  pt: "🇧🇷",
  zh: "🇨🇳",
  ar: "🇸🇦",
};

function saveLocaleCookie(locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${YEAR}; samesite=lax`;
}

export default function LanguagePicker({ className, menuClassName, align = "end" }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const choose = (next) => {
    if (next === locale) return;
    saveLocaleCookie(next);
    // A full page load, not router.replace. The root layout owns <html lang>
    // and the message provider, and Next keeps it mounted across client
    // navigations, so a soft switch left the old language in place and the
    // next switch built URLs like /de/fr. The dashboard and blog have no /fr
    // URLs, so they reload in place with the new cookie.
    const { search, hash } = window.location;
    if (UNTRANSLATED.test(pathname)) window.location.reload();
    else window.location.assign(getPathname({ href: pathname, locale: next }) + search + hash);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("language")}
          className={cn(
            "tap-target inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:text-[var(--landing-accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2",
            className
          )}
        >
          <GlobeIcon size={18} aria-hidden="true" />
          <span className="uppercase">{locale}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("w-40", menuClassName)}>
        {routing.locales.map((code) => (
          <DropdownMenuItem
            key={code}
            lang={code}
            onClick={() => choose(code)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{LOCALE_FLAGS[code]}</span>
              {LOCALE_LABELS[code]}
            </span>
            {code === locale ? <CheckIcon size={14} aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
