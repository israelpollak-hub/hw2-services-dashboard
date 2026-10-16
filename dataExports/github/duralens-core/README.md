# duralens-core

The core engine of **DuraLens**, Quillfeather Capital's internal bond-analytics tool. It computes modified duration, convexity and price sensitivity for fixed-income portfolios.

## Owner
Priya Natarajan (lead developer). Model definitions come from Maria Delgado; product scope is set by Joe Smith.

## What it does
- Prices bonds from a fitted Treasury curve plus spread
- Computes duration and convexity per position and per maturity bucket
- Aggregates portfolio-level figures (Bayview today: duration 6.4 years, convexity 0.82)
- Exposes a Python API used by the stress test engine, the reporting service and the dashboard

## Relation to Bayview
This library produces the numbers behind the Bayview Teachers Pension Fund Q4 rebalance. Every figure Rachel Stein sees traces back to a calculation here.

## Status
- v0.3 released Oct 3
- v0.4 planned Oct 24 (stress test integration)

## Related repos
yield-curve-builder, bond-pricer, convexity-calculator, stress-test-engine, bayview-reporting.

## Development
Run the test suite before every merge. Convexity results must match Maria's reference sheet within 0.01.
