import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";

// Next already emits <meta name="robots" content="noindex"> for not-found —
// declaring it here too would render the tag twice.
export const metadata = {
  title: "Page not found",
};

// ponytail: hand-picked links rather than a search box — three routes use
// dynamicParams:false, so most 404s are near-miss slugs these cover.
const links = [
  { label: "Tailor a CV from a job link", href: "/tailor-cv-from-job-link" },
  { label: "Resume examples", href: "/resume-examples" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-24 text-center">
        <div className="landing-container flex flex-col items-center">
          <p className="font-outfit text-sm font-bold uppercase tracking-widest text-[var(--landing-ink-soft)]">
            404
          </p>
          <h1
            className="mt-4 max-w-2xl font-outfit font-extrabold leading-[1.05] tracking-normal text-[var(--landing-ink)]"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            We couldn&apos;t find that page
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
            The link may be broken or the page may have moved. Here&apos;s where
            most people go next.
          </p>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-5 py-2.5 font-sans text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:border-[var(--landing-primary)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-8 font-sans text-sm font-semibold text-[var(--landing-ink-soft)] underline underline-offset-4 hover:text-[var(--landing-ink)]"
          >
            Back to the homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
