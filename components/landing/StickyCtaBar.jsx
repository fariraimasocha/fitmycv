"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

// Ids of the on-page job link forms. While either is on screen the bar would
// only repeat it, so the bar steps aside.
const FORM_TARGETS = ["hero", "cta-job-link"];

export default function StickyCtaBar() {
  const t = useTranslations("landing.sticky");
  const reduceMotion = useReducedMotion();
  const [onScreen, setOnScreen] = useState(() => new Set(["hero"]));

  useEffect(() => {
    const nodes = FORM_TARGETS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        setOnScreen((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            if (entry.isIntersecting) next.add(entry.target.id);
            else next.delete(entry.target.id);
          }
          return next;
        });
      },
      { threshold: 0 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const visible = onScreen.size === 0;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduceMotion ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--landing-line)] bg-[var(--landing-bg)]/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
          {/* Back to the hero link field. focus() scrolls it into view. */}
          <button
            type="button"
            onClick={() => document.getElementById("hero-job-link")?.focus()}
            className="landing-primary-btn w-full text-sm"
          >
            {t("cta")}
            <ArrowUpIcon size={16} aria-hidden="true" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
