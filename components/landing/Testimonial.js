"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="bg-[#EEF2F6] flex flex-col items-center px-5 py-16 sm:px-10 lg:px-[140px] lg:py-20">
      <div className="flex flex-col items-center w-full max-w-3xl" style={{ gap: 40 }}>
        {/* Stars */}
        <div className="flex flex-row items-center" style={{ gap: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={32} color="#F59E0B" fill="#F59E0B" />
          ))}
        </div>

        {/* Quote with highlight */}
        <div className="relative w-full">
          {/* Yellow highlight rect — hidden on small screens */}
          <div
            className="hidden sm:block absolute"
            style={{
              background: "#FEF9C3",
              borderRadius: 4,
              height: 30,
              width: "45%",
              right: 0,
              top: 3,
            }}
          />
          {/* Quote text */}
          <p
            className="relative text-[#4B5563] text-center w-full"
            style={{
              fontFamily: "var(--font-sn-pro)",
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.65,
              zIndex: 1,
            }}
          >
            Not having to rewrite my CV manually is saving me tons of
            application work. Now I just paste a job link and FitMyCv handles
            everything itself
          </p>
        </div>

        {/* Author */}
        <div className="flex flex-row items-center" style={{ gap: 16 }}>
          {/* Avatar */}
          <Image
            src="/farai.jpeg"
            alt="Farai Matsika"
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          {/* Text */}
          <div className="flex flex-col" style={{ gap: 4 }}>
            <span
              className="text-[#0F172A]"
              style={{
                fontFamily: "var(--font-outfit)",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Farai Matsika
            </span>
            <span
              className="text-[#6B7280]"
              style={{
                fontFamily: "var(--font-sn-pro)",
                fontSize: 15,
                fontWeight: 400,
              }}
            >
              Software Developer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
