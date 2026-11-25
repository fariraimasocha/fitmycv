"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import {
  ArrowRightIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react";
import { PRICING } from "@/lib/pricing";
import RevealWords from "@/components/landing/RevealWords";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff } from "@/lib/ats-handoff";
import { textAfterLink, toUrl } from "@/lib/ats-detect";
import { extractTerms } from "@/lib/keywords";
import { trackEvent } from "@/lib/analytics";
import { HOME_TESTIMONIALS } from "@/content/pages/home";

const TRUST_FACES = [
  "/trusted/jane.jpeg",
  "/trusted/portia.jpeg",
  "/trusted/jack.jpeg",
  "/trusted/winnie.jpeg",
  "/trusted/vitus.jpg",
];

// Same floor as /api/job/extract for a pasted description.
const MIN_JOB_TEXT_CHARS = 150;

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
            src="/new-fitmycv-demo.mp4"
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
export function JobLinkForm({
  id = "hero-job-link",
  className = "landing-rise-3 mt-8",
  source = "hero",
  onBeforeSubmit,
}) {
  const t = useTranslations("landing.hero");
  const router = useRouter();
  const gate = useWebviewGate();
  const { data: session } = useSession();
  const [link, setLink] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  // Ceiling: scrape fail used to dump straight to /auth with no recovery.
  // Keep the saved link, say the work is safe, and put paste-description
  // recovery in the fail panel itself.
  const [fail, setFail] = useState(null);
  const [failText, setFailText] = useState("");
  const [failShort, setFailShort] = useState(false);
  const failTextId = `${id}-fail-text`;

  const goToAuth = (authUrl) => {
    if (gate?.interceptAuth(null, authUrl)) return;
    router.push(authUrl);
  };

  const showPreview = (url, terms, authUrl) => {
    trackEvent("hero_preview_shown", { host: url.hostname, terms: terms.length, source });
    setFail(null);
    setFailText("");
    setFailShort(false);
    setPreview({ host: url.hostname.replace(/^www\./, ""), terms, authUrl });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const url = toUrl(link);
    if (!url) {
      setInvalid(true);
      return;
    }
    onBeforeSubmit?.();
    // A description pasted after the link goes in as text, so the tailor
    // page does not have to read the link.
    const jobText = textAfterLink(link);
    const hasText = jobText.length >= MIN_JOB_TEXT_CHARS;
    saveAtsHandoff(
      hasText ? { jobText, jobUrl: url.href, source } : { jobUrl: url.href, source },
    );
    trackEvent("hero_link_submitted", {
      signed_in: Boolean(session?.user),
      host: url.hostname,
      with_text: hasText,
      source,
    });
    // The link also rides in the URL. A magic link can open in a new tab,
    // where the localStorage copy may have expired.
    const dest = `/dashboard/tailor?url=${encodeURIComponent(url.href)}`;
    if (session?.user) {
      router.push(dest);
      return;
    }
    const authUrl = `/auth?next=${encodeURIComponent(dest)}`;
    // Signed-out visitors get the job's keywords back before the sign-in ask.
    setLoading(true);
    setFail(null);
    setFailText("");
    setFailShort(false);
    setPreview(null);
    const terms = hasText
      ? extractTerms(jobText, 8).map((item) => item.term)
      : await fetchJobTerms(url.href);
    setLoading(false);
    if (!terms.length) {
      setFail({
        host: url.hostname.replace(/^www\./, ""),
        href: url.href,
        authUrl,
      });
      return;
    }
    showPreview(url, terms, authUrl);
  };

  // Recovery when the board blocks the scrape: paste the posting text here.
  const retryWithDescription = () => {
    if (!fail || loading) return;
    const jobText = failText.trim();
    if (jobText.length < MIN_JOB_TEXT_CHARS) {
      setFailShort(true);
      return;
    }
    setFailShort(false);
    const url = toUrl(fail.href) || toUrl(link);
    if (!url) {
      setInvalid(true);
      return;
    }
    saveAtsHandoff({ jobText, jobUrl: url.href, source });
    trackEvent("hero_preview_fail_paste", {
      host: url.hostname,
      chars: jobText.length,
      source,
    });
    const dest = `/dashboard/tailor?url=${encodeURIComponent(url.href)}`;
    const authUrl = `/auth?next=${encodeURIComponent(dest)}`;
    const terms = extractTerms(jobText, 8).map((item) => item.term);
    if (!terms.length) {
      setFailShort(true);
      return;
    }
    showPreview(url, terms, authUrl);
  };

  return (
    <form onSubmit={submit} noValidate className={`w-full max-w-xl ${className}`}>
      <label htmlFor={id} className="sr-only">
        {t("linkLabel")}
      </label>
      <div className="flex flex-col gap-2 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-2 sm:flex-row">
        <input
          id={id}
          type="text"
          inputMode="url"
          autoComplete="off"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            setInvalid(false);
            setPreview(null);
            setFail(null);
            setFailText("");
            setFailShort(false);
          }}
          placeholder={t("linkPlaceholder")}
          aria-invalid={invalid || undefined}
          aria-describedby={
            invalid ? `${id}-error` : loading ? `${id}-status` : undefined
          }
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
      {loading ? (
        <p
          id={`${id}-status`}
          role="status"
          aria-live="polite"
          className="mt-2 text-sm font-semibold text-[var(--landing-ink-soft)]"
        >
          {t("previewLoadingHint")}
        </p>
      ) : null}
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
      {fail ? (
        <div
          role="alert"
          className="mt-3 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-4 text-left"
        >
          <p className="font-outfit text-base font-bold text-[var(--landing-ink)]">
            {t("previewFailTitle", { host: fail.host })}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--landing-ink-soft)]">
            {t("previewFailBody")}
          </p>
          <label htmlFor={failTextId} className="sr-only">
            {t("previewFailLabel")}
          </label>
          <textarea
            id={failTextId}
            value={failText}
            onChange={(e) => {
              setFailText(e.target.value);
              setFailShort(false);
            }}
            rows={5}
            placeholder={t("previewFailPlaceholder")}
            aria-invalid={failShort || undefined}
            aria-describedby={failShort ? `${failTextId}-error` : undefined}
            className="mt-3 w-full resize-y rounded-xl border border-[var(--landing-line)] bg-[var(--landing-surface)] px-3 py-2.5 text-sm leading-6 text-[var(--landing-ink)] placeholder:text-[var(--landing-ink-soft)] focus:border-[var(--landing-accent)] focus:outline-none"
          />
          {failShort ? (
            <p
              id={`${failTextId}-error`}
              className="mt-2 text-sm font-semibold text-[var(--landing-accent)]"
            >
              {t("previewFailTooShort", {
                count: failText.trim().length,
                min: MIN_JOB_TEXT_CHARS,
              })}
            </p>
          ) : null}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={retryWithDescription}
              className="landing-primary-btn inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 font-outfit text-base font-bold sm:w-auto"
            >
              {t("previewFailRetry")}
              <ArrowRightIcon size={18} aria-hidden="true" className="rtl:-scale-x-100" />
            </button>
            <Link
              href="/ats-resume-checker"
              onClick={() =>
                trackEvent("hero_preview_fail_checker", { host: fail.host })
              }
              className="inline-flex min-h-12 items-center justify-center px-2 font-outfit text-sm font-semibold text-[var(--landing-ink)] underline underline-offset-4 hover:text-[var(--landing-accent)]"
            >
              {t("previewFailChecker")}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => goToAuth(fail.authUrl)}
            className="mt-3 text-sm font-semibold text-[var(--landing-ink-soft)] underline underline-offset-4 hover:text-[var(--landing-ink)]"
          >
            {t("previewFailContinue")}
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
      <div className="landing-container flex flex-col items-center pt-20 text-center sm:pt-32">
        <Link
          href="/pricing"
          className="landing-rise-1 -mt-8 mb-6 inline-flex sm:-mt-12 items-center gap-2 rounded-full border border-[var(--landing-line)] bg-[var(--landing-surface)] py-1 ps-1 pe-3 text-xs text-[var(--landing-ink)] shadow-sm transition-colors hover:border-[var(--landing-ink-soft)] sm:text-sm"
        >
          <span className="rounded-full bg-[var(--landing-accent-soft)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--landing-accent)]">
            {t("lifetimeTag")}
          </span>
          <span className="tabular-nums">{t("lifetimeBadge", { price: lifetimePrice })}</span>
        </Link>
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

        {/* No entrance fade. On phones this is the largest paint, and Chrome
            counts a fade from opacity 0 late. */}
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--landing-ink-soft)]">
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

        {/* The demo shows the real output: one action and the result above
            the fold. The product sections below carry the feature list. */}
        <div className="mt-10 w-full sm:mt-12">
          <DemoPreview />
        </div>

      </div>
    </section>
  );
}
