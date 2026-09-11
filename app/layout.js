import { Geist_Mono, DM_Sans, Outfit, Instrument_Serif, Merriweather, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/auth-provider";
import ToastProvider from "@/components/providers/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

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

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
        url: "/og-image.jpg",
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
        url: "/og-image.jpg",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} ${instrumentSerif.variable} ${merriweather.variable} ${sourceSans.variable} antialiased`}
      >
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </QueryProvider>
        <Analytics />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="a238c633-7560-473f-b36e-9b3eadb168f6"
          strategy="afterInteractive"
        />
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_fwNMP7eI8dri3WgAXVMaz"
          data-domain="fitmycv.link"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
