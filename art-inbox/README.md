# Deutsch 16 artwork pipeline

The assistant performs generation, cropping, upload, word bindings, testing and publication. The user only reviews the artistic result. Do not ask the user to upload files to GitHub or edit mappings.

Palette: `#102B50`, `#FF5726`, `#FFFFFF`, `#FFF1E5`.

## Approved originals

`pronouns.zip` contains the corrected 15 individual PNG crops from `art-sources/pronouns/original-sheet.png`. The initial ZIP had equal-width crops that included neighboring figures and truncated compositions; it is preserved byte for byte at `art-sources/pronouns/original-package.zip`. Corrected crops retain original artwork pixels, exclude printed labels and neighboring fragments, and include a transparent margin. No redrawing or recoloring is applied. `pronouns.json` records their approved word/meaning bindings. In particular `sie` (she), `sie` (they), and `Sie` (formal you) are separate entries.

## Each next category

1. Read `catalog.json` for the exact words and meanings. Create illustrations with the image generation tool, using the palette and the approved pronoun characters as references. Request a transparent background. Keep originals in `art-sources/<category>/`, including full sheets when used. Never substitute programmatically drawn illustrations.
2. Show the artistic result to the user. Continue technical work only with the approved version. The `approved` field records that approval; do not set it merely because generation finished.
3. For sheets, prepare `crop-plan.json` beside the source with exact pixel boxes. Run `python3 scripts/prepare_art.py art-sources/<category>/crop-plan.json`. This only crops pixels; it does not redraw or recolor. For already separate PNGs omit `box` to preserve original bytes. If a generated sheet is opaque, use the image editing tool for a transparent version and obtain artistic approval if its appearance changes.
4. Commit the original sources, category ZIP and its adjacent JSON manifest. Each manifest item has `de`, `ua` and `file`. Every category word must have exactly one distinct PNG. Existing pronoun ZIPs are imported directly, without repackaging.
5. The Import Original Artwork workflow validates the whole batch, preserves ZIP PNG bytes, generates `word-art.js` and `art-report.json`, runs importer tests and real browser checks, commits the generated files, and publishes GitHub Pages in the same workflow. This explicit deployment avoids relying on another workflow being triggered by the bot's commit.
6. The workflow opens the published site in Chromium and verifies every approved image and word binding at 320, 390 and 1280 pixels. Inspect the action result; report completion only after publication and live verification succeed.

Example crop plan:

```json
{"category":"animals","approved":true,"items":[{"de":"der Hund","ua":"собака","source":"sheet.png","box":[0,0,512,512],"name":"der_Hund"}]}
```

The example shows one entry; the actual plan must include all category words.

For prepared PNG ZIPs, the matching manifest is:

```json
{"version":1,"category":"animals","approved":true,"items":[{"de":"der Hund","ua":"собака","file":"der_Hund.png"}]}
```

Images must be PNG with genuinely transparent and visible pixels, 32–4096 pixels per side, at most 8 MiB each and 100 MiB unpacked per ZIP. Invalid paths, duplicate files, incomplete categories and unknown words stop publication. The runtime uses exact category + German word + Ukrainian meaning, never list position. Other categories retain their existing art until approved replacements are supplied.

