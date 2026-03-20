"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  LightningIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

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
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const startTyping = useCallback(() => {
    if (reducedMotion) {
      setDisplayed(COVER_LETTER);
      setIsComplete(true);
      return;
    }

    indexRef.current = 0;
    setDisplayed("");
    setIsComplete(false);

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(COVER_LETTER.slice(0, indexRef.current));
      if (indexRef.current >= COVER_LETTER.length) {
        clearInterval(timerRef.current);
        setIsComplete(true);
        timerRef.current = setTimeout(() => startTyping(), RESTART_DELAY);
      }
    }, SPEED);
  }, [reducedMotion]);

  useEffect(() => {
    startTyping();
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(timerRef.current);
    };
  }, [startTyping]);

  return (
    <div className="w-full flex flex-col rounded-2xl border border-border overflow-hidden shadow-lg dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.35)]">
      {/* Window chrome */}
      <div className="flex flex-row items-center justify-between bg-muted border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="font-sans text-[11px] text-muted-foreground font-medium">
            cover_letter.pdf
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full bg-green-500 ${!isComplete ? "animate-pulse" : ""}`}
            aria-hidden="true"
          />
          <span className="font-sans text-[11px] text-muted-foreground font-medium">
            {isComplete ? "Complete" : "Generating…"}
          </span>
        </div>
      </div>

      {/* Job context */}
      <div className="flex flex-row items-center gap-2 bg-background border-b border-border px-4 py-2.5">
        <SparkleIcon
          size={12}
          className="text-muted-foreground shrink-0"
          aria-hidden="true"
        />
        <span className="font-sans text-[11px] text-muted-foreground">
          Tailored for:
        </span>
        <span className="font-sans font-semibold text-[12px] text-foreground">
          Senior Software Engineer at Stripe
        </span>
      </div>

      {/* Typewriter body */}
      <div className="bg-background px-5 py-5 min-h-[300px] max-h-[340px] overflow-hidden">
        <p
          className="font-sans text-[13px] leading-[1.85] text-foreground whitespace-pre-wrap"
          aria-live="polite"
        >
          {displayed}
          {!isComplete && (
            <span
              aria-hidden="true"
              className="inline-block w-[1.5px] h-[1em] bg-foreground ml-0.5 align-middle motion-safe:[animation:blink_0.9s_step-end_infinite]"
            />
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-row items-center justify-between bg-muted border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <CheckCircleIcon
            size={13}
            className={`transition-colors duration-300 ${isComplete ? "text-green-500" : "text-muted-foreground"}`}
            aria-hidden="true"
          />
          <span className="font-sans text-[11px] text-muted-foreground">
            ATS Score:{" "}
            <span className="font-semibold text-foreground">94%</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <LightningIcon
            size={13}
            className="text-muted-foreground"
            aria-hidden="true"
          />
          <span className="font-sans text-[11px] text-muted-foreground">
            Ready in <span className="font-semibold text-foreground">8s</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background flex items-center min-h-screen">
      {/* Ghost watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-0 top-0 font-extrabold leading-none tracking-tighter font-outfit text-foreground/[0.04]"
        style={{ fontSize: "clamp(160px, 25vw, 320px)", lineHeight: 1 }}
      >
        CV
      </span>

      <div className="relative w-full mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-center gap-12 px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24">
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-7 w-full lg:justify-center">
          {/* Headline */}
          <h1
            className="font-outfit text-foreground leading-[1.08] tracking-tight break-words"
            style={{ fontSize: "clamp(38px, 5.5vw, 64px)" }}
          >
            Land more interviews
            <br />
            with a CV that fits.
          </h1>

          {/* Subheading */}
          <p className="font-sans text-muted-foreground text-[17px] leading-[1.75]">
            Stop sending the same CV everywhere. FitMyCV tailors your resume and
            cover letter to every job, so you show up as the perfect fit.
          </p>

          {/* Feature dots */}
          <p className="font-sans text-[14px] text-muted-foreground">
            Upload your CV · Paste a job link · Get a tailored resume in seconds
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/auth"
              className="group inline-flex items-center justify-center gap-2 font-outfit font-semibold text-base bg-foreground text-background rounded-xl px-7 py-3.5 transition duration-200 hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
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
              className="inline-flex items-center justify-center font-outfit font-semibold text-base text-muted-foreground border border-border rounded-xl px-7 py-3.5 transition duration-200 hover:bg-muted hover:text-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right column — live typewriter demo */}
        <div className="flex-1 w-full lg:self-stretch lg:flex lg:items-center">
          <TypewriterCard />
        </div>
      </div>
    </section>
  );
}
