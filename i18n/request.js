import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// One file per area so the copy for each part of the app can be edited on its
// own. Add a namespace here when you add a file under messages/<locale>/.
const NAMESPACES = ["header", "landing", "pages", "auth", "errors", "onboarding", "dashboard", "tailor"];

export default getRequestConfig(async ({ requestLocale }) => {
  // Pages under app/[locale] pass their segment. Everything else (the
  // dashboard) falls back to the language the visitor last picked.
  let locale = await requestLocale;
  if (!hasLocale(routing.locales, locale)) {
    locale = (await cookies()).get("NEXT_LOCALE")?.value;
  }
  if (!hasLocale(routing.locales, locale)) locale = routing.defaultLocale;

  return {
    locale,
    messages: Object.fromEntries(
      await Promise.all(
        NAMESPACES.map(async (ns) => [ns, (await import(`../messages/${locale}/${ns}.json`)).default]),
      ),
    ),
  };
});

// Messages the browser needs outside the dashboard. The dashboard layout
// passes everything; public pages only get these, which keeps roughly 65KB of
// dashboard copy out of every landing page. Dotted paths pick one subtree.
export const PUBLIC_MESSAGES = ["header", "landing", "pages", "auth", "errors", "tailor.styleToolbar"];

export function pickMessages(messages, paths) {
  const out = {};
  for (const path of paths) {
    const [ns, ...rest] = path.split(".");
    const value = rest.reduce((node, key) => node?.[key], messages[ns]);
    if (value === undefined) continue;
    if (!rest.length) out[ns] = value;
    else {
      let node = (out[ns] ??= {});
      rest.slice(0, -1).forEach((key) => (node = node[key] ??= {}));
      node[rest.at(-1)] = value;
    }
  }
  return out;
}
