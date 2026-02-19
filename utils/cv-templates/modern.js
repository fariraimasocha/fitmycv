import {
  PAGE_WIDTH,
  MARGIN_JAKE,
  contentWidth,
  sanitizeText,
  ensureSpace,
  drawBulletPoints,
  drawWrappedTextWithFont,
} from "./shared";

const FONT = "helvetica";
const MARGIN = MARGIN_JAKE;
const BLACK = [0, 0, 0];

function drawJakeHeading(doc, y, title) {
  y = ensureSpace(doc, y, 10, MARGIN);
  y += 4;

  doc.setFont(FONT, "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BLACK);
  doc.text(sanitizeText(title.toUpperCase()), MARGIN, y);

  // 0.5pt black rule below, tight spacing
  y += 2;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.18);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  return y + 5;
}

export function renderModern(doc, data) {
  const { basics, work, education, skills } = data;
  const cw = contentWidth(MARGIN);
  let y = MARGIN;

  // ── Header ──────────────────────────────────────────────
  if (basics?.name) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(24);
    doc.setTextColor(...BLACK);
    doc.text(sanitizeText(basics.name), PAGE_WIDTH / 2, y, { align: "center" });
    y += 8;
  }

  // Contact pipe-separated, centered
  const contactParts = [basics?.email, basics?.phone, basics?.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont(FONT, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BLACK);
    doc.text(sanitizeText(contactParts.join("  |  ")), PAGE_WIDTH / 2, y, { align: "center" });
    y += 4;
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
      doc.setTextColor(...BLACK);
      const lines = doc.splitTextToSize(sanitizeText(profileText), cw);
      for (const line of lines) {
        doc.text(line, PAGE_WIDTH / 2, y, { align: "center" });
        y += 4;
      }
    }
  }

  // ── Summary ─────────────────────────────────────────────
  if (basics?.summary) {
    y = drawJakeHeading(doc, y, "Summary");
    y = drawWrappedTextWithFont(doc, y, basics.summary, 10, BLACK, "normal", MARGIN, FONT);
    y += 1;
  }

  // ── Experience ──────────────────────────────────────────
  if (work?.length > 0) {
    y = drawJakeHeading(doc, y, "Experience");

    for (const job of work) {
      y = ensureSpace(doc, y, 14, MARGIN);

      // Line 1 (Jake's signature: company first): Company (bold) left | Location (italic) right
      if (job.company) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(11);
        doc.setTextColor(...BLACK);
        doc.text(sanitizeText(job.company), MARGIN, y);
      }

      if (job.location) {
        doc.setFont(FONT, "italic");
        doc.setFontSize(10);
        doc.setTextColor(...BLACK);
        doc.text(sanitizeText(job.location), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 4.5;

      // Line 2: Position (italic) left | Dates right
      if (job.position) {
        doc.setFont(FONT, "italic");
        doc.setFontSize(10);
        doc.setTextColor(...BLACK);
        doc.text(sanitizeText(job.position), MARGIN, y);
      }

      const dateStr = [job.startDate, job.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...BLACK);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 4.5;

      // Bullet points with tight gap
      if (job.description) {
        y = drawBulletPoints(doc, y, job.description, 10, BLACK, MARGIN, 4, 0.7, FONT);
      }

      y += 2;
    }
  }

  // ── Education ───────────────────────────────────────────
  if (education?.length > 0) {
    y = drawJakeHeading(doc, y, "Education");

    for (const edu of education) {
      y = ensureSpace(doc, y, 12, MARGIN);

      // Institution (bold) left
      if (edu.institution) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(11);
        doc.setTextColor(...BLACK);
        doc.text(sanitizeText(edu.institution), MARGIN, y);
      }

      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...BLACK);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 4.5;

      // Degree (italic)
      const degreeLine = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      if (degreeLine) {
        doc.setFont(FONT, "italic");
        doc.setFontSize(10);
        doc.setTextColor(...BLACK);
        doc.text(sanitizeText(degreeLine), MARGIN, y);
        y += 4.5;
      }

      y += 2;
    }
  }

  // ── Technical Skills ────────────────────────────────────
  if (skills?.length > 0) {
    y = drawJakeHeading(doc, y, "Technical Skills");

    for (const group of skills) {
      y = ensureSpace(doc, y, 7, MARGIN);

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
          doc.setTextColor(...BLACK);
          doc.text(sanitizeText(group.category) + ": ", MARGIN, y);
          const categoryWidth = doc.getTextWidth(sanitizeText(group.category) + ": ");
          doc.setFont(FONT, "normal");
          doc.setTextColor(...BLACK);
          const remainder = lines[i].substring(lines[i].indexOf(": ") + 2);
          if (remainder) {
            doc.text(remainder, MARGIN + categoryWidth, y);
          }
        } else {
          doc.setTextColor(...BLACK);
          doc.text(lines[i], MARGIN, y);
        }
        y += 4;
      }

      y += 2;
    }
  }
}
