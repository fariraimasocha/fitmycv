// Cloudflare Email Service REST API. from uses {address} (not {email} like
// the Workers binding); success result is {delivered, permanent_bounces, queued}.
const FROM = { address: "noreply@fitmycv.link", name: "FitMyCV" };

export async function sendEmail({ to, subject, html, text }) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_EMAIL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, from: FROM, subject, html, text }),
    }
  );
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Email send failed: ${JSON.stringify(data.errors ?? data)}`);
  }
  return data.result;
}
