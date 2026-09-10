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

export function validateResumeFile(file) {
  if (isWord(file)) {
    return "That is a Word file. Export it as a PDF, then upload that.";
  }
  if (!isPdf(file) && !isPlainText(file)) {
    return "Choose a PDF resume.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Choose a PDF under 8MB.";
  }
  return null;
}

export async function extractResumeText(file) {
  const invalid = validateResumeFile(file);
  if (invalid) throw new Error(invalid);

  let text = "";

  if (isPlainText(file)) {
    const { sanitizeExtractedText } = await import("@/utils/pdf-parser");
    text = sanitizeExtractedText(await file.text());
  } else {
    const { extractPdfText } = await import("@/utils/pdf-parser");
    text = await extractPdfText(await file.arrayBuffer());
  }

  if (text.length < MIN_TEXT_LENGTH) {
    throw new Error(
      "Could not read enough text from this file. It may be a scan. Try another PDF, or paste the text."
    );
  }

  return text;
}
