// Per-document styling that sits on top of a template: accent colour, body
// font, section dividers and bullet indent.
//
// All four apply to EVERY template. Font and accent arrive as CSS variables;
// the Rezi family reads dividers and indent itself, and every other layout
// gets them from the data-cv-* rules in app/globals.css.

export const TEMPLATE_COLOR_OPTIONS = [
  { id: "black", label: "Black", accent: "#1a1a1a", swatch: "#1a1a1a" },
  { id: "rust", label: "Rust", accent: "#9a4530", swatch: "#c05a3f" },
  { id: "blue", label: "Blue", accent: "#1d4ed8", swatch: "#2563eb" },
  { id: "teal", label: "Teal", accent: "#0f766e", swatch: "#0d9488" },
  { id: "purple", label: "Purple", accent: "#6d28d9", swatch: "#7c3aed" },
  { id: "burgundy", label: "Burgundy", accent: "#9f1239", swatch: "#be123c" },
];

// Recruiter-safe faces, sans first, then serif. The var(--font-*) faces are
// loaded in components/RootShell.jsx without preload, so only a face a CV uses
// is downloaded. The system stacks cost nothing. Calibri ships with Windows and
// Office; elsewhere Carlito, its metric-compatible twin, stands in.
// Ids are stored on saved CVs, so never rename or remove one.
export const TEMPLATE_FONT_OPTIONS = [
  { id: "calibri", label: "Calibri", stack: "Calibri, var(--font-carlito), Arial, sans-serif" },
  { id: "arial", label: "Arial", stack: "Arial, Helvetica, sans-serif" },
  { id: "helvetica", label: "Helvetica", stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: "inter", label: "Inter", stack: "var(--font-inter), system-ui, sans-serif" },
  { id: "lato", label: "Lato", stack: "var(--font-lato), system-ui, sans-serif" },
  { id: "roboto", label: "Roboto", stack: "var(--font-roboto), system-ui, sans-serif" },
  { id: "open-sans", label: "Open Sans", stack: "var(--font-open-sans), system-ui, sans-serif" },
  { id: "source-sans", label: "Source Sans", stack: "var(--font-source-sans), system-ui, sans-serif" },
  { id: "dm-sans", label: "DM Sans", stack: "var(--font-sn-pro), system-ui, sans-serif" },
  { id: "georgia", label: "Georgia", stack: "Georgia, serif" },
  { id: "garamond", label: "Garamond", stack: "var(--font-garamond), Garamond, Georgia, serif" },
  { id: "times", label: "Times New Roman", stack: '"Times New Roman", Times, serif' },
  { id: "merriweather", label: "Merriweather", stack: "var(--font-merriweather), Georgia, serif" },
  { id: "lora", label: "Lora", stack: "var(--font-lora), Georgia, serif" },
  { id: "baskerville", label: "Libre Baskerville", stack: "var(--font-baskerville), Baskerville, Georgia, serif" },
  { id: "instrument-serif", label: "Instrument Serif", stack: "var(--font-serif), Georgia, serif" },
  { id: "mono", label: "Mono", stack: "var(--font-geist-mono), ui-monospace, monospace" },
];

export const DEFAULT_TEMPLATE_STYLE = {
  color: "black",
  font: "source-sans",
  dividers: true,
  indent: false,
};

export function normalizeTemplateStyle(style = {}) {
  const colorIds = TEMPLATE_COLOR_OPTIONS.map((option) => option.id);
  const fontIds = TEMPLATE_FONT_OPTIONS.map((option) => option.id);

  return {
    color: colorIds.includes(style.color) ? style.color : DEFAULT_TEMPLATE_STYLE.color,
    font: fontIds.includes(style.font) ? style.font : DEFAULT_TEMPLATE_STYLE.font,
    dividers: style.dividers ?? DEFAULT_TEMPLATE_STYLE.dividers,
    indent: style.indent ?? DEFAULT_TEMPLATE_STYLE.indent,
  };
}

export function getTemplateColorOption(colorId) {
  return (
    TEMPLATE_COLOR_OPTIONS.find((option) => option.id === colorId) ||
    TEMPLATE_COLOR_OPTIONS[0]
  );
}

export function getTemplateFontOption(fontId) {
  return (
    TEMPLATE_FONT_OPTIONS.find((option) => option.id === fontId) ||
    TEMPLATE_FONT_OPTIONS[0]
  );
}

/**
 * CSS custom properties the template components read. Setting them on the
 * wrapper means a colour or font change is a single style recalculation, with
 * no re-render of the document tree and no class churn in nineteen layouts.
 */
export function getTemplateStyleVars(style = DEFAULT_TEMPLATE_STYLE) {
  const resolved = normalizeTemplateStyle(style);
  const color = getTemplateColorOption(resolved.color);
  const font = getTemplateFontOption(resolved.font);

  return {
    "--cv-accent": color.accent,
    "--cv-divider": color.accent,
    "--cv-heading-border": color.accent,
    "--cv-font": font.stack,
  };
}

// ponytail: the old API returned a Tailwind class. Templates now inherit the
// face from --cv-font on the wrapper, so there is no class to hand back.
export function getTemplateStyleClassName() {
  return "";
}
