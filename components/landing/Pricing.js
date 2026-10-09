import PricingCards from "@/components/pricing/PricingCards";
import { getTranslations } from "next-intl/server";
import { getServerPricing } from "@/lib/server-pricing";

export default async function Pricing() {
  const { pricing, tier } = await getServerPricing();
  const t = await getTranslations("pages.pricing");

  return (
    <section
      id="pricing"
      className="landing-section landing-muted-band flex flex-col gap-10"
    >
      <div className="landing-container flex flex-col gap-4">
        <span className="landing-eyebrow-plain">{t("eyebrow")}</span>
        <h2 className="landing-section-title text-3xl sm:text-4xl">
          {t("titleLine1")}
          <br />
          <span className="landing-accent-tail">{t("titleLine2")}</span>
        </h2>
        <p className="landing-copy max-w-xl text-lg">
          {t("intro")}
        </p>
      </div>

      <div className="landing-container w-full">
        <PricingCards pricing={pricing} tier={tier} />
        <p className="mt-6 max-w-lg text-xs text-[var(--landing-ink-soft)]">
          {t("footnote")}
        </p>
        {tier === "standard" ? (
          <p className="mt-2 max-w-lg text-xs text-[var(--landing-ink-soft)]">
            {t("regionalAvailable")}
          </p>
        ) : null}
      </div>
    </section>
  );
}
