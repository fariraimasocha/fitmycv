import { Webhooks } from "@polar-sh/nextjs";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";
import TailoredCV from "@/models/TailoredCV";
import { captureServerEvent } from "@/lib/posthog-server";

async function resolveUser(data) {
  await connectDB();

  const userId = data.metadata?.userId;
  const customerEmail = data.customer?.email;

  let user;

  if (userId) {
    user = await User.findById(userId);
  }

  if (!user && customerEmail) {
    user = await User.findOne({ email: customerEmail });
  }

  if (!user) {
    console.error(
      `Webhook: could not resolve user (userId=${userId}, email=${customerEmail})`,
    );
  }

  return user;
}

// Sent from here, not the success page: a buyer who closes the tab or blocks
// scripts still counts. distinct_id is the user id the client identifies with.
// Renewals are skipped so this counts first purchases only.
async function capturePurchase(user, order) {
  if (order.billingReason === "subscription_cycle") return;
  const plan = isSingleOrder(order)
    ? "single"
    : order.metadata?.plan === "month" || order.subscriptionId
      ? "month"
      : "lifetime";
  await captureServerEvent(user._id, "purchase_complete", {
    plan,
    order_id: order.id,
    tier: order.metadata?.pricingTier ?? null,
    revenue: order.totalAmount / 100,
    currency: order.currency,
    $insert_id: order.id,
  });
}

// A single purchase opens one CV and nothing else. It never grants Pro, and
// its refund never takes Pro away from someone who also bought a plan.
const isSingleOrder = (order) =>
  order.metadata?.plan === "single" && Boolean(order.metadata?.tailoredCvId);

async function unlockSingleCV(user, order) {
  const cv = await TailoredCV.findOneAndUpdate(
    { _id: order.metadata.tailoredCvId, userId: user._id },
    { $set: { unlockedAt: new Date(), unlockOrderId: order.id } },
    { new: true },
  );
  if (!cv) {
    console.error(
      `Single unlock: CV ${order.metadata.tailoredCvId} not found for user ${user._id} (order ${order.id})`,
    );
    return;
  }
  console.log(`CV ${cv._id} unlocked for user: ${user.email} (order ${order.id})`);
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,

  onOrderPaid: async (payload) => {
    const order = payload.data;
    const user = await resolveUser(order);
    if (!user) return;

    if (isSingleOrder(order)) {
      await unlockSingleCV(user, order);
      if (order.customer?.id && !user.polarCustomerId) {
        user.polarCustomerId = order.customer.id;
        await user.save();
      }
      await capturePurchase(user, order);
      return;
    }

    user.isPremium = true;
    user.polarCustomerId = order.customer?.id || user.polarCustomerId || null;
    user.premiumActivatedAt = new Date();
    user.premiumRevokedAt = null;
    await user.save();
    await capturePurchase(user, order);

    console.log(`Premium activated for user: ${user.email} (order.paid)`);
  },

  onOrderRefunded: async (payload) => {
    const order = payload.data;
    const user = await resolveUser(order);
    if (!user) return;

    const isFullRefund = order.refundedAmount >= order.totalAmount;

    if (isSingleOrder(order)) {
      if (!isFullRefund) return;
      await TailoredCV.updateOne(
        { unlockOrderId: order.id, userId: user._id },
        { $unset: { unlockedAt: 1, unlockOrderId: 1 } },
      );
      console.log(`CV ${order.metadata.tailoredCvId} locked again (full refund on order ${order.id})`);
      return;
    }

    if (isFullRefund) {
      user.isPremium = false;
      user.premiumRevokedAt = new Date();
      user.polarSubscriptionId = null;
      user.polarSubscriptionStatus = null;
      user.subscriptionCurrentPeriodEnd = null;
      user.subscriptionCanceledAt = null;
      await user.save();

      console.log(
        `Premium revoked for user: ${user.email} (full refund on order ${order.id})`,
      );
    } else {
      console.log(
        `Partial refund for user: ${user.email} (${order.refundedAmount}/${order.totalAmount} on order ${order.id})`,
      );
    }
  },

  onSubscriptionActive: async (payload) => {
    const subscription = payload.data;
    const user = await resolveUser(subscription);
    if (!user) return;

    user.isPremium = true;
    user.polarCustomerId = subscription.customerId || user.polarCustomerId || null;
    user.polarSubscriptionId = subscription.id;
    user.polarSubscriptionStatus = "active";
    user.subscriptionCurrentPeriodEnd = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null;
    user.subscriptionCanceledAt = null;
    user.premiumRevokedAt = null;
    await user.save();

    console.log(
      `Subscription active for user: ${user.email} (subscription.active)`,
    );
  },

  onSubscriptionCanceled: async (payload) => {
    const subscription = payload.data;
    const user = await resolveUser(subscription);
    if (!user) return;

    // User keeps premium. They paid through the current period
    user.polarSubscriptionStatus = "canceled";
    user.subscriptionCanceledAt = subscription.canceledAt
      ? new Date(subscription.canceledAt)
      : new Date();
    user.subscriptionCurrentPeriodEnd = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : null;
    await user.save();

    console.log(
      `Subscription canceled for user: ${user.email} (premium kept until period end)`,
    );
  },

  onSubscriptionUncanceled: async (payload) => {
    const subscription = payload.data;
    const user = await resolveUser(subscription);
    if (!user) return;

    user.polarCustomerId = subscription.customerId || user.polarCustomerId || null;
    user.polarSubscriptionStatus = "active";
    user.subscriptionCanceledAt = null;
    await user.save();

    console.log(
      `Subscription uncanceled for user: ${user.email} (restored to active)`,
    );
  },

  onSubscriptionRevoked: async (payload) => {
    const subscription = payload.data;
    const user = await resolveUser(subscription);
    if (!user) return;

    user.isPremium = false;
    user.premiumRevokedAt = new Date();
    user.polarSubscriptionId = null;
    user.polarSubscriptionStatus = null;
    user.subscriptionCurrentPeriodEnd = null;
    user.subscriptionCanceledAt = null;
    await user.save();

    console.log(
      `Premium revoked for user: ${user.email} (subscription.revoked)`,
    );
  },
});
