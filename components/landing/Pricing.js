import PricingCards from "@/components/pricing/PricingCards";
import { getTranslations } from "next-intl/server";
import { getServerPricing } from "@/lib/server-pricing";

export default async function Pricing() {
  const { pricing, tier } = await getServerPricing();
  const t = await getTranslations("pages.pricing");

  return (
    <section
      id="pricing"
      className="landing-section landing-muted-band flex flex-col items-center gap-10"
    >
      <div className="landing-container flex flex-col items-center gap-5">
        <span className="landing-eyebrow">{t("eyebrow")}</span>
        <h2 className="landing-section-title text-center text-3xl sm:text-4xl lg:text-5xl">
          {t("titleLine1")}
          <br />
          <span className="landing-accent-tail">{t("titleLine2")}</span>
        </h2>
        <p className="landing-copy text-center text-lg">
          {t("intro")}
        </p>
      </div>

      <div className="landing-container w-full">
        <PricingCards pricing={pricing} tier={tier} />
        <p className="mx-auto mt-8 max-w-lg text-center text-xs text-[var(--landing-ink-soft)]">
          {t("footnote")}
        </p>
        {tier === "standard" ? (
          <p className="mx-auto mt-2 max-w-lg text-center text-xs text-[var(--landing-ink-soft)]">
            {t("regionalAvailable")}
          </p>
        ) : null}
      </div>
    </section>
  );
}
