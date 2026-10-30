# Pricing return

How pricing looked before the one-time pricing test, and how to bring it back.

- **Test started:** week of Oct 27, 2026.
- **Last commit with the old pricing:** `e7ff3ba`. Any file below can be read as it was with `git show e7ff3ba:<path>`.

## Why monthly was hidden

PostHog on Oct 27, 2026: a LinkedIn post brought 170 visitors and 0 purchases.

- The paywall opened 6 seconds after every tailored CV. It reached 7 people and none started checkout.
- So for one week we sell one-time payments only: one CV, or lifetime.
- The plan is to A/B test monthly against one-time after that.

Keep this in mind when reading the results: a comment in the old paywall code says every purchase in October 2026 was monthly, and lifetime sold none.

## The switch

`lib/pricing.js`:

```js
export const SHOW_MONTHLY = false;
```

Set it to `true` and every pricing surface goes back to the layout described under "Before".

- Checkout never stopped accepting `plan=month`, so old links and nurture emails kept working.
- For the A/B test, replace the constant with a PostHog feature flag. Read the flag in `PricingCards`, `UpgradePromptModal`, `components/landing/Pricing.js` and `app/[locale]/pricing/page.js`.
- `paywall_view` now records `primary_plan` (`month`, `single` or `lifetime`). Compare `checkout_start` and `purchase_complete` per variant.

## Prices (unchanged)

`lib/pricing.js`, `TIER_AMOUNTS`:

| Tier | Monthly | Lifetime | One CV |
|---|---|---|---|
| standard | $9.99 | $29.99 | $5.99 |
| africa | $6.99 | $16.99 | $3.99 |

The Africa tier covers the countries in `PPP_COUNTRY_CODES` in `lib/pricing-region.js`. The country comes from a header (`x-vercel-ip-country` or `cf-ipcountry`).

## Before vs during the test

### 1. Paywall modal (`components/UpgradePromptModal.jsx`)

**Before (`SHOW_MONTHLY = true`):**
1. Primary button: "Get Pro for ${month} a month" (`getMonth`), with "Cancel anytime." under it. Source `paywall_primary`.
2. Secondary button, only when signed in with a `cvId`: "Unlock this CV for ${single}" (`getSingle`), with "This CV and its cover letter only. One payment." Source `paywall_single`.
3. Text link: "Or pay ${lifetime} once for lifetime" (`orLifetime`). Source `paywall_secondary`.
4. "Maybe later".

`paywall_view` sent `primary_plan: "month"`.

**During the test:**
1. With a `cvId`: primary "Unlock this CV for ${single}", then a secondary button "Get lifetime for ${lifetime}" (`getLifetime`), with the note `lifetimeNote`.
2. Without a `cvId`: only the lifetime button, as the primary.

The old JSX is still in the file, in the `SHOW_MONTHLY` branch, so restoring it needs no code.

### 2. When the paywall opens (`app/(app)/dashboard/tailor/page.js`)

**Before:** after every successful tailor, free users got the modal automatically after 6 seconds (context `"tailored"`):

```js
// in tailorMutation onSuccess
if (!session?.user?.isPremium) {
  clearTimeout(upgradeTimerRef.current);
  upgradeTimerRef.current = setTimeout(() => {
    setUpgradeModalContext("tailored");
    setShowUpgradeModal(true);
  }, 6000);
}
```

There was also `const upgradeTimerRef = useRef(null)`, an unmount cleanup, and `clearTimeout(upgradeTimerRef.current)` in `handleDownload` and `startTailor`.

The old comment said: "Waiting on a Download click meant a third of free users who tailored never saw a price."

**Now:** no auto popup. The modal opens on Download, on a locked Pro card, or on `PREMIUM_REQUIRED`. A line next to the Download button, "Download from ${single}" (`tailor.tailorPage.result.downloadFrom`), keeps the price visible.

**This change does not depend on `SHOW_MONTHLY`.** To restore the timer, copy the block above back in, or use `git show e7ff3ba:"app/(app)/dashboard/tailor/page.js"`.

### 3. Pricing cards (`components/pricing/PricingCards.jsx`)

Used by the homepage pricing section, `/pricing` and `/dashboard/upgrade` (compact).

**Before:**
- Two cards side by side, Lifetime first with a "Best value" badge, Monthly second. With `primaryPlan="month"` (on `/dashboard/upgrade`), Monthly came first with a "Start here" badge.
- Below the cards, a separate full-width panel: "Both plans include everything [11]", with the features in two columns.

**During the test:**
- A single-plan branch: one centered card, `max-w-md`, laid out the same at every width as on a phone.
- From top to bottom: label, subline, price, the "Get Lifetime" button, "Secure checkout via Polar.", a divider, then "Everything included [11]" with one column of features.
- No badge.
- The compact version (`/dashboard/upgrade`) shows just the lifetime card.

### 4. Homepage pricing section (`components/landing/Pricing.js`)

**Before:**
- Left-aligned heading.
- Intro `pages.pricing.intro`: "One payment for lifetime access, or go monthly, cancel anytime."
- Footnote `pages.pricing.footnote`: "About {months} months of monthly…".

**During the test:**
- Centered heading and notes.
- Intro `pages.pricing.introOnce`: "One payment. Every feature, for good."
- The footnote is hidden.

### 5. `/pricing` page (`app/[locale]/pricing/page.js`)

**Before:** the headline price line read "${lifetime} once **or** ${month} a month".

**During the test:** only "${lifetime} once".

**Not changed:** the FAQ answers still mention monthly.

### Not changed, and still mentions monthly

- The terms page (`app/[locale]/terms-and-conditions/page.js`, `lib/dualmark-pages.js`)
- `app/llm.txt/route.js`
- `lib/structured-data.js`
- Nurture emails (`lib/nurture-email.js`, `lib/lead-nurture-email.js`)
- The auth page's checkout-intent copy for `pendingPlan === "month"`

## Copy keys added for the test

Added in all 7 locales. They can stay after monthly returns.

- `pages.upgradeModal.getLifetime`, `pages.upgradeModal.lifetimeNote`
- `pages.pricing.introOnce`
- `pages.pricingCards.includesTitleOne`, `pages.pricingCards.secureCheckout`
- `tailor.tailorPage.result.downloadFrom`

## Restore checklist

1. Set `SHOW_MONTHLY = true` in `lib/pricing.js`.
2. Decide whether the 6-second paywall timer comes back (section 2). Check PostHog first: compare `checkout_start` from `paywall_primary` and `paywall_single` for the test week against the week before.
3. Run `npm run build`. Check the homepage `#pricing`, `/pricing`, `/dashboard/upgrade`, and the paywall on `/dashboard/tailor` as a free user.
