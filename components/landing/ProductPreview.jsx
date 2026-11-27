"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { trackEvent } from "@/lib/analytics";

export function ProductImage({ tracker = false, image, alt, priority = false }) {
  const t = useTranslations("landing.redesign");
  return <div className={`product-preview-frame ${tracker ? "product-preview-tracker" : ""}`}>
    <div className="product-preview-bar" aria-hidden="true"><span /><span /><span /><span className="product-preview-address">fitmycv.link</span></div>
    <Image src={image || (tracker ? "/landing/applications.png" : "/landing/tailored-cv.png")} alt={alt || t(tracker ? "trackerAlt" : "tailorAlt")} width={1568} height={726} sizes="(min-width: 1280px) 1180px, 92vw" priority={priority} className="h-auto w-full" />
  </div>;
}

// Roving tabs for the how it works steps: arrows
// move and wrap, Home and End jump, focus follows selection.
export function useTabs(count, onSelect) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef([]);
  const select = (index) => {
    setActive(index);
    onSelect?.(index);
  };
  const props = (index) => ({
    ref: (node) => { refs.current[index] = node; },
    type: "button",
    role: "tab",
    id: `${id}-tab-${index}`,
    "aria-selected": active === index,
    "aria-controls": `${id}-panel-${index}`,
    tabIndex: active === index ? 0 : -1,
    onClick: () => select(index),
    onKeyDown: (event) => {
      const last = count - 1;
      const next = { Home: 0, End: last, ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next);
      refs.current[next]?.focus();
    },
  });
  const panelProps = (index) => ({ role: "tabpanel", id: `${id}-panel-${index}`, "aria-labelledby": `${id}-tab-${index}`, hidden: active !== index });
  return { active, props, panelProps };
}

// Teal's feature block, stacked: each feature is a row with copy on one side
// and the real in-app screen on an accent panel that runs off the page edge.
// Rows alternate sides so the page reads as a zigzag, no clicking needed.
const FEATURES = [
  { key: "tailor", row: "cv", image: "/landing/tailored-cv.png", href: "/#start-tailoring" },
  { key: "coverLetters", row: "letter", image: "/landing/cover-letter.png", href: "/ai-cover-letter-generator" },
  { key: "tracker", row: "tracker", image: "/landing/applications.png", href: "/job-tracker" },
];

export default function ProductPreview() {
  const t = useTranslations("landing.redesign");
  const tSuite = useTranslations("landing.suite");
  const tHero = useTranslations("landing.hero");
  // The tailor button scrolls to the hero form, so it reads as the hero's action.
  const ctaLabel = (key, row) =>
    key === "tailor" ? tHero("tailorCta") : key === "tracker" ? t("tracker") : tSuite(`rows.${row}.cta`);

  return <section id="product" className="feature-section">
    <div className="public-container">
      {FEATURES.map(({ key, row, image, href }, index) => <div key={key} className={`feature-panel ${index % 2 ? "feature-panel-flip" : ""}`}>
        <div className="feature-copy">
          <p className="feature-label">{tSuite(`rows.${row}.label`)}</p>
          <h2 className="feature-title">{tSuite(`rows.${row}.title`)}</h2>
          <p className="feature-body">{tSuite(`rows.${row}.body`)}</p>
          <Link href={href} className="landing-primary-btn feature-cta" onClick={() => trackEvent("marketing_preview_continued", { product: key })}>
            {ctaLabel(key, row)}
            <ArrowRightIcon size={18} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        </div>
        <div className="feature-media">
          <ProductImage tracker={key === "tracker"} image={image} alt={tSuite(`rows.${row}.alt`)} priority={index === 0} />
        </div>
      </div>)}
    </div>
  </section>;
}
