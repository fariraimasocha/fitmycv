import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import RevealWords from "@/components/landing/RevealWords";

// Real screenshots of the app, captured with sample contact details in place
// of a real person's. Recapture them when the screens change.
const ROWS = [
  { key: "link", image: "/landing/job-link.png", href: "/tailor-cv-from-job-link" },
  { key: "cv", image: "/landing/tailored-cv.png", href: "/ats-resume-checker" },
  { key: "letter", image: "/landing/cover-letter.png", href: "/ai-cover-letter-generator" },
  { key: "tracker", image: "/landing/applications.png", href: "/tailor-cv-from-job-link" },
];

// Free pages that run without an account. Every href is a live page.
const FREE = [
  { key: "ats", href: "/ats-resume-checker" },
  { key: "match", href: "/resume-job-match-checker" },
  { key: "linkedin", href: "/linkedin-profile-checker" },
  { key: "jobs", href: "/jobs" },
];

export default function ProductSuite() {
  const t = useTranslations("landing.suite");

  return (
    <section id="product" className="landing-section">
      <div className="landing-container">
        <span className="landing-eyebrow-plain">{t("eyebrow")}</span>
        <RevealWords
          text={t("title")}
          className="mt-4 max-w-2xl font-outfit text-4xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-5xl"
        />

        <div className="mt-14 space-y-16 sm:space-y-24">
          {ROWS.map(({ key, image, href }, index) => (
            <div key={key} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className={`lg:col-span-4 ${index % 2 ? "lg:order-2" : ""}`}>
                <p className="tag-accent">{t(`rows.${key}.label`)}</p>
                <h3 className="mt-3 font-outfit text-2xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-3xl">
                  {t(`rows.${key}.title`)}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--landing-ink-soft)]">
                  {t(`rows.${key}.body`)}
                </p>
                <Link
                  href={href}
                  className="mt-5 inline-flex items-center gap-1.5 font-outfit text-sm font-semibold text-[var(--landing-ink)] underline-offset-4 hover:text-[var(--landing-accent)] hover:underline"
                >
                  {t(`rows.${key}.cta`)}
                  <ArrowRightIcon size={16} aria-hidden="true" className="rtl:-scale-x-100" />
                </Link>
              </div>
              <div className={`lg:col-span-8 ${index % 2 ? "lg:order-1" : ""}`}>
                <div className="overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] shadow-[var(--landing-shadow-sm)]">
                  <Image
                    src={image}
                    alt={t(`rows.${key}.alt`)}
                    width={1568}
                    height={726}
                    sizes="(min-width: 1024px) 760px, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-[var(--landing-line)] pt-10">
          <h3 className="font-outfit text-xl font-bold tracking-tight text-[var(--landing-ink)]">
            {t("freeTitle")}
          </h3>
          <p className="mt-2 text-sm text-[var(--landing-ink-soft)]">{t("freeBody")}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FREE.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="flex h-full flex-col rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4 transition-colors hover:border-[var(--landing-ink-soft)]"
                >
                  <span className="font-outfit text-base font-semibold text-[var(--landing-ink)]">
                    {t(`free.${key}.title`)}
                  </span>
                  <span className="mt-1 text-sm text-[var(--landing-ink-soft)]">{t(`free.${key}.body`)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
