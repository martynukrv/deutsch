# Color vocabulary — brand palette illustrations

The user explicitly requested drawing, cropping and insertion on 15 October 2026 after confirming a strict four-color palette. approved-sheet.png is the original generation result for this request; earlier naturally colored drafts were rejected and are not used.

All objects use navy #102B50, orange #FF5726, white #FFFFFF and cream #FFF1E5. Their natural colors do not override the palette. The illustration is a mnemonic object beside the German word, not a literal color swatch.

crop_colors.py retains source RGB and edge transparency, excludes isolated alpha-extraction specks, checks clear individual boundaries, and adds a transparent 16 px margin. It performs no drawing, recoloring or scaling. Source, crop coordinates and output checksums are retained for later corrections.

Reproduce with Pillow, numpy and scipy installed:
`python3 art-sources/colors/crop_colors.py`
`python3 scripts/import_art.py`

The generated colors.json maps all 11 PNGs to exact German words and Ukrainian meanings. The existing runtime shares these illustrations between dictionary cards and lesson vocabulary.
