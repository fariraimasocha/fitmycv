import {
  PAGE_WIDTH,
  MARGIN_MINIMAL,
  COLORS_MINIMAL,
  contentWidth,
  sanitizeText,
  ensureSpace,
  drawWrappedTextWithFont,
} from "./shared";

const FONT = "helvetica";
const MARGIN = MARGIN_MINIMAL;
const C = COLORS_MINIMAL;

function drawMinimalHeading(doc, y, title) {
  y = ensureSpace(doc, y, 14, MARGIN);
  y += 20; // generous whitespace above — the primary visual separator

  doc.setFont(FONT, "normal"); // NOT bold
  doc.setFontSize(11);
  doc.setTextColor(...C.heading);
  doc.text(sanitizeText(title), MARGIN, y);

  return y + 6;
}

export function renderMinimal(doc, data) {
  const { basics, work, education, skills } = data;
  const cw = contentWidth(MARGIN);
  let y = MARGIN;

  // ── Header (left-aligned, no decorations) ─────────────
  if (basics?.name) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(20);
    doc.setTextColor(...C.heading);
    doc.text(sanitizeText(basics.name), MARGIN, y);
    y += 7;
  }

  // Contact line
  const contactParts = [basics?.email, basics?.phone, basics?.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont(FONT, "normal");
    doc.setFontSize(10);
    doc.setTextColor(...C.body);
    doc.text(sanitizeText(contactParts.join("  |  ")), MARGIN, y);
    y += 5;
  }

  // Profiles
  if (basics?.profiles?.length > 0) {
    const profileText = basics.profiles
      .filter((p) => p.network || p.url)
      .map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network))
      .join("  |  ");
    if (profileText) {
      doc.setFont(FONT, "normal");
      doc.setFontSize(9);
      doc.setTextColor(...C.body);
      const lines = doc.splitTextToSize(sanitizeText(profileText), cw);
      for (const line of lines) {
        doc.text(line, MARGIN, y);
        y += 4;
      }
    }
  }

  // ── Summary ─────────────────────────────────────────────
  if (basics?.summary) {
    y = drawMinimalHeading(doc, y, "Summary");
    y = drawWrappedTextWithFont(doc, y, basics.summary, 10, C.body, "normal", MARGIN, FONT);
    y += 2;
  }

  // ── Experience ──────────────────────────────────────────
  if (work?.length > 0) {
    y = drawMinimalHeading(doc, y, "Experience");

    for (const job of work) {
      y = ensureSpace(doc, y, 16, MARGIN);

      // Position (bold) left | Dates (gray) right
      if (job.position) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(10);
        doc.setTextColor(...C.heading);
        doc.text(sanitizeText(job.position), MARGIN, y);
      }

      const dateStr = [job.startDate, job.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.date);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Company below
      if (job.company) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(job.company), MARGIN, y);
        y += 5;
      }

      // Description as plain paragraphs (NO bullets)
      if (job.description) {
        y = drawWrappedTextWithFont(doc, y, job.description, 10, C.body, "normal", MARGIN, FONT);
      }

      y += 4;
    }
  }

  // ── Education ───────────────────────────────────────────
  if (education?.length > 0) {
    y = drawMinimalHeading(doc, y, "Education");

    for (const edu of education) {
      y = ensureSpace(doc, y, 12, MARGIN);

      // Degree (bold) left | Date (gray) right
      const degreeLine = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      if (degreeLine) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(10);
        doc.setTextColor(...C.heading);
        doc.text(sanitizeText(degreeLine), MARGIN, y);
      }

      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.date);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Institution below
      if (edu.institution) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(edu.institution), MARGIN, y);
        y += 5;
      }

      y += 3;
    }
  }

  // ── Skills (plain comma-separated, no bold categories) ─
  if (skills?.length > 0) {
    y = drawMinimalHeading(doc, y, "Skills");

    for (const group of skills) {
      y = ensureSpace(doc, y, 8, MARGIN);

      const allSkills = (group.skills || []).join(", ");
      const skillLine = group.category ? `${group.category}: ${allSkills}` : allSkills;

      doc.setFont(FONT, "normal");
      doc.setFontSize(10);
      doc.setTextColor(...C.body);

      const lines = doc.splitTextToSize(sanitizeText(skillLine), cw);
      for (const line of lines) {
        y = ensureSpace(doc, y, 5, MARGIN);
        doc.text(line, MARGIN, y);
        y += 4.5;
      }

      y += 1;
    }
  }
}
