## Owner
Maria Delgado, Quant analyst
## Definitions
- **Modified duration:** percentage price change per 1% (100 basis points) yield change
- **Convexity:** second-order sensitivity; improves the price estimate for large rate moves
## Method
- Price each bond from fitted Treasury curve plus spread
- Compute convexity numerically by bumping yields +/-1 basis point
- Aggregate by bucket: 0-2Y, 2-5Y, 5-10Y, 10-30Y
- Portfolio value weighted
## Current figures (Bayview)
- Portfolio duration 6.4 years, convexity 0.82
- 10Y bucket convexity 0.61, 30Y bucket convexity 2.95
## Approximation
Price change % = -Duration x dy + 0.5 x Convexity x dy^2
## Known limits
- Not valid for callable bonds without an option-adjusted model
- Sensitive to curve fit error beyond 20Y
## Review
Peer reviewed by Priya Natarajan (code) and Daniel Okafor (risk use).
