import { Geist_Mono, DM_Sans, Outfit, Instrument_Serif, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/auth-provider";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { PUBLIC_MESSAGES, pickMessages } from "@/i18n/request";
import { RTL_LOCALES } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import ChatwootWidget from "@/components/ChatwootWidget";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { WebviewGateProvider } from "@/components/landing/WebviewGateProvider";

const dmSans = DM_Sans({
  variable: "--font-sn-pro",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tailor Your CV From a Job Link in Seconds | FitMyCV",
    template: "%s | FitMyCV",
  },
  description:
    "Tailor your CV and cover letter to any job description in seconds. AI-powered keyword matching, ATS optimization, and one-click PDF export.",
  // "tailor cv to job description" deliberately lives on
  // /tailor-cv-from-job-link, not here. Two pages chasing one head term split
  // the signal and neither wins it.
  keywords: [
    "tailor cv from job link",
    "tailor resume from job url",
    "paste job link to tailor resume",
    "tailored cv from job posting url",
    "ai resume from job link",
    "ai cv tailoring",
    "ats optimization",
    "ai cover letter from job link",
    "tailored resume",
    "resume tailoring",
  ],
  authors: [{ name: "FitMyCV" }],
  creator: "FitMyCV",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FitMyCV",
    title: "Tailor Your CV From a Job Link in Seconds | FitMyCV",
    description:
      "Tailor your CV and cover letter to any job description in seconds. AI-powered keyword matching, ATS optimization, and one-click PDF export.",
    images: [
      {
        url: "/social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "FitMyCV: Land more interviews with a CV that fits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailor Your CV From a Job Link in Seconds | FitMyCV",
    description:
      "Tailor your CV and cover letter to any job description in seconds. AI-powered keyword matching, ATS optimization, and one-click PDF export.",
    images: [
      {
        url: "/social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "FitMyCV: Land more interviews with a CV that fits",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/favicon/site.webmanifest",
};

export default async function RootLayout({ children }) {
  // The session is read here so useSession() has it on the first render.
  // Without it every dashboard page server-rendered a spinner and waited for
  // /api/auth/session. ponytail: this keeps every page dynamic; split the
  // marketing pages into their own root layout when they should prerender.
  const [locale, messages, session] = await Promise.all([getLocale(), getMessages(), auth()]);
  return (
    <html lang={locale} dir={RTL_LOCALES.includes(locale) ? "rtl" : "ltr"}>
      <body
        className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} ${instrumentSerif.variable} ${bricolage.variable} antialiased`}
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
