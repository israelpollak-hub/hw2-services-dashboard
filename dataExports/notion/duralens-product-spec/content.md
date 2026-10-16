## Purpose
DuraLens computes **duration**, **convexity** and price sensitivity for fixed-income portfolios, and shows how they move under rate shocks.
## Users
- Portfolio managers (Joe Smith) for rebalance decisions
- Quants (Maria Delgado) for model validation
- Risk (Daniel Okafor) for stress test and VaR limits
- Clients such as Rachel Stein at Bayview
## Core features
- Bond pricing and yield-to-maturity solver (tolerance 1e-8)
- Modified duration and convexity per position and per bucket
- Parallel and key-rate shifts: +/-100 basis points, +/-50 basis points
- Treasury curve fitting (Nelson-Siegel, 6 parameters max)
- Monthly PDF report for Bayview
## Non-functional requirements
- Full portfolio (about 1,200 positions) repriced in under 5 seconds
- Every number traceable to a data snapshot
- Role-based access for clients
## Open questions
- How to handle callable bonds in the stress test (Daniel)
- Whether to add OAS in v0.5 (Maria, Priya)
## Owner
Priya Natarajan, with Joe Smith as product sponsor.
