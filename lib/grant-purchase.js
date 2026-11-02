import TailoredCV from "@/models/TailoredCV";

// What a paid one-time order gives, shared by Polar and EcoCash.
// A single purchase opens one CV and never grants Pro. Anything else grants Pro.
export async function grantPurchase(user, { plan, tailoredCvId, orderId }) {
  if (plan === "single" && tailoredCvId) {
    const cv = await TailoredCV.findOneAndUpdate(
      { _id: tailoredCvId, userId: user._id },
      { $set: { unlockedAt: new Date(), unlockOrderId: orderId } },
      { new: true },
    );
    if (!cv) {
      console.error(`Single unlock: CV ${tailoredCvId} not found for user ${user._id} (order ${orderId})`);
      return;
    }
    console.log(`CV ${cv._id} unlocked for user: ${user.email} (order ${orderId})`);
    return;
  }

  user.isPremium = true;
  user.premiumActivatedAt = new Date();
  user.premiumRevokedAt = null;
  await user.save();
  console.log(`Premium activated for user: ${user.email} (order ${orderId})`);
}
