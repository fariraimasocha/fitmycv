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

export default function ProductPreview() {
  const t = useTranslations("landing.redesign");
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef([]);
  const tabs = ["tailor", "tracker"];
  const selectTab = (index) => {
    setActive(index);
    trackEvent("marketing_preview_selected", { product: tabs[index] });
  };
  const selectWithKeyboard = (event, index) => {
    let next;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index;
    else return;
    event.preventDefault();
    selectTab(next);
    refs.current[next]?.focus();
  };
  return <div className="public-product-preview">
    <div role="tablist" aria-label={t("previewLabel")} className="product-preview-tabs">
      {tabs.map((key, index) => <button key={key} ref={(node) => { refs.current[index] = node; }} type="button" id={`${id}-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => selectTab(index)} onKeyDown={(event) => selectWithKeyboard(event, index)}>{t(key)}</button>)}
    </div>
    {tabs.map((key, index) => <div key={key} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0}><ProductImage tracker={index === 1} priority={index === 0} />{/* The tailor form sits right above, so only the tracker tab needs a way on. */}{index === 1 && <div className="product-preview-next"><Link href="/job-tracker" className="public-text-link" onClick={() => trackEvent("marketing_preview_continued", { product: key })}>{t("tracker")}<ArrowRightIcon size={16} aria-hidden="true" className="rtl:-scale-x-100" /></Link></div>}</div>)}
  </div>;
}
