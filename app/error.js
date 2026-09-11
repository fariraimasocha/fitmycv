"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";

// Catches render errors in any route below the root layout. Without this file
// a thrown error shows Next's default error page instead of the site.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-24 text-center">
        <div className="landing-container flex flex-col items-center">
          <p className="font-outfit text-sm font-bold uppercase tracking-widest text-[var(--landing-ink-soft)]">
            Error
          </p>
          <h1
            className="font-serif-display mt-4 max-w-2xl font-normal leading-[1.05] tracking-normal text-[var(--landing-ink)]"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            This page didn&apos;t load
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[var(--landing-ink-soft)]">
            Something on our side failed. Try again, or head back to the
            homepage.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex rounded-full bg-[var(--landing-ink)] px-5 py-2.5 font-sans text-sm font-semibold text-[var(--landing-bg)] transition-opacity hover:opacity-90"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] px-5 py-2.5 font-sans text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:border-[var(--landing-primary)]"
            >
              Go to the homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
