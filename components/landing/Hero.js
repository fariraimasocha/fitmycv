"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";

function DemoPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-16 w-full max-w-5xl md:mt-20"
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-white shadow-[0_24px_60px_oklch(0.18_0.02_260_/_0.08)]">
        <div className="landing-browser-bar">
          <span className="landing-browser-dot bg-[oklch(0.62_0.19_24)]" aria-hidden="true" />
          <span className="landing-browser-dot bg-[oklch(0.73_0.135_68)]" aria-hidden="true" />
          <span className="landing-browser-dot bg-[oklch(0.56_0.13_150)]" aria-hidden="true" />
          <span className="ml-3 flex-1 rounded-md bg-[var(--landing-paper-soft)] px-3 py-1 text-center font-sans text-xs font-medium text-[var(--landing-ink-soft)]">
            app.fitmycv.com
          </span>
        </div>
        <div className="relative overflow-hidden">
          <img
            src="/hero.jpg"
            alt="FitMyCV dashboard preview"
            width={2116}
            height={1248}
            className="h-auto w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative px-5 pb-20 pt-10 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-4xl flex-col items-center text-center"
        >
          <span className="landing-eyebrow mb-8 gap-2.5">
            <span className="landing-eyebrow-new">New</span>
            Tailor your CV from any job link
          </span>

          <h1
            className="font-serif-display max-w-4xl font-normal leading-[1.02] tracking-tight text-[var(--landing-ink)]"
            style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)" }}
          >
            Your AI{" "}
            <em className="text-[var(--landing-accent)]">CV tailoring</em>
            {" "}&amp; cover letter team in one paste
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--landing-ink-soft)] sm:text-lg">
            FitMyCV drops in{" "}
            <strong className="font-semibold text-[var(--landing-ink)]">
              job-link parsing
            </strong>
            ,{" "}
            <strong className="font-semibold text-[var(--landing-ink)]">
              ATS keyword matching
            </strong>{" "}
            and{" "}
            <strong className="font-semibold text-[var(--landing-ink)]">
              one-click PDF export
            </strong>
            . Upload your CV once, paste a listing, and get a hire-ready application in under a minute.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth" className="landing-primary-btn group min-w-[210px] text-sm">
              Get FitMyCV
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="#how-it-works"
              className="landing-secondary-btn min-w-[210px] text-sm"
            >
              <Play size={15} aria-hidden="true" />
              See how it works
            </Link>
          </div>

          <p className="landing-meta-line mt-6">
            [ Google sign-in · Lifetime from $16.99 · Cancel anytime on monthly ]
          </p>
        </motion.div>

        <DemoPreview />
      </div>
    </section>
  );
}
