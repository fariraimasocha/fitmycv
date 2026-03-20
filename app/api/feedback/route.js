import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import Feedback from "@/models/Feedback";
import { Resend } from "resend";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, name, email, message } = await request.json();

    await connectDB();
    await Feedback.create({
      userId: session.user.id,
      name,
      email,
      type,
      message,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "FitMyCV <onboarding@resend.dev>",
      to: "fariraimasocha@gmail.com",
      subject: `[FitMyCV Feedback] ${type} from ${name}`,
      html: `
        <p><strong>Type:</strong> ${escapeHtml(type)}</p>
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Message:</strong> ${escapeHtml(message)}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return Response.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}
