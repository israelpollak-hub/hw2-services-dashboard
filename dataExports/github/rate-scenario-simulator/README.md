# rate-scenario-simulator

Simulates possible Fed rate paths and their effect on Treasury yields and portfolio value, for **DuraLens**.

## Owner
Maria Delgado, quant analyst, with input from Daniel Okafor on scenario design.

## What it does
- Generates rate paths for the next 12 months (base case: three 25 basis points cuts by March)
- Maps policy rate moves to the Treasury curve using historical betas (2Y beta 0.85, 10Y beta 0.45, 30Y beta 0.30)
- Feeds shocked curves into stress-test-engine
- Produces expected portfolio return by path, using duration and convexity from duralens-core

## Relation to Bayview
The Bayview Teachers Pension Fund wants a Q4 rebalance ahead of expected Fed rate cuts. This tool shows Joe Smith how much extra duration pays off if cuts arrive late or not at all.

## Status
Prototype. Priya Natarajan will wrap it in a DuraLens dashboard view after v0.4.

## Next steps
- Add probability weights per path
- Validate betas against 2019 and 2024 cutting cycles
