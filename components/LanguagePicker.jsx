"use client";

import { useTransition } from "react";
import { CheckIcon, GlobeIcon } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter as useNextRouter } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_LABELS, UNTRANSLATED, routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const YEAR = 60 * 60 * 24 * 365;

export default function LanguagePicker({ className, align = "end" }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const [isPending, startTransition] = useTransition();

  const choose = (next) => {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${YEAR}; samesite=lax`;
    startTransition(() => {
      // The dashboard and blog have no /fr URLs, so re-render in place with
      // the new cookie. Translated pages move to their localized URL.
      if (UNTRANSLATED.test(pathname)) nextRouter.refresh();
      else router.replace(pathname, { locale: next });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("language")}
          disabled={isPending}
          className={cn(
            "tap-target inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:text-[var(--landing-accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2",
            className
          )}
        >
          <GlobeIcon size={18} aria-hidden="true" />
          <span className="uppercase">{locale}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-40">
        {routing.locales.map((code) => (
          <DropdownMenuItem
            key={code}
            lang={code}
            onClick={() => choose(code)}
            className="flex cursor-pointer items-center justify-between"
          >
            {LOCALE_LABELS[code]}
            {code === locale ? <CheckIcon size={14} aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
