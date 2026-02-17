import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/auth-provider";
import { Toaster } from "react-hot-toast";

const snPro = localFont({
  src: [
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-200-normal.woff2", weight: "200", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-900-normal.woff2", weight: "900", style: "normal" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-200-italic.woff2", weight: "200", style: "italic" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-700-italic.woff2", weight: "700", style: "italic" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-800-italic.woff2", weight: "800", style: "italic" },
    { path: "../node_modules/@fontsource/sn-pro/files/sn-pro-latin-900-italic.woff2", weight: "900", style: "italic" },
  ],
  variable: "--font-sn-pro",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FitMyCV",
  description: "Tailor your CV and cover letter for any job posting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${snPro.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {/* <AuthProvider>*/}
          {children}
          <Toaster position="bottom-right" />
          {/* </AuthProvider>*/}
        </QueryProvider>
      </body>
    </html>
  );
}
