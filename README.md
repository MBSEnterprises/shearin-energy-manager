# Shearin Energy Manager v0.9 — Source Configuration

## What changed

- Adds property-specific energy sources.
- Redding sources: PG&E electricity, Tesla solar, propane, kerosene.
- Manteca sources: PG&E electricity, Tesla solar, PG&E natural gas.
- Delivered fuels are event-based, not monthly requirements.
- Manteca will not show propane or kerosene.
- Redding will only show delivered fuel cards in a month where propane/kerosene/other delivered fuel cost exists.
- Adds data-completeness cards based only on expected monthly sources.

## SQL required

Run this new migration once:

`supabase/004_property_sources.sql`

Do not rerun 001, 002, or 003 if you already ran them.

## After deploying

1. Upload the full contents of this ZIP to GitHub and commit.
2. Wait for GitHub Pages deployment.
3. Refresh the app.
4. Go to Upload.
5. Click **Load / Repair Property Source Setup**.
6. Then click **Load / Repair June 2026 Known Data** and/or **Load Historical PG&E Bills** as needed.

## Notes

This release is about data architecture. It makes the app understand that some energy sources are monthly utilities while others are ad-hoc delivery events.
