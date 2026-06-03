function locationLabel(job) {
  if (job.isRemote) return "Remote";
  const parts = [job.city, job.state].filter(Boolean);
  return parts.length ? parts.join(", ") : job.country ?? "";
}

function jobCard(job) {
  const location = locationLabel(job);
  const remoteBadge = job.isRemote
    ? `<span style="display:inline-block;background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;margin-left:6px;">Remote</span>`
    : "";
  const salaryLine = job.salary
    ? `<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${job.salary}</p>`
    : "";

  return `
    <div style="border:1px solid #e5e7eb;border-radius:10px;padding:16px 20px;margin-bottom:14px;background:#fff;">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        ${
          job.logo
            ? `<img src="${job.logo}" alt="${job.company}" width="40" height="40" style="border-radius:6px;object-fit:contain;flex-shrink:0;" />`
            : `<div style="width:40px;height:40px;border-radius:6px;background:#f3f4f6;flex-shrink:0;"></div>`
        }
        <div style="flex:1;min-width:0;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${job.title}</p>
          <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">${job.company} &middot; ${location}${remoteBadge}</p>
          ${salaryLine}
        </div>
        <a href="${job.applyLink}" style="display:inline-block;flex-shrink:0;background:#111827;color:#fff;font-size:13px;font-weight:500;padding:7px 14px;border-radius:7px;text-decoration:none;" target="_blank">View Job</a>
      </div>
    </div>`;
}

export function buildJobDigestEmail({ userName, jobs }) {
  const firstName = (userName ?? "there").split(" ")[0];
  const cards = jobs.map(jobCard).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your Daily Job Matches</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#111827;border-radius:12px 12px 0 0;padding:24px 32px;">
          <p style="margin:0;font-size:20px;font-weight:700;color:#fff;">FitMyCV</p>
          <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Your daily job digest</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#fff;padding:28px 32px;">
          <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;">Good morning, ${firstName} 👋</p>
          <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Here are today's job matches based on your CV experience. Tap a role to apply.</p>

          ${cards}

          <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;text-align:center;">
            <a href="https://fitmycv.vercel.app/dashboard" style="color:#6b7280;text-decoration:underline;">View your dashboard</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f3f4f6;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">
            You're receiving this because you have a FitMyCV premium subscription.<br/>
            &copy; ${new Date().getFullYear()} FitMyCV
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
