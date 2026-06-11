"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react";

const faqs = [
  {
    question: "How does FitMyCv tailor my CV?",
    answer:
      "Our AI reads the job description, identifies key requirements and keywords, then restructures your CV to highlight matching experience and skills. The result passes ATS filters and reads naturally to recruiters.",
  },
  {
    question: "Will my CV still sound like me?",
    answer:
      "Absolutely. FitMyCv enhances your existing content — it doesn't replace it. Your voice, experience, and achievements remain front and center. We just make sure they're presented in the best possible way for each role.",
  },
  {
    question: "What do I get for free, and what needs Premium?",
    answer:
      "Free, you can upload and store your CV and track every application in one place. Premium unlocks the full tailoring suite: paste any job link, get a match score and ATS score, then tailor and download your CV and cover letter as polished PDFs. Premium also includes interview prep, company research, outreach messages, and daily job matches by email.",
  },
  {
    question: "What file formats can I export?",
    answer:
      "You can download your tailored CV and cover letter as PDF, ready to attach and send. PDF is the format recruiters and ATS systems handle best, so it keeps your formatting perfect on every application.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your Premium subscription at any time. You'll continue to have access until the end of your billing period. No questions asked, no hidden fees.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your privacy is our top priority. All data is encrypted, we never share your information, and you can delete your account and all associated data at any time.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-[var(--landing-line)] last:border-0 py-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left gap-3"
        aria-expanded={isOpen}
      >
        <span className="font-outfit font-bold text-base text-[var(--landing-ink)]">
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
      <h2 className="landing-heading font-outfit font-extrabold text-center text-3xl sm:text-4xl">
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
