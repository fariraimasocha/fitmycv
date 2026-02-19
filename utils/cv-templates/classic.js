import {
  PAGE_WIDTH,
  MARGIN_HARVARD,
  COLORS_CLASSIC,
  contentWidth,
  sanitizeText,
  ensureSpace,
  drawWrappedTextWithFont,
  drawBulletPoints,
} from "./shared";

const FONT = "times";
const MARGIN = MARGIN_HARVARD;
const C = COLORS_CLASSIC;

function drawHarvardHeading(doc, y, title) {
  y = ensureSpace(doc, y, 14, MARGIN);
  y += 12;

  doc.setFont(FONT, "bold");
  doc.setFontSize(12);
  doc.setTextColor(...C.heading);
  doc.text(sanitizeText(title.toUpperCase()), MARGIN, y);

  // 1pt black full-width rule below
  y += 2;
  doc.setDrawColor(...C.rule);
  doc.setLineWidth(0.35);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  return y + 4;
}

export function renderClassic(doc, data) {
  const { basics, work, education, skills } = data;
  const cw = contentWidth(MARGIN);
  let y = MARGIN;

  // ── Header ──────────────────────────────────────────────
  if (basics?.name) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(18);
    doc.setTextColor(...C.heading);
    doc.text(sanitizeText(basics.name.toUpperCase()), PAGE_WIDTH / 2, y, { align: "center" });
    y += 7;
  }

  // Contact pipe-separated, centered
  const contactParts = [basics?.email, basics?.phone, basics?.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont(FONT, "normal");
    doc.setFontSize(10);
    doc.setTextColor(...C.body);
    doc.text(sanitizeText(contactParts.join("  |  ")), PAGE_WIDTH / 2, y, { align: "center" });
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
        doc.text(line, PAGE_WIDTH / 2, y, { align: "center" });
        y += 4;
      }
    }
  }

  // ── Summary ─────────────────────────────────────────────
  if (basics?.summary) {
    y = drawHarvardHeading(doc, y, "Summary");
    y = drawWrappedTextWithFont(doc, y, basics.summary, 10, C.body, "normal", MARGIN, FONT);
    y += 2;
  }

  // ── Experience ──────────────────────────────────────────
  if (work?.length > 0) {
    y = drawHarvardHeading(doc, y, "Experience");

    for (const job of work) {
      y = ensureSpace(doc, y, 16, MARGIN);

      // Line 1: Position (bold) left | Dates right
      if (job.position) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(11);
        doc.setTextColor(...C.heading);
        doc.text(sanitizeText(job.position), MARGIN, y);
      }

      const dateStr = [job.startDate, job.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Line 2: Company (italic) left | Location (italic) right
      if (job.company) {
        doc.setFont(FONT, "italic");
        doc.setFontSize(10);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(job.company), MARGIN, y);
      }

      if (job.location) {
        doc.setFont(FONT, "italic");
        doc.setFontSize(10);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(job.location), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Bullet points for description
      if (job.description) {
        y = drawBulletPoints(doc, y, job.description, 10, C.body, MARGIN, 4, 1.5, FONT);
      }

      y += 2;
    }
  }

  // ── Education ───────────────────────────────────────────
  if (education?.length > 0) {
    y = drawHarvardHeading(doc, y, "Education");

    for (const edu of education) {
      y = ensureSpace(doc, y, 12, MARGIN);

      // Degree (bold) left | Date right
      const degreeLine = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      if (degreeLine) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(11);
        doc.setTextColor(...C.heading);
        doc.text(sanitizeText(degreeLine), MARGIN, y);
      }

      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Institution (italic)
      if (edu.institution) {
        doc.setFont(FONT, "italic");
        doc.setFontSize(10);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(edu.institution), MARGIN, y);
        y += 5;
      }

      y += 2;
    }
  }

  // ── Skills ──────────────────────────────────────────────
  if (skills?.length > 0) {
    y = drawHarvardHeading(doc, y, "Skills");

    for (const group of skills) {
      y = ensureSpace(doc, y, 8, MARGIN);

      const skillLine = group.category
        ? `${group.category}: ${(group.skills || []).join(", ")}`
        : (group.skills || []).join(", ");

      doc.setFont(FONT, "normal");
      doc.setFontSize(10);

      const lines = doc.splitTextToSize(sanitizeText(skillLine), cw);
      for (let i = 0; i < lines.length; i++) {
        y = ensureSpace(doc, y, 5, MARGIN);
        if (i === 0 && group.category) {
          doc.setFont(FONT, "bold");
          doc.setTextColor(...C.heading);
          doc.text(sanitizeText(group.category) + ": ", MARGIN, y);
          const categoryWidth = doc.getTextWidth(sanitizeText(group.category) + ": ");
          doc.setFont(FONT, "normal");
          doc.setTextColor(...C.body);
          const remainder = lines[i].substring(lines[i].indexOf(": ") + 2);
          if (remainder) {
            doc.text(remainder, MARGIN + categoryWidth, y);
          }
        } else {
          doc.setTextColor(...C.body);
          doc.text(lines[i], MARGIN, y);
        }
        y += 4.5;
      }

      y += 1;
    }
  }
}
