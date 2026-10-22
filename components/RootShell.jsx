import {
  Geist_Mono,
  DM_Sans,
  Outfit,
  Instrument_Serif,
  Bricolage_Grotesque,
  Merriweather,
  Source_Sans_3,
  Inter,
  Lato,
  Roboto,
  Open_Sans,
  Carlito,
  EB_Garamond,
  Lora,
  Libre_Baskerville,
} from "next/font/google";
import "@/app/globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { PUBLIC_MESSAGES, pickMessages } from "@/i18n/request";
import { RTL_LOCALES } from "@/i18n/routing";
import JsonLd from "@/components/JsonLd";
import ChatwootWidget from "@/components/ChatwootWidget";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { WebviewGateProvider } from "@/components/landing/WebviewGateProvider";

// The marketing and dashboard shells use Bricolage in place of DM Sans and
// Outfit, so these three load only when a page uses them. Their preloads
// slowed the CSS that must load before the homepage can paint.
const dmSans = DM_Sans({
  variable: "--font-sn-pro",
  subsets: ["latin"],
  preload: false,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// Marketing pages only, through .landing-dark in globals.css.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

// CV body fonts for the template font picker (utils/cv-templates/style.js).
// preload: false, so a page only downloads a face once a CV actually uses it.
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  preload: false,
});
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const carlito = Carlito({
  variable: "--font-carlito",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  preload: false,
});
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const cvFontVariables = [
  merriweather, sourceSans, inter, lato, roboto, openSans, carlito, garamond, lora, baskerville,
].map((font) => font.variable).join(" ");

// <html>, fonts and providers for every root layout. The public layouts pass
// no session, so they read nothing per request and can be prerendered; the
// session then loads in the browser. Only app/(app) passes one, because the
// dashboard should not render a spinner while it waits for /api/auth/session.
export default function RootShell({ locale, messages, session, children }) {
  return (
    <html lang={locale} dir={RTL_LOCALES.includes(locale) ? "rtl" : "ltr"}>
      <body
        className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} ${instrumentSerif.variable} ${bricolage.variable} ${cvFontVariables} antialiased`}
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <NextIntlClientProvider messages={pickMessages(messages, PUBLIC_MESSAGES)}>
          <QueryProvider>
            <AuthProvider session={session}>
              <WebviewGateProvider>
                {children}
                <Toaster position="top-center" />
                <ChatwootWidget />
              </WebviewGateProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_fwNMP7eI8dri3WgAXVMaz"
          data-domain="fitmycv.link"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
