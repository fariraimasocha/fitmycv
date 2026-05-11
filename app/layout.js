import { Geist_Mono, DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/auth-provider";
import ToastProvider from "@/components/providers/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

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

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://fitmycv.link"
  ),
  title: {
    default: "FitMyCV — AI-Powered CV Tailoring",
    template: "%s | FitMyCV",
  },
  description:
    "Tailor your CV and cover letter to any job description in seconds. AI-powered keyword matching, ATS optimization, and one-click PDF export.",
  keywords: [
    "CV tailoring",
    "resume tailoring",
    "AI resume",
    "cover letter generator",
    "ATS optimization",
    "job application",
    "tailored resume",
  ],
  authors: [{ name: "FitMyCV" }],
  creator: "FitMyCV",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FitMyCV",
    title: "FitMyCV — AI-Powered CV Tailoring",
    description:
      "Tailor your CV and cover letter to any job description in seconds. AI-powered keyword matching, ATS optimization, and one-click PDF export.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FitMyCV — Land more interviews with a CV that fits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitMyCV — AI-Powered CV Tailoring",
    description:
      "Tailor your CV and cover letter to any job description in seconds. AI-powered keyword matching, ATS optimization, and one-click PDF export.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_cdiVXmqmHhypbU5Znt1vC"
          data-domain="fitmycv.link"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${dmSans.variable} ${outfit.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
