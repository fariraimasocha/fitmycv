import { Geist_Mono, DM_Sans, Outfit, Caveat } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/auth-provider";
import ToastProvider from "@/components/providers/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import PostHogProvider from "@/components/providers/PostHogProvider";
import PostHogIdentify from "@/components/providers/PostHogIdentify";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import {
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
} from "@/lib/structured-data";

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

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tailor Your CV From a Job Link in Seconds | FitMyCV",
    template: "%s | FitMyCV",
  },
  description:
    "Tailor your CV and cover letter to any job description in seconds. AI-powered keyword matching, ATS optimization, and one-click PDF export.",
  keywords: [
    "tailor cv from job link",
    "tailor resume from job url",
    "paste job link to tailor resume",
    "tailored cv from job posting url",
    "ai resume from job link",
    "tailor cv to job description",
    "tailor cv to job description in seconds",
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
        url: "/hero.jpg",
        width: 2116,
        height: 1248,
        alt: "FitMyCV — Land more interviews with a CV that fits",
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
        url: "/hero.jpg",
        width: 2116,
        height: 1248,
        alt: "FitMyCV — Land more interviews with a CV that fits",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={softwareApplicationSchema} />
        <PostHogProvider>
          <QueryProvider>
            <AuthProvider>
              <PostHogIdentify />
              {children}
              <ToastProvider />
            </AuthProvider>
          </QueryProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
