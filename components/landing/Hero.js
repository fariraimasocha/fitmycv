"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import {
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { PRICING } from "@/lib/pricing";
import ProductPreview from "@/components/landing/ProductPreview";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";
import { saveAtsHandoff } from "@/lib/ats-handoff";
import { textAfterLink, toUrl } from "@/lib/ats-detect";
import { extractTerms } from "@/lib/keywords";
import { trackEvent } from "@/lib/analytics";

const MIN_JOB_TEXT_CHARS = 150;

// Scrapes the posting through the public job saver (Exa, rate limited per IP,
// no model call) and ranks its terms in the browser. Returns [] on any
// failure so the caller can fall back to sign-in.
async function fetchJobTerms(jobUrl, controller, source) {
  const timeout = setTimeout(() => {
    controller.abort(new DOMException("", "TimeoutError"));
  }, 20_000);
  try {
    const res = await fetch("/api/tools/job-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: jobUrl }),
      signal: controller.signal,
    });
    if (!res.ok) {
      trackEvent("hero_preview_failed", { status: res.status, source });
      return [];
    }
    const { text } = await res.json();
    return extractTerms(text || "", 8).map((item) => item.term);
  } catch {
    if (!controller.signal.aborted || controller.signal.reason?.name === "TimeoutError") {
      trackEvent("hero_preview_failed", {
        status: 0,
        source,
        reason: controller.signal.aborted ? "timeout" : "network",
      });
    }
    return [];
  } finally {
    clearTimeout(timeout);
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
  const activeRequest = useRef(null);
  useEffect(() => () => {
    activeRequest.current?.abort();
    activeRequest.current = null;
  }, []);
  const [preview, setPreview] = useState(null);
  // Ceiling: scrape fail used to dump straight to /auth with no recovery.
  // Keep the saved link, say the work is safe, and put paste-description
  // recovery in the fail panel itself.
  const [fail, setFail] = useState(null);
  const [failText, setFailText] = useState("");
  const [failShort, setFailShort] = useState(false);
  const failTextId = `${id}-fail-text`;

  const goToAuth = (authUrl) => {
    trackEvent("hero_preview_continued", { source, recovery: Boolean(fail) });
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
    const controller = new AbortController();
    activeRequest.current = controller;
    const terms = hasText
      ? extractTerms(jobText, 8).map((item) => item.term)
      : await fetchJobTerms(url.href, controller, source);
    // Editing the input starts a new attempt. Never show the old job's result.
    if (activeRequest.current !== controller) return;
    activeRequest.current = null;
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
            activeRequest.current?.abort();
            activeRequest.current = null;
            setLoading(false);
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
        <div role="status" className="mt-3 rounded-2xl border border-[var(--landing-line)] bg-[var(--landing-surface)] p-4 text-start">
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
          className="mt-3 rounded-2xl border border-[var(--landing-accent-line)] bg-[var(--landing-accent-soft)] p-4 text-start"
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
              role="alert"
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

export default function Hero({ lifetimePrice = PRICING.lifetime.price }) {
  const t = useTranslations("landing.hero");
  return <section id="hero" className="public-hero">
    <div className="public-container">
      <div className="public-hero-copy">
        <h1 className="public-hero-title">{t.rich("titleMain", { accent: (chunks) => <em>{chunks}</em> })}</h1>
        <p className="public-hero-description">{t("body")}</p>
        {/* The headline asks for a job link, so the hero takes one. The id
            keeps old /#start-tailoring links landing on the form. */}
        <div id="start-tailoring" className="public-hero-form">
          <JobLinkForm className="mx-auto mt-8" />
        </div>
        <p className="public-hero-note">{t("previewFree")}. {t("priceNote", { price: lifetimePrice })}</p>
      </div>
      <ProductPreview />
    </div>
  </section>;
}
