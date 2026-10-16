# Color vocabulary — uniform paint swatches

On 16 October 2026 the user requested a uniform paint-blot representation of color words and explicitly authorized actual colors as the ONLY exception to the app's four-color illustration palette. These 11 swatches replace the earlier object illustrations. All other artwork retains the brand palette; see AGENTS.md.

approved-sheet.png preserves the generated swatch sheet. All swatches have matching paint-blot shapes and consistent scale, an opaque colored fill, a thin neutral outline, and transparent margins. White remains visibly outlined on light backgrounds.

crop_colors.py uses checked cell boundaries, retains the original generated pixels and alpha of the main swatch, omits disconnected extraction specks, and centers each image on a transparent 340x340 canvas without drawing, recoloring or scaling.

Reproduce with Pillow, numpy and scipy:
`python3 art-sources/colors/crop_colors.py`
`python3 scripts/import_art.py`

colors.json maps all 11 PNGs to exact German words and Ukrainian meanings. The runtime reuses the same swatches in dictionary cards and lesson vocabulary. Source coordinates and checksums remain in crop-report.json.
