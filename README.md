# Shearin Energy Manager v0.5.1 Auth Fix

Complete release. Fixes expired Supabase JWT sessions so the app returns to the login screen instead of leaving the dashboard blank. No SQL changes required.

Deploy by uploading all files to GitHub and committing. Then refresh the GitHub Pages app and sign in again if prompted.

# Shearin Energy Manager v0.5 Redo

Complete release. Do not upload partial files.

## What changed

- Keeps v0.4 financial dashboard.
- Adds full energy categories: PG&E electric, PG&E gas, propane, kerosene, other delivered fuels.
- Adds Manteca Tesla June 2026 solar production: 771.0 kWh.
- Adds Historical PG&E Account Bills table and importer.
- Adds missing manual edit fields for propane, kerosene, and other energy costs.
- Keeps upload-first workflow; manual editing remains backup only.

## SQL required

Run these in Supabase SQL Editor in order if not already run:

1. `supabase/002_delivered_fuels.sql`
2. `supabase/003_historical_bills.sql`

Do not re-run `001_foundation.sql` if it already exists; it is included for archive completeness.

## Deployment

Upload the complete contents of this ZIP to GitHub and commit.

Then refresh the GitHub Pages app.

## After deployment

Go to Upload tab and click:

1. `Load / Repair June 2026 Known Data`
2. `Load Historical PG&E Bills`

## Notes

Historical PG&E records are currently account-level summaries from the uploaded statements. Property-level parsing will come later as the import engine improves.
