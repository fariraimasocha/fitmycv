"use client";
import { useTranslations } from "next-intl";
import ProductActionLink from "@/components/landing/ProductActionLink";

export default function TrackerLink() {
  const t = useTranslations("landing.redesign");
  return <ProductActionLink product="tracker">{t("trackerCta")}</ProductActionLink>;
}
