import { connectDB } from "@/utils/connect";
import { isCronRequest } from "@/lib/sign";
import { sendEmail } from "@/lib/email";
import { DONE, dueStep, nurtureMessage, shouldSkip } from "@/lib/nurture-email";
import User from "@/models/User";

// Hourly. Sends each signup the next nurture email once it is due.
export async function GET(request) {
  if (!isCronRequest(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // $type keeps out legacy users, who have no nurtureStep at all.
  const users = await User.find({
    nurtureStep: { $type: "number", $lt: DONE },
    marketingEmails: { $ne: false },
  })
    .select("email name isPremium nurtureStep createdAt")
    .lean();

  let sent = 0;
  let skipped = 0;
  const errors = [];

  for (const user of users) {
    const step = dueStep(user);
    if (step === null) continue;

    // Claim the step before sending so overlapping runs never double send.
    const claimed = await User.updateOne(
      { _id: user._id, nurtureStep: step },
      { $set: { nurtureStep: step + 1 } },
    );
    if (claimed.modifiedCount === 0) continue;

    if (shouldSkip(user, step)) {
      skipped++;
      continue;
    }

    try {
      await sendEmail(nurtureMessage(user, step));
      sent++;
    } catch (err) {
      // Hand the step back so the next run retries it.
      await User.updateOne({ _id: user._id, nurtureStep: step + 1 }, { $set: { nurtureStep: step } });
      console.error(`Nurture step ${step} failed for ${user.email}:`, err);
      errors.push({ email: user.email, step, error: err.message });
    }
  }

  return Response.json({ sent, skipped, errors, total: users.length });
}
