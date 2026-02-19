import {
  PAGE_WIDTH,
  MARGIN_CREATIVE,
  COLORS_CREATIVE,
  contentWidth,
  sanitizeText,
  ensureSpace,
  drawWrappedTextWithFont,
  drawBulletPoints,
} from "./shared";

const FONT = "helvetica";
const MARGIN = MARGIN_CREATIVE;
const C = COLORS_CREATIVE;

function drawCreativeHeading(doc, y, title) {
  y = ensureSpace(doc, y, 14, MARGIN);
  y += 10;

  // Left-border accent rectangle (1.5mm wide, 5mm tall)
  doc.setFillColor(...C.accent);
  doc.rect(MARGIN, y - 4, 1.5, 5, "F");

  // ALL CAPS bold in accent color
  doc.setFont(FONT, "bold");
  doc.setFontSize(12);
  doc.setTextColor(...C.accent);
  doc.text(sanitizeText(title.toUpperCase()), MARGIN + 4, y);

  return y + 6;
}

export function renderCreative(doc, data) {
  const { basics, work, education, skills } = data;
  const cw = contentWidth(MARGIN);
  let y = 0;

  // ── Header: Blue filled bar across full width ─────────
  doc.setFillColor(...C.accent);
  doc.rect(0, 0, PAGE_WIDTH, 18, "F");

  // Name in white inside bar
  if (basics?.name) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(sanitizeText(basics.name), MARGIN, 12);
  }

  y = 24; // below the bar

  // Contact line (black, below bar)
  const contactParts = [basics?.email, basics?.phone, basics?.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont(FONT, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.heading);
    doc.text(sanitizeText(contactParts.join("  |  ")), MARGIN, y);
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
      doc.setTextColor(...C.subtle);
      const lines = doc.splitTextToSize(sanitizeText(profileText), cw);
      for (const line of lines) {
        doc.text(line, MARGIN, y);
        y += 4;
      }
    }
  }

  y += 2;

  // ── Summary ─────────────────────────────────────────────
  if (basics?.summary) {
    y = drawCreativeHeading(doc, y, "Summary");
    y = drawWrappedTextWithFont(doc, y, basics.summary, 10, C.body, "normal", MARGIN, FONT);
    y += 2;
  }

  // ── Experience ──────────────────────────────────────────
  if (work?.length > 0) {
    y = drawCreativeHeading(doc, y, "Experience");

    for (const job of work) {
      y = ensureSpace(doc, y, 16, MARGIN);

      // Position (bold black) left | Dates (gray) right
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
        doc.setTextColor(...C.subtle);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Company below
      if (job.company) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.subtle);
        doc.text(sanitizeText(job.company), MARGIN, y);
        y += 5;
      }

      // Bullet points
      if (job.description) {
        y = drawBulletPoints(doc, y, job.description, 10, C.body, MARGIN, 4, 1.5, FONT);
      }

      y += 3;
    }
  }

  // ── Skills ──────────────────────────────────────────────
  if (skills?.length > 0) {
    y = drawCreativeHeading(doc, y, "Skills");

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

  // ── Education ───────────────────────────────────────────
  if (education?.length > 0) {
    y = drawCreativeHeading(doc, y, "Education");

    for (const edu of education) {
      y = ensureSpace(doc, y, 12, MARGIN);

      // Degree (bold) left | Date (gray) right
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
        doc.setTextColor(...C.subtle);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Institution (gray)
      if (edu.institution) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...C.subtle);
        doc.text(sanitizeText(edu.institution), MARGIN, y);
        y += 5;
      }

      y += 3;
    }
  }
}
