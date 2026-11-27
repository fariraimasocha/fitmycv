import PricingCards from "@/components/pricing/PricingCards";
import RevealWords from "@/components/landing/RevealWords";
import { getTranslations } from "next-intl/server";
import { getServerPricing } from "@/lib/server-pricing";
import { SHOW_MONTHLY_LINE } from "@/lib/pricing";

export default async function Pricing({ showIntro = true }) {
  const { pricing, tier, country } = await getServerPricing();
  const t = await getTranslations("pages.pricing");

  return (
    <section
      id="pricing"
      className={showIntro ? "landing-section landing-muted-band flex flex-col gap-10" : "public-container public-pricing-plans"}
    >
      {showIntro && <div
        className="landing-container flex flex-col items-center gap-4 text-center"
      >
        <RevealWords
          text={`${t("titleLine1")} <accent>${t("titleLine2")}</accent>`}
          className="public-section-title max-w-3xl"
        />
        <p className="landing-copy max-w-xl text-lg">
          {t(SHOW_MONTHLY_LINE ? "intro" : "introOnce")}
        </p>
      </div>}

      <div className="landing-container w-full">
        <PricingCards pricing={pricing} tier={tier} country={country} showMonthly={SHOW_MONTHLY_LINE} />
        <p className="mx-auto mt-8 max-w-lg text-center text-xs text-[var(--landing-ink-soft)]">
          {t("jobscanCompare")}
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
