# Shearin Energy Manager v0.2

Mobile-first energy dashboard for Redding and Manteca.

## Build 0.1 includes

- Supabase authentication
- Properties table
- Monthly energy table
- Manual monthly energy entry
- Dashboard cards
- Automatic calculations:
  - Home usage = solar produced + grid import - grid export
  - Solar offset = solar produced / home usage
- Mobile-friendly layout

## Setup

1. Create a new Supabase project.
2. Open Supabase SQL Editor.
3. Run `supabase/001_foundation.sql`.
4. In Supabase, go to Project Settings > API.
5. Copy the Project URL and anon public key.
6. Paste them into `config.js`.
7. Commit the updated files to GitHub.
8. Deploy using GitHub Pages, Netlify, or Vercel.

## First test

1. Create an account.
2. Click **Add starter properties**.
3. Go to **Monthly**.
4. Enter June Redding data:
   - Solar produced: 1822.1
   - Grid import: 1554.428
   - Grid export: 781.88
   - Monthly NEM charge: 323.13
   - True-Up balance: 4827.60
   - Electric base charge: 25.39
5. Save.
6. Confirm dashboard shows home usage and solar offset.


## Build 0.2 notes

This build adds an Upload/Import tab and a one-tap loader for the June 2026 data already extracted from Mike's PG&E bill and Tesla Redding screenshots.

Manteca Tesla production is intentionally left as 0 until those screenshots are imported.

No SQL changes are required from v0.1.
