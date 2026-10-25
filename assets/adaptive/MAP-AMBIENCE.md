# Disabled at user request

The ambient particle layer was disabled after visual review on 25 October 2026. Its renderer and stylesheet are no longer loaded; its regression is no longer in the workflows. The files below remain as an archived implementation. Earlier map, character, feedback and story-scene animations remain active.

# Landmark ambience

The original island images stay intact. A pointer-inert, aria-hidden decorative particle layer adds one theme near each lesson/final marker: ten locations on island one (ship, shore, camp embers, forest leaves, tower glints, crossing ripples, cottage smoke, waterfall spray, workshop sparks, cache glints) and eight on island two (arrival, landing, market steam, square ripples, gate flutter, meeting-house smoke, keeper-house glints, final glints).

Coordinates are authored against the original map and use the same mapY transform as lesson pins; ship/arrival effects use board coordinates. Labels, buttons, lesson order and stored progress are unchanged. Particles are simple UI accents in the existing navy/orange/cream palette, not replacement illustrations or emoji. Each effect uses three small particles with staggered negative delays. Existing IntersectionObserver pausing, hidden-page pause and per-profile motion preference apply. The whole layer disappears for manual motion off or system reduced motion. No new lighthouse beam or earned-state indicator is shown before the key is earned.

`.github/tests/map-ambience.cjs` verifies all 18 effects, theme variety, accessibility/hit testing, pause behavior, reduced motion, viewport sizes and removal when a lesson opens. Screenshots show both complete maps for placement review.
