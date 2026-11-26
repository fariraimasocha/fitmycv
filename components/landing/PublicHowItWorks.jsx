import { useLocale, useTranslations } from "next-intl";
import { getHomeSteps } from "@/content/pages/home";

export default function PublicHowItWorks() {
  const t = useTranslations("landing.howItWorks");
  const steps = getHomeSteps(useLocale());
  return <section id="how-it-works" className="public-section public-start-section">
    <div className="public-container">
      <p className="public-eyebrow">{t("eyebrow")}</p>
      <h2 className="public-section-title">{t("title")}</h2>
      <ol className="public-how-steps">{steps.map((step) => <li key={step.num}>
        <span className="public-step-number" aria-hidden="true">{step.num}</span>
        <h3>{step.title}</h3>
        <p className="public-copy">{step.copy}</p>
      </li>)}</ol>
    </div>
  </section>;
}
