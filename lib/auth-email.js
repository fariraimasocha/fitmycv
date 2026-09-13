import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

// Live landing palette from app/globals.css and announcement email.
// Keep this in sync with lib/announcement-email.js BRAND.
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
  accentDark: "#9a4530",
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

/**
 * Send the magic-link sign-in email. Uses the same branded shell as the
 * announcement and job-digest emails so the inbox feels consistent.
 * The `url` param is the raw Auth.js verification link; we rewrite its host
 * to the canonical SITE_URL (www) so apex vs www cookie issues cannot break
 * the first navigation after the click.
 */
export async function sendMagicLinkEmail({ email, url }) {
  // Force the verification host to the canonical site origin. Auth.js builds
  // `url` from the incoming request host, which can be the apex domain when
  // the user requested the link from fitmycv.link. The apex 308s to www and
  // would drop the host-only session cookie, causing the "page couldn't load"
  // state that fixes itself on reload.
  let safeUrl = url;
  try {
    const parsed = new URL(url);
    const canonical = new URL(SITE_URL);
    parsed.protocol = canonical.protocol;
    parsed.host = canonical.host;
    safeUrl = parsed.toString();
  } catch {
    safeUrl = url;
  }

  const subject = "Sign in to FitMyCV";
  const preheader = "Tap the button to sign in. This link works in the LinkedIn app where Google sign in is blocked.";
  const dashboardUrl = `${SITE_URL}/dashboard`;

  const text = `Sign in to FitMyCV\n\nTap the link below to sign in. This works in the LinkedIn app and other in-app browsers where Google sign-in is blocked.\n\n${safeUrl}\n\nThis link expires in 24 hours. If you did not request it, ignore this email.\n\nDashboard: ${dashboardUrl}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>${escapeHtml(subject)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    @media (prefers-color-scheme: dark) {
      .em-bg      { background: ${BRAND.paper} !important; }
      .em-card    { background: ${BRAND.paperSoft} !important; }
      .em-surface { background: ${BRAND.surface} !important; }
      .em-head    { background: ${BRAND.paperStrong} !important; }
      .em-ink       { color: ${BRAND.ink} !important; }
      .em-ink-soft  { color: ${BRAND.inkSoft} !important; }
      .em-ink-muted { color: ${BRAND.inkMuted} !important; }
      .em-accent    { color: ${BRAND.accentDark} !important; }
      .em-cream     { color: ${BRAND.paper} !important; }
    }
    [data-ogsc] .em-bg      { background: ${BRAND.paper} !important; }
    [data-ogsc] .em-card    { background: ${BRAND.paperSoft} !important; }
    [data-ogsc] .em-surface { background: ${BRAND.surface} !important; }
    [data-ogsc] .em-head    { background: ${BRAND.paperStrong} !important; }
    [data-ogsc] .em-ink       { color: ${BRAND.ink} !important; }
    [data-ogsc] .em-ink-soft  { color: ${BRAND.inkSoft} !important; }
    [data-ogsc] .em-ink-muted { color: ${BRAND.inkMuted} !important; }
    [data-ogsc] .em-accent    { color: ${BRAND.accentDark} !important; }
    [data-ogsc] .em-cream     { color: ${BRAND.paper} !important; }
    @media only screen and (max-width:600px) {
      .em-pad { padding-left: 22px !important; padding-right: 22px !important; }
      .em-h1  { font-size: 30px !important; }
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
                    <span class="em-ink-soft" style="font-family:${FONT_BODY};font-size:12px;color:${BRAND.inkSoft};">Sign in</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="em-pad em-card" style="padding:36px 32px 10px;background:${BRAND.paperSoft};">
              <h1 class="em-h1 em-ink" style="margin:0 0 12px;font-family:${FONT_SERIF};font-weight:400;font-size:34px;line-height:1.06;letter-spacing:-0.6px;color:${BRAND.ink};">Sign in to FitMyCV</h1>
              <p class="em-ink-soft" style="margin:0;font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.inkSoft};">
                Tap the button below to sign in. This link works in the LinkedIn app and other in-app browsers where Google sign in is blocked.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 14px;">
                <tr>
                  <td>
                    <a href="${escapeHtml(safeUrl)}" target="_blank" class="em-cream" style="display:inline-block;background:${BRAND.ink};color:${BRAND.paper};font-family:${FONT_UI};font-weight:700;font-size:15px;letter-spacing:-0.1px;padding:14px 26px;border-radius:12px;text-decoration:none;">Sign in to FitMyCV</a>
                  </td>
                </tr>
              </table>
              <p class="em-ink-soft" style="margin:0 0 16px;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${BRAND.inkSoft};">
                This link expires in 24 hours. If you did not request it, you can ignore this email.
              </p>
              <p class="em-ink-muted" style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${BRAND.inkMuted};word-break:break-all;">
                Or copy this link: <a href="${escapeHtml(safeUrl)}" style="color:${BRAND.accentDark};text-decoration:underline;word-break:break-all;">${escapeHtml(safeUrl)}</a>
              </p>
            </td>
          </tr>

          <!-- Help -->
          <tr>
            <td class="em-pad em-card" style="padding:8px 32px 28px;background:${BRAND.paperSoft};">
              <table role="presentation" class="em-surface" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surface};border:1px solid ${BRAND.line};border-radius:14px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div class="em-ink" style="font-family:${FONT_UI};font-weight:700;font-size:12px;letter-spacing:0.5px;text-transform:uppercase;color:${BRAND.ink};margin-bottom:6px;">Having trouble?</div>
                    <p class="em-ink-soft" style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${BRAND.inkSoft};">
                      If the button does not work, copy the link above and paste it in Chrome or Safari. The link can only be used once.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="em-head" style="background:${BRAND.paperStrong};border-top:1px solid ${BRAND.line};padding:22px 32px;text-align:center;">
              <p class="em-ink-soft" style="margin:0 0 8px;font-family:${FONT_BODY};font-size:12px;font-weight:500;line-height:1.6;color:${BRAND.inkSoft};">
                <a href="${escapeHtml(dashboardUrl)}" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Dashboard</a>
                &nbsp;&middot;&nbsp;
                <a href="${escapeHtml(SITE_URL)}/support" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Support</a>
                &nbsp;&middot;&nbsp;
                <a href="${escapeHtml(SITE_URL)}/pricing" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Pricing</a>
              </p>
              <p class="em-ink-muted" style="margin:0;font-family:${FONT_BODY};font-size:11px;line-height:1.6;color:${BRAND.inkMuted};">
                Sent to ${escapeHtml(email)} &middot; &copy; ${new Date().getFullYear()} FitMyCV
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await sendEmail({ to: email, subject, html, text });
}
