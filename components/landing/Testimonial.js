"use client";

import Image from "next/image";
import { StarIcon } from "@phosphor-icons/react";

export default function Testimonial() {
  return (
    <section className="landing-section-tight landing-muted-band flex flex-col items-center">
      <div className="landing-container flex flex-col items-center w-full max-w-3xl gap-10">
        {/* Stars */}
        <div className="flex flex-row items-center gap-2" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} size={28} weight="fill" className="text-[var(--landing-accent)]" aria-hidden="true" />
          ))}
        </div>

        {/* Quote with highlight */}
        <div className="relative w-full">
          <div
            className="hidden sm:block absolute bg-[oklch(0.9_0.075_68)] rounded h-[30px] w-[45%] right-0 top-[3px]"
            aria-hidden="true"
          />
          <p className="relative z-10 w-full text-center font-sans text-xl leading-relaxed text-[var(--landing-ink)] sm:text-2xl">
            Not having to rewrite my CV manually is saving me tons of application work. Now I
            just paste a job link and FitMyCv handles everything itself
          </p>
        </div>

        {/* Author */}
        <div className="flex flex-row items-center gap-4">
          <Image
            src="/farai.jpeg"
            alt="Farai Matsika"
            width={60}
            height={60}
            className="landing-inset-edge rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="font-outfit font-extrabold text-lg text-[var(--landing-ink)]">Farai Matsika</span>
            <span className="font-sans text-sm font-semibold text-[var(--landing-ink-soft)]">Software Developer</span>
          </div>
        </div>
      </div>
    </section>
  );
}
