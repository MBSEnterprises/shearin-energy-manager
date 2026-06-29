# Shearin Energy Manager v1.1 — UI Polish

## What changed

- Forces all dollar values through one USD currency formatter, so values display like `$6.30`, `$24.20`, and `$0.00`.
- Adds small card readability polish for money values, spacing, and number alignment.
- Keeps the v0.9 database design for property-specific energy sources.
- Adds source checkboxes when creating a property.
- Adds quick source presets for existing properties:
  - Redding setup: PG&E electricity, Tesla solar, propane, kerosene.
  - Manteca setup: PG&E electricity, Tesla solar, PG&E natural gas.
  - Electric + Tesla only.
  - Show all sources.
- Hides manual-entry fields that do not apply to the selected property.
  - Example: Manteca no longer shows propane or kerosene entry fields when configured with the Manteca setup.
- Keeps delivered fuels event-based, so missing propane/kerosene months are not treated as errors.

## SQL required

If you already ran v0.9 SQL, no new SQL is required.

If you have not run the source configuration SQL yet, run this once in Supabase SQL Editor:

`supabase/004_property_sources.sql`

Do not rerun 001, 002, or 003 if those were already completed.

## After deploying

1. Upload the full contents of this ZIP to GitHub and commit.
2. Wait for GitHub Pages deployment.
3. Refresh the app on PC and phone.
4. Go to **Properties**.
5. Use the source preset buttons:
   - Click **Redding setup** for Redding.
   - Click **Manteca setup** for Manteca.
6. Go to **Edit** and select each property to confirm only applicable fields appear.

## Notes

This release closes the currency-formatting issue visible on timeline cards and keeps the source-configuration behavior from v1.0. The app should no longer force irrelevant sources, such as kerosene in Manteca, into the manual workflow.
