import PricingCards from "@/components/pricing/PricingCards";
import RevealWords from "@/components/landing/RevealWords";
import { getTranslations } from "next-intl/server";
import { getServerPricing } from "@/lib/server-pricing";
import { SHOW_MONTHLY } from "@/lib/pricing";

export default async function Pricing() {
  const { pricing, tier } = await getServerPricing();
  const t = await getTranslations("pages.pricing");

  return (
    <section
      id="pricing"
      className="landing-section landing-muted-band flex flex-col gap-10"
    >
      <div
        className={`landing-container flex flex-col gap-4 ${SHOW_MONTHLY ? "" : "items-center text-center"}`}
      >
        <span className="landing-eyebrow-plain">{t("eyebrow")}</span>
        <RevealWords
          text={`${t("titleLine1")} <accent>${t("titleLine2")}</accent>`}
          className="max-w-3xl font-outfit text-4xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-5xl"
        />
        <p className="landing-copy max-w-xl text-lg">
          {t(SHOW_MONTHLY ? "intro" : "introOnce")}
        </p>
      </div>

      <div className="landing-container w-full">
        <PricingCards pricing={pricing} tier={tier} />
        {SHOW_MONTHLY ? (
        <p className="mt-6 max-w-lg text-xs text-[var(--landing-ink-soft)]">
          {/* Worked out from the real prices, so it holds for every tier:
              3 months on standard, 2 on regional. */}
          {t("footnote", {
            months: Math.round(Number(pricing.lifetime.price) / Number(pricing.month.price)),
          })}
        </p>
        ) : null}
        <p className={`mt-2 max-w-lg text-xs text-[var(--landing-ink-soft)] ${SHOW_MONTHLY ? "" : "mx-auto text-center"}`}>
          {t("jobscanCompare")}
        </p>
        {tier === "standard" ? (
          <p className={`mt-2 max-w-lg text-xs text-[var(--landing-ink-soft)] ${SHOW_MONTHLY ? "" : "mx-auto text-center"}`}>
            {t("regionalAvailable")}
          </p>
        ) : null}
      </div>
    </section>
  );
}
