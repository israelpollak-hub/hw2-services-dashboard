# risk-limits-monitor

Monitors portfolio risk limits and raises alerts for the **DuraLens** team.

## Owner
Daniel Okafor, risk manager. Priya Natarajan owns deployment.

## Limits monitored
- +100 basis points stress loss: -3.5% maximum
- 1-day 99% VaR: 1.00% of NAV (currently 0.92%)
- Single issuer: 5% of NAV
- Portfolio duration band for Bayview: 6.0 to 7.0 years

## Alert rules
- Warning at 90% of a limit: email Joe Smith
- Breach: alert Joe Smith and Daniel Okafor immediately; trading in that sleeve stops until reviewed

## Relation to Bayview
The Bayview Teachers Pension Fund has contractual limits. The Q4 rebalance pushes stress loss to -3.4% at duration 7.0, so this monitor is checked before each trade. Rachel Stein is informed of any breach the same day.

## Inputs
Results from duralens-core and stress-test-engine; convexity inputs from Maria Delgado.

## Status
Runs daily at 5:00 PM ET. Intraday monitoring is planned.
