// ponytail: shared key so ATS checker can hand job text to /dashboard/tailor

export const ATS_HANDOFF_KEY = "fitmycv_ats_handoff";

// localStorage, not sessionStorage: a magic link opens a new tab, and a new tab
// cannot see the old tab's sessionStorage. The hour cap keeps a CV from
// lingering in a shared browser.
const HANDOFF_TTL_MS = 60 * 60 * 1000;
const fresh = (data) => Date.now() - (data?.ts ?? 0) < HANDOFF_TTL_MS;

export function saveAtsHandoff(payload) {
  try {
    localStorage.setItem(
      ATS_HANDOFF_KEY,
      JSON.stringify({ ...payload, ts: Date.now() }),
    );
  } catch {
    // Private mode / quota: handoff is best effort.
  }
}

function readAtsHandoff() {
  try {
    const raw = localStorage.getItem(ATS_HANDOFF_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!fresh(data)) return null;
    // The hero hands over a link, the free tools hand over pasted text.
    const hasText = typeof data?.jobText === "string" && data.jobText.trim();
    const hasUrl = typeof data?.jobUrl === "string" && data.jobUrl.trim();
    return hasText || hasUrl ? data : null;
  } catch {
    return null;
  }
}

/** Read without clearing, to check whether a job is waiting for the tailor. */
export function peekAtsHandoff() {
  return readAtsHandoff();
}

/** Read and clear. Returns null if missing or invalid. */
export function takeAtsHandoff() {
  const data = readAtsHandoff();
  try {
    localStorage.removeItem(ATS_HANDOFF_KEY);
  } catch {}
  return data;
}

// The CV text a free tool already read, handed to onboarding's paste box so a
// new user skips the PDF upload. Separate key: the job handoff above needs a
// job, and most CV-only tools have none.
const CV_HANDOFF_KEY = "fitmycv_cv_handoff";

export function saveCvHandoff(cvText, source) {
  try {
    localStorage.setItem(CV_HANDOFF_KEY, JSON.stringify({ cvText, source, ts: Date.now() }));
  } catch {
    // Best effort, like the job handoff.
  }
}

/** Read and clear. Returns null if missing or invalid. */
export function takeCvHandoff() {
  try {
    const raw = localStorage.getItem(CV_HANDOFF_KEY);
    if (!raw) return null;
    localStorage.removeItem(CV_HANDOFF_KEY);
    const data = JSON.parse(raw);
    if (!fresh(data)) return null;
    return typeof data?.cvText === "string" && data.cvText.trim() ? data : null;
  } catch {
    return null;
  }
}

// The job description someone pasted into a free checker. Kept for the tab so
// a trip to /auth and back does not empty the box. Not cleared on read: the
// checker is still on screen and may go to sign-in again.
const JOB_DRAFT_KEY = "fitmycv_job_draft";

export function saveJobDraft(jobText) {
  try {
    sessionStorage.setItem(JOB_DRAFT_KEY, jobText);
  } catch {
    // Best effort, like the handoffs above.
  }
}

export function readJobDraft() {
  try {
    return sessionStorage.getItem(JOB_DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}
