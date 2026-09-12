import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import { getPricingForCountry } from "@/lib/pricing";

export async function sendLeadNurtureEmail({
  email,
  score,
  missingKeywordCount,
  country,
}) {
  const pricing = getPricingForCountry(country);
  const authUrl = `${SITE_URL}/auth`;
  const scoreLine =
    typeof score === "number"
      ? `Your CV scored ${score}% against that posting.`
      : "Your ATS check is ready.";
  const gapLine =
    typeof missingKeywordCount === "number" && missingKeywordCount > 0
      ? `${missingKeywordCount} keyword${missingKeywordCount === 1 ? "" : "s"} were missing from your CV.`
      : "FitMyCV can rewrite your CV against the job link so those gaps disappear.";

  const subject = "Your ATS score and how to fix the gaps";
  const text = `${scoreLine} ${gapLine}\n\nTailor your CV from a job link: ${authUrl}\n\nLifetime access is $${pricing.lifetime.price}. Monthly is $${pricing.month.price}.`;
  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;max-width:520px">
      <p style="font-size:18px;font-weight:700;margin:0 0 12px">Your ATS check results</p>
      <p style="margin:0 0 12px">${scoreLine}</p>
      <p style="margin:0 0 20px;color:#555">${gapLine}</p>
      <p style="margin:0 0 20px">Paste a job link into FitMyCV and get a rewritten CV and cover letter built from your real experience.</p>
      <p style="margin:0 0 24px">
        <a href="${authUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Tailor my CV</a>
      </p>
      <p style="margin:0;font-size:13px;color:#777">Lifetime access is $${pricing.lifetime.price}. Monthly is $${pricing.month.price}.</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html, text });
}
