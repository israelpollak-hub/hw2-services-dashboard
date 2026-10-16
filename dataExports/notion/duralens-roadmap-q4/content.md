## Q4 goals
Ship a client-ready DuraLens in time for the **Bayview Q4 rebalance** decision.
## Milestones
- **v0.3 (done, Oct 3):** YTM solver, duration and convexity per position
- **v0.4 (Oct 24):** stress test engine integration, +/-100 basis points scenarios
- **v0.5 (Nov 14):** monthly Bayview duration report, dashboard v1
- **v1.0 (Dec 5):** callable bond support, limits monitor, audit trail
## Owners
- Priya Natarajan: releases and dashboard
- Maria Delgado: convexity and curve models
- Daniel Okafor: stress test and limits
- Joe Smith: scope and client priorities
## Risks
- YTM solver fails to converge on some deep-discount bonds
- Treasury data feed delays near month-end
- Scope creep from Bayview reporting requests (Rachel Stein)
## Decisions needed
- Freeze scope for v0.4 by Oct 17
- Choose charting library for dashboard
