import { connectDB } from "@/utils/connect";
import { isCronRequest } from "@/lib/sign";
import { sendEmail } from "@/lib/email";
import {
  DONE,
  REMINDER_AFTER,
  REMINDER_UNTIL,
  checkoutReminderMessage,
  dueStep,
  nurtureMessage,
  shouldSkip,
} from "@/lib/nurture-email";
import User from "@/models/User";
import TailoredCV from "@/models/TailoredCV";

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

  const reminders = await sendCheckoutReminders(errors);

  return Response.json({ sent, skipped, reminders, errors, total: users.length });
}

// One email to anyone who opened a Polar checkout 2 to 48 hours ago and has
// not paid. Same claim-then-send pattern as above, so overlapping runs never
// double send.
async function sendCheckoutReminders(errors) {
  const now = Date.now();
  const due = await User.find({
    checkoutStartedAt: { $lte: new Date(now - REMINDER_AFTER), $gte: new Date(now - REMINDER_UNTIL) },
    checkoutReminderSentAt: { $exists: false },
    isPremium: { $ne: true },
    marketingEmails: { $ne: false },
  })
    .select("email name checkoutPlan checkoutCvId")
    .lean();

  let reminders = 0;
  for (const user of due) {
    const claimed = await User.updateOne(
      { _id: user._id, checkoutReminderSentAt: { $exists: false } },
      { $set: { checkoutReminderSentAt: new Date() } },
    );
    if (claimed.modifiedCount === 0) continue;

    // A single CV bought since the checkout opened needs no reminder.
    if (user.checkoutPlan === "single" && user.checkoutCvId) {
      const cv = await TailoredCV.findById(user.checkoutCvId).select("unlockedAt").lean();
      if (!cv || cv.unlockedAt) continue;
    }

    try {
      await sendEmail(checkoutReminderMessage(user));
      reminders++;
    } catch (err) {
      await User.updateOne({ _id: user._id }, { $unset: { checkoutReminderSentAt: 1 } });
      console.error(`Checkout reminder failed for ${user.email}:`, err);
      errors.push({ email: user.email, step: "checkout_reminder", error: err.message });
    }
  }
  return reminders;
}
