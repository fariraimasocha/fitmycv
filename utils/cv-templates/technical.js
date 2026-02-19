import {
  PAGE_WIDTH,
  MARGIN_TECHNICAL,
  COLORS_TECHNICAL,
  contentWidth,
  sanitizeText,
  ensureSpace,
} from "./shared";

const FONT = "courier";
const MARGIN = MARGIN_TECHNICAL;
const C = COLORS_TECHNICAL;

function drawTechnicalHeading(doc, y, title) {
  y = ensureSpace(doc, y, 12, MARGIN);
  y += 8;

  // ALL CAPS bold + 0.3pt black underline
  doc.setFont(FONT, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.heading);
  doc.text(sanitizeText(title.toUpperCase()), MARGIN, y);

  y += 1.5;
  doc.setDrawColor(...C.heading);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  return y + 4;
}

function drawDashBullets(doc, y, text, margin) {
  const sanitized = sanitizeText(text);
  const lines = sanitized.split("\n").filter((l) => l.trim());
  const lineHeight = 9 * 0.45; // 9pt font
  const indent = 4;
  const textX = margin + indent;
  const textWidth = PAGE_WIDTH - margin - textX;

  for (const line of lines) {
    y = ensureSpace(doc, y, lineHeight + 2, margin);

    // Draw dash prefix
    doc.setFont(FONT, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.body);
    doc.text("-", margin + 1, y);

    // Draw wrapped text
    const wrapped = doc.splitTextToSize(line.trim(), textWidth);
    for (let i = 0; i < wrapped.length; i++) {
      if (i > 0) {
        y = ensureSpace(doc, y, lineHeight + 2, margin);
      }
      doc.text(wrapped[i], textX, y);
      y += lineHeight;
    }

    y += 1;
  }

  return y;
}

export function renderTechnical(doc, data) {
  const { basics, work, education, skills } = data;
  const cw = contentWidth(MARGIN);
  let y = MARGIN;

  // ── Header: Terminal-style comment decorators ──────────
  const commentLine = "# " + String.fromCharCode(0x2500).repeat(40);

  doc.setFont(FONT, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.comment);
  doc.text(commentLine, MARGIN, y);
  y += 5;

  // Name UPPERCASE (bold, 16pt)
  if (basics?.name) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(16);
    doc.setTextColor(...C.heading);
    doc.text(sanitizeText(basics.name.toUpperCase()), MARGIN, y);
    y += 6;
  }

  // Contact pipe-separated (9pt)
  const contactParts = [basics?.email, basics?.phone, basics?.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont(FONT, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.body);
    doc.text(sanitizeText(contactParts.join(" | ")), MARGIN, y);
    y += 4;
  }

  // Profiles
  if (basics?.profiles?.length > 0) {
    const profileText = basics.profiles
      .filter((p) => p.network || p.url)
      .map((p) => (p.url ? `${p.network || "Link"}: ${p.url}` : p.network))
      .join(" | ");
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

  // Closing comment line
  doc.setFont(FONT, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.comment);
  doc.text(commentLine, MARGIN, y);
  y += 6;

  // ── Skills (promoted to top) ────────────────────────────
  if (skills?.length > 0) {
    y = drawTechnicalHeading(doc, y, "Skills");

    for (const group of skills) {
      y = ensureSpace(doc, y, 8, MARGIN);

      // Category in brackets [Category]
      if (group.category) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.heading);
        doc.text(sanitizeText(`[${group.category}]`), MARGIN, y);
        y += 4;
      }

      // Skills indented with dashes
      const skillList = group.skills || [];
      for (const skill of skillList) {
        y = ensureSpace(doc, y, 5, MARGIN);
        doc.setFont(FONT, "normal");
        doc.setFontSize(9);
        doc.setTextColor(...C.body);
        doc.text(sanitizeText(`  - ${skill}`), MARGIN, y);
        y += 4;
      }

      y += 2;
    }
  }

  // ── Summary ─────────────────────────────────────────────
  if (basics?.summary) {
    y = drawTechnicalHeading(doc, y, "Summary");

    doc.setFont(FONT, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.body);

    const sanitized = sanitizeText(basics.summary);
    const paragraphs = sanitized.split("\n");
    const lineHeight = 9 * 0.45;

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        y += lineHeight;
        continue;
      }
      const lines = doc.splitTextToSize(paragraph, cw);
      for (const line of lines) {
        y = ensureSpace(doc, y, lineHeight + 2, MARGIN);
        doc.text(line, MARGIN, y);
        y += lineHeight;
      }
    }
    y += 2;
  }

  // ── Experience ──────────────────────────────────────────
  if (work?.length > 0) {
    y = drawTechnicalHeading(doc, y, "Experience");

    for (const job of work) {
      y = ensureSpace(doc, y, 14, MARGIN);

      // Single-line dense: Company | Position | Dates
      const parts = [job.company, job.position, [job.startDate, job.endDate].filter(Boolean).join("-")].filter(Boolean);

      if (job.company) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.heading);
        const companyText = sanitizeText(job.company);
        doc.text(companyText, MARGIN, y);
        const companyWidth = doc.getTextWidth(companyText);

        // Remainder in normal weight
        const rest = parts.slice(1);
        if (rest.length > 0) {
          doc.setFont(FONT, "normal");
          doc.setTextColor(...C.body);
          doc.text(sanitizeText(" | " + rest.join(" | ")), MARGIN + companyWidth, y);
        }
      }
      y += 4;

      // Location as comment
      if (job.location) {
        doc.setFont(FONT, "normal");
        doc.setFontSize(9);
        doc.setTextColor(...C.comment);
        doc.text(sanitizeText(`// ${job.location}`), MARGIN, y);
        y += 4;
      }

      // Dash bullets for description
      if (job.description) {
        y = drawDashBullets(doc, y, job.description, MARGIN);
      }

      y += 3;
    }
  }

  // ── Education ───────────────────────────────────────────
  if (education?.length > 0) {
    y = drawTechnicalHeading(doc, y, "Education");

    for (const edu of education) {
      y = ensureSpace(doc, y, 10, MARGIN);

      // Single-line: Institution | Degree | Dates
      const degreeLine = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join("-");

      if (edu.institution) {
        doc.setFont(FONT, "bold");
        doc.setFontSize(9);
        doc.setTextColor(...C.heading);
        const instText = sanitizeText(edu.institution);
        doc.text(instText, MARGIN, y);
        const instWidth = doc.getTextWidth(instText);

        const rest = [degreeLine, dateStr].filter(Boolean);
        if (rest.length > 0) {
          doc.setFont(FONT, "normal");
          doc.setTextColor(...C.body);
          doc.text(sanitizeText(" | " + rest.join(" | ")), MARGIN + instWidth, y);
        }
      }
      y += 5;

      y += 2;
    }
  }
}
