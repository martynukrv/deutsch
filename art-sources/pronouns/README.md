# Original pronoun artwork and corrected crops

original-sheet.png is the original transparent sticker sheet. original-package.zip preserves the initial ZIP, including its erroneous equal-width crops. Neither source is overwritten.

The corrected pronouns.zip is cut from the original sheet using individual concept boundaries, connected alpha regions to exclude neighboring art, and masks to exclude printed labels. Every retained pixel keeps its source RGB and alpha. A transparent 12 px margin prevents any artwork from touching the exported PNG edge.

Reproduce: install Pillow, numpy and scipy, run `python3 scripts/recrop_pronouns.py`, then `python3 scripts/import_art.py`. The historical script is specific to this exact sheet; do not reuse its coordinates for other categories. Inspect every full composition on a contact sheet before publication; file validity alone cannot detect a wrong crop.
