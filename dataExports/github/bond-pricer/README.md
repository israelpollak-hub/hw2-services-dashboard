# bond-pricer

Prices fixed-rate bonds and solves yield-to-maturity (YTM) for **DuraLens**.

## Owner
Priya Natarajan, lead developer of DuraLens.

## What it does
- Clean and dirty price from cash flows and a discount curve
- Newton-Raphson YTM solver with bisection fallback (tolerance 1e-8)
- Accrued interest for 30/360 and actual/actual conventions
- Batch pricing: about 1,200 positions repriced in under 2 seconds

## Known issues
- The YTM solver fails to converge on some deep-discount bonds (priced below 60). Fix targeted for DuraLens v0.4.
- Callable bonds are priced to maturity only; option-adjusted pricing is planned with Maria Delgado.

## Relation to Bayview
The Bayview Teachers Pension Fund portfolio contains about 1,200 positions. All of them are priced here before duration and convexity are computed in duralens-core.

## Related
- yield-curve-builder supplies the Treasury curve
- stress-test-engine reprices through this package for Daniel Okafor's +/-100 basis points scenarios

## Testing
Run the regression suite; it includes 40 bonds with reference prices from Joe Smith's desk.
