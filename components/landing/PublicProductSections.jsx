import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
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
    { key: "cv", image: "/landing/tailored-cv.png", href: "/ats-resume-checker" },
    { key: "tracker", image: "/landing/applications.png", href: "/job-tracker", cta: r("tracker") },
    { key: "letter", image: "/landing/cover-letter.png", href: "/ai-cover-letter-generator" },
  ];
  return <section id="product" className="public-section"><div className="public-container public-stories">
    {rows.map((row, index) => <article key={row.key} className={`public-story ${index % 2 ? "public-story-reverse" : ""}`}>
      <div className="public-story-copy"><p className="public-eyebrow">{t(`rows.${row.key}.label`)}</p><h2 className="public-section-title">{t(`rows.${row.key}.title`)}</h2><p className="public-copy">{t(`rows.${row.key}.body`)}</p><Link href={row.href} className="public-text-link">{row.cta ?? t(`rows.${row.key}.cta`)}<ArrowRightIcon size={18} aria-hidden="true" className="rtl:-scale-x-100" /></Link></div>
      <ProductImage image={row.image} alt={t(`rows.${row.key}.alt`)} tracker={row.key === "tracker"} />
    </article>)}
    {!tailorOnly && <div className="public-tools-links"><div><p className="public-eyebrow">{r("tools")}</p><h2 className="public-section-title">{t("freeTitle")}</h2><p className="public-copy">{t("freeBody")}</p></div><div>{[{ key:"ats", href:"/ats-resume-checker" },{ key:"match", href:"/resume-job-match-checker" },{ key:"linkedin", href:"/linkedin-profile-checker" },{ key:"jobs", href:"/jobs" }].map(({key,href}) => <Link key={key} href={href} className="public-text-link">{t(`free.${key}.title`)}<ArrowRightIcon size={16} aria-hidden="true" className="rtl:-scale-x-100" /></Link>)}</div></div>}
  </div></section>;
}
