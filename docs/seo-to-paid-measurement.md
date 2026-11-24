# Search visitor to paid customer

Review this weekly in PostHog alongside the Search Console Performance report. Use completed calendar days in UTC and wait for Search Console's data lag before comparing the same dates. Do not divide Search Console clicks by PostHog purchases: the tools count different units and cannot identify the same person.

## Cohorts and steps

- Acquisition: unique people with `$initial_search_engine = google`, grouped by `$initial_pathname`. This is first-touch attribution, not every Google visit.
- Free tool: `ats_check_completed` with `mode = match`; count unique people, not checks. The check runs in the browser without signup.
- Product handoff: `ats_handoff_cta` with `source = match`, then `ats_handoff_consumed` or `cv_handoff_consumed`.
- Activation: `onboarding_completed`, `resume_uploaded`, `cv_tailored`.
- Payment intent: `paywall_view`, `checkout_start` (click), `checkout_created` (Polar session successfully created).
- Paid: `purchase_complete` (first purchase from the payment webhook). For Polar purchases, inspect `checkout_source` and `paywall_context`; EcoCash purchases have their own provider path.

Use unique users and an ordered 14-day conversion window when comparing an entrant cohort to purchase. A same-period event count is useful for volume, but it is not a conversion rate. Segment by initial landing page: `/`, `/ats-resume-checker`, and `/blog/*`. Keep counts visible with rates because purchase samples are small.

## Starting point, 2026-10-25 through 2026-11-21

Search Console: 581 clicks, 32,048 impressions, 1.81% CTR. The homepage received 181 clicks; `/ats-resume-checker` received 172. PostHog recorded 288 people with `onboarding_completed`, 234 with `cv_tailored`, 171 with `paywall_view`, 62 with `checkout_start`, and 12 with `purchase_complete`. These PostHog counts are independent event populations, not one ordered funnel. `checkout_created` and purchase source properties were added after this baseline, so start their comparison after release.

## Decision rule

Compare the ATS page's Google-first-touch **checker completion → handoff → tailored CV → checkout created → purchase** rates against the prior 28 days, with at least a 14-day conversion allowance for each entrant. Inspect the paywall by context and the count of `paywall_dismissed` events before changing pricing. Review the two edited article snippets in Search Console by *page and query* after indexing, while checking position changes; CTR alone can move when rankings or query mix change.
