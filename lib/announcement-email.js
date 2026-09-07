// One-off announcement: the /jobs board is live, and Lifetime is the upgrade.
//
// This file deliberately has NO imports. package.json is CommonJS, so a .mjs
// script cannot import the repo's ESM .js files; scripts/send-announcement.mjs
// copies this file to .mjs and imports the copy, the same trick as `check:jobs`.
// That is why SITE_URL and the feature list are inlined below.

const SITE_URL = "https://www.fitmycv.link";
const SUPPORT_EMAIL = "support@fitmycv.link";

// Verbatim snapshot of PRO_FEATURES in lib/pro-features.js. Copied rather than
// imported for the reason above. Every line maps to a real paywalled route.
const PRO_FEATURES = [
  "Tailor and download unlimited applications as PDF",
  "Match score and ATS score on every CV",
  "AI cover letters, downloadable as PDF",
  "Company research briefs before you apply",
  "Interview prep questions for the role",
  "Story Bank: reusable STAR answers",
  "Track applications, saved jobs and offers",
  "Daily job matches by email",
];

// Live landing palette from app/globals.css :root. The older
// lib/job-digest-email.js BRAND object is a stale teal/purple set; do not reuse it.
const BRAND = {
  paper: "#f7f4ef",
  paperSoft: "#faf8f5",
  paperStrong: "#efeae2",
  surface: "#ffffff",
  ink: "#1a1a1a",
  inkSoft: "#5c5c5c",
  inkMuted: "#8a857e",
  line: "#e3ddd4",
  accent: "#c05a3f",
  accentDark: "#9a4530", // 6.4:1 on white, safe for body-size text
  accentSoft: "#f7ece7",
  accentLine: "#e0b9a8",
};

const FONT_SERIF = `'Instrument Serif', Georgia, 'Times New Roman', serif`;
const FONT_BODY = `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const FONT_UI = `'Outfit', 'Segoe UI', system-ui, -apple-system, Helvetica, Arial, sans-serif`;

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Titles people put in the name field. Skipped so "Dr. Sharmila" greets Sharmila.
const HONORIFICS = new Set([
  "dr", "mr", "mrs", "ms", "miss", "prof", "rev", "sir", "eng", "engr", "sr", "jr",
]);

// Recase letter runs only. The hyphen is outside the class so ABDUL-LATIF
// becomes Abdul-Latif rather than Abdul-latif.
function titleCase(word) {
  return word.replace(
    /[\p{L}\p{M}]+/gu,
    (run) => run.charAt(0).toUpperCase() + run.slice(1).toLowerCase(),
  );
}

// Real sign-in names are messy: 12% arrive all lowercase, 3% ALL CAPS, and a
// handful are initials, honorifics or have digits stuck on. Greeting someone
// "Hi ARNOLD," or "Hi S.," reads worse than not personalising at all.
export function firstNameOf(userName) {
  const tokens = String(userName ?? "")
    .replace(/\(.*?\)/g, " ") // drop trailing handles like "(A.T.G 1738)"
    .split(/\s+/)
    .map((token) => token.replace(/[^\p{L}\p{M}'-]/gu, "")) // strip digits and punctuation
    .filter(Boolean);

  for (const token of tokens) {
    const bare = token.replace(/^[-']+|[-']+$/g, "");
    if (bare.length < 2) continue; // an initial, not a name
    if (HONORIFICS.has(bare.toLowerCase())) continue;
    // Recase only when the token is uniformly cased. That fixes "tashinga" and
    // "ARNOLD" while leaving "McKay" and initialisms like "BJ" alone.
    const uniform = bare === bare.toLowerCase() || bare === bare.toUpperCase();
    return uniform && bare.length > 2 ? titleCase(bare) : bare;
  }
  return "there";
}

export function buildAnnouncementSubject(jobCount) {
  const n = typeof jobCount === "number" && jobCount > 0 ? jobCount.toLocaleString("en-US") : null;
  return n
    ? `${n} remote jobs, taken straight from the employer.`
    : "Remote jobs, taken straight from the employer.";
}

function statCell(value, label, isLast) {
  return `<td width="33%" valign="top" style="padding:0 ${isLast ? "0" : "8px"} 0 0;">
    <div style="background:${BRAND.surface};border:1px solid ${BRAND.line};border-radius:14px;padding:16px 14px;">
      <div class="em-ink" style="font-family:${FONT_SERIF};font-size:26px;line-height:1.1;color:${BRAND.ink};">${escapeHtml(value)}</div>
      <div class="em-ink-soft" style="margin-top:6px;font-family:${FONT_BODY};font-size:11px;font-weight:500;line-height:1.4;color:${BRAND.inkSoft};">${escapeHtml(label)}</div>
    </div>
  </td>`;
}

function step(number, text) {
  return `<tr>
    <td valign="top" width="30" style="padding:0 12px 14px 0;">
      <div style="width:22px;height:22px;border-radius:999px;background:${BRAND.accentSoft};border:1px solid ${BRAND.accentLine};text-align:center;line-height:22px;font-family:${FONT_UI};font-weight:700;font-size:11px;color:${BRAND.accentDark};">${number}</div>
    </td>
    <td valign="top" style="padding:0 0 14px;font-family:${FONT_BODY};font-size:14px;line-height:1.5;color:${BRAND.ink};">${escapeHtml(text)}</td>
  </tr>`;
}

function feature(text) {
  return `<tr>
    <td valign="top" width="22" style="padding:0 10px 9px 0;font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:${BRAND.accentDark};">&#10003;</td>
    <td valign="top" style="padding:0 0 9px;font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:${BRAND.ink};">${escapeHtml(text)}</td>
  </tr>`;
}

/**
 * @param {object} args
 * @param {string} args.userName        full name from the User doc
 * @param {number|null} args.jobCount   live count from the jobs collection, or null to hide the number
 * @param {string} args.unsubscribeUrl  signed one-click opt-out link
 */
export function buildAnnouncementEmail({ userName, jobCount, unsubscribeUrl }) {
  const firstName = firstNameOf(userName);
  const countLabel = typeof jobCount === "number" && jobCount > 0 ? jobCount.toLocaleString("en-US") : null;
  // Shown next to the subject in the inbox, so it must add something the
  // subject does not already say.
  const preheader = "No aggregators. No reposts. Nothing older than 60 days.";
  const jobsUrl = `${SITE_URL}/jobs`;
  const pricingUrl = `${SITE_URL}/pricing`;

  const stats = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 28px;">
      <tr>
        ${countLabel ? statCell(countLabel, "Live remote roles", false) : statCell("100%", "Employer posted", false)}
        ${statCell("2x", "Refreshed daily", false)}
        ${statCell("60d", "Nothing older", true)}
      </tr>
    </table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>${escapeHtml(buildAnnouncementSubject(jobCount))}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Apple Mail / iOS dark mode: hold the light palette rather than let the
       client invert a cream design into mud. */
    @media (prefers-color-scheme: dark) {
      .em-bg      { background: ${BRAND.paper} !important; }
      .em-card    { background: ${BRAND.paperSoft} !important; }
      .em-surface { background: ${BRAND.surface} !important; }
      .em-head    { background: ${BRAND.paperStrong} !important; }
      .em-offer   { background: ${BRAND.accentSoft} !important; }
      .em-ink       { color: ${BRAND.ink} !important; }
      .em-ink-soft  { color: ${BRAND.inkSoft} !important; }
      .em-ink-muted { color: ${BRAND.inkMuted} !important; }
      .em-accent    { color: ${BRAND.accentDark} !important; }
      .em-cream     { color: ${BRAND.paper} !important; }
    }
    /* Gmail mobile dark mode */
    [data-ogsc] .em-bg      { background: ${BRAND.paper} !important; }
    [data-ogsc] .em-card    { background: ${BRAND.paperSoft} !important; }
    [data-ogsc] .em-surface { background: ${BRAND.surface} !important; }
    [data-ogsc] .em-head    { background: ${BRAND.paperStrong} !important; }
    [data-ogsc] .em-offer   { background: ${BRAND.accentSoft} !important; }
    [data-ogsc] .em-ink       { color: ${BRAND.ink} !important; }
    [data-ogsc] .em-ink-soft  { color: ${BRAND.inkSoft} !important; }
    [data-ogsc] .em-ink-muted { color: ${BRAND.inkMuted} !important; }
    [data-ogsc] .em-accent    { color: ${BRAND.accentDark} !important; }
    [data-ogsc] .em-cream     { color: ${BRAND.paper} !important; }
    @media only screen and (max-width:600px) {
      .em-pad { padding-left: 22px !important; padding-right: 22px !important; }
      .em-h1  { font-size: 32px !important; }
    }
  </style>
</head>
<body class="em-bg" style="margin:0;padding:0;background:${BRAND.paper};font-family:${FONT_BODY};color:${BRAND.ink};-webkit-font-smoothing:antialiased;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;font-size:1px;color:transparent;">${escapeHtml(preheader)}</span>
  <table role="presentation" class="em-bg" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="em-card" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.paperSoft};border:1px solid ${BRAND.line};border-radius:20px;overflow:hidden;">

          <!-- Masthead -->
          <tr>
            <td class="em-head" style="background:${BRAND.paperStrong};border-bottom:1px solid ${BRAND.line};padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" width="34" style="padding-right:10px;">
                    <div class="em-cream" style="width:26px;height:26px;border-radius:8px;background:${BRAND.ink};text-align:center;line-height:26px;color:${BRAND.paper};font-family:${FONT_UI};font-weight:700;font-size:13px;">F</div>
                  </td>
                  <td valign="middle">
                    <span class="em-ink" style="font-family:${FONT_SERIF};font-size:19px;letter-spacing:-0.3px;color:${BRAND.ink};">FitMyCV</span>
                  </td>
                  <td valign="middle" align="right">
                    <span class="em-accent" style="display:inline-block;background:${BRAND.accentSoft};border:1px solid ${BRAND.accentLine};color:${BRAND.accentDark};font-family:${FONT_UI};font-size:10px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;padding:5px 10px;border-radius:999px;line-height:1;">New</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td class="em-pad em-card" style="padding:38px 32px 8px;background:${BRAND.paperSoft};">
              <div class="em-ink-soft" style="margin:0 0 12px;font-family:${FONT_BODY};font-size:15px;font-weight:500;line-height:1.4;color:${BRAND.inkSoft};">Hi ${escapeHtml(firstName)},</div>
              <h1 class="em-h1 em-ink" style="margin:0 0 16px;font-family:${FONT_SERIF};font-weight:400;font-size:42px;line-height:1.04;letter-spacing:-1px;color:${BRAND.ink};">Not from LinkedIn.<br>Not from Indeed.</h1>
              <p class="em-ink-soft" style="margin:0;font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.inkSoft};">
                The new FitMyCV board reads Greenhouse, Lever, Ashby, Workable and SmartRecruiters directly. No aggregators, no reposts, nothing posted more than 60 days ago.
              </p>
              ${stats}
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="${escapeHtml(jobsUrl)}" target="_blank" class="em-cream" style="display:inline-block;background:${BRAND.ink};color:${BRAND.paper};font-family:${FONT_UI};font-weight:600;font-size:15px;letter-spacing:-0.1px;padding:14px 26px;border-radius:12px;text-decoration:none;">Browse the job board</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Steps -->
          <tr>
            <td class="em-pad em-card" style="padding:34px 32px 6px;background:${BRAND.paperSoft};">
              <div class="em-ink-muted" style="font-family:${FONT_UI};font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:${BRAND.inkMuted};margin-bottom:16px;">How it works</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${step(1, "Find a role on the board.")}
                ${step(2, "Tailor your CV to it in one click.")}
                ${step(3, "Download the CV and cover letter as PDF.")}
              </table>
            </td>
          </tr>

          <!-- Offer -->
          <tr>
            <td class="em-pad em-card" style="padding:22px 32px 36px;background:${BRAND.paperSoft};">
              <table role="presentation" class="em-offer" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.accentSoft};border:1px solid ${BRAND.accentLine};border-radius:16px;">
                <tr>
                  <td style="padding:26px 24px;">
                    <h2 class="em-ink" style="margin:0 0 10px;font-family:${FONT_SERIF};font-weight:400;font-size:25px;line-height:1.15;letter-spacing:-0.4px;color:${BRAND.ink};">Pay once. Keep it forever.</h2>
                    <p class="em-ink-soft" style="margin:0 0 18px;font-family:${FONT_BODY};font-size:14px;line-height:1.6;color:${BRAND.inkSoft};">
                      Browsing the board is free. Company names and apply links come with Premium, along with everything else:
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${PRO_FEATURES.map(feature).join("")}
                    </table>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid ${BRAND.accentLine};">
                      <tr>
                        <td style="padding-top:20px;">
                          <div class="em-ink" style="font-family:${FONT_SERIF};font-size:32px;line-height:1;color:${BRAND.ink};">$16.99<span class="em-ink-soft" style="font-family:${FONT_BODY};font-size:14px;font-weight:500;color:${BRAND.inkSoft};"> once</span></div>
                          <div class="em-ink-soft" style="margin-top:6px;font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:${BRAND.inkSoft};">Lifetime access. No subscription, no renewal.</div>
                          <div style="margin-top:18px;">
                            <a href="${escapeHtml(pricingUrl)}" target="_blank" class="em-cream" style="display:inline-block;background:${BRAND.accentDark};color:#ffffff;font-family:${FONT_UI};font-weight:600;font-size:15px;padding:14px 26px;border-radius:12px;text-decoration:none;">Get Lifetime for $16.99</a>
                          </div>
                          <div class="em-ink-soft" style="margin-top:12px;font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${BRAND.inkSoft};">Prefer monthly? That is $6.99, cancel anytime.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="em-head" style="background:${BRAND.paperStrong};border-top:1px solid ${BRAND.line};padding:22px 32px;text-align:center;">
              <p class="em-ink-soft" style="margin:0 0 8px;font-family:${FONT_BODY};font-size:12px;font-weight:500;line-height:1.6;color:${BRAND.inkSoft};">
                <a href="${escapeHtml(jobsUrl)}" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Job board</a>
                &nbsp;&middot;&nbsp;
                <a href="${escapeHtml(SITE_URL)}/dashboard" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Dashboard</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${SUPPORT_EMAIL}" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Support</a>
              </p>
              <p class="em-ink-muted" style="margin:0;font-family:${FONT_BODY};font-size:11px;font-weight:400;line-height:1.6;color:${BRAND.inkMuted};">
                You are getting this because you have a FitMyCV account.<br>
                <a href="${escapeHtml(unsubscribeUrl)}" class="em-ink-muted" style="color:${BRAND.inkMuted};text-decoration:underline;">Unsubscribe from product emails</a>
                &nbsp;&middot;&nbsp; &copy; ${new Date().getFullYear()} FitMyCV
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Plain-text alternative. Bulk senders that ship HTML only get filtered harder.
export function buildAnnouncementText({ userName, jobCount, unsubscribeUrl }) {
  const firstName = firstNameOf(userName);
  const countLine =
    typeof jobCount === "number" && jobCount > 0
      ? `${jobCount.toLocaleString("en-US")} roles are live right now, refreshed twice a day.`
      : "The board is refreshed twice a day.";

  return `Hi ${firstName},

NOT FROM LINKEDIN. NOT FROM INDEED.

The new FitMyCV board reads Greenhouse, Lever, Ashby, Workable and
SmartRecruiters directly. No aggregators, no reposts, nothing posted more than
60 days ago. ${countLine}

Browse the job board: ${SITE_URL}/jobs

How it works
1. Find a role on the board.
2. Tailor your CV to it in one click.
3. Download the CV and cover letter as PDF.

Pay once. Keep it forever.
Browsing the board is free. Company names and apply links come with Premium,
along with everything else:

${PRO_FEATURES.map((f) => `  - ${f}`).join("\n")}

Lifetime is $16.99, paid once. No subscription, no renewal.
Prefer monthly? That is $6.99, cancel anytime.

Get Lifetime: ${SITE_URL}/pricing

You are getting this because you have a FitMyCV account.
Unsubscribe: ${unsubscribeUrl}
Questions: ${SUPPORT_EMAIL}
`;
}

// Self-check: npm run check:names
// Guarded so importing this module for a real send does not run the asserts.
if (process.argv[1]?.endsWith("announcement-email.mjs")) {
  const { strict: assert } = await import("node:assert");
  const cases = [
    ["Tawanda Mugadza", "Tawanda"],
    ["tashinga pamuke", "Tashinga"],       // all lowercase
    ["ARNOLD CHIBVONGODZE", "Arnold"],     // ALL CAPS
    ["ABDUL-LATIF AKUDUGU", "Abdul-Latif"],// caps across a hyphen
    ["BJ Kimberly", "BJ"],                 // short initialism keeps its shape
    ["Beyonce\u0301 Esther Mwale", "Beyonce\u0301"], // accents survive
    ["Ju\u0301lian Milla\u0301n", "Ju\u0301lian"],
    ["S M Asraful Islam", "Asraful"],      // skips initials
    ["i chabs", "Chabs"],
    ["Dr. Sharmila", "Sharmila"],          // skips the honorific
    ["Admire007 Muwish", "Admire"],        // strips digits
    [",fmkfkf Djdjdjf", "Fmkfkf"],         // strips leading punctuation
    ["ASHELL GONESE (A.T.G 1738)", "Ashell"],
    ["S. K.", "there"],                    // nothing usable
    ["", "there"],
    [null, "there"],
    [undefined, "there"],
    ["   ", "there"],
  ];
  for (const [input, expected] of cases) {
    assert.equal(
      firstNameOf(input),
      expected,
      `firstNameOf(${JSON.stringify(input)}) gave ${JSON.stringify(firstNameOf(input))}, wanted ${JSON.stringify(expected)}`,
    );
  }
  console.log(`firstNameOf: ${cases.length} cases pass`);
}
