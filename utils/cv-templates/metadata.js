import { DEFAULT_TEMPLATE_STYLE, normalizeTemplateStyle } from "@/utils/cv-templates/style";

// Each template's own look, expressed in the same four knobs the style picker
// exposes. These are what a layout renders as before anyone touches a control,
// so "Technical" still arrives monospaced and "Spotlight" still arrives red.
export const TEMPLATE_DEFAULT_STYLES = {
  classic: { color: "black", font: "instrument-serif", dividers: true, indent: false },
  hybrid: { color: "black", font: "dm-sans", dividers: true, indent: false },
  accent: { color: "blue", font: "dm-sans", dividers: true, indent: false },
  graduate: { color: "black", font: "dm-sans", dividers: true, indent: false },
  modern: { color: "black", font: "dm-sans", dividers: true, indent: false },
  clean: { color: "black", font: "dm-sans", dividers: true, indent: false },
  minimal: { color: "black", font: "dm-sans", dividers: false, indent: false },
  technical: { color: "black", font: "mono", dividers: true, indent: false },
  sidebar: { color: "black", font: "dm-sans", dividers: true, indent: false },
  spotlight: { color: "burgundy", font: "dm-sans", dividers: true, indent: false },
  executive: { color: "black", font: "dm-sans", dividers: true, indent: false },
  compact: { color: "black", font: "dm-sans", dividers: true, indent: false },
  elegant: { color: "black", font: "instrument-serif", dividers: true, indent: false },
  professional: { color: "black", font: "dm-sans", dividers: true, indent: false },
  standard: { color: "black", font: "dm-sans", dividers: true, indent: false },
  scholar: { color: "black", font: "instrument-serif", dividers: true, indent: false },
  rezi: { color: "blue", font: "merriweather", dividers: true, indent: false },
  "rezi-simple": { color: "black", font: "source-sans", dividers: false, indent: false },
  "rezi-modern": { color: "teal", font: "source-sans", dividers: true, indent: true },
};

export function getTemplateDefaultStyle(template) {
  return normalizeTemplateStyle(TEMPLATE_DEFAULT_STYLES[template] || DEFAULT_TEMPLATE_STYLE);
}

// ponytail: marketing copy hardcodes this list's length ("19 templates") in
// app/page.js, components/content/TemplateGallery.jsx,
// content/pages/templates.js and content/pages/guides.js. Add a template here,
// update those. `grep -rn "16 .*\(template\|theme\|layout\)" app components content`
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
    description: "Plain black-and-white with the name on its own first line.",
  },
  {
    id: "standard",
    name: "Standard",
    badge: "ATS-safe",
    description: "Company-first entries. The widely shared recruiter template.",
  },
  {
    id: "scholar",
    name: "Scholar",
    badge: "Small caps",
    description: "Small-caps ruled headings in serif. The LaTeX engineering-resume look.",
  },
  {
    id: "rezi",
    name: "Rezi Classic",
    badge: "Rezi",
    description: "Rezi's 2026 serif layout. Ruled headings, role-first entries, paragraph achievements.",
    category: "rezi",
  },
  {
    id: "rezi-simple",
    name: "Rezi Simple",
    badge: "Rezi",
    description: "Clean sans-serif Rezi layout with minimal rules. Finance, law, and government friendly.",
    category: "rezi",
  },
  {
    id: "rezi-modern",
    name: "Rezi Modern",
    badge: "Rezi",
    description: "Rezi layout with accent headings and tighter spacing for tech and product roles.",
    category: "rezi",
  },
];

// Gallery grouping. Every template belongs to exactly one group, so the tab
// counts add up to the full list and "All" is not a superset with gaps.
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "simple", label: "Simple" },
  { id: "modern", label: "Modern" },
  { id: "compact", label: "Compact" },
  { id: "specialist", label: "Specialist" },
];

const CATEGORY_BY_TEMPLATE = {
  classic: "simple",
  minimal: "simple",
  clean: "simple",
  professional: "simple",
  standard: "simple",
  "rezi-simple": "simple",
  modern: "modern",
  accent: "modern",
  hybrid: "modern",
  elegant: "modern",
  rezi: "modern",
  "rezi-modern": "modern",
  compact: "compact",
  executive: "compact",
  technical: "compact",
  scholar: "compact",
  graduate: "specialist",
  sidebar: "specialist",
  spotlight: "specialist",
};

export function getTemplateCategory(template) {
  return CATEGORY_BY_TEMPLATE[template] || "simple";
}

export function getTemplatesInCategory(categoryId) {
  if (categoryId === "all") return TEMPLATE_METADATA;
  return TEMPLATE_METADATA.filter((t) => getTemplateCategory(t.id) === categoryId);
}

export const TEMPLATE_IDS = TEMPLATE_METADATA.map((t) => t.id);

export const DEFAULT_TEMPLATE = "classic";

export function getTemplateName(template) {
  return (
    TEMPLATE_METADATA.find((item) => item.id === template)?.name || "Classic"
  );
}
