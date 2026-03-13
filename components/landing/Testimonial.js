"use client";

import Image from "next/image";
import { StarIcon } from "@phosphor-icons/react";

export default function Testimonial() {
  return (
    <section className="bg-muted flex flex-col items-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24 lg:py-20">
      <div className="flex flex-col items-center w-full max-w-3xl gap-10">
        {/* Stars */}
        <div className="flex flex-row items-center gap-2" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} size={32} weight="fill" className="text-amber-400" aria-hidden="true" />
          ))}
        </div>

        {/* Quote with highlight */}
        <div className="relative w-full">
          {/* Yellow highlight rect — hidden on small screens */}
          <div
            className="hidden sm:block absolute bg-amber-100 rounded h-[30px] w-[45%] right-0 top-[3px]"
            aria-hidden="true"
          />
          <p className="relative font-sans text-foreground/80 text-center w-full text-[22px] leading-[1.65] z-10">
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
            className="rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="font-outfit font-bold text-lg text-foreground">Farai Matsika</span>
            <span className="font-sans text-[15px] text-muted-foreground">Software Developer</span>
          </div>
        </div>
      </div>
    </section>
  );
}
