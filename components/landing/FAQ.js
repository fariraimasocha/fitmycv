"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Minus } from "lucide-react";

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
    <div
      style={{
        borderBottom: "1px solid #E2E8F0",
        padding: "24px 0",
      }}
      className="last:border-0"
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
        style={{ gap: 12 }}
      >
        <span
          className="text-[#0F172A]"
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {faq.question}
        </span>
        {isOpen ? (
          <Minus size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
        ) : (
          <Plus size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
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
            <p
              className="text-[#64748B] w-full"
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
                paddingTop: 12,
              }}
            >
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
      className="bg-white flex flex-col items-center px-5 py-16 sm:px-10 lg:px-[140px] lg:py-[100px]"
      style={{ gap: 48 }}
    >
      <h2
        className="text-[#0F172A] text-center text-[32px] sm:text-[40px]"
        style={{
          fontFamily: "var(--font-outfit)",
          fontWeight: 700,
          letterSpacing: "-1.6px",
        }}
      >
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
