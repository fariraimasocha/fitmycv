"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  ChartBarIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  LinkedinLogoIcon,
  TargetIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react";
import { PRICING } from "@/lib/pricing";
import RevealWords from "@/components/landing/RevealWords";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff } from "@/lib/ats-handoff";
import { toUrl } from "@/lib/ats-detect";
import { extractTerms } from "@/lib/keywords";
import { trackEvent } from "@/lib/analytics";
import { HOME_TESTIMONIALS } from "@/content/pages/home";

// Each chip is a real feature with its own page, so "all in one" holds up.
const PLATFORM_LINKS = [
  { key: "tailor", href: "/tailor-cv-from-job-link", Icon: FileTextIcon },
  { key: "coverLetter", href: "/ai-cover-letter-generator", Icon: EnvelopeSimpleIcon },
  { key: "atsScore", href: "/ats-resume-checker", Icon: ChartBarIcon },
  { key: "jobMatch", href: "/resume-job-match-checker", Icon: TargetIcon },
  { key: "linkedin", href: "/linkedin-profile-checker", Icon: LinkedinLogoIcon },
  { key: "jobs", href: "/jobs", Icon: BriefcaseIcon },
];

const TRUST_FACES = [
  "/trusted/jane.jpeg",
  "/trusted/portia.jpeg",
  "/trusted/jack.jpeg",
  "/trusted/winnie.jpeg",
  "/trusted/vitus.jpg",
];

// One real quote with a concrete outcome, right under the CTA.
const HERO_PROOF = HOME_TESTIMONIALS.find((item) => item.author === "Vitus");
// Break after the first sentence so the quote always sits on two lines.
const HERO_PROOF_LINES = HERO_PROOF?.quote.split(/(?<=\.) /, 2) ?? [];

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

// Scrapes the posting through the public job saver (Exa, rate limited per IP,
// no model call) and ranks its terms in the browser. Returns [] on any
// failure so the caller can fall back to sign-in.
async function fetchJobTerms(jobUrl) {
  try {
    const res = await fetch("/api/tools/job-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: jobUrl }),
    });
    if (!res.ok) {
      trackEvent("hero_preview_failed", { status: res.status });
      return [];
    }
    const { text } = await res.json();
    return extractTerms(text || "", 8).map((item) => item.term);
  } catch {
    trackEvent("hero_preview_failed", { status: 0 });
    return [];
  }
}

// The headline says "paste any job link", so the hero takes one. The link
// rides the existing ATS handoff (localStorage) through sign-in and
// onboarding and is waiting in the tailor page's link field.
export function JobLinkForm({ id = "hero-job-link", className = "landing-rise-3 mt-8" }) {
  const t = useTranslations("landing.hero");
  const router = useRouter();
  const gate = useWebviewGate();
  const { data: session } = useSession();
  const [link, setLink] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const goToAuth = (authUrl) => {
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const url = toUrl(link);
    if (!url) {
      setInvalid(true);
      return;
    }
    saveAtsHandoff({ jobUrl: url.href, source: "hero" });
    trackEvent("hero_link_submitted", { signed_in: Boolean(session?.user), host: url.hostname });
    // The link also rides in the URL. A magic link can open in a new tab,
    // where the localStorage copy may have expired.
    const dest = `/dashboard/tailor?url=${encodeURIComponent(url.href)}`;
    if (session?.user) {
      router.push(dest);
      return;
    }
    const authUrl = `/auth?next=${encodeURIComponent(dest)}`;
    // Signed-out visitors get the job's keywords back before the sign-in ask.
    // Half of them used to leave at /auth with nothing for their link. Any
    // failure falls through to the old straight-to-auth path.
    setLoading(true);
    const terms = await fetchJobTerms(url.href);
    setLoading(false);
    if (!terms.length) {
      goToAuth(authUrl);
      return;
    }
    trackEvent("hero_preview_shown", { host: url.hostname, terms: terms.length });
    setPreview({ host: url.hostname.replace(/^www\./, ""), terms, authUrl });
  };

  return (
    <form onSubmit={submit} noValidate className={`w-full max-w-xl ${className}`}>
      <label htmlFor={id} className="sr-only">
        {t("linkLabel")}
      </label>
      <div className="flex flex-col gap-2 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-2 sm:flex-row">
        <input
          id={id}
          type="url"
          inputMode="url"
          autoComplete="off"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            setInvalid(false);
            setPreview(null);
          }}
          placeholder={t("linkPlaceholder")}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className="min-h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-base text-[var(--landing-ink)] placeholder:text-[var(--landing-ink-soft)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading || undefined}
          className="landing-primary-btn group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-outfit text-base font-bold disabled:opacity-70"
        >
          {loading ? t("previewLoading") : t("tailorCta")}
          <ArrowRightIcon
            size={18}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100"
          />
        </button>
      </div>
      {invalid ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-[var(--landing-accent)]">
          {t("linkError")}
        </p>
      ) : null}
      {preview ? (
        <div role="status" className="mt-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4 text-left">
          <p className="font-outfit text-base font-bold text-[var(--landing-ink)]">
            {t("previewTitle", { host: preview.host })}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {preview.terms.map((term) => (
              <li
                key={term}
                className="rounded-full border border-[var(--landing-line)] px-3 py-1 text-sm text-[var(--landing-ink)]"
              >
                {term}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-[var(--landing-ink-soft)]">{t("previewBody")}</p>
          <button
            type="button"
            onClick={() => goToAuth(preview.authUrl)}
            className="landing-primary-btn mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 font-outfit text-base font-bold sm:w-auto"
          >
            {t("previewCta")}
            <ArrowRightIcon size={18} aria-hidden="true" className="rtl:-scale-x-100" />
          </button>
        </div>
      ) : null}
    </form>
  );
}

export default function Hero({ lifetimePrice = PRICING.lifetime.price, userCount = null }) {
  const t = useTranslations("landing.hero");
  return (
    <section id="hero" className="relative px-5 pb-16 sm:px-10 lg:px-16 xl:px-24">
      <div className="landing-container flex flex-col items-center pt-10 text-center sm:pt-14">
        <RevealWords
          as="h1"
          onLoad
          text={t.raw("titleMain")}
          className="max-w-5xl font-serif-display text-[var(--landing-ink)]"
          style={{
            fontSize: "clamp(3rem, 6.75vw, 6.75rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
          }}
        />

        <p className="landing-rise-2 mt-8 max-w-xl text-lg leading-relaxed text-[var(--landing-ink-soft)]">
          {t("body")}
        </p>

        <JobLinkForm />
        <p className="landing-rise-3 mt-3 text-xs text-[var(--landing-ink-soft)]">
          {t("previewFree")}. {t("priceNote", { price: lifetimePrice })} {t("notReady")}{" "}
          <Link
            href="/ats-resume-checker"
            className="font-semibold text-[var(--landing-ink)] underline underline-offset-4 hover:text-[var(--landing-accent)]"
          >
            {t("checkerCta")}
          </Link>
        </p>

        {/* One proof row: the faces, one real quote, and a real, rounded-down
            account count (or no number at all). */}
        <div className="landing-rise-3 mt-6 flex max-w-2xl flex-col items-center gap-4 sm:flex-row sm:text-start">
          <div className="flex shrink-0 -space-x-2 rtl:space-x-reverse">
            {TRUST_FACES.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full object-cover ring-2 ring-[var(--landing-bg)]"
              />
            ))}
          </div>
          <div className="text-xs leading-4">
            {HERO_PROOF ? (
              <figure className="text-[var(--landing-ink)] sm:whitespace-nowrap">
                <blockquote className="inline">
                  <span className="block">“{HERO_PROOF_LINES[0]}</span>
                  {HERO_PROOF_LINES[1]}”
                </blockquote>{" "}
                <figcaption className="inline font-semibold">{HERO_PROOF.author}</figcaption>
              </figure>
            ) : null}
            {userCount ? (
              <p className="text-xs leading-4 text-[var(--landing-ink-soft)]">{t("usedBy", { count: userCount })}</p>
            ) : null}
          </div>
        </div>

        {/* The demo shows the real output, so it comes before the platform
            chips: one action and the result above the fold. */}
        <div className="mt-10 w-full sm:mt-12">
          <DemoPreview />
        </div>

        <h2 className="landing-rise-3 mt-10 font-outfit text-2xl font-bold tracking-tight text-[var(--landing-ink)] sm:mt-12 sm:text-3xl">
          {t("platformTitle")}
        </h2>
        <ul className="landing-rise-3 mt-6 flex max-w-5xl flex-wrap justify-center gap-2 sm:gap-3">
          {PLATFORM_LINKS.map(({ key, href, Icon }) => (
            <li key={key}>
              <Link
                href={href}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] px-4 font-outfit text-sm font-semibold text-[var(--landing-ink)] transition-colors hover:border-[var(--landing-ink-soft)] sm:text-base"
              >
                <Icon size={18} aria-hidden="true" className="text-[var(--landing-accent)]" />
                {t(`platform.${key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
