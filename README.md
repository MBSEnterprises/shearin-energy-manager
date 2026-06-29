# Shearin Energy Manager v1.4 — UI Polish

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


## v1.4 UI polish
- Prevented currency amounts from wrapping onto multiple lines in metric cards.
- Added responsive financial typography using container-based sizing.
- Kept dollar amounts in tabular numeric formatting for cleaner comparison.


## v1.4 Tesla History
- Adds a **Load Tesla Historical Data** button on Upload.
- Loads confirmed Tesla solar production into monthly property history without changing PG&E billing amounts.
- Historical PG&E reload now preserves existing Tesla solar values instead of overwriting them with zero.
- Confirmed values included now: Redding June 2026 = 1,822.1 kWh; Manteca June 2026 = 771.0 kWh. Add additional months only after screenshots/export data are confirmed.


## v1.4 Tesla Expanded History
- Loads Jan-Jun 2026 Tesla solar production for both Redding and Manteca.
- June monthly values are exact from Tesla Month screenshots: Redding 1,822.1 kWh; Manteca 771.0 kWh.
- Jan-May 2026 values are graph-estimated from Tesla Year screenshots and clearly marked in monthly row notes.
- The displayed YTD validation points are Redding about 7.4 MWh and Manteca 4,126.5 kWh.
- Lifetime screenshots were used as reference only, not as monthly rows, because they do not provide exact monthly values.
