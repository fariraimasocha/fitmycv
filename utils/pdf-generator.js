import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  MARGIN_DEFAULT,
  COLORS,
  contentWidth,
  createDoc,
  sanitizeText,
  ensureSpace,
  drawDivider,
} from "./cv-templates/shared";
import { CV_TEMPLATES, DEFAULT_TEMPLATE } from "./cv-templates";

export function generateCVPdf(data, template = DEFAULT_TEMPLATE) {
  const doc = createDoc();
  const render = CV_TEMPLATES[template]?.render ?? CV_TEMPLATES[DEFAULT_TEMPLATE].render;
  render(doc, data);
  return doc;
}

export function generateCoverLetterPdf(content, meta = {}) {
  const doc = createDoc();
  const margin = MARGIN_DEFAULT;
  const cw = contentWidth(margin);
  let y = margin;

  // Header - applicant name centered
  if (meta.name) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.heading);
    doc.text(sanitizeText(meta.name), PAGE_WIDTH / 2, y, { align: "center" });
    y += 10;
  }

  // Subtitle with job info
  if (meta.jobTitle || meta.jobCompany) {
    const subtitle = [meta.jobTitle, meta.jobCompany].filter(Boolean).join(" at ");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.subtle);
    doc.text(sanitizeText(subtitle), PAGE_WIDTH / 2, y, { align: "center" });
    y += 8;
  }

  y = drawDivider(doc, y, margin);
  y += 4;

  // Body - split by double newlines for paragraphs
  const sanitized = sanitizeText(content || "");
  const paragraphs = sanitized.split(/\n\s*\n/);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.body);

  const lineHeight = 5;

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) continue;

    const lines = doc.splitTextToSize(paragraph.trim(), cw);
    for (const line of lines) {
      y = ensureSpace(doc, y, lineHeight + 2, margin);
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += 4;
  }

  return doc;
}

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
