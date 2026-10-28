# Original third-island artwork — 28 October 2026

User explicitly authorised generation and immediate integration of the island, characters and every lesson. The built-in image generation tool was used; no CLI/API image generator, procedural illustration or replacement of existing artwork was used.

Original outputs are preserved byte-for-byte: map.png, characters.png, items-original.png and the background-cleanup edit items.png. Crop rectangles and inner alpha-bound padding are recorded in crops.json; WebP crops retain source pixels without recolouring or redrawing. All nine full-body character poses and all seven item/reward compositions were visually inspected on cream. Feet, hands, accessories and side dashes remain. The alpha-background RGB can contain dark glow values, but transparent pixels are not visible when composited. No drawn checkerboard.

Prompt set (production illustration-story):

- Map: one tall 1:2 isometric rocky expedition island, strict navy/orange/white/cream brand palette, thick organic contours, coherent cliff terraces and switchback trail, one large rope bridge. Eight landmarks top-to-bottom: equipment warehouse, sorting shed, tents, packing deck, supply-counting platform, request counter, bridge checkpoint, survey table with map. Navy sea, orange tents and sparse bushes, tiny edge sailboat. No text, numbers, buttons, gradients or extra UI. Landmarks have room for HTML pins. Distinct from previous forest and Mediterranean village maps.
- Characters: Benno portrait supplied strictly as style reference. Transparent 3×3 sheet, three distinct full-body actors in welcome/success/encourage poses with complete accessories and generous gutters. Greta: curly-haired woman, orange vest, cream shirt, clipboard. Felix: explorer hat, orange scarf, rolled map. Juna: short navy bob, orange overalls, cross-body bag. Expressive friendly flat cartoon, thick navy outlines, tapered accent dashes, fixed four-color palette, no typography or glossy/realistic rendering.
- Items: style reference Benno. Seven distinct transparent objects in 3×3 layout: backpack/compass/map; duffel bag/book/coiled rope; bottom centre reward route scroll. Clear backpack straps vs bag handles, map trail, compass needle without letters. Tapered accent dashes. Fixed four-color palette, no text, shadows or glossy 3D. Edit requested removal of background/glow while preserving all items, contours and layout, opaque flat interiors, alpha-zero gutters.

Runtime files: `assets/illustrations/expedition/gear-island-20261028.webp`, `gear-{greta,felix,juna}-{welcome,success,encourage}.webp`, `gear/*.webp`, `gear-route-scroll.webp`. Asset names are versioned/new; old assets remain intact.

## Distinct landmarks edit — 28 October 2026

User requested one replacement in each visually similar pair 1/2 and 3/4, with immediate integration. Built-in imagegen edited the original full map into `map-distinct-landmarks.png` (887 × 1774). Landmark 2 is now a lightweight open sorting canopy with a flat orange fabric roof, hanging bags and tables. Landmark 4 is an uncovered packing bench dominated by an upright hiking backpack and rolled map. Names, pins, terrain, trail and remaining landmarks retain their positions. The original map remains preserved. Runtime: `assets/illustrations/expedition/gear-island-distinct-20261028.webp`.

Prompt: precise-object-edit of the original tall map; replace only upper-right gabled shed with an open four-post cloth sorting canopy and mid-right awning/luggage deck with an uncovered backpack packing bench. Preserve full 1:2 composition, all normalized landmark locations, paths, cliffs, warehouse, tents, supplies, counter, bridge and survey table. Match navy/orange/cream/white ink illustration; no text or UI.
