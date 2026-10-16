## Owner
Priya Natarajan, lead developer of DuraLens
## Before release
- All tests pass (current count: 214)
- YTM solver regression suite green
- Convexity results match Maria Delgado reference sheet within 0.01
- Stress test output reviewed by Daniel Okafor
## Release steps
- Freeze main branch
- Tag version (v0.4 planned Oct 24)
- Build and deploy dashboard to staging
- Smoke test with Bayview sample portfolio
- Joe Smith sign-off
## After release
- Publish release notes
- Notify team and Rachel Stein if client-facing
- Open issues for deferred bugs
## Rollback
- Redeploy previous tag
- Post incident note in the team page
## Last release
v0.3 on Oct 3: added duration and convexity per position; known bug: solver fails on deep-discount bonds.
