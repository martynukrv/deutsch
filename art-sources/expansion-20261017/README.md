# Vocabulary expansion — 17 October 2026

62 new word illustrations and two category illustrations, generated with the built-in ImageGen tool. User authorized expanding every category and starting new categories; standing one-version immediate cropping/publication workflow applies. Existing artwork is preserved byte for byte.

Final selected sheets: sheet-1.png through sheet-4.png. Two pre-cleanup originals are retained separately. items.json lists the row-major meanings; crop-plan.json records individually inspected source rectangles. Crops retain original pixels, trim transparent margins and add 18 transparent pixels of padding. No programmatic drawing or recoloring. All 64 crops were visually checked for full compositions and neighboring fragments.

## Prompt set

Common prompt: transparent PNG sheet, sixteen isolated illustrations in four columns and four rows, wide gutters, full compositions. Playful expressive cartoon doodles, thick organic navy #102B50 contours, flat orange #FF5726, white #FFFFFF and cream #FFF1E5; no gradients, glossy emoji or 3D. Two signature tapered navy/orange accent dashes beside every composition. No labels; only exact numerals and question marks where appropriate. Exact item order is in items.json.

- Sheet 1, items 1–16: something (child with mysterious gift), nothing (empty hands), each (each child holds a star), open door, close door, helping another child, light cloth, dark cloth, multicolored paint blots using brand colors, numerals 60 / 70 / 80 / 90, good night (child in bed and moon), see you soon (wave and clock), aunt.
- Sheet 2, items 17–32: uncle, baby, female friend, happy, tired, potato, tomato, soup, lamp, sofa, wardrobe, backpack, ruler, eraser, week (seven calendar boxes), month (calendar grid).
- Sheet 3, items 33–48: year (twelve month panels), how long (hourglass), how often (repeat arrows and clock), which (choice between objects), because (umbrella in rain), with (children hand in hand), without (missing spoon), back, neck, tooth, duck, sheep, elephant, airplane, ship, bus stop.
- Sheet 4, items 49–64: T-shirt, trousers, dress, jacket, shoe, knit hat, scarf, sun, rain, snow, wind, cloud, tree, flower, clothing category (shirt/hanger/scarf), weather/nature category (sun/cloud/tree).

Cleanup prompts for sheets 2 and 3: preserve all sixteen drawings, their arrangement and dash accents; remove background/glow with alpha zero between drawings and keep opaque interior whites. Sheet 3 additionally changes tiny carrot leaves to navy to enforce the palette. Inspect actual alpha-composited PNGs: previews may show RGB color in fully transparent pixels.

## Packaging

art-inbox/expansion-<category>.zip and adjacent manifests add exact German/Ukrainian bindings. The importer combines approved packages per category, rejects cross-package duplicates and requires complete combined catalog coverage. Future additions do not require repackaging original approved artwork.

New vocabulary uses existing audio routing: recorded clips when available, otherwise German browser speech synthesis. No new ElevenLabs recordings are included in this batch.

Final sheet 1 palette edit: preserve dimensions/arrangement and change the third child's brown skin fills to cream and the aunt's brown hair fills to navy. Original is retained as sheet-1-before-palette.png. All final crop boxes were inspected again after that edit.

Reproduce packages with `python3 scripts/prepare_expansion.py art-sources/expansion-20261017/crop-plan.json`, then run `python3 scripts/import_art.py`.
