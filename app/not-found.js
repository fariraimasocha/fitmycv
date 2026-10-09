import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";

// Next already emits <meta name="robots" content="noindex"> for not-found.
// declaring it here too would render the tag twice.
export async function generateMetadata() {
  const t = await getTranslations("errors.notFound");
  return { title: t("metaTitle") };
}

// ponytail: hand-picked links rather than a search box. Most 404s that a real
// person hits are near-miss slugs on the marketing, blog and examples routes,
// which these four links cover.
const links = [
  { key: "tailor", href: "/tailor-cv-from-job-link" },
  { key: "resumeExamples", href: "/resume-examples" },
  { key: "blog", href: "/blog" },
  { key: "pricing", href: "/pricing" },
];

export default function NotFound() {
  const t = useTranslations("errors.notFound");

  return (
    <div className="landing-root min-h-screen">
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-24 text-center">
        <div className="landing-container flex flex-col items-center">
          <p className="font-outfit text-sm font-bold uppercase tracking-widest text-[var(--landing-ink-soft)]">
            {t("eyebrow")}
          </p>
          <h1
            className="font-serif-display mt-4 max-w-2xl font-normal leading-[1.05] tracking-normal text-[var(--landing-ink)]"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
            {t("body")}
          </p>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {links.map(({ key, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-5 py-2.5 font-sans text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:border-[var(--landing-primary)]"
                >
                  {t(`links.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-8 font-sans text-sm font-semibold text-[var(--landing-ink-soft)] underline underline-offset-4 hover:text-[var(--landing-ink)]"
          >
            {t("home")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
