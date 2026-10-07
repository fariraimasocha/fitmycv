// ponytail: shared key so ATS checker can hand job text to /dashboard/tailor

export const ATS_HANDOFF_KEY = "fitmycv_ats_handoff";

export function saveAtsHandoff(payload) {
  try {
    sessionStorage.setItem(
      ATS_HANDOFF_KEY,
      JSON.stringify({ ...payload, ts: Date.now() }),
    );
  } catch {
    // Private mode / quota: handoff is best effort.
  }
}

/** Read and clear. Returns null if missing or invalid. */
export function takeAtsHandoff() {
  try {
    const raw = sessionStorage.getItem(ATS_HANDOFF_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(ATS_HANDOFF_KEY);
    const data = JSON.parse(raw);
    if (!data?.jobText || typeof data.jobText !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

// The CV text a free tool already read, handed to onboarding's paste box so a
// new user skips the PDF upload. Separate key: the job handoff above needs a
// job, and most CV-only tools have none.
const CV_HANDOFF_KEY = "fitmycv_cv_handoff";

export function saveCvHandoff(cvText, source) {
  try {
    sessionStorage.setItem(CV_HANDOFF_KEY, JSON.stringify({ cvText, source }));
  } catch {
    // Best effort, like the job handoff.
  }
}

/** Read and clear. Returns null if missing or invalid. */
export function takeCvHandoff() {
  try {
    const raw = sessionStorage.getItem(CV_HANDOFF_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(CV_HANDOFF_KEY);
    const data = JSON.parse(raw);
    return typeof data?.cvText === "string" && data.cvText.trim() ? data : null;
  } catch {
    return null;
  }
}
