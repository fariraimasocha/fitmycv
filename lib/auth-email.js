import { sendEmail } from "@/lib/email";

export async function sendMagicLinkEmail({ email, url }) {
  const subject = "Sign in to FitMyCV";
  const text = `Sign in to FitMyCV\n\n${url}\n\nThis link expires in 24 hours. If you did not request it, ignore this email.`;
  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;max-width:480px">
      <p style="font-size:18px;font-weight:700;margin:0 0 12px">Sign in to FitMyCV</p>
      <p style="margin:0 0 20px;color:#555">Tap the button below to sign in. This works in the LinkedIn app and other in-app browsers where Google sign-in is blocked.</p>
      <p style="margin:0 0 24px">
        <a href="${url}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Sign in to FitMyCV</a>
      </p>
      <p style="margin:0;font-size:13px;color:#777">This link expires in 24 hours. If you did not request it, ignore this email.</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html, text });
}
