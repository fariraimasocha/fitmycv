import { connectDB } from "@/utils/connect";
import { isCronRequest } from "@/lib/sign";
import { sendEmail } from "@/lib/email";
import {
  DONE,
  PAYWALL_AFTER,
  PAYWALL_UNTIL,
  REMINDER_AFTER,
  REMINDER_UNTIL,
  checkoutReminderMessage,
  dueStep,
  nurtureMessage,
  paywallReminderMessage,
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
  const paywallReminders = await sendPaywallReminders(errors);

  return Response.json({ sent, skipped, reminders, paywallReminders, errors, total: users.length });
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

// One email to a free user who tailored a CV 1 to 48 hours ago, hit the
// paywall and never opened checkout. Anyone who opened checkout after that CV
// gets the checkout reminder above instead, never both.
async function sendPaywallReminders(errors) {
  const now = Date.now();
  const cvs = await TailoredCV.find({
    createdAt: { $lte: new Date(now - PAYWALL_AFTER), $gte: new Date(now - PAYWALL_UNTIL) },
    unlockedAt: { $exists: false },
  })
    .sort({ createdAt: -1 })
    .select("userId jobTitle jobCompany createdAt")
    .lean();

  // Newest CV per user.
  const latest = new Map();
  for (const cv of cvs) {
    const id = String(cv.userId);
    if (!latest.has(id)) latest.set(id, cv);
  }
  if (!latest.size) return 0;

  const users = await User.find({
    _id: { $in: [...latest.keys()] },
    paywallReminderSentAt: { $exists: false },
    isPremium: { $ne: true },
    marketingEmails: { $ne: false },
  })
    .select("email name checkoutStartedAt")
    .lean();

  let sent = 0;
  for (const user of users) {
    const cv = latest.get(String(user._id));
    if (user.checkoutStartedAt && user.checkoutStartedAt >= cv.createdAt) continue;

    const claimed = await User.updateOne(
      { _id: user._id, paywallReminderSentAt: { $exists: false } },
      { $set: { paywallReminderSentAt: new Date() } },
    );
    if (claimed.modifiedCount === 0) continue;

    try {
      await sendEmail(paywallReminderMessage(user, cv));
      sent++;
    } catch (err) {
      await User.updateOne({ _id: user._id }, { $unset: { paywallReminderSentAt: 1 } });
      console.error(`Paywall reminder failed for ${user.email}:`, err);
      errors.push({ email: user.email, step: "paywall_reminder", error: err.message });
    }
  }
  return sent;
}
