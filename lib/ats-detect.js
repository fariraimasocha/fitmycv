// Tells which applicant tracking system a link belongs to, from the link alone.
//
// ponytail: host match only, no network. Every host below belongs to the
// vendor, so a match is a fact about the link. A company's own careers site
// (stripe.com/jobs) tells us nothing, and we say so instead of guessing.
// lib/job-crawler.js has its own patterns because crawling needs a job path;
// this file only needs the vendor.

const GENERAL_GUIDE = "/blog/ats-resume-guide";

export const ATS_VENDORS = [
  { id: "greenhouse", name: "Greenhouse", hostRe: /(^|\.)greenhouse\.io$/, guide: "/greenhouse-ats-resume" },
  { id: "lever", name: "Lever", hostRe: /(^|\.)lever\.co$/, guide: "/lever-ats-resume" },
  { id: "workday", name: "Workday", hostRe: /(^|\.)(myworkdayjobs|myworkdaysite)\.com$/, guide: "/workday-resume-format" },
  { id: "ashby", name: "Ashby", hostRe: /(^|\.)ashbyhq\.com$/, guide: GENERAL_GUIDE },
  { id: "smartrecruiters", name: "SmartRecruiters", hostRe: /(^|\.)smartrecruiters\.com$/, guide: GENERAL_GUIDE },
  { id: "workable", name: "Workable", hostRe: /(^|\.)workable\.com$/, guide: GENERAL_GUIDE },
  { id: "successfactors", name: "SAP SuccessFactors", hostRe: /(^|\.)successfactors\.(com|eu)$/, guide: GENERAL_GUIDE },
  { id: "taleo", name: "Oracle Taleo", hostRe: /(^|\.)taleo\.net$/, guide: "/taleo-resume-format" },
  // Oracle hosts much more than recruiting on oraclecloud.com, so the path
  // has to prove it is the candidate site.
  {
    id: "oracle",
    name: "Oracle Recruiting Cloud",
    hostRe: /(^|\.)oraclecloud\.com$/,
    pathRe: /\/hcmUI\/CandidateExperience/i,
    guide: GENERAL_GUIDE,
  },
  { id: "icims", name: "iCIMS", hostRe: /(^|\.)icims\.com$/, guide: "/icims-resume-format" },
  { id: "bamboohr", name: "BambooHR", hostRe: /(^|\.)bamboohr\.com$/, guide: GENERAL_GUIDE },
  { id: "teamtailor", name: "Teamtailor", hostRe: /(^|\.)teamtailor\.com$/, guide: GENERAL_GUIDE },
  { id: "jobvite", name: "Jobvite", hostRe: /(^|\.)jobvite\.com$/, guide: GENERAL_GUIDE },
  { id: "recruitee", name: "Recruitee", hostRe: /(^|\.)recruitee\.com$/, guide: GENERAL_GUIDE },
  { id: "breezy", name: "Breezy HR", hostRe: /(^|\.)breezy\.hr$/, guide: GENERAL_GUIDE },
];

export const getAtsVendor = (id) => ATS_VENDORS.find((v) => v.id === id) ?? null;

/** Parses a pasted link. Returns a URL or null. Bare hosts get https://. */
export function toUrl(input) {
  const text = String(input ?? "").trim();
  if (!text) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`);
    return /^https?:$/.test(url.protocol) && url.hostname.includes(".") ? url : null;
  } catch {
    return null;
  }
}

/** The vendor behind a link, or null when the link does not show one. */
export function detectAts(input) {
  const url = toUrl(input);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  return ATS_VENDORS.find((v) => v.hostRe.test(host) && (!v.pathRe || v.pathRe.test(url.pathname))) ?? null;
}
