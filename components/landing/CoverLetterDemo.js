"use client";

import { useEffect, useState, useRef } from "react";
import { SparkleIcon, ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

const COVER_LETTER = `Dear Hiring Manager,

I am excited to apply for the Senior Software Engineer position at Stripe. With over 5 years of experience building scalable payment infrastructure and distributed systems, I am confident I can make an immediate impact on your team.

At my current role at Acme Corp, I led the redesign of our checkout pipeline — reducing latency by 40% and increasing payment success rates from 91% to 97%. I worked closely with product and design teams to ship features used by over 2 million customers monthly.

Stripe's commitment to building the economic infrastructure of the internet deeply resonates with me. I am particularly drawn to your focus on developer experience and reliability — values I have championed throughout my career.

I would love the opportunity to bring my experience in TypeScript, Go, and distributed systems to help Stripe continue to raise the bar for financial technology.

Thank you for your consideration.

Sincerely,
Farirai Masocha`;

const SPEED = 18; // ms per character
const RESTART_DELAY = 2500; // ms before restarting

export default function CoverLetterDemo() {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  const startTyping = () => {
    indexRef.current = 0;
    setDisplayed("");
    setIsComplete(false);

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(COVER_LETTER.slice(0, indexRef.current));

      if (indexRef.current >= COVER_LETTER.length) {
        clearInterval(timerRef.current);
        setIsComplete(true);
        timerRef.current = setTimeout(() => {
          startTyping();
        }, RESTART_DELAY);
      }
    }, SPEED);
  };

  useEffect(() => {
    startTyping();
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section className="bg-background flex flex-col items-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-24 gap-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="inline-flex flex-row items-center gap-2 bg-muted border border-border rounded-full px-4 py-1.5">
          <SparkleIcon size={14} className="text-foreground" aria-hidden="true" />
          <span className="font-sans font-medium text-sm text-foreground">
            AI Writing Live
          </span>
        </div>
        <h2 className="font-outfit font-bold text-foreground text-3xl sm:text-4xl tracking-tight leading-tight">
          Watch your cover letter
          <br />
          write itself
        </h2>
        <p className="font-sans text-muted-foreground text-base max-w-xl">
          FitMyCV reads the job description and writes a tailored, professional
          cover letter in seconds — in your voice.
        </p>
      </div>

      {/* Demo card */}
      <div className="w-full max-w-3xl flex flex-col rounded-2xl border border-border overflow-hidden shadow-[0_8px_40px_-8px_rgba(15,23,42,0.10)]">
        {/* Card header bar */}
        <div className="flex flex-row items-center justify-between bg-muted border-b border-border px-5 py-3.5">
          <div className="flex flex-row items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
            <span className="font-sans text-xs text-muted-foreground font-medium">
              cover_letter.pdf
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            <span className="font-sans text-xs text-muted-foreground font-medium">
              {isComplete ? "Complete" : "Generating…"}
            </span>
          </div>
        </div>

        {/* Job context strip */}
        <div className="flex flex-row items-center gap-3 bg-background border-b border-border px-5 py-3">
          <span className="font-sans text-xs text-muted-foreground">Tailored for:</span>
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-sm text-foreground">
              Senior Software Engineer
            </span>
            <span className="font-sans text-xs text-muted-foreground">at</span>
            <span className="font-sans font-semibold text-sm text-foreground">Stripe</span>
          </div>
        </div>

        {/* Typewriter area */}
        <div className="bg-background px-4 py-5 sm:px-7 sm:py-7 min-h-[380px]">
          <p
            className="font-sans text-sm leading-relaxed text-foreground whitespace-pre-wrap"
            aria-live="polite"
            aria-label="Cover letter being generated"
          >
            {displayed}
            {!isComplete && (
              <span
                aria-hidden="true"
                className="inline-block w-[2px] h-[1em] bg-foreground ml-0.5 align-middle animate-[blink_0.9s_step-end_infinite]"
              />
            )}
          </p>
        </div>

        {/* Card footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-muted border-t border-border px-5 py-3.5">
          <span className="font-sans text-xs text-muted-foreground">
            {displayed.length} / {COVER_LETTER.length} characters
          </span>
          <Link
            href="/auth"
            className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs text-foreground hover:opacity-70 transition"
          >
            Generate mine
            <ArrowRightIcon size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Bottom note */}
      <p className="font-sans text-sm text-muted-foreground text-center">
        Every letter is unique — written to match the exact job, company, and your background.
      </p>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
