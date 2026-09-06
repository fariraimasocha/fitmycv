import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import CTABand from "@/components/landing/CTABand";
import JobsBrowser from "./JobsBrowser";

export const metadata = {
  title: "Remote Jobs From Company Career Pages",
  description:
    "Fresh remote jobs pulled straight from company career pages twice a day, posted by the employer rather than reposted by an aggregator. Find a role, then tailor your CV to it in one click.",
  keywords: [
    "remote jobs",
    "remote job board",
    "company career pages",
    "greenhouse remote jobs",
    "lever remote jobs",
    "remote software engineer jobs",
  ],
  alternates: {
    canonical: "/jobs",
  },
  openGraph: {
    type: "website",
    url: "/jobs",
    siteName: "FitMyCV",
    title: "Remote Jobs From Company Career Pages | FitMyCV",
    description:
      "Fresh remote jobs pulled straight from company career pages twice a day. Find a role, then tailor your CV to it in one click.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Remote jobs from company career pages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Jobs From Company Career Pages | FitMyCV",
    description:
      "Fresh remote jobs pulled straight from company career pages twice a day.",
    images: ["/og-image.jpg"],
  },
};

export default function JobsPage() {
  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden px-5 pb-10 pt-32 sm:px-10 lg:px-16 xl:px-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.994_0.008_84)_55%,transparent_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-120 bg-[radial-gradient(circle_at_50%_18%,oklch(0.94_0.02_84_/_0.7),transparent_30rem)]"
          />
          <div className="landing-container flex flex-col items-center text-center">
            <div className="landing-eyebrow">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--landing-primary)]" />
              Find Jobs
            </div>
            <h1
              className="font-serif-display mt-6 max-w-4xl font-normal leading-[1.02] tracking-normal text-[var(--landing-ink)]"
              style={{ fontSize: "clamp(36px, 5.4vw, 68px)" }}
            >
              Remote jobs, straight from the source.
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
              New roles twice a day, pulled straight from company career pages.
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-10 lg:px-16 xl:px-24">
          <JobsBrowser />
        </section>

        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
