# Shearin Energy Manager v1

Mobile-first personal energy dashboard for Redding and Manteca.

## What v1 does
- Tracks PG&E imports, exports, NEM charges, True-Up balance, and gas.
- Tracks Tesla solar production.
- Calculates estimated home consumption and solar offset.
- Works locally without Supabase, then syncs after Supabase is configured.

## Setup
1. Create a new Supabase project.
2. Open Supabase SQL Editor.
3. Run `SUPABASE_SCHEMA_V1.sql`.
4. Create a GitHub repository named `shearin-energy-manager`.
5. Upload these files.
6. Enable GitHub Pages or deploy with Netlify/Vercel.
7. Open the app and enter your Supabase URL and publishable anon key.

## Security note
The first schema uses a simple open RLS policy for quick setup. For a private production version, add authentication and user-specific row policies.
