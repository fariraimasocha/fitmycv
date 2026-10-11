# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for FitMyCV. Session Replay, Error Tracking, and Support are enabled; health, error-tracking, and support-ticket signal sources now feed the inbox. Findings should begin appearing in the [Self-driving inbox](https://us.posthog.com/project/607441/inbox) within about 30 minutes.

## AI data processing

Approved by the wizard's organization-level gate.

## GitHub

Connected before this setup run through the PostHog GitHub App.

## Products enabled

| Product | Result | Notes |
| --- | --- | --- |
| Session Replay | Already enabled | Browser recordings are present. The production `posthog-js` setup does not disable recording; local development recording is intentionally disabled. |
| Error Tracking | Enabled | The browser init has exception capture enabled. Existing error issues confirm the product has data. |
| Support / Conversations | Enabled | An inbound email, inbox, or Slack channel is still required before support tickets can arrive. |

## Signal sources

| Source product | Source type | Action |
| --- | --- | --- |
| `health_checks` | `health_issue` | Enabled |
| `error_tracking` | `issue_created` | Enabled |
| `error_tracking` | `issue_reopened` | Enabled |
| `error_tracking` | `issue_spiking` | Enabled |
| `conversations` | `ticket` | Enabled |
| `signals_scout` | `cross_source_issue` | On by default; no opt-out row created |
| Session replay | — | Deliberately not created as a source; Replay Vision scanners provide its inbox route. |

## Connected tools

The connected-tools selection was dismissed, so no external issue tracker, error tracker, support desk, security scanner, feedback tool, or search-analytics responder was added.

| Tool | Status |
| --- | --- |
| GitHub Issues | Not selected; GitHub App remains connected for future use. |
| Linear | Not selected |
| Jira | Not selected |
| Sentry | Not selected |
| Zendesk | Not selected |

## Scout troop

**Run budget:** 100 runs/day; 0 used at setup time and 100 remaining. The current banner says: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

Seven scouts are enabled, using the default daily schedule:

| Scout | Why it is enabled |
| --- | --- |
| `signals-scout-general` | Broad cross-product coverage and correlations. |
| `signals-scout-product-analytics` | Generic flow, funnel, lifecycle, and retention regression coverage. |
| `signals-scout-web-analytics` | Website traffic, attribution, landing-page, and 404 health. |
| `signals-scout-revenue-analytics` | Revenue and payment-data health; the app uses Polar. |
| `signals-scout-observability-gaps` | Identifies important product events without insight, dashboard, or alert coverage. |
| `signals-scout-cv-tailoring-journey` | Custom core-tailoring completion monitor. |
| `signals-scout-checkout-purchase-completion` | Custom checkout-to-purchase completion monitor. |

Twenty-three built-in scouts remain disabled to keep the troop selective: AI observability, anomaly detection, APM, conversations, CSP violations, customer analytics, data pipelines, data warehouse, experiments, feature flags, inbox validation, insight alerts, logs, MCP tool calls, PR follow-up, Replay Vision trend analysis, session replay, skills store, surveys, tasks, web vitals, workflows, and the error-tracking scout.

They are disabled because the repo and project evidence does not show their corresponding product surface in active use, or because a dedicated route already covers it: Error Tracking uses native sources, and Session Replay uses the Replay Vision scanners below. Enable an individual scout later from the inbox if that surface becomes important.

## Custom scouts

| Scout | Watches | Discriminator | Why it is distinct |
| --- | --- | --- | --- |
| `signals-scout-cv-tailoring-journey` | The core journey in `app/dashboard/tailor/page.js`, from tailoring start through generated CV and document download. | A material fall from `tailor_started` to `cv_tailored` while starts remain stable. | The general product scout partly covers saved flows, but this monitor names the core FitMyCV journey and distinguishes job reading, generation, and expected free-plan download boundaries. |
| `signals-scout-checkout-purchase-completion` | The path from pricing or upgrade checkout intent to the Polar webhook’s completed purchase. | A material fall from `checkout_start` to `purchase_complete` while checkout starts remain stable. | The revenue scout partly covers payment health, but does not specifically guarantee this checkout conversion path. |

Considered but not added: error bursts are covered by the native Error Tracking sources; replay friction is covered by the Replay Vision monitors; surveys, feature flags, account analytics, logs, and PostHog AI observability have no active evidence. If a custom scout becomes noisy, set its config’s `emit` field to `false` in PostHog to switch it to dry-run.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes credible findings to the inbox. These are the only items in this setup that spend Replay Vision quota. Findings arrive at half weight, so a report needs corroboration from independent recordings before promotion.

| Monitor | Status | Query scope | Sampling | Estimated monthly spend |
| --- | --- | --- | --- | --- |
| **FitMyCV tailoring breakage** | Created | Recordings that include `/dashboard/tailor`, the product’s core job-listing-to-tailored-CV completion flow. | 50% | 240 observations, 1,200 credits/month |
| **FitMyCV user frustration** | Created | Recordings containing `$rageclick`, with no URL scope so it stays distinct from the breakage monitor. | 100% | 60 observations, 300 credits/month |

The org had 2,420 credits remaining when sized, with an 8-day remainder in the current billing period. The scanners’ projected remaining-period usage is comfortably below that budget. Rate early observations in the Replay Vision UI with a thumbs-up or thumbs-down and a short note to improve the monitors.

## Files modified or created

| File | Change |
| --- | --- |
| `posthog-self-driving-report.md` | Created this configuration record. |

No application source files were changed. The existing browser PostHog initialization already allows Session Replay and Error Tracking in production.

## Follow-ups

- [ ] Connect an inbound email, inbox, or Slack channel to PostHog Support so the enabled support-ticket source receives tickets.
- [ ] If external work items should enter Self-driving, select and connect the relevant tool from the project’s integrations settings: https://us.posthog.com/project/607441/settings/environment-integrations
- [ ] Reauthorize the PostHog MCP connection with `action:read` and `property_definition:read` scopes if you want future setup runs to validate the live event taxonomy directly.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scout runs draw from the project’s daily budget, and Replay Vision starts evaluating new recordings immediately. Findings cluster into actionable reports in the [Self-driving inbox](https://us.posthog.com/project/607441/inbox), where they can become coding tasks.
