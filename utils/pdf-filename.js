// Download file names for CVs and cover letters, shared by every download
// button and the free tool at /resume-file-name-generator, so both follow the
// same rules: "Farirai-Masocha-Software-Engineer-Resume.pdf".
// Dependency-free so the client print path and scripts/check-tools.mjs can
// import it.

// Keep the whole name, extension included, under 100 characters.
const MAX_USER_LENGTH = 84;

const trimEdges = (value) => value.replace(/^[-_.]+|[-_.]+$/g, "");

/**
 * Turns one field into a safe file name part. Capitalisation is left alone:
 * people spell their own names, and title casing over them gets it wrong.
 */
export function sanitizePart(value, separator) {
  return trimEdges(
    String(value ?? "")
      .normalize("NFKD") // "e" with an acute accent becomes "e" plus a mark
      .replace(/[\u0300-\u036f]/g, "") // drop the mark, keep the letter
      .replace(/[\\/:*?"<>|]/g, " ") // characters that break uploads
      .replace(/[\u0000-\u001f\u007f]/g, " ") // control characters
      .replace(/[^\p{L}\p{N}\s._-]/gu, " ") // punctuation, symbols, emoji
      .replace(/\s+/g, separator) // whitespace runs collapse to one separator
      .replace(/[-_]{2,}/g, separator)
  );
}

/**
 * Joins the parts, caps the length, and always ends with the label (Resume by
 * default) so the file says what it is even when everything else is stripped.
 */
export function buildFileName(parts, separator = "-", label = "Resume") {
  let stem = parts
    .map((part) => sanitizePart(part, separator))
    .filter(Boolean)
    .join(separator)
    .replace(/[-_]{2,}/g, separator)
    .replace(/\.{2,}/g, ".");

  if (stem.length > MAX_USER_LENGTH) {
    // ponytail: a very long name is cut at the last separator inside the cap,
    // and mid word when there is no separator to cut at.
    const cut = stem.slice(0, MAX_USER_LENGTH);
    const lastSeparator = cut.lastIndexOf(separator);
    stem = lastSeparator > 0 ? cut.slice(0, lastSeparator) : cut;
  }

  stem = trimEdges(stem);
  return stem ? `${stem}${separator}${label}.pdf` : `${label}.pdf`;
}

/** True when the parts are long enough that buildFileName has to cut them. */
export function exceedsLimit(parts, separator = "-") {
  return (
    parts
      .map((part) => sanitizePart(part, separator))
      .filter(Boolean)
      .join(separator).length > MAX_USER_LENGTH
  );
}

/**
 * File name for a downloaded CV or cover letter: name, then the role it was
 * tailored for when there is one.
 */
export function buildPdfFilename(name, type, role = "") {
  return buildFileName([name, role], "-", type === "cover-letter" ? "Cover-Letter" : "Resume");
}
