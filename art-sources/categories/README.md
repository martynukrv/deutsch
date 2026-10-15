# Approved category illustrations

The user approved the 16-icon sheet on 15 October 2026. `approved-sheet.png` preserves that image generation result. The palette and characters match the pronoun illustrations.

The source has uneven gutters. `crop_categories.py` uses individually checked row and column boundaries, removes isolated alpha-extraction specks, and places the original pixels on transparent 384x384 canvases without drawing, recoloring or scaling. All crop boundaries must fall in transparent space.

Reproduce from the repository root after installing Pillow, numpy and scipy:
`python3 art-sources/categories/crop_categories.py`

The app maps each category explicitly to its PNG with a content-hash cache key. Browser tests require all 16 distinct category images to load at mobile and desktop widths. Category images replace both the dictionary picker and sidebar icons.
