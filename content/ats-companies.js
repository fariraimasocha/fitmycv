// Companies with a page at /ats/[slug]. Each claim rests on evidenceUrl: a
// job board on the vendor's own domain that had open postings when checked.
// scripts/check-ats-companies.mjs confirms every evidenceUrl detects as its ats.
//
// Only add a company after opening its board and seeing live postings. A
// company that runs its own hiring system gets no page: no page beats a
// false claim.

export const ATS_CHECKED_ON = "2026-10-09";

export const ATS_COMPANIES = [
  { slug: "absa", name: "Absa", ats: "workday", evidenceUrl: "https://absa.wd3.myworkdayjobs.com/ABSAcareersite" },
  { slug: "adobe", name: "Adobe", ats: "workday", evidenceUrl: "https://adobe.wd5.myworkdayjobs.com/external_experienced" },
  { slug: "airbnb", name: "Airbnb", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/airbnb" },
  { slug: "airtable", name: "Airtable", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/airtable" },
  { slug: "asana", name: "Asana", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/asana" },
  { slug: "bosch", name: "Bosch", ats: "smartrecruiters", evidenceUrl: "https://jobs.smartrecruiters.com/BoschGroup" },
  { slug: "canonical", name: "Canonical", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/canonical" },
  { slug: "cisco", name: "Cisco", ats: "workday", evidenceUrl: "https://cisco.wd5.myworkdayjobs.com/Cisco_Careers" },
  { slug: "cloudflare", name: "Cloudflare", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/cloudflare" },
  { slug: "coinbase", name: "Coinbase", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/coinbase" },
  { slug: "cursor", name: "Cursor", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/cursor" },
  { slug: "databricks", name: "Databricks", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/databricks" },
  { slug: "datadog", name: "Datadog", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/datadog" },
  { slug: "discord", name: "Discord", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/discord" },
  { slug: "disney", name: "Disney", ats: "workday", evidenceUrl: "https://disney.wd5.myworkdayjobs.com/disneycareer" },
  { slug: "dropbox", name: "Dropbox", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/dropbox" },
  { slug: "duolingo", name: "Duolingo", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/duolingo" },
  { slug: "elastic", name: "Elastic", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/elastic" },
  { slug: "equinox", name: "Equinox", ats: "smartrecruiters", evidenceUrl: "https://jobs.smartrecruiters.com/Equinox" },
  { slug: "figma", name: "Figma", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/figma" },
  { slug: "gitlab", name: "GitLab", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/gitlab" },
  { slug: "instacart", name: "Instacart", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/instacart" },
  { slug: "intel", name: "Intel", ats: "workday", evidenceUrl: "https://intel.wd1.myworkdayjobs.com/External" },
  { slug: "kuda", name: "Kuda", ats: "workable", evidenceUrl: "https://apply.workable.com/kuda/" },
  { slug: "lemfi", name: "LemFi", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/lemfi" },
  { slug: "linear", name: "Linear", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/linear" },
  { slug: "lyft", name: "Lyft", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/lyft" },
  { slug: "mastercard", name: "Mastercard", ats: "workday", evidenceUrl: "https://mastercard.wd1.myworkdayjobs.com/CorporateCareers" },
  { slug: "mongodb", name: "MongoDB", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/mongodb" },
  { slug: "moniepoint", name: "Moniepoint", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/moniepoint" },
  { slug: "notion", name: "Notion", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/notion" },
  { slug: "nvidia", name: "NVIDIA", ats: "workday", evidenceUrl: "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite" },
  { slug: "okta", name: "Okta", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/okta" },
  { slug: "openai", name: "OpenAI", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/openai" },
  { slug: "palantir", name: "Palantir", ats: "lever", evidenceUrl: "https://jobs.lever.co/palantir" },
  { slug: "paypal", name: "PayPal", ats: "workday", evidenceUrl: "https://paypal.wd1.myworkdayjobs.com/jobs" },
  { slug: "perplexity", name: "Perplexity", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/perplexity" },
  { slug: "pinterest", name: "Pinterest", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/pinterest" },
  { slug: "plaid", name: "Plaid", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/plaid" },
  { slug: "ramp", name: "Ramp", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/ramp" },
  { slug: "reddit", name: "Reddit", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/reddit" },
  { slug: "robinhood", name: "Robinhood", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/robinhood" },
  { slug: "salesforce", name: "Salesforce", ats: "workday", evidenceUrl: "https://salesforce.wd12.myworkdayjobs.com/External_Career_Site" },
  { slug: "spotify", name: "Spotify", ats: "lever", evidenceUrl: "https://jobs.lever.co/spotify" },
  { slug: "stripe", name: "Stripe", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/stripe" },
  { slug: "supabase", name: "Supabase", ats: "ashby", evidenceUrl: "https://jobs.ashbyhq.com/supabase" },
  { slug: "target", name: "Target", ats: "workday", evidenceUrl: "https://target.wd5.myworkdayjobs.com/targetcareers" },
  { slug: "twilio", name: "Twilio", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/twilio" },
  { slug: "ubisoft", name: "Ubisoft", ats: "smartrecruiters", evidenceUrl: "https://jobs.smartrecruiters.com/Ubisoft2" },
  { slug: "unilever", name: "Unilever", ats: "workday", evidenceUrl: "https://unilever.wd3.myworkdayjobs.com/Unilever_Experienced_Professionals" },
];

export const getAtsCompany = (slug) => ATS_COMPANIES.find((c) => c.slug === slug) ?? null;
