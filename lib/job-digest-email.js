import { SITE_URL } from "@/lib/site";

const BRAND = {
  paper: "#FAF8F0",
  paperSoft: "#FFFEF9",
  paperStrong: "#F5EFE0",
  ink: "#272138",
  inkSoft: "#5A5170",
  inkMuted: "#7A6F8A",
  line: "#E5DFCC",
  primaryDark: "#0F4D55",
  primarySoft: "#D6F0EE",
  primaryBorder: "#1F8A95",
  coral: "#D86A3C",
  coralSoft: "#F4E4D0",
  accent: "#9C7728",
  accentSoft: "#F2E5C7",
};

const FONT_DISPLAY = `'Outfit', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
const FONT_BODY = `'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
const FONT_MONO = `'Geist Mono', 'SF Mono', Menlo, Consolas, monospace`;

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function locationLabel(job) {
  if (job.isRemote) return "Remote";
  const parts = [job.city, job.state].filter(Boolean);
  return parts.length ? parts.join(", ") : (job.country ?? "");
}

function timeAgo(iso) {
  if (!iso) return "Recent";
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diff / 36e5);
  if (hours < 1) return "Just now";
  if (hours < 24) return `Posted ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Posted ${days}d ago`;
}

const TILE_VARIANTS = [
  { bg: BRAND.primarySoft, fg: BRAND.primaryDark, border: "#1F8A951F" },
  { bg: BRAND.coralSoft, fg: BRAND.coral, border: "#D86A3C1F" },
  { bg: BRAND.accentSoft, fg: BRAND.accent, border: "#9C7728" + "1F" },
];

function logoTile(job, index) {
  const variant = TILE_VARIANTS[index % TILE_VARIANTS.length];
  if (job.logo) {
    return `<img src="${escapeHtml(job.logo)}" alt="${escapeHtml(job.company)}" width="44" height="44" style="display:block;border-radius:12px;object-fit:contain;background:${variant.bg};border:1px solid ${variant.border};" />`;
  }
  const letter = (job.company?.[0] ?? "?").toUpperCase();
  return `<div style="width:44px;height:44px;border-radius:12px;background:${variant.bg};border:1px solid ${variant.border};text-align:center;line-height:44px;font-family:${FONT_DISPLAY};font-weight:800;font-size:18px;color:${variant.fg};">${escapeHtml(letter)}</div>`;
}

function badge({
  bg,
  color,
  border,
  text,
  fontFamily = FONT_BODY,
  weight = 700,
}) {
  const borderStyle = border ? `border:1px solid ${border};` : "";
  return `<span style="display:inline-block;background:${bg};${borderStyle}color:${color};font-family:${fontFamily};font-size:11px;font-weight:${weight};padding:5px 10px;border-radius:999px;margin:4px 4px 0 0;line-height:1;">${escapeHtml(text)}</span>`;
}

function jobCard(job, index) {
  const location = locationLabel(job);
  const meta = `${escapeHtml(job.company)} &middot; ${escapeHtml(location)} &middot; ${escapeHtml(timeAgo(job.postedAt))}`;

  const remoteBadge = job.isRemote
    ? badge({
        bg: BRAND.primarySoft,
        color: BRAND.primaryDark,
        text: "🌐  Remote",
      })
    : "";
  const salaryBadge = job.salary
    ? badge({
        bg: BRAND.paper,
        color: BRAND.inkSoft,
        border: BRAND.line,
        text: job.salary,
        fontFamily: FONT_MONO,
        weight: 500,
      })
    : "";
  const employmentBadge = job.employmentType
    ? badge({
        bg: BRAND.paper,
        color: BRAND.inkSoft,
        border: BRAND.line,
        text: job.employmentType,
        weight: 600,
      })
    : "";

  return `
  <table role="presentation" class="em-row" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid ${BRAND.line};border-radius:18px;margin-bottom:12px;">
    <tr>
      <td style="padding:18px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="top" width="56" style="padding-right:14px;">${logoTile(job, index)}</td>
            <td valign="top" style="font-family:${FONT_BODY};">
              <div class="em-ink" style="font-family:${FONT_DISPLAY};font-weight:700;font-size:15px;color:${BRAND.ink};line-height:1.3;">${escapeHtml(job.title)}</div>
              <div class="em-ink-soft" style="margin-top:4px;font-family:${FONT_BODY};font-weight:500;font-size:12px;color:${BRAND.inkSoft};line-height:1.5;">${meta}</div>
            </td>
            <td valign="top" align="right" style="padding-left:12px;">
              <a href="${escapeHtml(job.applyLink)}" target="_blank" class="em-white" style="display:inline-block;background:${BRAND.primaryDark};color:#FFFFFF;font-family:${FONT_DISPLAY};font-weight:800;font-size:12px;letter-spacing:0.2px;padding:10px 16px;border-radius:13px;text-decoration:none;box-shadow:0 8px 18px ${BRAND.primaryDark}38;">View&nbsp;↗</a>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="padding-top:12px;">${remoteBadge}${salaryBadge}${employmentBadge}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function queryChip(query) {
  return `<span style="display:inline-block;background:${BRAND.primarySoft};border:1px solid ${BRAND.primaryBorder}33;color:${BRAND.primaryDark};font-family:${FONT_BODY};font-size:12px;font-weight:700;padding:6px 12px;border-radius:999px;line-height:1;margin-left:8px;">${escapeHtml(query)}</span>`;
}

export function buildJobDigestEmail({
  userName,
  jobs,
  queries = [],
  dashboardUrl = `${SITE_URL}/dashboard`,
}) {
  const firstName = (userName ?? "there").split(" ")[0];
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const cards = jobs.map(jobCard).join("");
  const chips = queries.map(queryChip).join("");
  const matchedRow = chips
    ? `<div style="margin:20px 0 18px;">
         <span style="font-family:${FONT_BODY};font-size:11px;font-weight:700;color:${BRAND.inkSoft};letter-spacing:0.5px;text-transform:uppercase;">Matched for</span>
         ${chips}
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>Your daily job matches</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    /* Apple Mail / iOS — proper dark mode override */
    @media (prefers-color-scheme: dark) {
      .em-bg     { background: #FAF8F0 !important; }
      .em-card   { background: #FFFEF9 !important; }
      .em-row    { background: #FFFFFF !important; }
      .em-header { background: #272138 !important; background-image: linear-gradient(145deg, #272138 0%, #1A3F5C 100%) !important; }
      .em-footer { background: #F5EFE0 !important; }
      .em-ink       { color: #272138 !important; }
      .em-ink-soft  { color: #5A5170 !important; }
      .em-ink-muted { color: #7A6F8A !important; }
      .em-white  { color: #FFFFFF !important; }
      .em-cream  { color: #FAF8F0 !important; }
    }
    /* Gmail mobile dark mode override */
    [data-ogsc] .em-bg     { background: #FAF8F0 !important; }
    [data-ogsc] .em-card   { background: #FFFEF9 !important; }
    [data-ogsc] .em-row    { background: #FFFFFF !important; }
    [data-ogsc] .em-header { background: #272138 !important; }
    [data-ogsc] .em-footer { background: #F5EFE0 !important; }
    [data-ogsc] .em-ink       { color: #272138 !important; }
    [data-ogsc] .em-ink-soft  { color: #5A5170 !important; }
    [data-ogsc] .em-ink-muted { color: #7A6F8A !important; }
    [data-ogsc] .em-white  { color: #FFFFFF !important; }
    [data-ogsc] .em-cream  { color: #FAF8F0 !important; }
  </style>
</head>
<body class="em-bg" style="margin:0;padding:0;background:${BRAND.paper};font-family:${FONT_BODY};color:${BRAND.ink};-webkit-font-smoothing:antialiased;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;font-size:1px;color:transparent;">${jobs.length} fresh remote roles matched to your CV today.</span>
  <table role="presentation" class="em-bg" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="em-card" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.paperSoft};border-radius:18px;overflow:hidden;box-shadow:0 18px 45px ${BRAND.ink}1F, 0 4px 12px ${BRAND.ink}14;">

          <!-- Header (dark gradient) -->
          <tr>
            <td class="em-header" style="background:${BRAND.ink};background-image:linear-gradient(145deg, ${BRAND.ink} 0%, #1A3F5C 100%);padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" width="32" style="padding-right:10px;">
                    <div class="em-white" style="width:28px;height:28px;border-radius:8px;background:${BRAND.primaryDark};text-align:center;line-height:28px;color:#FFFFFF;font-family:${FONT_DISPLAY};font-weight:800;font-size:14px;box-shadow:inset 0 1px 0 #FFFFFF2E;">F</div>
                  </td>
                  <td valign="middle">
                    <div class="em-white" style="font-family:${FONT_DISPLAY};font-weight:800;font-size:18px;color:#FFFFFF;letter-spacing:-0.4px;line-height:1.1;">FitMyCV</div>
                    <div class="em-cream" style="margin-top:3px;font-family:${FONT_BODY};font-size:12px;font-weight:500;color:#FAF8F0CC;">Your daily job digest &middot; ${escapeHtml(dateLabel)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="em-card" style="padding:36px 32px 28px;background:${BRAND.paperSoft};">
              <h1 class="em-ink" style="margin:0 0 10px;font-family:${FONT_DISPLAY};font-weight:800;font-size:30px;line-height:1.1;letter-spacing:-1.2px;color:${BRAND.ink};">Good morning, ${escapeHtml(firstName)} 👋</h1>
              <p class="em-ink-soft" style="margin:0;font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${BRAND.inkSoft};">We found ${jobs.length} fresh remote ${jobs.length === 1 ? "role" : "roles"} that match your experience. Tap any role to apply.</p>

              ${matchedRow}

              ${cards}

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid ${BRAND.line};">
                <tr>
                  <td align="center" style="padding-top:28px;">
                    <a href="${escapeHtml(dashboardUrl)}" target="_blank" class="em-white" style="display:inline-block;background:${BRAND.primaryDark};color:#FFFFFF;font-family:${FONT_DISPLAY};font-weight:800;font-size:14px;letter-spacing:-0.2px;padding:14px 26px;border-radius:13px;text-decoration:none;box-shadow:0 12px 22px ${BRAND.primaryDark}38;">Open FitMyCV&nbsp;→</a>
                    <p class="em-ink-soft" style="margin:14px 0 0;font-family:${FONT_BODY};font-size:12px;font-weight:500;color:${BRAND.inkSoft};">Tailor your CV to any of these in one click.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="em-footer" style="background:${BRAND.paperStrong};border-top:1px solid ${BRAND.line};padding:22px 32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 10px;">
                <tr>
                  <td valign="middle" style="padding-right:6px;">
                    <div class="em-white" style="width:16px;height:16px;border-radius:5px;background:${BRAND.primaryDark};text-align:center;line-height:16px;color:#FFFFFF;font-family:${FONT_DISPLAY};font-weight:800;font-size:9px;">F</div>
                  </td>
                  <td valign="middle">
                    <span class="em-ink" style="font-family:${FONT_DISPLAY};font-weight:800;font-size:12px;color:${BRAND.ink};letter-spacing:-0.2px;">FitMyCV</span>
                  </td>
                </tr>
              </table>
              <p class="em-ink-soft" style="margin:0 0 8px;font-family:${FONT_BODY};font-size:11px;font-weight:600;color:${BRAND.inkSoft};">
                <a href="${escapeHtml(dashboardUrl)}" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Dashboard</a>
                &nbsp;&middot;&nbsp;
                <a href="${escapeHtml(dashboardUrl)}/profile" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Manage preferences</a>
                &nbsp;&middot;&nbsp;
                <a href="${escapeHtml(dashboardUrl)}/profile" class="em-ink-soft" style="color:${BRAND.inkSoft};text-decoration:none;">Unsubscribe</a>
              </p>
              <p class="em-ink-muted" style="margin:0;font-family:${FONT_BODY};font-size:10px;font-weight:400;color:${BRAND.inkMuted};">
                Sent because you're on FitMyCV Premium &middot; &copy; ${new Date().getFullYear()} FitMyCV
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
