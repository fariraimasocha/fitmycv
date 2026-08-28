"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react";
import { HOME_FAQS } from "@/content/pages/home";

const faqs = HOME_FAQS.map(({ q, a }) => ({ question: q, answer: a }));

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-[var(--landing-line)] last:border-0 py-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left gap-3"
        aria-expanded={isOpen}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="font-sans text-[var(--landing-ink-soft)] text-sm leading-relaxed pt-3">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}
