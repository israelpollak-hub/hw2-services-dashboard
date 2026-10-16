# treasury-data-loader

Loads daily Treasury par yields and bond reference data into the **DuraLens** data store.

## Owner
Priya Natarajan, lead developer of DuraLens. Sruly handles daily monitoring.

## What it does
- Downloads par yield curve rates for 1M to 30Y after the market close
- Validates data: rejects moves above 25 basis points in a day without a manual flag
- Writes dated snapshots so every DuraLens result can be reproduced
- Loads Bayview position files (about 1,200 positions) in CSV format

## Relation to Bayview
Snapshots feed yield-curve-builder, and positions for the Bayview Teachers Pension Fund come from here. Rachel Stein's team sends the file each month-end.

## Schedule
Runs at 6:30 PM ET on business days. Month-end loads are delayed sometimes; see the Q4 roadmap risks.

## Contacts
- Data issues: Priya Natarajan
- Curve fitting questions: Maria Delgado
- Limit checks that use these data: Daniel Okafor
- Priorities: Joe Smith
