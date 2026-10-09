import PricingCards from "@/components/pricing/PricingCards";
import RevealWords from "@/components/landing/RevealWords";
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
        <RevealWords
          text={`${t("titleLine1")} <accent>${t("titleLine2")}</accent>`}
          className="max-w-3xl font-outfit text-4xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-5xl"
        />
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
