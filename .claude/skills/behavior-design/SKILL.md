---
name: behavior-design
description: Apply behavioural psychology to UI so people act and come back without being pushed. Covers feedback loops, Hick's law, Fitts's law, emotional tone, social proof and the Zeigarnik effect. Use when designing loading or AI wait states, first-run screens, primary actions, dashboards, progress or streak UI, or when asked to improve activation or retention.
---

# Behaviour design

Source: Tim Gabe, "How Top 1% Apps Keep You Hooked" (youtube.com/watch?v=D9SXaj6qQIQ).

The products people stick with fit how the brain works: what grabs
attention, what triggers action, and what pulls you back. Get that right
and users pull themselves in. Apply the six principles below in order. Each
one only pays off once the one before it holds.

## 1. Feedback loops: the system visibly reacts

Like Perplexity's live loader and reacting voice dots. When the user acts, the app should react at once, and the loop should feel closed.
- Movement shows the system is working, not frozen.
- Small pulses or flickers confirm the input landed.
- Treat waiting as a designed moment, not empty time.

## 2. Hick's law: fewer choices, faster start

Like Apple Fitness's single "Let's go". More options mean slower decisions.
- One clear focus per screen, and one primary button.
- Remove friction from the first minute.

## 3. Fitts's law: big, close, easy

Like Waze's thumb-sized buttons. Bigger and closer targets are faster to hit.
- Size shows priority. The main action is the biggest target.
- Design for distracted, one-handed use on phones, with primary actions within thumb reach.

## 4. Emotional tone sets behaviour

Like Headspace slowing your pace from the splash screen on. Colour, type,
motion and copy tell people how to feel about the product, and that starts
at onboarding.

## 5. Social proof: show, don't tell

Like Discord's lit avatars and "2,312 online". Show real activity as it
happens: presence, counts, recent actions. Put community in plain view, not
buried.

## 6. Zeigarnik effect: open loops pull people back

Like Streaks or Duolingo. Unfinished tasks stick in memory.
- Show stacked, visible progress, and keep the next threshold close.
- Make completion itself the reward.
- Don't show 20 loops at once (see Hick's law).

## FitMyCV map

- **Feedback:** AI waits for tailoring, extract, ATS score and match score.
  Show a live sign the work is going on, such as the elapsed counter on the
  tailor page (`tailorSeconds`) or the stages in `components/UploadProgress.jsx`.
  Never show a bare spinner for more than a few seconds.
- **Hick's:** the dashboard home and `/dashboard/tailor` lead with one action,
  "paste a job link". Push secondary tools into the sidebar.
- **Fitts's:** primary buttons use `dashboard-primary-btn` at full width on
  mobile. Keep tap targets at least 44px (`tap-target`).
- **Social proof:** only counts we can query, such as a user's own
  application pipeline, tailored CV count or ATS score history. **Never
  invent activity numbers.** CLAUDE.md requires every claim to be checkable
  from the data.
- **Zeigarnik:** an activation checklist (`components/dashboard/DashboardActivation.jsx`),
  application stages, "2 of 4 steps done". Show the next step, not every step.

## Guardrails

- No dark patterns: no fake scarcity, no guilt copy, no streak shaming, no
  confirm-shaming on the upgrade modal.
- Respect `useReducedMotion()`. Feedback must also work without motion
  (text, `aria-live`).
- Reuse what's installed (`motion/react`, sonner, tanstack-query state). No
  new dependency for an animation.
