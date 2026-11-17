"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";

// Wraps each keyword tailoring added in a soft highlight. Plain text otherwise.
function Highlighted({ text, terms }) {
  if (!terms.length) return text;
  const escaped = terms.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // Whole words only, so "Java" never lights up inside "JavaScript".
  const parts = text.split(new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join("|")})(?![\\p{L}\\p{N}])`, "giu"));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-[var(--landing-success-soft)] px-0.5 text-[var(--landing-success)]">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/**
 * The proof that tailoring did real work: a few of the user's own bullets,
 * before and after. Pairs come from lib/bullet-diff, never from the model.
 */
export default function BeforeAfterCard({ pairs, titleKey = "title" }) {
  const t = useTranslations("tailor.beforeAfter");
  const [open, setOpen] = useState(true);
  if (!pairs?.length) return null;

  return (
    <section className="dashboard-card rounded-lg">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="dashboard-card-pad flex w-full items-center gap-2 text-start"
      >
        <span className="min-w-0">
          <span className="block font-outfit text-base font-semibold text-foreground">{t(titleKey)}</span>
          <span className="block text-xs text-muted-foreground">{t("description", { count: pairs.length })}</span>
        </span>
        {open ? (
          <CaretUpIcon size={16} className="ms-auto shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : (
          <CaretDownIcon size={16} className="ms-auto shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </button>
      {open && (
        <ol className="divide-y divide-[var(--landing-line)] border-t border-[var(--landing-line)]">
          {pairs.map((pair) => (
            <li key={pair.after} className="dashboard-card-pad grid gap-2 sm:grid-cols-2 sm:gap-4">
              {pair.role && <p className="text-xs font-medium text-muted-foreground sm:col-span-2">{pair.role}</p>}
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("before")}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--landing-ink-soft)]">{pair.before}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-[var(--landing-success)] uppercase">{t("after")}</p>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  <Highlighted text={pair.after} terms={pair.added} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
