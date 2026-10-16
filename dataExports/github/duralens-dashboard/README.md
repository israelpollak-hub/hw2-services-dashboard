# duralens-dashboard

Web dashboard for **DuraLens**: portfolio duration, convexity, and stress test results in one place.

## Owner
Priya Natarajan, lead developer of DuraLens.

## Views
- Portfolio summary: duration 6.4 years, convexity 0.82 for Bayview
- Bucket breakdown by maturity
- Stress test: +/-100 basis points and Fed cut path results from Daniel Okafor's engine
- Limits: usage against -3.5% stress loss and 1.00% VaR
- Treasury curve chart from Maria Delgado's fit

## Relation to Bayview
Joe Smith uses the dashboard on client calls with Rachel Stein at the Bayview Teachers Pension Fund. A read-only client view is planned for v0.5.

## Roadmap
- v0.4 (Oct 24): scenario output panel
- v0.5 (Nov 14): client login and monthly report download
- v1.0: limit alerts

## Tech
React front end, Python API on top of duralens-core. Charting library decision pending.
