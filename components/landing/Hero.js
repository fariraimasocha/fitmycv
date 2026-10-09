"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react";
import { PRICING } from "@/lib/pricing";
import RevealWords from "@/components/landing/RevealWords";
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
    <div className="zen-frame landing-rise-4 relative mx-auto w-full max-w-5xl rounded-4xl p-2 shadow-2xl sm:rounded-[48px] sm:p-4">
      <div className="overflow-hidden rounded-3xl border border-[oklch(1_0_0_/_0.1)] bg-[var(--landing-surface)] sm:rounded-[36px]">
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
            className="absolute bottom-3 start-3 inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--landing-ink)]/80 px-3 py-1.5 text-xs font-semibold text-[var(--landing-on-primary)] backdrop-blur transition hover:bg-[var(--landing-ink)]"
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

export default function Hero({ lifetimePrice = PRICING.lifetime.price }) {
  const t = useTranslations("landing.hero");
  const router = useRouter();
  const gate = useWebviewGate();

  const handleTryFree = (event) => {
    if (gate?.interceptAuth(event, "/auth")) return;
    router.push("/auth");
  };

  return (
    <section id="hero" className="relative px-5 pb-16 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container flex flex-col items-center pt-16 text-center sm:pt-24">
        <RevealWords
          as="h1"
          onLoad
          text={t.raw("titleMain")}
          className="max-w-5xl font-serif-display text-[var(--landing-ink)]"
          style={{
            fontSize: "clamp(3.25rem, 8vw, 8rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        />

        <p className="landing-rise-2 mt-8 max-w-xl text-lg leading-relaxed text-[var(--landing-ink-soft)]">
          {t("body")}
        </p>

        <div className="landing-rise-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleTryFree}
            className="landing-primary-btn group rounded-xl px-7 py-3.5 font-outfit text-sm"
          >
            {t("tryFree")}
            <ArrowRightIcon
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>
          <Link
            href="/ats-resume-checker"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--landing-paper-soft)] px-7 py-3.5 font-outfit text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:bg-[var(--landing-surface-elevated)]"
          >
            {t("checkerCta")}
            <CheckCircleIcon size={16} weight="fill" aria-hidden="true" className="text-[var(--landing-accent)]" />
          </Link>
        </div>

        <p className="landing-rise-3 mt-6 text-xs text-[var(--landing-ink-soft)]">
          {t("previewFree")}. {t("priceNote", { price: lifetimePrice })}
        </p>

        <div className="mt-16 w-full sm:mt-20">
          <DemoPreview />
        </div>
      </div>
    </section>
  );
}
