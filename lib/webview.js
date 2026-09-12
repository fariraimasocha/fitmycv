export function isInAppWebView(userAgent) {
  if (!userAgent) return false;
  return /FBAN|FBAV|Instagram|Twitter|LinkedInApp|GSA|wv|LinkedIn/i.test(
    userAgent,
  );
}

export function isLinkedInWebView(userAgent) {
  if (!userAgent) return false;
  return /LinkedInApp|com\.linkedin\.android|LinkedIn/i.test(userAgent);
}

export function isLinkedInReferrer(referrer) {
  if (!referrer) return false;
  return /linkedin\.com/i.test(referrer);
}

/** LinkedIn in-app browser or traffic from a LinkedIn link. */
export function shouldBlockLinkedInAuth(userAgent, referrer) {
  return isLinkedInWebView(userAgent) || isLinkedInReferrer(referrer);
}
