import { jsPDF } from "jspdf";

export const PAGE_WIDTH = 210;
export const PAGE_HEIGHT = 297;
export const MARGIN_DEFAULT = 20;
export const MARGIN_COMPACT = 15;

// ATS template margins
export const MARGIN_HARVARD = 25.4; // 1 inch
export const MARGIN_JAKE = 12.7; // 0.5 inch
export const MARGIN_CLEAN = 19; // 0.75 inch

export const COLORS = {
  heading: [17, 24, 39],
  body: [55, 65, 81],
  subtle: [107, 114, 128],
  divider: [209, 213, 219],
  accent: [37, 99, 235],
};

export const COLORS_CLASSIC = {
  heading: [0, 0, 0],
  body: [0, 0, 0],
  rule: [0, 0, 0],
};

export const COLORS_CLEAN = {
  heading: [51, 51, 51],
  body: [0, 0, 0],
  subtle: [85, 85, 85],
  label: [68, 68, 68],
  rule: [153, 153, 153],
};

// New template margins
export const MARGIN_MINIMAL = 28;
export const MARGIN_CREATIVE = 20;
export const MARGIN_TECHNICAL = 18;

// New template color palettes
export const COLORS_MINIMAL = { heading: [0, 0, 0], body: [0, 0, 0], date: [80, 80, 80] };
export const COLORS_CREATIVE = { accent: [30, 64, 175], heading: [0, 0, 0], body: [31, 41, 55], subtle: [107, 114, 128] };
export const COLORS_TECHNICAL = { heading: [0, 0, 0], body: [0, 0, 0], comment: [100, 100, 100] };

export function createDoc() {
  return new jsPDF({ unit: "mm", format: "a4" });
}

export function contentWidth(margin = MARGIN_DEFAULT) {
  return PAGE_WIDTH - margin * 2;
}

export function sanitizeText(text) {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ");
}

export function ensureSpace(doc, y, needed, margin = MARGIN_DEFAULT) {
  if (y + needed > PAGE_HEIGHT - margin) {
    doc.addPage();
    return margin;
  }
  return y;
}

export function drawDivider(doc, y, margin = MARGIN_DEFAULT, color = COLORS.divider) {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.3);
  doc.line(margin, y, PAGE_WIDTH - margin, y);
  return y + 4;
}

export function drawSectionHeading(doc, y, title, margin = MARGIN_DEFAULT) {
  y = ensureSpace(doc, y, 12, margin);
  y = drawDivider(doc, y, margin);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.subtle);
  doc.text(sanitizeText(title.toUpperCase()), margin, y + 3);
  return y + 8;
}

export function drawWrappedText(doc, y, text, fontSize, color, fontStyle = "normal", margin = MARGIN_DEFAULT) {
  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const sanitized = sanitizeText(text);
  const paragraphs = sanitized.split("\n");
  const lineHeight = fontSize * 0.45;
  const width = contentWidth(margin);

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      y += lineHeight;
      continue;
    }
    const lines = doc.splitTextToSize(paragraph, width);
    for (const line of lines) {
      y = ensureSpace(doc, y, lineHeight + 2, margin);
      doc.text(line, margin, y);
      y += lineHeight;
    }
  }

  return y;
}

export function drawWrappedTextWithFont(doc, y, text, fontSize, color, fontStyle = "normal", margin = MARGIN_DEFAULT, fontFamily = "helvetica") {
  doc.setFont(fontFamily, fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const sanitized = sanitizeText(text);
  const paragraphs = sanitized.split("\n");
  const lineHeight = fontSize * 0.45;
  const width = contentWidth(margin);

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      y += lineHeight;
      continue;
    }
    const lines = doc.splitTextToSize(paragraph, width);
    for (const line of lines) {
      y = ensureSpace(doc, y, lineHeight + 2, margin);
      doc.text(line, margin, y);
      y += lineHeight;
    }
  }

  return y;
}

/**
 * Draw bullet points from a newline-separated description string.
 * Each line gets a filled circle bullet and wrapped text.
 */
export function drawBulletPoints(doc, y, text, fontSize, color, margin, indent = 4, bulletGap = 1.5, fontFamily = "helvetica") {
  const sanitized = sanitizeText(text);
  const lines = sanitized.split("\n").filter((l) => l.trim());
  const lineHeight = fontSize * 0.45;
  const textX = margin + indent;
  const textWidth = PAGE_WIDTH - margin - textX;

  for (const line of lines) {
    y = ensureSpace(doc, y, lineHeight + 2, margin);

    // Draw bullet circle
    doc.setFillColor(...color);
    doc.circle(margin + 1.5, y - 1, 0.5, "F");

    // Draw wrapped text
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const wrapped = doc.splitTextToSize(line.trim(), textWidth);
    for (let i = 0; i < wrapped.length; i++) {
      if (i > 0) {
        y = ensureSpace(doc, y, lineHeight + 2, margin);
      }
      doc.text(wrapped[i], textX, y);
      y += lineHeight;
    }

    y += bulletGap;
  }

  return y;
}
