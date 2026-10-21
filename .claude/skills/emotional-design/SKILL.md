---
name: emotional-design
description: Make the product feel alive, trustworthy and premium through micro-interactions, success states, polish and first impressions. Use when adding or reviewing confirmation moments, success or celebration states, onboarding and welcome screens, charts and cards, high-stakes flows (payments, uploads, data people care about), or when an app "feels like every other AI app".
---

# Emotional design

Source: Tim Gabe, "The Secret Behind Weirdly Addictive Apps" (youtube.com/watch?v=Du2lkZ_cux8). Builds on Don Norman's *Emotional Design*.

Anyone can ship features now, so being useful is no longer an edge. How the
product makes people feel when they tap, swipe, wait and leave is. The
video shows three ways to use it.

## 1. Habit loops through delight (Duolingo)

Instant emotional feedback on repeated actions keeps people coming back.
- Add micro-interactions to confirmation moments: a subtle bounce, glow or check.
- Celebrate small wins. Success states can be small but must be designed on purpose.
- Show momentum with progress animations: streaks, levels, counts building over time.
- The goal is feedback that feels human, not just functional.

## 2. Trust through polish (Phantom)

In scary or high-stakes spaces (money, crypto, health, careers):
- **Polish builds trust.** Motion, transitions and visual detail are product features, not fluff. Every micro-interaction is a trust signal.
- **Keep it approachable.** Warm, friendly details make heavy topics lighter.
- **Build for people, not pros.** Don't assume users know the rules. Explain in plain words inside the flow.
- **Smooth feedback raises confidence.** How it feels on tap, swipe and wait sticks more than raw speed.

## 3. Premium through craft (Revolut)

Polish signals the price point.
- **Nail the first impression.** Onboarding and welcome moments should show quality and care immediately.
- **Add quiet delight.** Fades, hover states and gestures. None of it should shout.
- **Make data tactile.** Charts that respond to the pointer, cards with depth, so plain features feel elevated.

## FitMyCV map

A job hunt is stressful and personal, so this is a trust space like Phantom's.

- **Confirmation moments:** CV saved, ATS fix applied, application moved,
  story saved. Pair the sonner toast with a small on-screen change, such as
  the item settling into place or the score ticking up.
- **Small wins:** ATS score going up after a fix, the first tailored CV, the
  first interview stage in Applications.
- **Momentum:** the application pipeline and stats strip
  (`components/dashboard/DashboardStatStrip.jsx`), and the activity chart
  (`DashboardActivityChart.jsx`). Animate changes in value, not page loads.
- **First impression:** the signed-out landing and `/dashboard` after first
  sign-in. The empty states (`DashboardEmptyState`) are onboarding, so make
  them warm and point at one action.
- **Tactile data:** the ATS and match score cards, and the CV template
  previews (`components/cv/ScaledDocument.jsx`). Hover and press states
  should feel deliberate.

## Rules for this repo

- **Restraint over spectacle.** The brand is plain and calm (see the CLAUDE.md
  copy rules). One well-timed motion beats five. No mascots or confetti unless
  asked.
- **`motion/react` only**, with `useReducedMotion()`. Animate `transform` and
  `opacity`. Keep it short (150 to 400ms) and never delay input.
- **The CV document itself stays plain.** Its preview and PDF must stay
  ATS-safe. Apply delight to the app chrome around it, never inside the CV.
- **Honest celebration.** Celebrate what the data shows ("ATS score up 12
  points"). Never claim outcomes we can't verify ("you'll get the job").
- Pair this with the `make-interfaces-feel-better` and `improve-animations`
  skills for implementation detail.
