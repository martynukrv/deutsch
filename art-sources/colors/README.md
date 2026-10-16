# Color vocabulary — selected variant 3, paint-slime mascots

The user selected variant 3 on 16 October 2026 after reviewing three playful alternatives. approved-sheet.png preserves that exact image generation result. These 11 cheerful paint-slime mascots replace the earlier plain paint swatches. Do not regenerate or substitute another variant without approval.

Each mascot has the same recognizable paint-puddle character design, similar scale, expression and pose, and the actual named body color. Color vocabulary and its lesson reuse remain the ONLY exception to the app's four-color brand palette. All other new art follows AGENTS.md, including three preview variants before cropping or insertion.

crop_colors.py uses individually checked transparent gutters, retains original RGB and alpha, omits disconnected extraction specks, and centers each full mascot on a transparent 390x390 canvas. It does not draw, recolor or resize the generated character. Coordinates and hashes remain in crop-report.json.

Reproduce with Pillow, numpy and scipy:
`python3 art-sources/colors/crop_colors.py`
`python3 scripts/import_art.py`

colors.json maps all 11 PNGs to exact German words and Ukrainian meanings. The runtime shares them across dictionary cards and lesson vocabulary. The content-hash URLs invalidate cached earlier artwork.
