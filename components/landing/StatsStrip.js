"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations, useFormatter } from "next-intl";
import { ATS_COMPANIES } from "@/content/ats-companies";
import { FREE_TOOLS } from "@/lib/free-tools";

function buildItems({ tailored, users, tracked, format, t }) {
  // Prefer live traction, then fill with product facts so the strip always
  // shows three distinct, verifiable numbers.
  const pool = [];
  if (tailored != null) {
    // Both counts are rounded down, so both carry a "+".
    pool.push({ value: `${format.number(tailored)}+`, label: t("tailored") });
  }
  if (users != null) {
    pool.push({ value: `${format.number(users)}+`, label: t("people") });
  }
  if (tracked != null) {
    pool.push({ value: `${format.number(tracked)}+`, label: t("tracked") });
  }
  pool.push({
    value: `${ATS_COMPANIES.length}+`,
    label: t("atsGuides"),
  });
  pool.push({
    value: String(FREE_TOOLS.length),
    label: t("freeTools"),
  });
  return pool.slice(0, 3);
}

/**
 * Dark traction band straight under the hero. Layout mirrors the Teal-style three-up
 * strip. Every number is either a live DB count (rounded down) or a product
 * fact from the repo. No interview rates or "companies hired at" claims.
 */
export default function StatsStrip({ users = null, tailored = null, tracked = null }) {
  const t = useTranslations("landing.stats");
  const format = useFormatter();
  // The server passes whatever its worker had cached (often nothing on a fresh
  // Workers isolate). The live counts come from the edge-cached API route.
  const { data } = useQuery({
    queryKey: ["landing-stats"],
    queryFn: () => fetch("/api/landing-stats").then((r) => (r.ok ? r.json() : null)),
    staleTime: 60 * 60 * 1000,
  });
  const live = data ?? { users, tailored, tracked };
  const items = buildItems({ ...live, format, t });

  return (
    <section
      aria-labelledby="stats-heading"
      className="landing-dark-band landing-section-tight px-5 sm:px-10 lg:px-16 xl:px-24"
    >
      <div className="landing-reveal landing-container">
        {/* Same label style as the sections around it. */}
        <h2 id="stats-heading" className="public-eyebrow mb-10 block text-center">
          {t("heading")}
        </h2>
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {items.map(({ value, label }) => (
            <li key={label} className="text-center">
              {/* Inherits the band's white. --landing-on-primary turns dark in dark mode. */}
              <p className="font-outfit text-4xl font-bold tracking-tight sm:text-5xl">
                {value}
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--landing-ink-inverse-soft)]">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
