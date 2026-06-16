// JSearch-supported job markets. Shared by the Preferences UI (labels) and the
// preferences API (server-side validation) so the two can't drift.
export const COUNTRIES = [
  { code: "us", label: "United States" },
  { code: "gb", label: "United Kingdom" },
  { code: "ca", label: "Canada" },
  { code: "au", label: "Australia" },
  { code: "ie", label: "Ireland" },
  { code: "nz", label: "New Zealand" },
  { code: "in", label: "India" },
  { code: "sg", label: "Singapore" },
  { code: "ae", label: "United Arab Emirates" },
  { code: "za", label: "South Africa" },
  { code: "ng", label: "Nigeria" },
  { code: "ke", label: "Kenya" },
  { code: "gh", label: "Ghana" },
  { code: "eg", label: "Egypt" },
  { code: "de", label: "Germany" },
  { code: "fr", label: "France" },
  { code: "nl", label: "Netherlands" },
  { code: "es", label: "Spain" },
  { code: "it", label: "Italy" },
  { code: "pt", label: "Portugal" },
  { code: "se", label: "Sweden" },
  { code: "pl", label: "Poland" },
  { code: "br", label: "Brazil" },
  { code: "mx", label: "Mexico" },
  { code: "ph", label: "Philippines" },
];

export const COUNTRY_CODES = new Set(COUNTRIES.map((c) => c.code));
