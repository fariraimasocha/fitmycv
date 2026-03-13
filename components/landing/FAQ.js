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
    question: "What file formats can I export?",
    answer:
      "You can export your tailored CV and cover letter as PDF, DOCX, or plain text. PDF is recommended for most applications as it preserves formatting perfectly.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period. No questions asked, no hidden fees.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your privacy is our top priority. All data is encrypted, we never share your information, and you can delete your account and all associated data at any time.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-border last:border-0 py-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left gap-3"
        aria-expanded={isOpen}
      >
        <span className="font-outfit font-semibold text-base text-foreground">
          {faq.question}
        </span>
        {isOpen ? (
          <MinusIcon size={18} className="text-muted-foreground shrink-0" aria-hidden="true" />
        ) : (
          <PlusIcon size={18} className="text-muted-foreground shrink-0" aria-hidden="true" />
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
            <p className="font-sans text-muted-foreground text-[15px] leading-[1.7] pt-3">
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
      className="bg-background flex flex-col items-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24 gap-12"
    >
      <h2 className="font-outfit font-bold text-foreground text-center text-[32px] sm:text-[40px] tracking-tight">
        Frequently asked questions
      </h2>

      <div className="w-full max-w-2xl">
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
