export const TEMPLATE_METADATA = [
  {
    id: "classic",
    name: "Classic",
    badge: "ATS 98%",
    description: "Harvard-style serif single column. Corporate, finance, law.",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    badge: "ATS 96%",
    description: "Skills-led with chronological timeline. Tech roles and career changers.",
  },
  {
    id: "accent",
    name: "Accent",
    badge: "ATS 96%",
    description: "Single column with a deep blue accent. The modern builder signature look.",
  },
  {
    id: "graduate",
    name: "Graduate",
    badge: "ATS 97%",
    description: "Education-first layout. Students and fresh graduates.",
  },
  {
    id: "modern",
    name: "Modern",
    badge: "ATS-safe",
    description: "Jake's Resume style. Compact, company-first entries.",
  },
  {
    id: "clean",
    name: "Clean",
    badge: "ATS-safe",
    description: "Left-aligned with soft gray accents. Works everywhere.",
  },
  {
    id: "minimal",
    name: "Minimal",
    badge: "ATS-safe",
    description: "Zero decoration, maximum whitespace.",
  },
  {
    id: "technical",
    name: "Technical",
    badge: "Skills-first",
    description: "Monospace terminal aesthetic with skills on top.",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    badge: "Two-column",
    description: "Left rail for contact and skills. Best when a human reads first.",
  },
  {
    id: "spotlight",
    name: "Spotlight",
    badge: "Accent red",
    description: "Awesome-CV style with centered header and red highlights.",
  },
  {
    id: "executive",
    name: "Executive",
    badge: "ATS 95%",
    description: "Summary-heavy and concise. Senior leadership roles.",
  },
  {
    id: "compact",
    name: "Compact",
    badge: "One-pager",
    description: "Dense layout that fits a long history on one page.",
  },
  {
    id: "elegant",
    name: "Elegant",
    badge: "Serif",
    description: "Refined serif with a centered header.",
  },
  {
    id: "professional",
    name: "Professional",
    badge: "ATS-safe",
    description: "Plain black-and-white with inline name and title.",
  },
];

export const TEMPLATE_IDS = TEMPLATE_METADATA.map((t) => t.id);

export const DEFAULT_TEMPLATE = "classic";

// Font family used by each CV template, so companion documents (cover letter)
// can match. Templates not listed here render in the default sans-serif.
const TEMPLATE_FONT_CLASSES = {
  classic: "font-serif",
  elegant: "font-serif",
  technical: "font-mono",
};

export function getTemplateFontClass(template) {
  return TEMPLATE_FONT_CLASSES[template] || "font-sans";
}
