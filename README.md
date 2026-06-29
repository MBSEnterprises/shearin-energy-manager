# Shearin Energy Manager v0.6 – Timeline

Mobile-first energy dashboard for Redding and Manteca.

## What's new in v0.6

- Adds a **Timeline** tab.
- Lets you move month-by-month through saved history.
- Shows PG&E account-level bill history by month.
- Highlights large true-up events.
- Shows property-specific monthly energy rows when available.
- Keeps manual edit/data entry as backup.
- No new SQL migration required if you already ran:
  - `supabase/001_foundation.sql`
  - `supabase/002_delivered_fuels.sql`
  - `supabase/003_historical_bills.sql`

## Deploy

Upload the full contents of this folder to GitHub and commit.

Then refresh the GitHub Pages app.

## After deploy

1. Sign in.
2. Go to **Upload**.
3. If needed, click:
   - **Load / Repair June 2026 Known Data**
   - **Load Historical PG&E Bills**
4. Go to **Timeline** and review prior months.

## Notes

Historical PG&E bills are currently account-level summaries. Full property-level parsing and automatic PDF extraction are future builds.
