# Color artwork — exact user-selected shared image

The user explicitly selected this image on 16 October 2026:
https://chatgpt.com/s/m_6ad1c65c98a4819186f9a78249ba7dcb

approved-sheet.png is the actual original PNG downloaded from that public image share. Visual identity: bouncy asymmetrical PAINT SPLATS WITHOUT EYES OR MOUTHS, white highlights, navy outlines and nearby motion marks. This replaces the earlier slime mascots. Variant numbers in the prior chat/gallery were inconsistent; use this exact image and URL as authoritative, never infer from a number.

All 11 complete compositions, including motion marks, are cropped with transparent boundaries and centered on transparent 390x390 canvases. Source RGB and retained alpha are preserved; no drawing, recoloring or scaling. Original source, crop coordinates and output hashes are retained.

Reproduce with Pillow, numpy and scipy:
`python3 art-sources/colors/crop_colors.py`
`python3 scripts/import_art.py`

Color vocabulary remains the only actual-color exception. Other illustrations retain the four brand colors. New artwork still needs three previews and the user's explicit selection before cropping or insertion.
