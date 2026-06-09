/**
 * Build a human-friendly download filename for a CV or cover letter.
 * Kept dependency-free (no jsPDF) so it can be imported by the client print
 * path without pulling a PDF library into the bundle.
 */
export function buildPdfFilename(name, jobTitle, type) {
  const safeName = (name || "CV").replace(/[^\w\s-]/g, "").trim();
  const safeJob = (jobTitle || "").replace(/[^\w\s-]/g, "").trim();

  if (type === "cover-letter") {
    const parts = [safeName, safeJob, "Cover Letter"].filter(Boolean);
    return `${parts.join(" - ")}.pdf`;
  }

  const parts = [safeName, safeJob].filter(Boolean);
  return `${parts.join(" - ")}.pdf`;
}
