// Signup nurture: six emails over five days. Step 0 goes out from the signIn
// callback in lib/auth.js; app/api/cron/nurture sends the rest, hourly.
//
// Relative imports (not "@/") so scripts/check-nurture.mjs can import this file.
import { BRAND, FONT_BODY, FONT_SERIF, FONT_UI, escapeHtml, firstNameOf } from "./announcement-email.js";
import { PRO_FEATURES } from "./pro-features.js";
import { SITE_URL, SUPPORT_EMAIL } from "./site.js";
import { sign } from "./sign.js";

const HOUR = 36e5;
const DAY = 24 * HOUR;

// Delay after signup for each step. nurtureStep on the User is the next index.
export const OFFSETS = [0, HOUR, DAY, 2 * DAY, 3 * DAY, 5 * DAY];
export const DONE = OFFSETS.length;
const OFFER_STEP = 5;

// ponytail: hourly cron, so "+1h" lands between 1 and 2 hours. A queue fixes that if it matters.
// Returns the step to act on now, or null. Callers skip (not send) the offer for premium users.
export function dueStep(user, now = Date.now()) {
  const step = user.nurtureStep;
  if (typeof step !== "number" || step >= DONE) return null;
  return now - new Date(user.createdAt).getTime() >= OFFSETS[step] ? step : null;
}

export const shouldSkip = (user, step) => step === OFFER_STEP && user.isPremium === true;

const url = (path) => `${SITE_URL}${path}`;

// Copy for each step. paragraphs are plain text; steps/features render as lists.
const EMAILS = [
  {
    subject: "Welcome to FitMyCV",
    preheader: "Upload your CV once. Paste a job link. Get a CV made for that role.",
    heading: "You're in.",
    paragraphs: [
      "I'm Farirai. I built FitMyCV.",
      "The idea is simple. Upload your CV once, paste a job link, and get a CV made for that role.",
      "Start with your CV. Everything else builds on it.",
    ],
    cta: ["Upload your CV", "/dashboard/resume"],
  },
  {
    subject: "How to tailor your first CV",
    preheader: "Three steps, one job link.",
    heading: "One paste. No rewrites.",
    paragraphs: ["Here is the whole flow:"],
    steps: [
      "Upload your CV as a PDF.",
      "Paste a job link from LinkedIn, Indeed, Glassdoor or a careers page.",
      "Get a rewritten CV and a cover letter for that role.",
    ],
    after: "Seeing your tailored CV on screen is free.",
    cta: ["Tailor my CV", "/dashboard/tailor"],
  },
  {
    subject: "Why I built FitMyCV",
    preheader: "And why I hate writing cover letters.",
    heading: "I kept rewriting my CV for every job link I clicked.",
    paragraphs: [
      "Same experience. New job. Another hour making my CV use the words the posting used.",
      "Then the cover letter. I hate writing cover letters.",
      "So I built the thing I wanted. Paste the link, get both.",
      "It only uses experience you actually have. It does not make things up.",
    ],
    cta: ["Try it on a job", "/dashboard/tailor"],
  },
  {
    subject: "What FitMyCV does",
    preheader: "It reads the posting and finds the words your CV is missing.",
    heading: "You are not being turned down. You are being filtered out.",
    paragraphs: [
      "FitMyCV reads the posting, finds the terms you are missing, and rewrites your CV to use them.",
      "What you get:",
    ],
    features: [
      "A tailored CV from any job link",
      "A cover letter for the same role",
      "A free ATS score check",
      "19 ATS-safe templates",
      "A job board read straight from employer pages",
    ],
    cta: ["Open FitMyCV", "/dashboard"],
  },
  {
    subject: "Any questions?",
    preheader: "Reply to this email. I read every reply.",
    plain: true,
    paragraphs: [
      "Quick one.",
      "Is FitMyCV doing what you need?",
      "If something is confusing, broken or missing, reply to this email. I read every reply.",
    ],
  },
  {
    subject: "Pay once. Keep it forever.",
    preheader: "Lifetime access. No subscription, no renewal.",
    heading: "Pay once. Keep it forever.",
    paragraphs: [
      "Tailoring and previewing on screen stays free.",
      "Lifetime unlocks everything else, paid once:",
    ],
    offer: true,
    // ponytail: price lives on /pricing because it is regional; we do not store the user's country.
    after: "No subscription, no renewal. Your price is on the pricing page.",
    cta: ["See Lifetime pricing", "/pricing"],
  },
];

const p = (text, color = BRAND.inkSoft) =>
  `<p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${color};">${escapeHtml(text)}</p>`;

const numbered = (items) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 10px;">${items
    .map(
      (text, i) => `<tr>
    <td valign="top" width="30" style="padding:0 12px 14px 0;"><div style="width:22px;height:22px;border-radius:999px;background:${BRAND.accentSoft};border:1px solid ${BRAND.accentLine};text-align:center;line-height:22px;font-family:${FONT_UI};font-weight:700;font-size:11px;color:${BRAND.accentDark};">${i + 1}</div></td>
    <td valign="top" style="padding:0 0 14px;font-family:${FONT_BODY};font-size:14px;line-height:1.5;color:${BRAND.ink};">${escapeHtml(text)}</td>
  </tr>`,
    )
    .join("")}</table>`;

const checks = (items) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 12px;">${items
    .map(
      (text) => `<tr>
    <td valign="top" width="22" style="padding:0 10px 9px 0;font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:${BRAND.accentDark};">&#10003;</td>
    <td valign="top" style="padding:0 0 9px;font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:${BRAND.ink};">${escapeHtml(text)}</td>
  </tr>`,
    )
    .join("")}</table>`;

const button = ([label, path], bg = BRAND.ink, fg = BRAND.paper) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:10px 0 6px;"><tr><td>
    <a href="${escapeHtml(url(path))}" target="_blank" style="display:inline-block;background:${bg};color:${fg};font-family:${FONT_UI};font-weight:600;font-size:15px;padding:14px 26px;border-radius:12px;text-decoration:none;">${escapeHtml(label)}</a>
  </td></tr></table>`;

const signoff = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:26px;"><tr>
    <td valign="middle" width="50" style="padding-right:12px;"><img src="${SITE_URL}/fari.png" width="40" height="40" alt="Farirai" style="display:block;width:40px;height:40px;border-radius:999px;border:1px solid ${BRAND.line};"></td>
    <td valign="middle" style="font-family:${FONT_BODY};font-size:14px;line-height:1.4;color:${BRAND.ink};">Farirai<br><span style="font-size:12px;color:${BRAND.inkMuted};">Founder, FitMyCV</span></td>
  </tr></table>`;

function body(email, firstName) {
  const hi = `<div style="margin:0 0 12px;font-family:${FONT_BODY};font-size:15px;font-weight:500;color:${BRAND.inkSoft};">Hi ${escapeHtml(firstName)},</div>`;
  const heading = email.heading
    ? `<h1 class="em-h1" style="margin:0 0 18px;font-family:${FONT_SERIF};font-weight:400;font-size:38px;line-height:1.08;letter-spacing:-0.8px;color:${BRAND.ink};">${escapeHtml(email.heading)}</h1>`
    : "";
  const paras = email.paragraphs.map((t) => p(t, email.plain ? BRAND.ink : BRAND.inkSoft)).join("");
  const steps = email.steps ? numbered(email.steps) : "";
  const features = email.features ? checks(email.features) : "";
  const after = email.after ? p(email.after) : "";

  if (email.offer) {
    return `${hi}${heading}${paras}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;background:${BRAND.accentSoft};border:1px solid ${BRAND.accentLine};border-radius:16px;">
        <tr><td style="padding:24px 22px;">
          ${checks(PRO_FEATURES)}
          <div style="border-top:1px solid ${BRAND.accentLine};padding-top:16px;">
            ${after}
            ${button(email.cta, BRAND.accentDark, "#ffffff")}
          </div>
        </td></tr>
      </table>
      ${signoff}`;
  }
  return `${hi}${heading}${paras}${steps}${features}${after}${email.cta ? button(email.cta) : ""}${signoff}`;
}

export function buildNurtureEmail(step, { userName, unsubscribeUrl }) {
  const email = EMAILS[step];
  const firstName = firstNameOf(userName);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>${escapeHtml(email.subject)}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width:600px) {
      .em-pad { padding-left: 22px !important; padding-right: 22px !important; }
      .em-h1  { font-size: 30px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${BRAND.paper};font-family:${FONT_BODY};color:${BRAND.ink};-webkit-font-smoothing:antialiased;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;font-size:1px;color:transparent;">${escapeHtml(email.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.paperSoft};border:1px solid ${BRAND.line};border-radius:20px;overflow:hidden;">
        <tr><td style="background:${BRAND.paperStrong};border-bottom:1px solid ${BRAND.line};padding:20px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle" width="34" style="padding-right:10px;"><div style="width:26px;height:26px;border-radius:8px;background:${BRAND.ink};text-align:center;line-height:26px;color:${BRAND.paper};font-family:${FONT_UI};font-weight:700;font-size:13px;">F</div></td>
            <td valign="middle"><span style="font-family:${FONT_SERIF};font-size:19px;letter-spacing:-0.3px;color:${BRAND.ink};">FitMyCV</span></td>
          </tr></table>
        </td></tr>
        <tr><td class="em-pad" style="padding:36px 32px 34px;">
          ${body(email, firstName)}
        </td></tr>
        <tr><td style="background:${BRAND.paperStrong};border-top:1px solid ${BRAND.line};padding:22px 32px;text-align:center;">
          <p style="margin:0;font-family:${FONT_BODY};font-size:11px;line-height:1.6;color:${BRAND.inkMuted};">
            You are getting this because you signed up for FitMyCV.<br>
            <a href="${escapeHtml(unsubscribeUrl)}" style="color:${BRAND.inkMuted};text-decoration:underline;">Unsubscribe from product emails</a>
            &nbsp;&middot;&nbsp; <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND.inkMuted};text-decoration:none;">${SUPPORT_EMAIL}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Hi ${firstName},`,
    email.heading,
    ...email.paragraphs,
    ...(email.steps ?? []).map((s, i) => `${i + 1}. ${s}`),
    ...(email.features ?? []).map((f) => `  * ${f}`),
    ...(email.offer ? PRO_FEATURES.map((f) => `  * ${f}`) : []),
    email.after,
    email.cta && `${email.cta[0]}: ${url(email.cta[1])}`,
    "Farirai\nFounder, FitMyCV",
    `Unsubscribe: ${unsubscribeUrl}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { subject: email.subject, html, text };
}

// Everything sendEmail needs for one user and step.
export function nurtureMessage(user, step) {
  const id = String(user._id);
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?u=${id}&s=${sign(id)}`;
  return {
    to: user.email,
    ...buildNurtureEmail(step, { userName: user.name, unsubscribeUrl }),
    fromName: "Farirai from FitMyCV",
    replyTo: SUPPORT_EMAIL,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}
