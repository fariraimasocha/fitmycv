"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  LinkIcon,
  SparkleIcon,
  DownloadSimpleIcon,
  ReadCvLogoIcon,
} from "@phosphor-icons/react";
import ResumeUpload from "@/components/ResumeUpload";
import PricingCards from "@/components/pricing/PricingCards";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "how", title: "How it works" },
  { id: "upload", title: "Upload CV" },
  { id: "pricing", title: "Unlock" },
];

const HOW_STEPS = [
  {
    icon: LinkIcon,
    title: "Paste a job link",
    copy: "Drop a LinkedIn, Indeed, or any job URL. We extract the requirements instantly.",
  },
  {
    icon: SparkleIcon,
    title: "AI tailors your CV",
    copy: "Your CV and cover letter are rewritten to match the role — keywords, impact, ATS-ready.",
  },
  {
    icon: DownloadSimpleIcon,
    title: "Download & apply",
    copy: "Export polished PDFs and apply with confidence. Track every application in one place.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const completeOnboarding = async (destination = "/dashboard/tailor") => {
    setFinishing(true);
    try {
      const res = await fetch("/api/user/onboarding", { method: "POST" });
      if (!res.ok) throw new Error("Failed to save progress");
      await update();
      router.replace(destination);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setFinishing(false);
    }
  };

  const handleCvParsed = () => {
    setStep(3);
  };

  if (finishing) return <Loader />;

  return (
    <div className="landing-root min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 hidden opacity-40"
      />
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-10 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ReadCvLogoIcon
              size={24}
              weight="bold"
              className="text-[var(--landing-primary)]"
            />
            <span className="font-outfit text-lg font-extrabold text-[var(--landing-ink)]">
              FitMyCV
            </span>
          </div>
          <span className="text-xs font-semibold text-[var(--landing-ink-soft)]">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-10 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step
                  ? "bg-[var(--landing-primary)]"
                  : "bg-[var(--landing-line)]"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            {step === 0 && (
              <div className="flex flex-1 flex-col gap-6">
                <span className="landing-eyebrow w-fit">Welcome aboard</span>
                <h1 className="font-outfit text-3xl font-extrabold leading-tight text-[var(--landing-ink)] sm:text-4xl">
                  Tailor your CV to any job in seconds
                </h1>
                <p className="text-base leading-relaxed text-[var(--landing-ink-soft)]">
                  FitMyCV reads job listings, matches them to your experience,
                  and generates tailored CVs and cover letters — so you stop
                  sending the same application everywhere.
                </p>
                <ul className="mt-2 flex flex-col gap-3">
                  {[
                    "Paste any job link — we handle the rest",
                    "ATS keyword matching on every CV",
                    "Cover letters, interview prep, and PDF export",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-[var(--landing-ink-soft)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--landing-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-1 flex-col gap-6">
                <span className="landing-eyebrow w-fit">How it works</span>
                <h2 className="font-outfit text-2xl font-extrabold text-[var(--landing-ink)] sm:text-3xl">
                  Three steps to a hire-ready application
                </h2>
                <div className="mt-2 flex flex-col gap-4">
                  {HOW_STEPS.map((item, i) => (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary-soft)] text-[var(--landing-primary)]">
                        <item.icon size={20} aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-[var(--landing-ink-soft)]">
                          {i + 1}
                        </span>
                        <h3 className="font-outfit font-extrabold text-[var(--landing-ink)]">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[var(--landing-ink-soft)]">
                          {item.copy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-1 flex-col gap-6">
                <span className="landing-eyebrow w-fit">Your CV</span>
                <h2 className="font-outfit text-2xl font-extrabold text-[var(--landing-ink)] sm:text-3xl">
                  Upload your reference CV
                </h2>
                <p className="text-sm leading-relaxed text-[var(--landing-ink-soft)]">
                  We use this as the base for every tailored application. PDF
                  upload — we parse it into structured data automatically.
                </p>
                <div className="rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-5">
                  <ResumeUpload onParsed={handleCvParsed} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-1 flex-col gap-6">
                <span className="landing-eyebrow w-fit">Unlock everything</span>
                <h2 className="font-outfit text-2xl font-extrabold text-[var(--landing-ink)] sm:text-3xl">
                  Ready to land more interviews?
                </h2>
                <p className="text-sm leading-relaxed text-[var(--landing-ink-soft)]">
                  Preview tailoring is free. Upgrade to download PDFs and unlock
                  the full toolkit — or continue free and upgrade when you&apos;re
                  ready.
                </p>
                <PricingCards
                  compact
                  onSkip={() => completeOnboarding("/dashboard/tailor")}
                  skipLabel="Continue free — I'll upgrade later"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer nav */}
        {step !== 2 && step !== 3 && (
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--landing-line)] pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--landing-ink-soft)] transition-colors hover:text-[var(--landing-ink)]"
              >
                <ArrowLeftIcon size={16} />
                Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="landing-primary-btn cursor-pointer font-outfit text-sm"
            >
              Continue
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        {step === 2 && (
          <p className="mt-6 text-center text-xs text-[var(--landing-ink-soft)]">
            Upload a PDF to continue. You can edit the parsed data after.
          </p>
        )}
      </div>
    </div>
  );
}
