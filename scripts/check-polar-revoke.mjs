// Self check for ownsGrant in lib/polar.js: who a Polar revoke or refund may
// downgrade.
//
// Run: npm run check:polar-revoke

import assert from "node:assert/strict";
import { ownsGrant } from "../lib/polar.js";

const subscriber = { _id: "u1", polarSubscriptionId: "sub_1" };
const lifetime = { _id: "u2", polarSubscriptionId: null };

assert.ok(ownsGrant(subscriber, { subscriptionId: "sub_1" }), "own subscription revokes");
assert.ok(!ownsGrant(subscriber, { subscriptionId: "sub_other" }), "someone else's subscription found by email does not");
assert.ok(!ownsGrant(lifetime, { subscriptionId: "sub_old" }), "a stray subscription never revokes a lifetime buyer");
assert.ok(ownsGrant(lifetime, { metadataUserId: "u2" }), "refund of our own checkout order revokes");
assert.ok(!ownsGrant(lifetime, { metadataUserId: undefined }), "an order without our userId does not");
assert.ok(!ownsGrant(lifetime, { metadataUserId: "u9" }), "an order for another user does not");

console.log("polar revoke checks passed");
