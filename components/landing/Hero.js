"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  PlayIcon,
  FilePdfIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { PRICING } from "@/lib/pricing";

function DemoPreview() {
  const videoRef = useRef(null);

  // The video carries autoPlay so it starts before hydration. This pauses it
  // again for anyone who asked their OS to reduce motion, and follows them if
  // they change the setting while the page is open.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const video = videoRef.current;
      if (!video) return;
      if (query.matches) video.pause();
      else video.play().catch(() => {});
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className="landing-rise-4 relative mx-auto mt-16 w-full">
      <div className="overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-white shadow-[0_24px_60px_oklch(0.18_0.02_260_/_0.08)]">
        <div className="landing-browser-bar">
          <span className="landing-browser-dot bg-[oklch(0.62_0.19_24)]" aria-hidden="true" />
          <span className="landing-browser-dot bg-[oklch(0.73_0.135_68)]" aria-hidden="true" />
          <span className="landing-browser-dot bg-[oklch(0.56_0.13_150)]" aria-hidden="true" />
          <span className="ml-3 flex-1 rounded-md bg-[var(--landing-paper-soft)] px-3 py-1 text-center font-sans text-xs font-medium text-[var(--landing-ink-soft)]">
            www.fitmycv.link
          </span>
        </div>
        <div className="relative overflow-hidden">
          {/* Muted autoplay so it works as a silent product demo on mobile too */}
          <video
            ref={videoRef}
            src="/fitmycv-demo.mp4"
            poster="/hero-new.png"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="FitMyCV demo: paste a job link and download a tailored CV"
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * The free ATS checker, offered inline the way the reference site offers its
 * upload bar. It links to a tool that genuinely takes a CV and a job
 * description without an account, so the promise on the card is the product.
 */
function CheckerBar() {
  return (
    <Link
      href="/ats-resume-checker"
      className="landing-rise-3 group landing-lift relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4 landing-shadow-lift sm:flex-row sm:gap-5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-faint)]">
        <FilePdfIcon size={24} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1 text-center sm:text-left">
        <span className="block text-sm font-semibold text-[var(--landing-ink)] sm:text-base">
          Check your CV against a job posting, free
        </span>
        <span className="mt-0.5 block text-xs text-[var(--landing-ink-soft)] sm:text-sm">
          No sign-up. Your file is read in your browser.
        </span>
      </span>

      <span className="landing-secondary-btn landing-secondary-btn-sm font-outfit w-full shrink-0 sm:w-auto">
        Score my CV
        <ArrowRightIcon
          size={15}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative px-5 pb-20 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container landing-rules relative border-t border-[var(--landing-line)] px-4 pt-24 sm:px-8 sm:pt-36">
        {/* Asymmetric split, as on the reference: the headline owns the left
            seven columns and the supporting column sits in the last four,
            dropped down so it starts against the middle of the headline. */}
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="landing-rise lg:col-span-7">
            {/* Measured off the reference: 1.15 leading and near-neutral
                tracking. The earlier 1.05 / -0.02em crashed the lines together
                and read as cramped at this size. */}
            <h1
              className="font-outfit font-medium text-[var(--landing-ink)]"
              style={{
                fontSize: "clamp(2.25rem, 3.9vw, 3.6rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {/* Two-tone: the muted line names the category, the full-strength
                  line makes the promise. One typeface throughout, as on the
                  reference. The accent carries the brand, not a second face. */}
              <span className="block text-[var(--landing-ink-faint)]">
                AI CV and cover letters.
              </span>
              <span className="block">
                Paste any job link. Get a CV{" "}
                <span className="text-[var(--landing-accent)]">made for that role</span>.
              </span>
            </h1>
          </div>

          <div className="landing-rise-2 lg:col-span-4 lg:col-start-9 lg:mt-24">
            {/* Two lines of larger type, as on the reference. The detail that
                used to live here is covered further down the page. */}
            <p className="text-lg leading-relaxed text-[var(--landing-ink-soft)]">
              Upload your CV once. FitMyCV reads the listing and rewrites your CV
              in the words that role asks for.
            </p>

            {/* Button and proof sit on one row, the way the reference pairs its
                CTA with a rating. */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
              <Link href="/auth" className="landing-primary-btn group font-outfit text-sm">
                Try for free
                <ArrowUpRightIcon
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              {/* Where the reference puts a star rating. We have no review data,
                  so this states things that are true of the product instead.
                  See the note in TrustSignals.jsx. */}
              <span className="flex flex-col gap-1 text-xs leading-5 text-[var(--landing-ink-soft)]">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--landing-ink)]">
                  <CheckCircleIcon
                    size={15}
                    weight="fill"
                    aria-hidden="true"
                    className="text-[var(--landing-success)]"
                  />
                  Free to build and tailor
                </span>
                <span>Only pay to download. ${PRICING.lifetime.price} once.</span>
              </span>
            </div>

            <Link
              href="#how-it-works"
              className="group mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--landing-ink)] transition-colors duration-300 hover:text-[var(--landing-accent-dark)]"
            >
              <PlayIcon size={14} weight="fill" aria-hidden="true" />
              See how it works
              <ArrowRightIcon
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* The bar sits on the rule and masks it with its own surface, the
            way the reference seats its upload strip on the section divider. */}
        <div className="relative mt-20">
          <div
            aria-hidden="true"
            className="absolute top-1/2 -left-4 -right-4 border-t border-[var(--landing-line)] sm:-left-8 sm:-right-8"
          />
          <CheckerBar />
        </div>

        <DemoPreview />
      </div>
    </section>
  );
}
