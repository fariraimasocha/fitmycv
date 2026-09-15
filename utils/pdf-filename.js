/**
 * Download filename for a CV or cover letter, named after the person on the
 * CV: "Ada Lovelace CV.pdf" and "Ada Lovelace Application Letter.pdf".
 * Kept dependency-free (no jsPDF) so the client print path can import it.
 */
export function buildPdfFilename(name, type) {
  // Letters in any script survive, so accented names stay intact.
  const safeName = (name || "").replace(/[^\p{L}\p{N}\s'.-]/gu, "").replace(/\s+/g, " ").trim();
  const label = type === "cover-letter" ? "Application Letter" : "CV";
  return `${safeName ? `${safeName} ` : ""}${label}.pdf`;
}
