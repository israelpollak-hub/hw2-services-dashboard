## Meeting details
- Date: Oct 9, 2:00 PM ET
- Attendees: Daniel Okafor (lead), Joe Smith, Maria Delgado, Priya Natarajan, Sruly
## Stress test results
- +100 basis points: portfolio -3.1% (limit -3.5%)
- -100 basis points: portfolio +3.6%
- Proposed rebalance (duration 7.0): +100 basis points gives -3.4%, close to the limit
## Issues
- 1-day 99% VaR at 0.92% of NAV versus 1.00% limit
- Stress test fails for callable bonds (Priya to fix in DuraLens v0.4)
- Convexity estimate for 30Y bucket differs 0.04 between models (Maria investigating)
## Decisions
- Cap target duration at 6.9 years until callable bond fix ships
- Daniel to send limit warning to Joe if VaR passes 0.95%
## Action items
- Priya: callable bond fix
- Maria: reconcile the convexity models
- Sruly: update Bayview report numbers
- Rachel Stein to receive a summary from Joe
