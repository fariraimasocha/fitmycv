"use client";

import { useEffect, useState, useRef } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LightningIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

const COVER_LETTER = `Dear Hiring Manager,

I am excited to apply for the Senior Software Engineer position at Stripe. With over 5 years of experience building scalable payment infrastructure and distributed systems, I am confident I can make an immediate impact on your team.

At my current role at Acme Corp, I led the redesign of our checkout pipeline — reducing latency by 40% and increasing payment success rates from 91% to 97%.

Stripe's mission to build the economic infrastructure of the internet deeply resonates with me. I would love the opportunity to bring my experience in TypeScript, Go, and distributed systems to help Stripe continue raising the bar.

Thank you for your consideration.

Sincerely,
Farirai Masocha`;

const SPEED = 20;
const RESTART_DELAY = 2800;

function TypewriterCard() {
  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const [displayed, setDisplayed] = useState(() =>
    reducedMotion ? COVER_LETTER : ""
  );
  const [isComplete, setIsComplete] = useState(reducedMotion);
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const restartTimerRef = useRef(null);

  useEffect(() => {
    if (reducedMotion || isComplete) return;

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(COVER_LETTER.slice(0, indexRef.current));
      if (indexRef.current >= COVER_LETTER.length) {
        clearInterval(timerRef.current);
        setIsComplete(true);
      }
    }, SPEED);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(restartTimerRef.current);
    };
  }, [isComplete, reducedMotion]);

  useEffect(() => {
    if (!isComplete || reducedMotion) return;

    restartTimerRef.current = setTimeout(() => {
      indexRef.current = 0;
      setDisplayed("");
      setIsComplete(false);
    }, RESTART_DELAY);
    return () => clearTimeout(restartTimerRef.current);
  }, [isComplete, reducedMotion]);

  return (
    <div className="landing-card w-full flex flex-col overflow-hidden rounded-2xl">
      {/* Window chrome */}
      <div className="flex flex-row items-center justify-between border-b border-[var(--landing-line)] bg-[var(--landing-paper-strong)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="font-sans text-xs text-[var(--landing-ink-soft)] font-semibold">
            cover_letter.pdf
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full bg-[var(--landing-success)] ${!isComplete ? "animate-pulse" : ""}`}
            aria-hidden="true"
          />
          <span className="font-sans text-xs text-[var(--landing-ink-soft)] font-semibold">
            {isComplete ? "Complete" : "Generating…"}
          </span>
        </div>
      </div>

      {/* Job context */}
      <div className="flex flex-row items-center gap-2 border-b border-[var(--landing-line)] bg-[var(--landing-paper-soft)] px-4 py-2.5">
        <SparkleIcon
          size={12}
          className="text-[var(--landing-primary-dark)] shrink-0"
          aria-hidden="true"
        />
        <span className="font-sans text-xs text-[var(--landing-ink-soft)]">
          Tailored for:
        </span>
        <span className="font-sans font-bold text-xs text-[var(--landing-ink)]">
          Senior Software Engineer at Stripe
        </span>
      </div>

      {/* Typewriter body */}
      <div className="min-h-[300px] max-h-[340px] overflow-hidden bg-[var(--landing-paper-soft)] px-5 py-5">
        <p
          className="font-sans text-sm leading-relaxed text-[var(--landing-ink)] whitespace-pre-wrap"
          aria-live="polite"
        >
          {displayed}
          {!isComplete && (
            <span
              aria-hidden="true"
              className="inline-block w-[1.5px] h-[1em] bg-[var(--landing-primary-dark)] ml-0.5 align-middle motion-safe:[animation:blink_0.9s_step-end_infinite]"
            />
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-row items-center justify-between border-t border-[var(--landing-line)] bg-[var(--landing-paper-strong)] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <CheckCircleIcon
            size={13}
            className={`transition-colors duration-300 ${isComplete ? "text-[var(--landing-success)]" : "text-[var(--landing-ink-soft)]"}`}
            aria-hidden="true"
          />
          <span className="font-sans text-xs text-[var(--landing-ink-soft)]">
            ATS Score:{" "}
            <span className="font-bold text-[var(--landing-ink)]">94%</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <LightningIcon
            size={13}
            className="text-[var(--landing-ink-soft)]"
            aria-hidden="true"
          />
          <span className="font-sans text-xs text-[var(--landing-ink-soft)]">
            Ready in <span className="font-bold text-[var(--landing-ink)]">8s</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32 sm:px-10 lg:px-16 xl:px-24">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 hidden h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[oklch(0.73_0.135_68_/_0.18)] blur-3xl lg:block"
      />

      <div className="landing-container relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Left column */}
        <div className="min-w-0 flex w-full flex-col gap-7 lg:justify-center">
          {/* Headline */}
          <h1
            className="landing-heading font-outfit font-extrabold break-words"
            style={{ fontSize: "clamp(42px, 6vw, 76px)" }}
          >
            Land more interviews
            <br />
            with a CV that fits.
          </h1>

          {/* Subheading */}
          <p className="landing-copy font-sans text-lg">
            Stop sending the same CV everywhere. FitMyCV tailors your resume and
            cover letter to every job, so you show up as the perfect fit.
          </p>

          {/* Feature dots */}
          <div className="flex flex-wrap gap-2">
            {["Upload your CV", "Paste a job link", "Apply with a better match"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--landing-line)] bg-[oklch(0.997_0.006_84_/_0.72)] px-3 py-1.5 text-sm font-semibold text-[var(--landing-ink-soft)]"
              >
                {item}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/auth"
              className="landing-primary-btn group font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              Get Started Free
              <ArrowRightIcon
                size={16}
                aria-hidden="true"
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </Link>
            <Link
              href="#how-it-works"
              className="landing-secondary-btn font-outfit text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-primary-dark)] focus-visible:ring-offset-2"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right column — live typewriter demo */}
        <div className="relative w-full lg:flex lg:items-center">
          <div className="absolute -right-8 -top-10 hidden w-64 rotate-3 overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] shadow-[var(--landing-shadow-sm)] lg:block">
            <Image
              src="/hero-img.png"
              alt=""
              width={420}
              height={398}
              className="h-auto w-full opacity-90"
              priority
            />
          </div>
          <div className="relative z-10">
            <TypewriterCard />
          </div>
        </div>
      </div>
    </section>
  );
}
