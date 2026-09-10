"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react";
import { HOME_FAQS } from "@/content/pages/home";

const faqs = HOME_FAQS.map(({ q, a }) => ({ question: q, answer: a }));

// Collapsed answers stay in the DOM and animate by CSS grid rows rather than
// being unmounted. Two reasons: search and answer engines only see text that
// is actually rendered, and it keeps framer-motion off the landing page.
function FAQItem({ faq, index, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="border-b border-[var(--landing-line)] last:border-0 py-6">
      <button
        id={buttonId}
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left gap-3"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="font-medium text-[var(--landing-ink)]">
          {faq.question}
        </span>
        {isOpen ? (
          <MinusIcon size={18} className="text-[var(--landing-primary-dark)] shrink-0" aria-hidden="true" />
        ) : (
          <PlusIcon size={18} className="text-[var(--landing-ink-soft)] shrink-0" aria-hidden="true" />
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
          <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed pt-3">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="landing-section flex flex-col items-center gap-12"
    >
      <h2 className="landing-section-title text-center text-3xl sm:text-4xl">
        Frequently asked questions
      </h2>

      <div className="landing-card w-full max-w-2xl rounded-2xl px-6 sm:px-8">
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
    </section>
  );
}
