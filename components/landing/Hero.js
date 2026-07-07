"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";

function DemoPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-14 w-full max-w-5xl px-2 md:mt-16"
    >
      <a
        href="https://cleanshot.com/share/vPgrrSpQ"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch how FitMyCV works"
        className="group relative block overflow-hidden rounded-2xl border border-[var(--landing-line)] shadow-[0_30px_70px_oklch(0.205_0.035_244_/_0.18)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-4"
      >
        <img
          src="/hero.jpg"
          alt="Watch how FitMyCV works"
          width={2116}
          height={1248}
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--landing-primary-dark)] shadow-[0_14px_34px_oklch(0.205_0.035_244_/_0.4)] ring-4 ring-white/30 transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
            <Play
              size={28}
              fill="currentColor"
              className="ml-0.5 text-[oklch(0.99_0.006_84)] sm:size-9"
              aria-hidden="true"
            />
          </span>
        </span>
      </a>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-screen overflow-hidden px-5 pb-16 pt-32 sm:px-10 lg:px-16 xl:px-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.997_0.006_84)_0%,oklch(0.985_0.012_84)_72%,oklch(0.965_0.02_84)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_50%_18%,oklch(0.92_0.06_174_/_0.72),transparent_34rem)]"
      />
      <div className="landing-container relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <h1
            className="max-w-6xl font-outfit font-extrabold leading-[0.95] tracking-normal text-[var(--landing-ink)]"
            style={{ fontSize: "clamp(48px, 8.4vw, 126px)" }}
          >
            Tailor your CV
            <br />
            <span className="relative inline-block px-2 text-[var(--landing-ink)]">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[0.07em] -z-10 h-[0.32em] -rotate-1 bg-[oklch(0.87_0.071_313_/_0.72)]"
              />
              to match the job.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)] sm:text-xl">
            Paste a job link, upload your CV, and FitMyCV rewrites your CV,
            cover letter, and interview prep to match the role.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth"
              className="landing-primary-btn group min-w-[210px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              Tailor my CV
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="#how-it-works"
              className="landing-secondary-btn min-w-[190px] font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        <DemoPreview />
      </div>
    </section>
  );
}
