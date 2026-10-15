# Artwork inbox — Deutsch 16

Upload a ZIP file here via GitHub's **Add file → Upload files**.
The **Import Original Artwork** GitHub Action automatically extracts its original PNGs to `assets/illustrations/<category>/` and commits them to `main`.

For pronouns, name the archive `pronouns.zip` and put the 15 files directly inside:
`ich.png`, `du.png`, `er.png`, `sie_she.png`, `es.png`, `wir.png`, `ihr.png`, `sie_they.png`, `Sie_formal.png`, `derjenige.png`, `diejenige.png`, `dasjenige.png`, `alle.png`, `jemand.png`, `niemand.png`.

Images must be PNG with transparency, between 32 and 4096 pixels per side, up to 8 MB each. The importer does **not** alter, redraw, recolor, or recompress them.

For future categories, use the matching English slug as ZIP name, e.g. `animals.zip`, `family.zip`, `food.zip`. Files are automatically extracted, but new word-to-image mappings must be configured in the app for categories other than pronouns.

Check **Actions → Import Original Artwork** for success or errors. The site deployment then runs automatically.
