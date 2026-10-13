// Free users see enough to tell the tailor worked: the summary, every role
// with its first line, and the cover letter's opening paragraph. The full
// document stays in the database and is served once they upgrade. The blur
// in PreviewUnlockGate is only the visual; this is the gate.

const firstLine = (text) => String(text ?? "").split("\n").find((line) => line.trim()) ?? "";

export function previewCV(cv) {
  if (!cv) return cv;
  return {
    ...cv,
    work: (cv.work ?? []).map((role) => ({ ...role, description: firstLine(role.description) })),
  };
}

export function previewCoverLetter(text) {
  return String(text ?? "").split(/\n\s*\n/)[0] ?? "";
}

/** Pro opens every CV. A single purchase opens the one it was bought for. */
export function canReadFull(session, doc) {
  return Boolean(session?.user?.isPremium || doc?.unlockedAt);
}

/** A saved TailoredCV as this viewer may read it. `locked` is what the client gates on. */
export function tailoredForViewer(session, doc) {
  if (!doc) return doc;
  const { unlockOrderId, ...cv } = doc;
  if (canReadFull(session, cv)) return cv;
  return { ...previewCV(cv), coverLetter: previewCoverLetter(cv.coverLetter), locked: true };
}

export const httpUrl = (value) => {
  const url = String(value ?? "").trim();
  return /^https?:\/\//i.test(url) ? url : "";
};
