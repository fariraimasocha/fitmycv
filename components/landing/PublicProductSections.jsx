import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon, BriefcaseIcon, CheckCircleIcon, LinkedinLogoIcon, ScanIcon, TargetIcon, XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { ProductImage } from "@/components/landing/ProductPreview";

export function ProductStories({ tailorOnly = false }) {
  const t = useTranslations("landing.suite");
  const r = useTranslations("landing.redesign");
  // Each link label must say where it goes: "Scan my CV for free" is the ATS
  // checker, and the tracker row names the page instead of "Start with a job link".
  const rows = tailorOnly ? [
    { key: "link", image: "/landing/job-link.png", href: "/#start-tailoring" },
    { key: "cv", image: "/landing/tailored-cv.png", href: "/ats-resume-checker" },
    { key: "letter", image: "/landing/cover-letter.png", href: "/ai-cover-letter-generator" },
  ] : [
    // The hero preview already shows the tailored CV, so the stories start
    // at the paste step instead of repeating that screenshot.
    { key: "link", image: "/landing/job-link.png", href: "/tailor-cv-from-job-link" },
    { key: "tracker", image: "/landing/applications.png", href: "/job-tracker", cta: r("tracker") },
    { key: "letter", image: "/landing/cover-letter.png", href: "/ai-cover-letter-generator" },
  ];
  return <section id="product" className="public-section"><div className="public-container public-stories">
    {rows.map((row, index) => <article key={row.key} className={`public-story ${index % 2 ? "public-story-reverse" : ""}`}>
      <div className="public-story-copy"><p className="public-eyebrow">{t(`rows.${row.key}.label`)}</p><h2 className="public-section-title">{t(`rows.${row.key}.title`)}</h2><p className="public-copy">{t(`rows.${row.key}.body`)}</p><Link href={row.href} className="public-text-link">{row.cta ?? t(`rows.${row.key}.cta`)}<ArrowRightIcon size={18} aria-hidden="true" className="rtl:-scale-x-100" /></Link></div>
      <ProductImage image={row.image} alt={t(`rows.${row.key}.alt`)} tracker={row.key === "tracker"} />
    </article>)}
  </div></section>;
}

// The free tools as plain links, kept on the home page for people who want a
// quick check before signing up (and for internal links).
// The ATS checker's real output: required terms marked found or missing.
// Sample terms, tagged "Example" on the tile.
const SAMPLE_MISSING = ["Kubernetes", "Terraform", "SLOs", "Postgres"];
const SAMPLE_FOUND = ["Python", "AWS", "CI/CD"];

function Term({ label, found }) {
  const Icon = found ? CheckCircleIcon : XCircleIcon;
  return <span className={`bento-term ${found ? "" : "bento-term-missing"}`}>
    <Icon size={14} weight="fill" aria-hidden="true" />{label}
  </span>;
}

function ToolTile({ toolKey, href, icon: Icon, className = "", children }) {
  const t = useTranslations("landing.suite");
  return <Link href={href} className={`bento-tile ${className}`}>
    <span className="bento-head">
      <Icon size={22} aria-hidden="true" className="bento-icon" />
      <ArrowRightIcon size={18} aria-hidden="true" className="bento-arrow rtl:-scale-x-100" />
    </span>
    {children}
    <span className="bento-copy">
      <span className="bento-title">{t(`free.${toolKey}.title`)}</span>
      <span className="bento-body">{t(`free.${toolKey}.body`)}</span>
    </span>
  </Link>;
}

// Bento: the ATS checker leads with a large tile that shows what it finds,
// the match checker runs wide, LinkedIn and the job board sit under it.
// Every tile is one link, so the tools stay crawlable for SEO.
export function FreeToolsLinks() {
  const t = useTranslations("landing.suite");
  return <section className="public-section"><div className="public-container">
    <h2 className="public-section-title text-center">{t("freeTitle")}</h2>
    <p className="public-copy mx-auto mt-4 text-center">{t("freeBody")}</p>
    <div className="bento-grid">
      <ToolTile toolKey="ats" href="/ats-resume-checker" icon={ScanIcon} className="bento-lead">
        <span className="bento-sample">
          <span className="bento-sample-tag">{t("free.example")}</span>
          <span className="bento-terms">
            {SAMPLE_MISSING.map((term) => <Term key={term} label={term} />)}
            {SAMPLE_FOUND.map((term) => <Term key={term} label={term} found />)}
          </span>
        </span>
      </ToolTile>
      <ToolTile toolKey="match" href="/resume-job-match-checker" icon={TargetIcon} className="bento-wide" />
      <ToolTile toolKey="linkedin" href="/linkedin-profile-checker" icon={LinkedinLogoIcon} />
      <ToolTile toolKey="jobs" href="/jobs" icon={BriefcaseIcon} />
    </div>
  </div></section>;
}
