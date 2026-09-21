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
