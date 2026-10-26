// Tiny Dualmark settings shared by proxy.js. Keep this file free of content
// registries so the proxy bundle stays small.
import { routing } from "../i18n/routing";
import { SITE_URL } from "./site";

export const DUALMARK_SITE_URL = SITE_URL;

export const DUALMARK_SKIP_PATHS = [
  "/dashboard",
  "/api",
  "/print",
  "/payment",
  "/auth",
  ...routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => `/${locale}`),
];
