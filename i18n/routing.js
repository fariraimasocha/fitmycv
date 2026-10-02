import { defineRouting } from "next-intl/routing";

// English keeps its current URLs. The other languages get /fr, /es, /de so
// Google can index each one. The dashboard has no prefix and follows the
// NEXT_LOCALE cookie instead.
export const routing = defineRouting({
  locales: ["en", "fr", "es", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Page metadata already emits alternates.languages for translated pages.
  // The default Link headers also advertised English-only pages in every language.
  alternateLinks: false,
});

export const LOCALE_LABELS = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
};

// These stay English at their current URLs and live outside app/[locale].
// Files with an extension (og images, robots.txt, llm.txt) skip it too.
export const UNTRANSLATED =
  /^\/(dashboard|blog|cv-examples|resume-examples|jobs|print|support|payment)(\/|$)|\.[a-z0-9]+$/i;
