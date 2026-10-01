"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import AuthLink from "@/components/landing/AuthLink";
import { PRICING } from "@/lib/pricing";

export default function CTABand({ lifetimePrice = PRICING.lifetime.price }) {
  const t = useTranslations("landing.cta");

  return (
    <section className="landing-dark-band landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-reveal landing-container flex flex-col items-center gap-8 py-10">
        <h2 className="landing-section-title text-center text-3xl text-white sm:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <p className="max-w-xl text-center text-base leading-relaxed text-[var(--landing-ink-inverse-soft)]">
          {t("body", { price: lifetimePrice })}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <AuthLink
            href="/auth"
            className="landing-pill-btn landing-pill-solid font-outfit px-6 py-3 text-sm"
          >
            {t("tryFree")}
            <ArrowUpRightIcon size={16} aria-hidden="true" />
          </AuthLink>
          <Link
            href="#pricing"
            className="landing-pill-btn landing-pill-ghost font-outfit px-6 py-3 text-sm"
          >
            {t("pricing")}
          </Link>
        </div>
      </div>
    </section>
  );
}
