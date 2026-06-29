# Shearin Energy Manager v0.8 — Timeline Redesign

Complete release ZIP.

## What changed
- Timeline now behaves more like the Dashboard for previous months.
- Timeline has clear scope: Combined / PG&E Account, Redding, or Manteca.
- Combined Timeline shows the PG&E bill tie-out first.
- Property Timeline shows dashboard-style cards when property-level data is available.
- Historical import now repairs account-level history and adds property-level PG&E rows for months where the uploaded PDFs provided the service summary.
- December 2025 now loads property rows for both Manteca and Redding.
- No SQL changes if 002 and 003 were already run.

## Deploy
1. Upload the full contents of this folder to GitHub.
2. Commit.
3. Wait for GitHub Pages deployment.
4. Hard refresh the app.
5. Go to Upload and run **Load Historical PG&E Bills** again.
6. Go to Timeline and check December 2025 under Combined, Redding, and Manteca.

## Important note
For older months, Tesla solar production is not yet imported unless we have Tesla screenshots for that month. Those months will show PG&E property data but solar offset may show as unavailable.
