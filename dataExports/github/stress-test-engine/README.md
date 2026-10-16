# stress-test-engine

Runs rate-shock scenarios on portfolios for **DuraLens**.

## Owner
Daniel Okafor, risk manager. Priya Natarajan owns the integration into DuraLens.

## Scenarios
- Parallel +100 and -100 basis points
- Steepener (2Y -25, 30Y +50 basis points) and flattener
- Fed cut path: -75 basis points over six months

## How it works
Full repricing through bond-pricer on a shocked Treasury curve from yield-curve-builder. Results are compared with limits: +100 bp loss at most -3.5%, 1-day 99% VaR at most 1.00% of NAV.

## Latest Bayview results
- +100 basis points: -3.1%
- -100 basis points: +3.6%
- Proposed rebalance at duration 7.0: -3.4%, close to the limit

## Relation to Bayview
Every proposed trade in the Bayview Teachers Pension Fund Q4 rebalance must pass this engine before Joe Smith approves it.

## Known gaps
Callable bonds are mispriced; Maria Delgado is preparing option-adjusted convexity inputs.
