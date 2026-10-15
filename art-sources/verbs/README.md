# Approved verb illustrations

All 35 verb illustrations were approved on 15 October 2026, across three original transparent sheets. Originals are preserved as sheet-01.png through sheet-03.png.

The crop script uses individually checked boundaries. Every crop must have clear space around the complete composition. Isolated alpha-extraction specks are excluded; source RGB and retained alpha are preserved, without drawing, recoloring or resizing. Each output gets a transparent 16 px margin.

Reproduce after installing Pillow, numpy and scipy:
`python3 art-sources/verbs/crop_verbs.py`
`python3 scripts/import_art.py`

The generated verbs.json maps every image explicitly to its German word and Ukrainian meaning. The app uses these approved images both in dictionary cards and lesson vocabulary, resolving ambiguous pronouns by meaning. Original sheets, crop coordinates and checksums remain available for later corrections.
