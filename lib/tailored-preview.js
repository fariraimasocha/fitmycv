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

/** A saved TailoredCV as this viewer may read it. */
export function tailoredForViewer(session, doc) {
  if (!doc || session?.user?.isPremium) return doc;
  return { ...previewCV(doc), coverLetter: previewCoverLetter(doc.coverLetter), locked: true };
}

export const httpUrl = (value) => {
  const url = String(value ?? "").trim();
  return /^https?:\/\//i.test(url) ? url : "";
};
