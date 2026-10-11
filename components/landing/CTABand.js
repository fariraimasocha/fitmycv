"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import RevealWords from "@/components/landing/RevealWords";

import { JobLinkForm } from "@/components/landing/Hero";
import { PRICING } from "@/lib/pricing";

export default function CTABand({ lifetimePrice = PRICING.lifetime.price }) {
  const t = useTranslations("landing.cta");

  return (
    <section className="landing-dark-band landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container flex flex-col items-center gap-8 py-10">
        <RevealWords text={t("title")} className="text-center font-outfit text-4xl font-bold tracking-tight text-[var(--landing-ink)] sm:text-5xl" />
        <p className="max-w-xl text-center text-base leading-relaxed text-[var(--landing-ink-inverse-soft)]">
          {t("body", { price: lifetimePrice })}
        </p>
        <JobLinkForm id="cta-job-link" className="" />
        <Link
          href="#pricing"
          className="font-outfit text-sm font-semibold text-[var(--landing-ink)] underline underline-offset-4"
        >
          {t("pricing")}
        </Link>
      </div>
    </section>
  );
}
