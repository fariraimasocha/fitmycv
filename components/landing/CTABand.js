"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function CTABand() {
  return (
    <section className="bg-muted border-t border-b border-border px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-20">
      <div className="flex flex-col items-center gap-8">
        <h2 className="font-outfit font-bold text-foreground text-center text-2xl sm:text-3xl lg:text-4xl tracking-tight">
          Ready to stop being ignored?
        </h2>
        <p className="font-sans text-muted-foreground text-center text-base max-w-[560px]">
          Join thousands of job seekers who are landing interviews faster with
          AI-tailored applications.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center gap-2 font-outfit font-semibold text-base bg-foreground text-background rounded-[10px] px-7 py-3.5 transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Get Started
            <ArrowRightIcon size={16} aria-hidden="true" />
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center font-outfit font-semibold text-base text-muted-foreground border border-border bg-transparent rounded-[10px] px-7 py-3.5 transition-all hover:bg-background"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
