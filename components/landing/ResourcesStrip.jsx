import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

// Contextual internal links on the homepage. The footer carries navigation
// links to the same places; this band exists so the highest-value pages get a
// real in-content link with descriptive anchor text.
const RESOURCES = [
  { key: "tailor", href: "/tailor-cv-from-job-link" },
  { key: "match", href: "/resume-job-match-checker" },
  { key: "ats", href: "/ats-resume-checker" },
  { key: "atsGuide", href: "/blog/ats-resume-guide" },
  { key: "examples", href: "/resume-examples" },
];

export default function ResourcesStrip() {
  const t = useTranslations("landing.resources");

  return (
    <section className="landing-section-tight landing-tinted-band px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container">
        <div className="max-w-2xl">
          <h2 className="landing-section-title text-2xl sm:text-3xl">
            {t("title")}
          </h2>
          <p className="landing-copy mt-4 text-base">
            {t("body")}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {RESOURCES.map(({ key, href }) => (
            <Link key={href} href={href} className="minimal-card group block">
              <span className="minimal-card-inner flex h-full flex-col gap-2 p-6">
                <span className="font-outfit text-base font-extrabold text-[var(--landing-ink)]">
                  {t(`items.${key}.label`)}
                </span>
                <span className="text-sm leading-6 text-[var(--landing-ink-soft)]">
                  {t(`items.${key}.body`)}
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-outfit text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-primary-dark)]">
                  {t("open")}
                  <ArrowRightIcon
                    size={12}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
