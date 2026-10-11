"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export default function StickyCtaBar() {
  const t = useTranslations("landing.sticky");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--landing-line)] bg-[var(--landing-bg)]/95 p-3 backdrop-blur-md md:hidden">
      {/* Back to the hero link field. focus() scrolls it into view. */}
      <button
        type="button"
        onClick={() => document.getElementById("hero-job-link")?.focus()}
        className="landing-primary-btn w-full text-sm"
      >
        {t("cta")}
        <ArrowUpIcon size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
