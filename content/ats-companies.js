// Companies with a page at /ats/[slug]. Each claim rests on evidenceUrl: a
// job board on the vendor's own domain that had open postings when checked.
// scripts/check-ats-companies.mjs confirms every evidenceUrl detects as its ats.
//
// Only add a company after opening its board and seeing live postings. A
// company that runs its own hiring system gets no page: no page beats a
// false claim.
//
// Optional `extra` adds a title, description, keywords, lede, blocks and faqs
// for a company whose searchers want more than the ATS answer (GSC shows
// "target resume").

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
  {
    slug: "target",
    name: "Target",
    ats: "workday",
    evidenceUrl: "https://target.wd5.myworkdayjobs.com/targetcareers",
    extra: {
      title: "Target Resume Examples for Store Jobs (Workday Tips)",
      description:
        "Example resume bullets for Target stocking, checkout, guest service and team leader jobs. Target hires through Workday, so keep the layout simple to read.",
      keywords: ["target resume", "target team member resume", "resume for target", "target resume examples"],
      lede: "Below are example resume bullets for Target store jobs: stocking, checkout and guest service, team leader, and a first job. Target posts its jobs on Workday, so keep the layout simple enough for Workday to read.",
      blocks: [
        { h2: "Target resume examples" },
        {
          p: "These are examples to adapt, not real resumes. The numbers are placeholders. Put in your own and only claim what you did.",
        },
        { h3: "Team member: stocking and fulfillment" },
        {
          ul: [
            "Unloaded the morning truck and stocked about 40 cases an hour across grocery and household aisles.",
            "Picked and packed online orders for same-day pickup, keeping each order inside the time the app set.",
            "Kept the back room labelled and in order so the next shift could find stock without asking.",
          ],
        },
        { h3: "Team member: checkout and guest service" },
        {
          ul: [
            "Served about 150 guests a shift at the checkout and balanced the cash drawer at close.",
            "Handled returns and exchanges at the guest service desk and followed the store's refund policy.",
            "Signed guests up for the store card and loyalty program while keeping the line moving.",
          ],
        },
        { h3: "Team leader" },
        {
          ul: [
            "Led a team of 8 on the evening shift and set the zone and replenishment priorities each night.",
            "Trained 5 new team members on the register, pickup orders and safety routines in their first week.",
            "Built weekly schedules around team availability and covered call-outs without missing a closing task.",
          ],
        },
        { h3: "First job or no work history" },
        {
          ul: [
            "Volunteered at a weekend food bank, sorting donations and stocking shelves for 4 hours a week.",
            "Ran the till at a school fundraiser and counted and handed over the takings at the end of the day.",
            "Available evenings, weekends and holidays.",
          ],
        },
        { h3: "Sample summary" },
        {
          p: "*Reliable team member with 2 years in retail stocking and checkout. Comfortable on the register, with online pickup orders and on early truck shifts. Available weekends and holidays.*",
        },

        { h2: "Writing a resume for a Target job" },
        {
          p: "Use the words from the posting you are applying to, not a generic list. If it mentions guest service, stocking or the checkout, put those words inside bullets that show what you did and how often.",
        },
        {
          p: "Store and hourly roles can run through a different hiring flow from office jobs, so paste the exact job link into the [ATS lookup](/ats) before you format anything.",
        },
        {
          ul: [
            "**Store and guest service roles:** see the [customer service resume example](/resume-examples/customer-service-representative) and the [customer service resume keywords](/customer-service-resume-keywords).",
            "**First job or no work history:** the [first job resume example](/resume-examples/first-job) shows how to use school, volunteering and part-time work.",
            "**Management roles:** the [operations manager resume example](/resume-examples/operations-manager) covers multi-site and distribution management.",
          ],
        },
      ],
      faqs: [
        {
          q: "What should I put on a resume for Target?",
          a: "Your contact details, a short summary, your work history with bullets that show what you did, your skills and your availability. Use the words from the posting, such as guest service, stocking or checkout, where they are true for you.",
        },
        {
          q: "How do I write a Target resume with no experience?",
          a: "Lead with what you have done: school, volunteering, sports, or helping with a family business. Write bullets that show you turned up, worked with people and handled money or stock. Add your availability, since store jobs often need evening and weekend shifts.",
        },
        {
          q: "What skills should I list on a Target resume?",
          a: "Pick the skills the posting asks for and that you can back up. For store jobs that often means customer service, cash handling, stocking, teamwork and working at a steady pace. Put each one inside a bullet too, not only in a list.",
        },
        {
          q: "Should my Target resume be one page?",
          a: "For store and hourly jobs, yes. One page is enough for a few jobs and keeps the recruiter on the parts that match the posting.",
        },
      ],
    },
  },
  { slug: "twilio", name: "Twilio", ats: "greenhouse", evidenceUrl: "https://job-boards.greenhouse.io/twilio" },
  { slug: "ubisoft", name: "Ubisoft", ats: "smartrecruiters", evidenceUrl: "https://jobs.smartrecruiters.com/Ubisoft2" },
  { slug: "unilever", name: "Unilever", ats: "workday", evidenceUrl: "https://unilever.wd3.myworkdayjobs.com/Unilever_Experienced_Professionals" },
];

export const getAtsCompany = (slug) => ATS_COMPANIES.find((c) => c.slug === slug) ?? null;
