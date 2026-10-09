"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  PlayIcon,
  FilePdfIcon,
  CheckCircleIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react";
import { PRICING } from "@/lib/pricing";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";

function DemoPreview() {
  const t = useTranslations("landing.hero");
  const videoRef = useRef(null);
  // Autoplay only works muted. The first unmute restarts the video so
  // people hear the walkthrough from the start.
  const [muted, setMuted] = useState(true);
  const [heardSound, setHeardSound] = useState(false);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    if (muted && !heardSound) {
      video.currentTime = 0;
      setHeardSound(true);
    }
    video.muted = !muted;
    if (muted) video.play().catch(() => {});
    setMuted(!muted);
  };

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
    <div className="landing-rise-4 relative mx-auto w-full">
      <div className="overflow-hidden rounded-2xl border border-[var(--landing-line)] bg-white shadow-[0_24px_60px_oklch(0.18_0.02_260_/_0.08)]">
        <div className="landing-browser-bar">
          <span className="landing-browser-dot bg-[oklch(0.62_0.19_24)]" aria-hidden="true" />
          <span className="landing-browser-dot bg-[oklch(0.73_0.135_68)]" aria-hidden="true" />
          <span className="landing-browser-dot bg-[oklch(0.56_0.13_150)]" aria-hidden="true" />
          <span className="ms-3 flex-1 rounded-md bg-[var(--landing-paper-soft)] px-3 py-1 text-center font-sans text-xs font-medium text-[var(--landing-ink-soft)]">
            www.fitmycv.link
          </span>
        </div>
        <div className="relative overflow-hidden">
          <video
            ref={videoRef}
            src="/fitmycv-demo.mp4"
            poster="/hero-new.png"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={t("videoLabel")}
            className="h-auto w-full"
          />
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--landing-ink)]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-[var(--landing-ink)]"
          >
            {muted ? (
              <SpeakerSlashIcon size={14} aria-hidden="true" />
            ) : (
              <SpeakerHighIcon size={14} aria-hidden="true" />
            )}
            {muted ? t("soundOn") : t("soundOff")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckerBar() {
  const t = useTranslations("landing.hero");
  return (
    <Link
      href="/ats-resume-checker"
      className="landing-rise-3 group landing-lift relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4 landing-shadow-lift sm:flex-row sm:gap-5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--landing-line)] bg-[var(--landing-paper-soft)] text-[var(--landing-ink-faint)]">
        <FilePdfIcon size={24} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1 text-center sm:text-start">
        <span className="block text-sm font-semibold text-[var(--landing-ink)] sm:text-base">
          {t("checkerTitle")}
        </span>
        <span className="mt-0.5 block text-xs text-[var(--landing-ink-soft)] sm:text-sm">
          {t("checkerBody")}
        </span>
      </span>

      <span className="landing-secondary-btn landing-secondary-btn-sm font-outfit w-full shrink-0 sm:w-auto">
        {t("checkerCta")}
        <ArrowRightIcon
          size={15}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export default function Hero({ lifetimePrice = PRICING.lifetime.price }) {
  const t = useTranslations("landing.hero");
  const router = useRouter();
  const gate = useWebviewGate();

  const handleTryFree = (event) => {
    if (gate?.interceptAuth(event, "/auth")) return;
    router.push("/auth");
  };

  return (
    <section id="hero" className="relative px-5 pb-20 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container landing-rules relative border-t border-[var(--landing-line)] px-4 pt-16 sm:px-8 sm:pt-24">
        <div className="grid grid-cols-1 items-center gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="landing-rise lg:col-span-6">
            <p className="mb-4 font-sans text-sm font-semibold text-[var(--landing-ink-faint)]">
              {t("titleLead")}
            </p>
            <h1
              className="font-outfit font-medium text-[var(--landing-ink)]"
              style={{
                fontSize: "clamp(2.25rem, 3.4vw, 3.1rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {t.rich("titleMain", {
                accent: (chunks) => (
                  <span className="text-[var(--landing-accent)]">{chunks}</span>
                ),
              })}
            </h1>

            <p className="landing-rise-2 mt-6 text-lg leading-relaxed text-[var(--landing-ink-soft)]">
              {t("body")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4">
              <button
                type="button"
                onClick={handleTryFree}
                className="landing-primary-btn group font-outfit text-sm"
              >
                {t("tryFree")}
                <ArrowUpRightIcon
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>

              <span className="flex flex-col gap-1 text-xs leading-5 text-[var(--landing-ink-soft)]">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--landing-ink)]">
                  <CheckCircleIcon
                    size={15}
                    weight="fill"
                    aria-hidden="true"
                    className="text-[var(--landing-success)]"
                  />
                  {t("previewFree")}
                </span>
                <span>{t("priceNote", { price: lifetimePrice })}</span>
              </span>
            </div>

            <NextLink
              href="#how-it-works"
              className="tap-target group mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--landing-ink)] transition-colors duration-300 hover:text-[var(--landing-accent-dark)]"
            >
              <PlayIcon size={14} weight="fill" aria-hidden="true" />
              {t("seeHow")}
              <ArrowRightIcon
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </NextLink>
          </div>

          <div className="lg:col-span-6">
            <DemoPreview />
          </div>
        </div>

        <div className="relative mt-20">
          <div
            aria-hidden="true"
            className="absolute top-1/2 -start-4 -end-4 border-t border-[var(--landing-line)] sm:-start-8 sm:-end-8"
          />
          <CheckerBar />
        </div>
      </div>

    </section>
  );
}
