# yield-curve-builder

Fits the US Treasury curve used by **DuraLens** to price every bond in a portfolio.

## Owner
Maria Delgado (quant analyst). Priya Natarajan reviews the code.

## What it does
- Fits Nelson-Siegel curves (up to 6 parameters) to daily Treasury par yields
- Interpolates zero rates for any maturity from 3 months to 30 years
- Reports fit error in basis points; current average error is 0.8 bp, worst case 2.1 bp at the 30Y point
- Stores a dated snapshot so any DuraLens number can be reproduced

## Relation to Bayview
The Bayview Teachers Pension Fund Q4 rebalance depends on this curve. Convexity for the 10Y and 30Y buckets is only as good as the curve fit beyond 20 years, which is a known weak spot.

## Inputs and outputs
- Input: treasury-data-loader snapshots
- Output: curve objects consumed by duralens-core and bond-pricer

## Open items
- Compare against spline fit before the v0.4 release
- Add an alert when fit error passes 3 basis points

Contact Maria Delgado with questions about methodology.
