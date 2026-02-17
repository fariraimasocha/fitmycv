import { Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/providers/auth-provider";
import ToastProvider from "@/components/providers/ToastProvider";

const dmSans = DM_Sans({
  variable: "--font-sn-pro",
  subsets: ["latin"],
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
        className={`${dmSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {/* <AuthProvider>*/}
          {children}
          <ToastProvider />
          {/* </AuthProvider>*/}
        </QueryProvider>
      </body>
    </html>
  );
}
