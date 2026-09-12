"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react";

function FAQItem({ faq, index, isOpen, onToggle }) {
  const panelId = `founder-faq-panel-${index}`;
  const buttonId = `founder-faq-button-${index}`;

  return (
    <div className="border-b border-[var(--landing-line)] py-6 last:border-0">
      <button
        id={buttonId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="font-medium text-[var(--landing-ink)]">
          {faq.question}
        </span>
        {isOpen ? (
          <MinusIcon
            size={18}
            className="shrink-0 text-[var(--landing-primary-dark)]"
            aria-hidden="true"
          />
        ) : (
          <PlusIcon
            size={18}
            className="shrink-0 text-[var(--landing-ink-soft)]"
            aria-hidden="true"
          />
        )}
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        data-open={isOpen}
        className="landing-collapse"
      >
        <div>
          <p className="pt-3 font-sans text-sm leading-relaxed text-[var(--landing-ink-soft)]">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FounderFaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div>
      <p className="landing-eyebrow-plain">FAQ</p>
      <h2 className="mt-3 font-outfit text-3xl font-extrabold leading-tight text-[var(--landing-ink)] sm:text-4xl lg:text-5xl">
        Honest answers.
      </h2>
      <div className="mt-8">
        {faqs.map((faq, i) => (
          <FAQItem
            key={faq.question}
            faq={faq}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </div>
  );
}
