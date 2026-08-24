export const PRINT_KEY_PREFIX = "fitmycv:print:";

/**
 * Hand a document off to the /print route, which renders it with the SAME
 * template components as the on-screen preview and triggers the browser's
 * native Save-as-PDF. Because the PDF is produced by the same DOM/CSS that
 * makes the preview, fonts, layout, formatting and emojis all match — and the
 * text stays selectable (ATS-friendly).
 *
 * The payload is stashed in localStorage under a one-time token (passed via the
 * URL) so it survives the new tab and avoids URL-length limits / races.
 *
 * @param {object} payload
 * @param {"cv"|"cover-letter"} payload.kind
 * @param {string} payload.filename     Suggested file name (including ".pdf").
 * @param {object} [payload.data]       Resume data { basics, work, ... } (kind "cv").
 * @param {string} [payload.template]   Template id (kind "cv"; for kind
 *                                       "cover-letter" it sets the matching font).
 * @param {string} [payload.content]    Letter body (kind "cover-letter").
 * @param {object} [payload.meta]       { name, jobTitle, jobCompany } (cover letter).
 */
export function printDocument(payload) {
  if (typeof window === "undefined") return;

  const token = crypto.randomUUID();
  try {
    window.localStorage.setItem(PRINT_KEY_PREFIX + token, JSON.stringify(payload));
  } catch {
    // localStorage unavailable (private mode / quota) — nothing useful to print.
    return;
  }

  window.open(`/print?k=${token}`, "_blank");
}
