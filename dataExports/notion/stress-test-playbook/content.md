## Owner
Daniel Okafor, Risk manager
## Scenarios
- Parallel +100 basis points and -100 basis points
- Steepener: 2Y -25, 30Y +50 basis points
- Flattener: reverse of steepener
- Fed cut path: -75 basis points over 6 months
## Procedure
- Snapshot positions and Treasury curve from DuraLens
- Run each scenario using full repricing, not duration only
- Compare results to limits
- Record in the Q4 rebalance decision log
## Limits
- +100 basis points loss: -3.5% maximum
- 1-day 99% VaR: 1.00% of NAV
- Single issuer: 5% maximum
## Escalation
- Within 10% of a limit: notify Joe Smith
- Breach: stop trading in that sleeve and call Joe Smith and Rachel Stein same day
## Known gaps
- Callable bonds mis-priced in stress test
- Maria Delgado to supply option-adjusted convexity
- Priya Natarajan to add scenario output to the dashboard
