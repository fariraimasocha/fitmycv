"use client";

// Catches errors thrown in the root layout itself, which app/error.js
// cannot reach. Without this file Next renders its plain "This page
// couldn't load" fallback with no site chrome. This boundary replaces the
// whole document, so it carries its own <html> and inline styles.
//
// It also sits outside NextIntlClientProvider, so it bundles the errors
// messages itself and picks the language from the URL prefix or the
// NEXT_LOCALE cookie. The server render and hydration always use English,
// then the client switches, which avoids a hydration mismatch.
import { useEffect, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { createTranslator } from "next-intl";
import en from "@/messages/en/errors.json";
import fr from "@/messages/fr/errors.json";
import es from "@/messages/es/errors.json";
import de from "@/messages/de/errors.json";
import pt from "@/messages/pt/errors.json";
import zh from "@/messages/zh/errors.json";
import ar from "@/messages/ar/errors.json";
import { RTL_LOCALES } from "@/i18n/routing";

const MESSAGES = { en, fr, es, de, pt, zh, ar };

function detectLocale() {
  const prefix = window.location.pathname.split("/")[1];
  if (Object.hasOwn(MESSAGES, prefix)) return prefix;
  const cookie = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)?.[1];
  return cookie && Object.hasOwn(MESSAGES, cookie) ? cookie : "en";
}

const subscribe = () => () => {};

const STYLES = `
  body { margin: 0; background: #f7f4ef; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .card { max-width: 520px; width: 100%; text-align: center; }
  .brand { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #5c5c5c; }
  h1 { font-size: 40px; line-height: 1.1; font-weight: 400; color: #1a1a1a; margin: 24px 0 0; }
  p { font-size: 18px; line-height: 1.6; font-weight: 600; color: #5c5c5c; margin: 16px 0 0; }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 28px; }
  a, button { font: inherit; }
  .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid #1a1a1a; background: #1a1a1a; color: #f7f4ef; }
  .btn-secondary { background: #ffffff; color: #1a1a1a; border-color: #e3ddd4; }
  footer { margin-top: 28px; font-size: 13px; font-weight: 600; color: #5c5c5c; }
  footer a { color: #1a1a1a; font-weight: 700; }
`;

export default function GlobalError({ error }) {
  const locale = useSyncExternalStore(subscribe, detectLocale, () => "en");
  const t = createTranslator({
    locale,
    messages: { errors: MESSAGES[locale] },
    namespace: "errors.global",
  });

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.captureException(error);
    }
    console.error("Global page error:", error);
  }, [error]);

  const handleReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("retry", String(Date.now()));
    window.location.assign(url.toString());
  };

  return (
    <html lang={locale} dir={RTL_LOCALES.includes(locale) ? "rtl" : "ltr"}>
      <head>
        <title>{t("docTitle")}</title>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      </head>
      <body>
        <div className="wrap">
          <div className="card">
            <span className="brand">FitMyCV</span>
            <h1>{t("title")}</h1>
            <p>{t("body")}</p>
            <div className="actions">
              <button type="button" className="btn" onClick={handleReload}>
                {t("retry")}
              </button>
              {/* A full page load on purpose: the root layout just crashed. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="btn btn-secondary">
                {t("home")}
              </a>
            </div>
            <footer>
              {t.rich("support", {
                // eslint-disable-next-line @next/next/no-html-link-for-pages
                link: (chunks) => <a href="/support">{chunks}</a>,
              })}
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}