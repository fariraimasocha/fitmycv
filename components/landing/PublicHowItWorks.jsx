"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { getHomeSteps } from "@/content/pages/home";
import { ProductImage, useTabs } from "@/components/landing/ProductPreview";
import { trackEvent } from "@/lib/analytics";

// One real screen per step, in the same order as HOME_STEPS.
const STEP_IMAGES = ["/landing/job-link.png", "/landing/tailored-cv.png", "/landing/cover-letter.png"];

// Teal's how it works: one large panel with the step's screen and copy, the
// numbered steps as tabs under it, and the main action below. The steps also
// feed the HowTo schema, so what people read matches what search engines get.
export default function PublicHowItWorks() {
  const t = useTranslations("landing.howItWorks");
  const tHero = useTranslations("landing.hero");
  const steps = getHomeSteps(useLocale());
  const { active, props, panelProps } = useTabs(steps.length, (index) =>
    trackEvent("how_it_works_step_selected", { step: index + 1 }),
  );

  return <section id="how-it-works" className="public-section public-start-section">
    <div className="public-container">
      <p className="public-eyebrow text-center">{t("eyebrow")}</p>
      <h2 className="public-section-title text-center">{t("title")}</h2>
      {steps.map((step, index) => <div key={step.num} {...panelProps(index)} className="steps-panel">
        <div className="steps-shot">
          <ProductImage image={STEP_IMAGES[index]} alt={step.title} tracker={false} />
        </div>
        <div className="steps-copy">
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </div>
      </div>)}
      <div role="tablist" aria-label={t("title")} className="steps-tabs">
        {steps.map((step, index) => <button key={step.num} {...props(index)}>
          <span className="steps-tab-number" aria-hidden="true">{index + 1}</span>
          {step.title}
        </button>)}
      </div>
      <div className="mt-10 flex justify-center">
        <Link href="/#start-tailoring" className="landing-primary-btn feature-cta" onClick={() => trackEvent("how_it_works_cta")}>
          {tHero("tailorCta")}
          <ArrowRightIcon size={18} aria-hidden="true" className="rtl:-scale-x-100" />
        </Link>
      </div>
    </div>
  </section>;
}
