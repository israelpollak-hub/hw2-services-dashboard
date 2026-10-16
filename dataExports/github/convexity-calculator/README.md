# convexity-calculator

Numerical duration and convexity calculations for **DuraLens**.

## Owner
Maria Delgado, quant analyst. Priya Natarajan maintains the packaging.

## Method
- Bump yields by +/-1 basis point and reprice
- Modified duration = (P- - P+) / (2 x P0 x dy)
- Convexity = (P- + P+ - 2 x P0) / (P0 x dy^2)
- Aggregate by bucket: 0-2Y, 2-5Y, 5-10Y, 10-30Y, weighted by market value

## Current Bayview figures
- Portfolio duration 6.4 years, convexity 0.82
- 10Y bucket convexity 0.61
- 30Y bucket convexity 2.95

## Relation to Bayview
These numbers support the Bayview Teachers Pension Fund Q4 rebalance. Joe Smith uses them to decide how far to extend duration, and Rachel Stein receives them in the monthly report.

## Limitations
- Not valid for callable bonds without an option-adjusted model
- Two models differ by 0.04 on the 30Y bucket; reconciliation in progress

## Related
bond-pricer, yield-curve-builder, duralens-core, stress-test-engine.
