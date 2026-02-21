import { Webhooks } from "@polar-sh/nextjs";
import { connectDB } from "@/utils/connect";
import User from "@/models/User";

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

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,

  onOrderPaid: async (payload) => {
    const order = payload.data;
    const user = await resolveUser(order);
    if (!user) return;

    user.isPremium = true;
    user.polarCustomerId = order.customer?.id || null;
    user.premiumActivatedAt = new Date();
    user.premiumRevokedAt = null;
    await user.save();

    console.log(`Premium activated for user: ${user.email} (order.paid)`);
  },

  onOrderRefunded: async (payload) => {
    const order = payload.data;
    const user = await resolveUser(order);
    if (!user) return;

    const isFullRefund = order.refundedAmount >= order.totalAmount;

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

    // User keeps premium — they paid through the current period
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
