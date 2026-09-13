/**
 * WebView / in-app browser detection for FitMyCV.
 * Google OAuth is blocked inside embedded browsers. LinkedIn, Facebook,
 * Instagram and others open links in an in-app WebView where signIn("google")
 * will fail with disallowed_useragent. We detect that case and guide the
 * user to Chrome / Safari or to the email magic-link fallback which works
 * everywhere.
 *
 * Key constraint: normal Chrome / Safari must never be flagged, even when
 * the user arrived from linkedin.com (desktop referrer). Only an actual
 * embedded WebView should trigger the gate.
 */

// ---------- platform helpers ----------

export function isIOS(userAgent) {
  const ua = userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return /iPhone|iPad|iPod/i.test(ua || "");
}

export function isAndroid(userAgent) {
  const ua = userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return /Android/i.test(ua || "");
}

// ---------- direct LinkedIn detection ----------

/** True when the UA string was produced by the LinkedIn app itself. */
export function isLinkedInWebView(userAgent) {
  if (!userAgent) return false;
  return /LinkedIn/i.test(userAgent);
}

// ---------- generic in-app / WebView detection ----------

/**
 * iOS WKWebView / SFSafariViewController embedded views often omit the
 * `Safari/` token while still containing `AppleWebKit`. Real Safari always
 * has `Version/` + `Safari/`.
 */
export function isIOSWebView(userAgent) {
  if (!userAgent) return false;
  const isAppleDevice = /iPhone|iPad|iPod/i.test(userAgent);
  if (!isAppleDevice) return false;
  // Real Safari: Version/xx Mobile/... Safari/...
  // In-app WKWebView: AppleWebKit/... Mobile/... (no Safari token)
  const hasAppleWebKit = /AppleWebKit/i.test(userAgent);
  const hasSafariToken = /Safari/i.test(userAgent);
  return hasAppleWebKit && !hasSafariToken;
}

/** Android System WebView / Custom Tab that exposes the `; wv` flag. */
export function isAndroidWebView(userAgent) {
  if (!userAgent) return false;
  return /\bwv\b/.test(userAgent);
}

/** Any known in-app container, including LinkedIn, Facebook, Instagram, etc. */
export function isGenericInAppWebView(userAgent) {
  if (!userAgent) return false;
  // Explicit in-app markers (case-insensitive)
  if (/FBAN|FBAV|FBAN\/|FBAV\/|Instagram|Twitter|Snapchat|TikTok|Pinterest|KakaoTalk|Line\/|Line-|\bLine\b|WhatsApp|WeChat|MicroMessenger|GSA\/|GSA |SearchApp|Viber|Telegram|Discord|Slack|Quora/i.test(userAgent)) {
    return true;
  }
  if (isAndroidWebView(userAgent)) return true;
  if (isIOSWebView(userAgent)) return true;
  return false;
}

/**
 * Broad check: is this an embedded browser where Google OAuth will be
 * blocked? Includes LinkedIn plus other social wrappers and raw platform
 * WebViews. Used on the /auth page to disable the Google button.
 */
export function isInAppBrowser(userAgent) {
  if (!userAgent) return false;
  if (isLinkedInWebView(userAgent)) return true;
  if (isGenericInAppWebView(userAgent)) return true;
  return false;
}

/** Legacy alias kept for older imports. */
export const isInAppWebView = isInAppBrowser;

// ---------- referrer ----------

export function isLinkedInReferrer(referrer) {
  if (!referrer) return false;
  return /linkedin\.com/i.test(referrer);
}

// ---------- gated action ----------

/**
 * Should we intercept a sign-in attempt and show the "Open in browser"
 * gate? True only when we are confident the user is inside LinkedIn's
 * in-app browser. We deliberately do NOT block on referrer alone, so a
 * normal Chrome/Safari user who clicked a LinkedIn link on desktop is
 * not affected.
 *
 * Cases:
 * 1. UA contains LinkedIn  -> LinkedIn app (primary)
 * 2. Generic in-app UA + referrer is linkedin.com -> UA-masked WKWebView
 *    opened from LinkedIn where the UA was stripped but the referrer hints it.
 */
export function shouldBlockLinkedInAuth(userAgent, referrer) {
  if (isLinkedInWebView(userAgent)) return true;
  if (isGenericInAppWebView(userAgent) && isLinkedInReferrer(referrer)) return true;
  if (isIOSWebView(userAgent) && isLinkedInReferrer(referrer)) return true;
  return false;
}

// ---------- external browser helpers ----------

/** Build the Android intent URL that forces Chrome to open the link. */
export function getAndroidIntentUrl(url) {
  const stripped = String(url).replace(/^https?:\/\//, "");
  return `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;end`;
}

/**
 * Try to escape the in-app WebView to the system browser.
 * Returns true if an attempt was made. On iOS there is no reliable
 * programmatic escape, so we return false and let the UI show copy
 * instructions.
 */
export function tryOpenExternalBrowser(url) {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const target = url || window.location.href;

  if (isAndroid(ua)) {
    try {
      window.location.href = getAndroidIntentUrl(target);
      return true;
    } catch {
      // fall through to window.open fallback
    }
    try {
      const win = window.open(target, "_blank", "noopener");
      if (win) return true;
    } catch {}
    return false;
  }

  // iOS and desktop: no reliable programmatic escape.
  // Best effort: try window.open which on some LinkedIn versions opens Safari.
  try {
    const win = window.open(target, "_blank", "noopener");
    if (win) return true;
  } catch {}
  return false;
}

/** Convenience: return a human label for the current in-app context. */
export function getInAppBrowserLabel(userAgent) {
  const ua = userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (/LinkedIn/i.test(ua || "")) return "LinkedIn";
  if (/FBAN|FBAV/i.test(ua || "")) return "Facebook";
  if (/Instagram/i.test(ua || "")) return "Instagram";
  if (/Twitter/i.test(ua || "")) return "X";
  return "in-app browser";
}
