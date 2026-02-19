import { jsPDF } from "jspdf";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  heading: [17, 24, 39], // #111827
  body: [55, 65, 81], // #374151
  subtle: [107, 114, 128], // #6B7280
  divider: [209, 213, 219], // #D1D5DB
};

function sanitizeText(text) {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ");
}

function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function drawDivider(doc, y) {
  doc.setDrawColor(...COLORS.divider);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  return y + 4;
}

function drawSectionHeading(doc, y, title) {
  y = ensureSpace(doc, y, 12);
  y = drawDivider(doc, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.subtle);
  doc.text(sanitizeText(title.toUpperCase()), MARGIN, y + 3);
  return y + 8;
}

function drawWrappedText(doc, y, text, fontSize, color, fontStyle = "normal") {
  doc.setFont("helvetica", fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const sanitized = sanitizeText(text);
  const paragraphs = sanitized.split("\n");
  const lineHeight = fontSize * 0.45;

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      y += lineHeight;
      continue;
    }
    const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH);
    for (const line of lines) {
      y = ensureSpace(doc, y, lineHeight + 2);
      doc.text(line, MARGIN, y);
      y += lineHeight;
    }
  }

  return y;
}

export function generateCVPdf(data) {
  const { basics, work, education, skills } = data;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  // Header - centered name
  if (basics?.name) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.heading);
    doc.text(sanitizeText(basics.name), PAGE_WIDTH / 2, y, { align: "center" });
    y += 8;
  }

  // Label
  if (basics?.label) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.subtle);
    doc.text(sanitizeText(basics.label), PAGE_WIDTH / 2, y, { align: "center" });
    y += 5;
  }

  // Contact info
  const contactParts = [basics?.email, basics?.phone, basics?.location].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.subtle);
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
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.subtle);
      const lines = doc.splitTextToSize(sanitizeText(profileText), CONTENT_WIDTH);
      for (const line of lines) {
        doc.text(line, PAGE_WIDTH / 2, y, { align: "center" });
        y += 4;
      }
    }
  }

  y += 4;

  // Professional Summary
  if (basics?.summary) {
    y = drawSectionHeading(doc, y, "Professional Summary");
    y = drawWrappedText(doc, y, basics.summary, 10, COLORS.body);
    y += 4;
  }

  // Work Experience
  if (work?.length > 0) {
    y = drawSectionHeading(doc, y, "Work Experience");

    for (const job of work) {
      y = ensureSpace(doc, y, 16);

      // Position and dates on same line
      if (job.position) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.heading);
        doc.text(sanitizeText(job.position), MARGIN, y);
      }

      const dateStr = [job.startDate, job.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.subtle);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      // Company and location
      const companyLine = [job.company, job.location].filter(Boolean).join(", ");
      if (companyLine) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.subtle);
        doc.text(sanitizeText(companyLine), MARGIN, y);
        y += 5;
      }

      // Description
      if (job.description) {
        y = drawWrappedText(doc, y, job.description, 9, COLORS.body);
      }

      y += 4;
    }
  }

  // Education
  if (education?.length > 0) {
    y = drawSectionHeading(doc, y, "Education");

    for (const edu of education) {
      y = ensureSpace(doc, y, 12);

      const degreeLine = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ");
      if (degreeLine) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.heading);
        doc.text(sanitizeText(degreeLine), MARGIN, y);
      }

      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(" - ");
      if (dateStr) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.subtle);
        doc.text(sanitizeText(dateStr), PAGE_WIDTH - MARGIN, y, { align: "right" });
      }
      y += 5;

      if (edu.institution) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.subtle);
        doc.text(sanitizeText(edu.institution), MARGIN, y);
        y += 5;
      }

      y += 2;
    }
  }

  // Skills
  if (skills?.length > 0) {
    y = drawSectionHeading(doc, y, "Skills");

    for (const group of skills) {
      y = ensureSpace(doc, y, 8);

      const skillLine = group.category
        ? `${group.category}: ${(group.skills || []).join(", ")}`
        : (group.skills || []).join(", ");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const lines = doc.splitTextToSize(sanitizeText(skillLine), CONTENT_WIDTH);
      for (let i = 0; i < lines.length; i++) {
        y = ensureSpace(doc, y, 5);
        if (i === 0 && group.category) {
          // Bold the category part on the first line
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...COLORS.heading);
          doc.text(sanitizeText(group.category) + ": ", MARGIN, y);
          const categoryWidth = doc.getTextWidth(sanitizeText(group.category) + ": ");
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...COLORS.body);
          const remainder = lines[i].substring(lines[i].indexOf(": ") + 2);
          if (remainder) {
            doc.text(remainder, MARGIN + categoryWidth, y);
          }
        } else {
          doc.setTextColor(...COLORS.body);
          doc.text(lines[i], MARGIN, y);
        }
        y += 4.5;
      }

      y += 1;
    }
  }

  return doc;
}

export function generateCoverLetterPdf(content, meta = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

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

  y = drawDivider(doc, y);
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

    const lines = doc.splitTextToSize(paragraph.trim(), CONTENT_WIDTH);
    for (const line of lines) {
      y = ensureSpace(doc, y, lineHeight + 2);
      doc.text(line, MARGIN, y);
      y += lineHeight;
    }
    y += 4; // paragraph spacing
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
