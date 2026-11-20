// Client-side resume text extraction for the free tools.
// The PDF is read in the browser. Nothing is posted or stored.

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MIN_TEXT_LENGTH = 40;

const isPdf = (file) =>
  file.type === "application/pdf" || /\.pdf$/i.test(file.name);

const isPlainText = (file) =>
  file.type === "text/plain" || /\.txt$/i.test(file.name);

const isWord = (file) =>
  file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
  /\.docx?$/i.test(file.name);

// Each failure has a code, so a translated page can show its own wording
// (components/tools/ResumeFileField.jsx). The English text is for callers that
// print error.message as it comes.
const MESSAGES = {
  word: "That is a Word file. Export it as a PDF, then upload that.",
  type: "Choose a PDF resume.",
  size: "File is too large. Choose a PDF under 8MB.",
  empty: "Could not read enough text from this file. It may be a scan. Try another PDF, or paste the text.",
};

const fail = (code) => Object.assign(new Error(MESSAGES[code]), { code });

/** Returns "word", "type" or "size" when the file cannot be read, else null. */
export function validateResumeFile(file) {
  if (isWord(file)) return "word";
  if (!isPdf(file) && !isPlainText(file)) return "type";
  if (file.size > MAX_FILE_SIZE) return "size";
  return null;
}

export async function extractResumeText(file) {
  const invalid = validateResumeFile(file);
  if (invalid) throw fail(invalid);

  let text = "";

  if (isPlainText(file)) {
    const { sanitizeExtractedText } = await import("@/utils/pdf-parser");
    text = sanitizeExtractedText(await file.text());
  } else {
    const { extractPdfText } = await import("@/utils/pdf-parser");
    text = await extractPdfText(await file.arrayBuffer());
  }

  if (text.length < MIN_TEXT_LENGTH) throw fail("empty");

  return text;
}
