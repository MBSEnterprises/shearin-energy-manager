# Shearin Energy Manager V2

Mobile-first energy tracking app for PG&E + Tesla data.

## What it tracks

- Properties: Redding, Manteca, and future locations
- PG&E imports / exports / net usage
- Tesla solar production
- True-Up balance
- Monthly NEM charges
- Gas charges
- Calculated home usage
- Calculated solar offset

## Setup overview

1. Create a GitHub repo named `shearin-energy-manager`.
2. Upload these files into the repo.
3. Create a new Supabase project.
4. Run `SUPABASE_SCHEMA_V2.sql` in Supabase SQL Editor.
5. In Supabase, copy:
   - Project URL
   - anon public key
6. Edit `config.js` and paste those values.
7. Enable GitHub Pages or deploy with Netlify/Vercel.

## Important

This version supports manual monthly entry first. That is intentional. Direct Tesla / PG&E automation should come after the database and dashboard are stable.

## Monthly workflow

1. Download PG&E bill PDF.
2. Capture Tesla Month screenshot.
3. Enter values into Add Month.
4. Review Dashboard.

## Key formula

Estimated Home Usage = PG&E Import + (Tesla Solar Produced - PG&E Export)

Solar Offset % = Tesla Solar Produced / Estimated Home Usage

These are estimates because PG&E does not report solar used directly by the home.
